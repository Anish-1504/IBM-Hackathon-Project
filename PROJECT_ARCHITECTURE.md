# 🚀 DevInsight AI - Intelligent Code Review & Repository Intelligence Platform

## 1. PROBLEM STATEMENT

### The Challenge
Modern software teams face critical productivity bottlenecks:
- **Code Review Delays**: PRs sit for hours/days waiting for human review
- **Context Loss**: Reviewers lack full context of changes, leading to superficial reviews
- **Onboarding Friction**: New developers spend weeks understanding codebases
- **Technical Debt Blindness**: Teams don't know where technical debt accumulates
- **Documentation Lag**: Code changes faster than documentation updates
- **Security Gaps**: Security issues slip through manual reviews
- **Inconsistent Standards**: Code quality varies across teams and PRs

### The Impact
- 40% of developer time wasted on code review cycles
- 2-3 weeks average onboarding time for new developers
- 60% of security vulnerabilities introduced during feature development
- Documentation becomes outdated within weeks

### Why Existing Solutions Fall Short
- **GitHub Copilot**: Helps write code but doesn't review or understand repositories
- **SonarQube**: Static analysis only, no AI-powered insights
- **Manual Reviews**: Slow, inconsistent, miss context
- **Basic CI/CD**: Catches syntax errors but not architectural issues

---

## 2. SOLUTION OVERVIEW

**DevInsight AI** is an intelligent code review and repository intelligence platform that uses AI to:
1. **Instant AI Code Reviews**: Automated, context-aware PR reviews in seconds
2. **Repository Intelligence**: Deep understanding of entire codebases
3. **Smart Documentation**: Auto-generated, always-updated documentation
4. **Security Analysis**: AI-powered vulnerability detection
5. **Onboarding Acceleration**: Interactive codebase exploration for new developers
6. **Technical Debt Tracking**: Identify and prioritize refactoring opportunities

### Key Innovation
Unlike traditional tools, DevInsight AI:
- **Understands Context**: Analyzes entire repository history, not just diffs
- **Learns Patterns**: Adapts to team coding standards
- **Explains Reasoning**: Provides detailed explanations, not just flags
- **Actionable Insights**: Suggests specific fixes with code examples
- **Real-time Intelligence**: Continuous analysis, not just on-demand

---

## 3. CORE FEATURES (MVP Prioritized)

### 3.1 AI-Powered Code Review ⭐ (MVP Priority 1)
- **Instant PR Analysis**: Upload PR diff, get comprehensive review in 10-15 seconds
- **Multi-dimensional Review**:
  - Code quality and best practices
  - Security vulnerabilities (OWASP Top 10)
  - Performance implications
  - Architectural consistency
  - Test coverage gaps
- **Contextual Understanding**: Analyzes related files, not just changed lines
- **Severity Classification**: Critical, High, Medium, Low, Info
- **Inline Suggestions**: Specific code fixes with explanations

### 3.2 Repository Intelligence Dashboard ⭐ (MVP Priority 2)
- **Codebase Health Score**: Overall quality metric (0-100)
- **Hotspot Detection**: Files with highest change frequency + bug density
- **Code Complexity Metrics**: Cyclomatic complexity, maintainability index
- **Security Posture**: Vulnerability trends over time
- **Quick Stats**: Files, lines of code, languages

### 3.3 Smart Documentation Generator (MVP Priority 3)
- **Auto-generated README**: Based on code analysis
- **API Documentation**: Extracted from code + AI enhancement
- **Setup Guide**: For new developers

### 3.4 Interactive Code Explorer (Post-MVP)
- **Natural Language Queries**: "Show me authentication logic"
- **Semantic Search**: Beyond text matching
- **Impact Analysis**: "What breaks if I change this function?"

---

## 4. TECHNICAL ARCHITECTURE

### 4.1 High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (TypeScript + React)               │  │
│  │  - Dashboard UI                                       │  │
│  │  - PR Review Interface                                │  │
│  │  - Repository Explorer                                │  │
│  │  - Real-time Updates (WebSocket)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/WSS
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FastAPI Backend (Python 3.11+)                       │  │
│  │  - Request Validation (Pydantic)                      │  │
│  │  - Rate Limiting (10 req/min per user)               │  │
│  │  - Authentication (JWT)                               │  │
│  │  - CORS Configuration                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   PR Review  │  │  Repository  │  │ Documentation│     │
│  │   Service    │  │   Analysis   │  │   Generator  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Security   │  │   Code       │  │   Metrics    │     │
│  │   Scanner    │  │   Parser     │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   AI ORCHESTRATION LAYER                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AI Service Manager                                   │  │
│  │  - Prompt Engineering                                 │  │
│  │  - Context Management (max 8K tokens)                │  │
│  │  - Response Parsing & Validation                     │  │
│  │  - Token Optimization                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  IBM watsonx │  │   OpenAI     │  │   Fallback   │     │
│  │     .ai      │  │   GPT-4      │  │   Handler    │     │
│  │  (Primary)   │  │  (Backup)    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │    Redis     │  │   File       │     │
│  │  (Primary)   │  │   (Cache)    │  │  Storage     │     │
│  │  - Users     │  │  - Sessions  │  │  - Repos     │     │
│  │  - Reviews   │  │  - AI Cache  │  │  - Diffs     │     │
│  │  - Repos     │  │  - Rate Lim  │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   GitHub     │  │   GitLab     │  │   Bitbucket  │     │
│  │     API      │  │     API      │  │     API      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Request Lifecycle Examples

#### PR Review Flow (10-15 seconds)
```
1. User uploads PR diff via UI
2. Frontend → POST /api/v1/reviews/analyze
3. API Gateway: Validate request, authenticate, rate limit check
4. PR Review Service:
   - Parse diff (extract files, lines changed)
   - Fetch related context (imports, function calls)
5. Parallel Execution:
   - AI Service: Generate review (IBM watsonx.ai)
   - Security Scanner: Pattern matching for vulnerabilities
   - Metrics Service: Calculate complexity delta
6. Aggregate results → Cache in Redis (30min TTL)
7. Return response to frontend
8. WebSocket: Push real-time updates
9. Frontend: Render interactive review UI
```

#### Repository Analysis Flow (30-60 seconds, background)
```
1. User connects GitHub repository
2. Backend: Shallow clone repository
3. Code Parser Service:
   - Extract file structure
   - Parse AST for each file
   - Build dependency graph
4. Metrics Service:
   - Calculate complexity metrics
   - Identify hotspots (high churn + bugs)
5. AI Service:
   - Generate architecture summary
   - Identify technical debt
6. Store results in PostgreSQL
7. WebSocket: Notify frontend when complete
```

### 4.3 Scalability Considerations

**Current Design (Hackathon MVP)**:
- Single FastAPI instance
- Single PostgreSQL instance
- Single Redis instance
- Handles ~100 concurrent users

**Future Scaling Path**:
- **Horizontal Scaling**: Multiple FastAPI instances behind load balancer
- **Database**: Read replicas, connection pooling
- **Caching**: Redis cluster
- **AI**: Queue system (Celery + RabbitMQ) for async processing
- **Storage**: S3 for repository clones
- **CDN**: Static assets on Cloudflare

---

## 5. BACKEND ARCHITECTURE

### 5.1 Technology Stack
- **Framework**: FastAPI 0.109+ (async, high performance)
- **Language**: Python 3.11+ (type hints, performance improvements)
- **Database**: PostgreSQL 15+ (JSONB support)
- **Cache**: Redis 7+ (session, AI response cache)
- **ORM**: SQLAlchemy 2.0+ (async support)
- **Validation**: Pydantic v2 (request/response models)
- **Testing**: pytest + pytest-asyncio + pytest-cov
- **Code Analysis**: tree-sitter (AST), radon (metrics), bandit (security)
- **Git**: GitPython
- **HTTP Client**: httpx (async)

### 5.2 Folder Structure

```
backend/
├── app/
│   ├── api/                          # API Layer
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py          # Login, register, refresh
│   │   │   │   ├── reviews.py       # PR review endpoints
│   │   │   │   ├── repositories.py  # Repository management
│   │   │   │   ├── documentation.py # Doc generation
│   │   │   │   └── analytics.py     # Metrics, trends
│   │   │   └── router.py            # V1 router aggregation
│   │   └── dependencies.py          # Dependency injection
│   ├── core/                         # Core Configuration
│   │   ├── __init__.py
│   │   ├── config.py                # Settings (env vars)
│   │   ├── security.py              # JWT, password hashing
│   │   ├── logging.py               # Structured logging
│   │   └── exceptions.py            # Custom exceptions
│   ├── services/                     # Business Logic
│   │   ├── __init__.py
│   │   ├── pr_review_service.py     # PR review orchestration
│   │   ├── repository_service.py    # Repo analysis
│   │   ├── ai_service.py            # AI provider management
│   │   ├── security_scanner.py      # Vulnerability detection
│   │   ├── code_parser.py           # AST parsing, diff parsing
│   │   ├── metrics_service.py       # Complexity, churn metrics
│   │   └── documentation_service.py # Doc generation
│   ├── models/                       # Database Models
│   │   ├── __init__.py
│   │   ├── base.py                  # Base model class
│   │   ├── user.py
│   │   ├── repository.py
│   │   ├── review.py
│   │   └── analysis.py
│   ├── schemas/                      # Pydantic Schemas
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── review.py
│   │   ├── repository.py
│   │   ├── documentation.py
│   │   └── common.py                # Shared schemas
│   ├── repositories/                 # Data Access Layer
│   │   ├── __init__.py
│   │   ├── base.py                  # Base repository
│   │   ├── user_repository.py
│   │   ├── review_repository.py
│   │   └── repository_repository.py
│   ├── utils/                        # Utilities
│   │   ├── __init__.py
│   │   ├── git_utils.py             # Git operations
│   │   ├── code_analysis.py         # Code parsing helpers
│   │   ├── prompt_templates.py      # AI prompts
│   │   └── cache.py                 # Cache helpers
│   ├── db/                           # Database
│   │   ├── __init__.py
│   │   ├── session.py               # DB session management
│   │   └── init_db.py               # DB initialization
│   └── main.py                       # Application entry point
├── tests/
│   ├── unit/
│   │   ├── test_services/
│   │   ├── test_repositories/
│   │   └── test_utils/
│   ├── integration/
│   │   └── test_api/
│   └── conftest.py                   # Pytest fixtures
├── alembic/                          # Database migrations
│   ├── versions/
│   └── env.py
├── scripts/
│   ├── init_db.py                    # Initialize database
│   └── seed_data.py                  # Seed test data
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── pytest.ini
└── README.md
```

### 5.3 API Design

#### Endpoints

```
Authentication:
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login (returns JWT)
POST   /api/v1/auth/refresh           # Refresh access token
GET    /api/v1/auth/me                # Get current user

Reviews:
POST   /api/v1/reviews/analyze        # Analyze PR diff
GET    /api/v1/reviews/{id}           # Get review details
GET    /api/v1/reviews                # List user's reviews
DELETE /api/v1/reviews/{id}           # Delete review

Repositories:
POST   /api/v1/repositories/connect   # Connect repository
GET    /api/v1/repositories/{id}      # Get repository details
GET    /api/v1/repositories           # List repositories
POST   /api/v1/repositories/{id}/analyze  # Trigger analysis
GET    /api/v1/repositories/{id}/health   # Get health metrics
DELETE /api/v1/repositories/{id}      # Disconnect repository

Documentation:
POST   /api/v1/documentation/generate # Generate documentation
GET    /api/v1/documentation/{id}     # Get documentation
GET    /api/v1/documentation          # List documentation

Analytics:
GET    /api/v1/analytics/overview     # Dashboard metrics
GET    /api/v1/analytics/trends       # Trends over time

WebSocket:
WS     /api/v1/ws                     # Real-time updates
```

#### Request/Response Examples

**POST /api/v1/reviews/analyze**
```json
Request:
{
  "pr_diff": "diff --git a/src/app.py b/src/app.py\nindex 1234567..abcdefg 100644\n--- a/src/app.py\n+++ b/src/app.py\n@@ -10,7 +10,7 @@\n def login(username, password):\n-    query = \"SELECT * FROM users WHERE username='\" + username + \"'\"\n+    query = \"SELECT * FROM users WHERE username=?\"\n",
  "repository_id": "repo_abc123",
  "options": {
    "include_security": true,
    "include_performance": true
  }
}

Response (200 OK):
{
  "review_id": "rev_xyz789",
  "status": "completed",
  "score": 85,
  "summary": "Found 1 critical security issue and 2 code quality improvements",
  "findings": [
    {
      "id": "finding_1",
      "file": "src/app.py",
      "line": 12,
      "severity": "CRITICAL",
      "category": "security",
      "issue": "SQL Injection Vulnerability Fixed",
      "explanation": "The original code concatenated user input directly into SQL query, allowing SQL injection attacks. The fix uses parameterized queries.",
      "suggestion": "Good fix! Consider using an ORM like SQLAlchemy for additional safety.",
      "code_snippet": "query = \"SELECT * FROM users WHERE username=?\""
    }
  ],
  "metrics": {
    "files_changed": 1,
    "lines_added": 1,
    "lines_removed": 1,
    "complexity_delta": 0
  },
  "created_at": "2026-05-15T21:00:00Z",
  "completed_at": "2026-05-15T21:00:12Z"
}
```

**POST /api/v1/repositories/connect**
```json
Request:
{
  "url": "https://github.com/username/repo",
  "provider": "github",
  "access_token": "ghp_xxxxxxxxxxxxx"
}

Response (201 Created):
{
  "repository_id": "repo_abc123",
  "name": "username/repo",
  "url": "https://github.com/username/repo",
  "provider": "github",
  "status": "connected",
  "analysis_status": "pending",
  "created_at": "2026-05-15T21:00:00Z"
}
```

### 5.4 Security Implementation

#### Authentication
```python
# core/security.py
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=24))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

#### Input Validation
```python
# schemas/review.py
from pydantic import BaseModel, Field, validator

class ReviewAnalyzeRequest(BaseModel):
    pr_diff: str = Field(..., min_length=1, max_length=1_000_000)
    repository_id: str = Field(..., regex=r'^repo_[a-zA-Z0-9]+$')
    options: Optional[ReviewOptions] = None
    
    @validator('pr_diff')
    def validate_diff(cls, v):
        if not v.startswith('diff --git'):
            raise ValueError('Invalid diff format')
        # Check for malicious patterns
        dangerous_patterns = ['rm -rf', 'eval(', 'exec(']
        if any(pattern in v for pattern in dangerous_patterns):
            raise ValueError('Potentially malicious content detected')
        return v
```

#### Rate Limiting
```python
# api/dependencies.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/reviews/analyze")
@limiter.limit("10/minute")  # 10 requests per minute per IP
async def analyze_review(request: Request, ...):
    pass
```

---

## 6. FRONTEND ARCHITECTURE

### 6.1 Technology Stack
- **Framework**: Next.js 14+ (App Router, Server Components)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand (lightweight)
- **Data Fetching**: TanStack Query (React Query v5)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Code Display**: react-syntax-highlighter
- **WebSocket**: socket.io-client
- **Testing**: Vitest + React Testing Library

### 6.2 Folder Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth layout group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/              # Dashboard layout group
│   │   │   ├── layout.tsx            # Dashboard layout
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── reviews/
│   │   │   │   ├── page.tsx          # Reviews list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # New review
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Review details
│   │   │   ├── repositories/
│   │   │   │   ├── page.tsx          # Repositories list
│   │   │   │   ├── connect/
│   │   │   │   │   └── page.tsx      # Connect repo
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Repository details
│   │   │   └── documentation/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── reviews/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── FindingsList.tsx
│   │   │   ├── FindingCard.tsx
│   │   │   ├── CodeDiff.tsx
│   │   │   └── ReviewForm.tsx
│   │   ├── repositories/
│   │   │   ├── RepositoryCard.tsx
│   │   │   ├── HealthScore.tsx
│   │   │   ├── MetricsChart.tsx
│   │   │   └── ConnectRepoForm.tsx
│   │   ├── documentation/
│   │   │   └── DocumentationViewer.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── lib/
│   │   ├── api.ts                    # API client
│   │   ├── websocket.ts              # WebSocket client
│   │   ├── utils.ts                  # Utility functions
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useReviews.ts
│   │   ├── useRepositories.ts
│   │   ├── useWebSocket.ts
│   │   └── useAuth.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── review.ts
│   │   ├── repository.ts
│   │   ├── user.ts
│   │   └── api.ts
│   └── styles/
│       └── globals.css
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env.local.example
```

### 6.3 Key Pages & Components

#### Dashboard Home (`app/(dashboard)/page.tsx`)
- Overview metrics cards
- Recent reviews list
- Repository health summary
- Quick action buttons

#### PR Review Page (`app/(dashboard)/reviews/[id]/page.tsx`)
- Review header (score, status, timestamp)
- Findings list grouped by severity
- Code diff viewer with inline comments
- Export options (PDF, Markdown)

#### New Review Page (`app/(dashboard)/reviews/new/page.tsx`)
- PR diff upload (textarea or file)
- Repository selection
- Options (security scan, performance analysis)
- Real-time progress indicator

---

## 7. AI WORKFLOW & PROMPT ENGINEERING

### 7.1 AI Provider Strategy

**Primary: IBM watsonx.ai**
- Model: granite-13b-chat-v2 or llama-2-70b-chat
- Reason: Hackathon sponsor, enterprise-grade
- Cost: ~$0.002 per 1K tokens
- Latency: 2-5 seconds

**Fallback: OpenAI GPT-4**
- Model: gpt-4-turbo
- Reason: Reliability, proven performance
- Cost: ~$0.01 per 1K tokens (input), ~$0.03 per 1K tokens (output)
- Latency: 3-8 seconds

### 7.2 Prompt Templates

#### Code Review Prompt
```python
CODE_REVIEW_PROMPT = """You are an expert software engineer conducting a thorough code review.

CONTEXT:
Repository: {repo_name}
Language: {language}
Files Changed: {file_count}

RELATED FILES (for context):
{context_files}

CODE CHANGES:
{diff}

REVIEW CRITERIA:
1. Code Quality: Readability, maintainability, DRY principle, naming conventions
2. Security: SQL injection, XSS, authentication issues, hardcoded secrets
3. Performance: Time complexity, memory usage, N+1 queries, unnecessary loops
4. Best Practices: Language-specific conventions, design patterns, error handling
5. Testing: Test coverage, edge cases, test quality

INSTRUCTIONS:
- Identify specific issues with file path and line number
- Explain WHY each issue matters (impact on security, performance, maintainability)
- Suggest concrete fixes with code examples
- Classify severity:
  * CRITICAL: Security vulnerabilities, data loss risks
  * HIGH: Bugs, performance issues, broken functionality
  * MEDIUM: Code quality, maintainability concerns
  * LOW: Style issues, minor improvements
  * INFO: Suggestions, best practices
- Be constructive and educational
- Focus on the most important issues first

OUTPUT FORMAT (valid JSON only, no markdown):
{{
  "findings": [
    {{
      "file": "path/to/file.py",
      "line": 42,
      "severity": "HIGH",
      "category": "security",
      "issue": "Brief issue description (max 100 chars)",
      "explanation": "Detailed explanation of why this is a problem and its impact",
      "suggestion": "Specific fix with actionable steps",
      "code_example": "# Example of fixed code\\nfixed_code_here()"
    }}
  ],
  "summary": "Overall assessment in 2-3 sentences highlighting key concerns",
  "score": 85,
  "strengths": ["Good test coverage", "Clear naming conventions"],
  "improvements": ["Add input validation", "Optimize database queries"]
}}

Respond ONLY with valid JSON. No additional text."""
```

### 7.3 Token Optimization

**Strategies**:
1. **Context Pruning**: Include only 3-5 most relevant files
2. **Diff Compression**: Remove unchanged context lines (keep ±3 lines)
3. **Smart Truncation**: Truncate large files to relevant sections
4. **Caching**: Cache identical prompts for 30 minutes
5. **Batch Processing**: Analyze multiple small files in one request

**Token Budget per Request**:
- Input: Max 8,000 tokens (~6,000 words)
- Output: Max 2,000 tokens (~1,500 words)
- Total cost per review: ~$0.10-0.15

### 7.4 AI Safety & Validation

**Input Sanitization**:
```python
def sanitize_code_input(code: str) -> str:
    # Remove potentially malicious patterns
    dangerous_patterns = [
        r'rm\s+-rf',
        r'eval\s*\(',
        r'exec\s*\(',
        r'__import__',
        r'subprocess\.',
    ]
    for pattern in dangerous_patterns:
        if re.search(pattern, code):
            raise ValueError(f"Potentially malicious pattern detected: {pattern}")
    return code
```

**Output Validation**:
```python
def validate_ai_response(response: dict) -> dict:
    # Ensure required fields exist
    required_fields = ['findings', 'summary', 'score']
    for field in required_fields:
        if field not in response:
            raise ValueError(f"Missing required field: {field}")
    
    # Validate score range
    if not 0 <= response['score'] <= 100:
        response['score'] = max(0, min(100, response['score']))
    
    # Validate severity values
    valid_severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']
    for finding in response['findings']:
        if finding['severity'] not in valid_severities:
            finding['severity'] = 'MEDIUM'
    
    return response
```

---

## 8. DATABASE SCHEMA

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Repositories table
CREATE TABLE repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    default_branch VARCHAR(100) DEFAULT 'main',
    last_analyzed_at TIMESTAMP,
    health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, url)
);

CREATE INDEX idx_repositories_user ON repositories(user_id);
CREATE INDEX idx_repositories_health ON repositories(health_score DESC);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pr_number INTEGER,
    pr_title VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    score INTEGER CHECK (score >= 0 AND score <= 100),
    summary TEXT,
    findings JSONB NOT NULL DEFAULT '[]',
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_reviews_repository ON reviews(repository_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- Repository analyses table
CREATE TABLE repository_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    file_count INTEGER,
    total_lines INTEGER,
    complexity_metrics JSONB DEFAULT '{}',
    hotspots JSONB DEFAULT '[]',
    security_issues JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_analyses_repository ON repository_analyses(repository_id);
CREATE INDEX idx_analyses_created ON repository_analyses(created_at DESC);

-- Documentation table
CREATE TABLE documentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    format VARCHAR(20) DEFAULT 'markdown',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documentation_repository ON documentation(repository_id);
```

---

## 9. DEPLOYMENT STRATEGY

### 9.1 Deployment Architecture

```
Frontend (Vercel):
- Next.js app deployed to Vercel
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard
- CDN for static assets

Backend (Render):
- FastAPI app deployed as Web Service
- PostgreSQL database (Render managed)
- Redis instance (Render managed or Upstash)
- Environment variables configured in Render dashboard

Alternative (Docker):
- docker-compose.yml for local development
- Can deploy to any cloud provider (AWS, GCP, Azure)
```

### 9.2 Environment Variables

**Backend (.env)**:
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/devinsight
REDIS_URL=redis://host:6379/0

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Providers
WATSONX_API_KEY=your-watsonx-api-key
WATSONX_PROJECT_ID=your-project-id
OPENAI_API_KEY=your-openai-api-key

# CORS
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10
```

**Frontend (.env.local)**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api/v1/ws
```

### 9.3 Docker Configuration

**backend/Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./app ./app

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/devinsight
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./backend/app:/app/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=devinsight
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 10. DEVELOPMENT TIMELINE (24-30 hours)

### Phase 1: Setup & Core Backend (8 hours)
- [x] Project structure setup
- [ ] Database schema & models (2h)
- [ ] Authentication system (2h)
- [ ] Core API endpoints (2h)
- [ ] AI service integration (2h)

### Phase 2: PR Review Feature (8 hours)
- [ ] Diff parsing logic (2h)
- [ ] Security scanner implementation (2h)
- [ ] AI review service (2h)
- [ ] Review API endpoints (2h)

### Phase 3: Frontend Development (8 hours)
- [ ] UI components setup (2h)
- [ ] Dashboard & review pages (3h)
- [ ] Repository management (2h)
- [ ] Real-time updates (1h)

### Phase 4: Polish & Deploy (6 hours)
- [ ] Testing & bug fixes (2h)
- [ ] Documentation (1h)
- [ ] Deployment (2h)
- [ ] Demo preparation (1h)

---

## 11. DEMO FLOW (3 minutes)

### Minute 1: Problem & Solution
"Code reviews are slow and inconsistent. DevInsight AI provides instant, AI-powered code reviews that catch security issues, performance problems, and code quality concerns in seconds."

### Minute 2: Live Demo
1. **Upload PR Diff**: Show uploading a real PR with security vulnerability
2. **Instant Analysis**: Watch real-time analysis (10-15 seconds)
3. **Review Results**: Highlight critical security finding with explanation
4. **Repository Dashboard**: Show health score and metrics

### Minute 3: Impact & Future
"DevInsight AI reduces code review time by 70%, catches security issues before production, and helps teams maintain high code quality. Future: GitHub integration, team collaboration, custom rules."

---

## 12. HACKATHON WINNING STRATEGY

### Innovation (25%)
- **AI-powered context-aware reviews** (not just static analysis)
- **Multi-dimensional analysis** (security + performance + quality)
- **Actionable insights** with code examples

### Technical Complexity (25%)
- **Clean architecture** (service layer, repository pattern)
- **Async processing** for performance
- **AI orchestration** with fallback logic
- **Real-time updates** via WebSocket

### Usability (20%)
- **Beautiful UI** with shadcn/ui
- **Instant feedback** (10-15 second reviews)
- **Clear visualizations** (health scores, charts)
- **Export options** (PDF, Markdown)

### Real-world Impact (20%)
- **Solves real problem** (slow code reviews)
- **Measurable benefits** (70% time reduction)
- **Production-ready architecture**
- **Scalable design**

### Demo Quality (10%)
- **Smooth flow** (problem → solution → demo → impact)
- **Live demo** (not just slides)
- **Impressive visuals**
- **Clear value proposition**

---

## 13. SECURITY CHECKLIST

- [ ] No hardcoded secrets (use environment variables)
- [ ] Password hashing (bcrypt)
- [ ] JWT authentication with expiration
- [ ] Input validation (Pydantic schemas)
- [ ] SQL injection prevention (ORM, parameterized queries)
- [ ] XSS prevention (sanitize outputs)
- [ ] CSRF protection (SameSite cookies)
- [ ] Rate limiting (10 req/min per user)
- [ ] CORS configuration (whitelist origins)
- [ ] HTTPS only in production
- [ ] Secure headers (helmet.js equivalent)
- [ ] Dependency scanning (pip-audit, npm audit)
- [ ] Error handling (don't leak sensitive info)
- [ ] Logging (structured, no sensitive data)
- [ ] API key encryption (Fernet)

---

## 14. PERFORMANCE OPTIMIZATION CHECKLIST

- [ ] Database indexes on foreign keys and query fields
- [ ] Redis caching for AI responses (30min TTL)
- [ ] Async/await for I/O operations
- [ ] Connection pooling (SQLAlchemy)
- [ ] Lazy loading for large datasets
- [ ] Pagination for list endpoints
- [ ] Code splitting (Next.js automatic)
- [ ] Image optimization (Next.js Image component)
- [ ] Bundle size optimization (tree shaking)
- [ ] API response compression (gzip)
- [ ] CDN for static assets
- [ ] Database query optimization (EXPLAIN ANALYZE)
- [ ] Token optimization for AI requests
- [ ] Parallel processing where possible

---

## 15. FUTURE SCALABILITY

### Short-term (Post-Hackathon)
- GitHub/GitLab OAuth integration
- Webhook support for automatic PR reviews
- Team collaboration features
- Custom rule configuration
- Slack/Discord notifications

### Medium-term (3-6 months)
- Microservices architecture
- Message queue (RabbitMQ/Kafka) for async jobs
- Vector database for semantic code search
- ML model for learning team patterns
- Multi-language support (currently Python/JS focused)

### Long-term (6-12 months)
- Enterprise features (SSO, RBAC, audit logs)
- On-premise deployment option
- IDE plugins (VS Code, JetBrains)
- CI/CD integration (GitHub Actions, Jenkins)
- Advanced analytics and reporting

---

## 16. README STRUCTURE

```markdown
# DevInsight AI

> Intelligent Code Review & Repository Intelligence Platform

## 🚀 Features
- Instant AI-powered code reviews
- Security vulnerability detection
- Repository health monitoring
- Auto-generated documentation

## 🛠️ Tech Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Python, PostgreSQL
- AI: IBM watsonx.ai, OpenAI GPT-4

## 📦 Installation
[Setup instructions]

## 🎯 Usage
[Usage examples with screenshots]

## 🏗️ Architecture
[Architecture diagram and explanation]

## 🔒 Security
[Security features and best practices]

## 📊 Performance
[Performance metrics and optimizations]

## 🤝 Contributing
[Contribution guidelines]

## 📄 License
MIT
```

---

## 17. PRESENTATION STRUCTURE

### Slide 1: Title
- DevInsight AI
- Tagline: "Intelligent Code Review in Seconds"
- Team name

### Slide 2: Problem
- Code reviews are slow (40% of dev time)
- Security issues slip through
- Inconsistent quality
- Onboarding takes weeks

### Slide 3: Solution
- AI-powered instant reviews
- Context-aware analysis
- Security + performance + quality
- Real-time insights

### Slide 4: Demo
- [Live demo video or screenshots]
- Show PR review flow
- Highlight key features

### Slide 5: Architecture
- High-level architecture diagram
- Tech stack highlights
- Scalability considerations

### Slide 6: Impact
- 70% faster code reviews
- Catch security issues early
- Improve code quality
- Accelerate onboarding

### Slide 7: Future Vision
- GitHub integration
- Team collaboration
- Custom rules
- Enterprise features

### Slide 8: Thank You
- Contact information
- GitHub repository
- Live demo link

---

**END OF ARCHITECTURE DOCUMENT**

This architecture provides a complete blueprint for building a production-grade hackathon project that is:
- ✅ Technically impressive
- ✅ Realistically achievable in 24-30 hours
- ✅ Demo-friendly
- ✅ Scalable
- ✅ Secure
- ✅ Well-documented
- ✅ Hackathon-winning potential