const aiService = require('./ai.service');
const { Review } = require('../models');

class ReviewService {
  parseDiff(diffText) {
    const changes = [];
    const lines = diffText.split('\n');
    let currentFile = null;
    let addedLines = 0;
    let removedLines = 0;
    let content = [];

    for (const line of lines) {
      if (line.startsWith('diff --git')) {
        if (currentFile) {
          changes.push({
            file: currentFile,
            addedLines,
            removedLines,
            content: content.join('\n'),
            language: this.detectLanguage(currentFile)
          });
        }
        const match = line.match(/b\/(.+)$/);
        currentFile = match ? match[1] : null;
        addedLines = 0;
        removedLines = 0;
        content = [];
      } else if (line.startsWith('+') && !line.startsWith('+++')) {
        addedLines++;
        content.push(line);
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        removedLines++;
        content.push(line);
      } else if (!line.startsWith('\\')) {
        content.push(line);
      }
    }

    if (currentFile) {
      changes.push({
        file: currentFile,
        addedLines,
        removedLines,
        content: content.join('\n'),
        language: this.detectLanguage(currentFile)
      });
    }

    // Accept plain code snippets (not git diff format)
    if (changes.length === 0 && diffText.trim()) {
      changes.push({
        file: 'code-snippet.txt',
        addedLines: diffText.split('\n').length,
        removedLines: 0,
        content: diffText,
        language: 'unknown'
      });
    }

    return changes;
  }

  detectLanguage(filename) {
    const ext = filename.split('.').pop();
    const langMap = {
      py: 'python',
      js: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      tsx: 'typescript',
      java: 'java',
      go: 'go',
      rs: 'rust',
      cpp: 'cpp',
      c: 'c',
      rb: 'ruby',
      php: 'php'
    };
    return langMap[ext] || 'unknown';
  }

  scanSecurity(changes) {
    const vulnerabilities = [];
    const patterns = {
      sql_injection: {
        regex: [/execute\s*\([^)]*\+[^)]*\)/gi, /query\s*=\s*['"'].*['"].*\+/gi],
        severity: 'CRITICAL',
        description: 'Potential SQL injection vulnerability',
        recommendation: 'Use parameterized queries or ORM'
      },
      xss: {
        regex: [/innerHTML\s*=\s*[^;]*\+/gi, /dangerouslySetInnerHTML/gi],
        severity: 'HIGH',
        description: 'Potential XSS vulnerability',
        recommendation: 'Sanitize user input and use safe DOM methods'
      },
      hardcoded_secrets: {
        regex: [/password\s*=\s*['"'][^'"']{8,}['"']/gi, /api_key\s*=\s*['"'][^'"']{20,}['"']/gi],
        severity: 'CRITICAL',
        description: 'Hardcoded secret detected',
        recommendation: 'Use environment variables for secrets'
      }
    };

    changes.forEach((change) => {
      Object.entries(patterns).forEach(([type, config]) => {
        config.regex.forEach((regex) => {
          const matches = change.content.match(regex);
          if (matches) {
            matches.forEach((match) => {
              vulnerabilities.push({
                file: change.file,
                line: this.getLineNumber(change.content, match),
                type,
                severity: config.severity,
                description: config.description,
                recommendation: config.recommendation
              });
            });
          }
        });
      });
    });

    return vulnerabilities;
  }

  getLineNumber(content, match) {
    const index = content.indexOf(match);
    return content.substring(0, index).split('\n').length;
  }

  transformAiResponse(aiReview, securityIssues = []) {
    const findings = [...(aiReview.findings || [])];

    securityIssues.forEach((vuln) => {
      findings.push({
        file: vuln.file,
        line: vuln.line,
        severity: vuln.severity,
        category: 'security',
        issue: vuln.description,
        explanation: `Security scanner detected: ${vuln.type}`,
        suggestion: vuln.recommendation
      });
    });

    const score = Math.max(0, Math.min(100, aiReview.score || 50));

    const issues = findings.map((f) => ({
      type: f.category || 'general',
      severity: (f.severity || 'medium').toLowerCase(),
      description: f.issue || f.explanation || 'Issue detected',
      line: f.line
    }));

    const suggestions = [];

    (aiReview.improvements || []).forEach((imp, i) => {
      suggestions.push({
        title: typeof imp === 'string' ? `Improvement ${i + 1}` : imp.title || `Improvement ${i + 1}`,
        description: typeof imp === 'string' ? imp : imp.description || ''
      });
    });

    findings.forEach((f) => {
      if (f.suggestion) {
        suggestions.push({
          title: f.issue || 'Suggested fix',
          description: f.suggestion
        });
      }
    });

    const securityScore = Math.max(0, 100 - findings.filter((f) => f.category === 'security').length * 15);

    return {
      categories: {
        code_quality: {
          score,
          feedback: aiReview.summary || 'Overall code quality assessment'
        },
        security: {
          score: securityScore,
          feedback: securityIssues.length
            ? `${securityIssues.length} potential security concern(s) found`
            : 'No obvious security issues detected'
        },
        maintainability: {
          score: Math.min(100, score + 5),
          feedback: (aiReview.strengths || []).join('. ') || 'Review maintainability and structure'
        }
      },
      issues,
      suggestions,
      summary: aiReview.summary,
      strengths: aiReview.strengths || []
    };
  }

  async runAnalysis(changes) {
    const securityIssues = this.scanSecurity(changes);

    try {
      const aiReview = await aiService.reviewCode(changes);
      const criticalCount = (aiReview.findings || []).filter((f) => f.severity === 'CRITICAL').length;
      if (criticalCount > 0) {
        aiReview.score = Math.max(0, (aiReview.score || 50) - criticalCount * 15);
      }
      return this.transformAiResponse(aiReview, securityIssues);
    } catch (error) {
      console.log('AI analysis unavailable, using rule-based review:', error.message);
      return this.transformAiResponse(
        {
          score: securityIssues.length > 0 ? 55 : 78,
          summary: 'Rule-based review (configure WATSONX or OPENAI keys for full AI analysis)',
          findings: securityIssues.map((v) => ({
            file: v.file,
            line: v.line,
            severity: v.severity,
            category: 'security',
            issue: v.description,
            suggestion: v.recommendation
          })),
          strengths: ['Code submitted successfully for review'],
          improvements: ['Add automated tests', 'Review error handling paths']
        },
        []
      );
    }
  }

  async analyzeReview(prDiff, userId, repositoryId = null, prNumber = null, prTitle = null) {
    const changes = this.parseDiff(prDiff);

    if (changes.length === 0) {
      throw new Error('No changes detected in diff');
    }

    const analysis = await this.runAnalysis(changes);
    const overallScore = analysis.categories.code_quality.score;

    const review = await Review.create({
      userId,
      repositoryId,
      prNumber,
      prTitle,
      prDiff,
      analysis,
      overallScore,
      status: 'completed'
    });

    return review.toJSON();
  }
}

module.exports = new ReviewService();
