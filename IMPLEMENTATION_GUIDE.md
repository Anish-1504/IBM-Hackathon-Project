# DevInsight AI - Implementation Guide

This guide provides step-by-step instructions for implementing the DevInsight AI platform.

---

## 🚀 QUICK START

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Git

### Setup Commands
```bash
# Clone repository
git clone <your-repo-url>
cd devinsight-ai

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
alembic upgrade head
python scripts/init_db.py

# Frontend setup
cd ../frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with API URL

# Run development servers
# Terminal 1 (Backend)
cd backend
uvicorn app.main:app --reload

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

---

## 📁 PHASE 1: BACKEND CORE (Hours 1-8)

### Step 1.1: Database Models (2 hours)

**File: `backend/app/models/base.py`**
```python
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DateTime
from datetime import datetime
import uuid

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
```

**File: `backend/app/models/user.py`**
```python
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
```

**File: `backend/app/models/repository.py`**
```python
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from .base import BaseModel

class Repository(BaseModel):
    __tablename__ = "repositories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    provider = Column(String(50), nullable=False)
    default_branch = Column(String(100), default="main")
    health_score = Column(Integer)
    metadata = Column(JSONB, default={})
    
    user = relationship("User", backref="repositories")
```

**File: `backend/app/models/review.py`**
```python
from sqlalchemy import Column, String, Integer, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from .base import BaseModel

class Review(BaseModel):
    __tablename__ = "reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    repository_id = Column(UUID(as_uuid=True), ForeignKey("repositories.id", ondelete="CASCADE"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    pr_number = Column(Integer)
    pr_title = Column(String(500))
    status = Column(String(50), nullable=False, default="pending")
    score = Column(Integer)
    summary = Column(Text)
    findings = Column(JSONB, default=[])
    metrics = Column(JSONB, default={})
    completed_at = Column(DateTime)
    
    repository = relationship("Repository", backref="reviews")
    user = relationship("User", backref="reviews")
```

### Step 1.2: Pydantic Schemas (1 hour)

**File: `backend/app/schemas/common.py`**
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

class TimestampSchema(BaseSchema):
    created_at: datetime
    updated_at: datetime
```

**File: `backend/app/schemas/review.py`**
```python
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from .common import TimestampSchema

class Finding(BaseModel):
    file: str
    line: int
    severity: str
    category: str
    issue: str
    explanation: str
    suggestion: str
    code_example: Optional[str] = None

class ReviewOptions(BaseModel):
    include_security: bool = True
    include_performance: bool = True
    context_depth: int = Field(default=3, ge=1, le=5)

class ReviewAnalyzeRequest(BaseModel):
    pr_diff: str = Field(..., min_length=1, max_length=1_000_000)
    repository_id: Optional[str] = None
    options: Optional[ReviewOptions] = ReviewOptions()
    
    @validator('pr_diff')
    def validate_diff(cls, v):
        if not v.strip().startswith('diff --git'):
            raise ValueError('Invalid diff format')
        return v

class ReviewResponse(TimestampSchema):
    review_id: UUID
    status: str
    score: Optional[int] = None
    summary: Optional[str] = None
    findings: List[Finding] = []
    metrics: Dict[str, Any] = {}
    completed_at: Optional[datetime] = None
```

### Step 1.3: Core Configuration (1 hour)

**File: `backend/app/core/config.py`**
```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App
    APP_NAME: str = "DevInsight AI"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # AI Providers
    WATSONX_API_KEY: str
    WATSONX_PROJECT_ID: str
    OPENAI_API_KEY: str
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

**File: `backend/app/core/security.py`**
```python
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

### Step 1.4: Database Session (30 minutes)

**File: `backend/app/db/session.py`**
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Convert postgresql:// to postgresql+asyncpg://
database_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(database_url, echo=settings.DEBUG, future=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

### Step 1.5: Authentication Endpoints (2 hours)

**File: `backend/app/api/v1/endpoints/auth.py`**
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse
from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        full_name=user_data.full_name
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return user

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    # Find user
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}
```

### Step 1.6: Main Application (30 minutes)

**File: `backend/app/main.py`**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "DevInsight AI API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

---

## 🔍 PHASE 2: PR REVIEW FEATURE (Hours 9-16)

### Step 2.1: Code Parser Service (2 hours)

**File: `backend/app/services/code_parser.py`**
```python
import re
from typing import List, Dict, Tuple
from dataclasses import dataclass

@dataclass
class FileChange:
    file_path: str
    old_content: str
    new_content: str
    added_lines: List[Tuple[int, str]]
    removed_lines: List[Tuple[int, str]]
    language: str

class CodeParser:
    def parse_diff(self, diff: str) -> List[FileChange]:
        """Parse git diff into structured file changes"""
        changes = []
        current_file = None
        old_content = []
        new_content = []
        added_lines = []
        removed_lines = []
        line_number = 0
        
        for line in diff.split('\n'):
            # New file
            if line.startswith('diff --git'):
                if current_file:
                    changes.append(FileChange(
                        file_path=current_file,
                        old_content='\n'.join(old_content),
                        new_content='\n'.join(new_content),
                        added_lines=added_lines,
                        removed_lines=removed_lines,
                        language=self._detect_language(current_file)
                    ))
                
                # Extract file path
                match = re.search(r'b/(.+)$', line)
                current_file = match.group(1) if match else None
                old_content = []
                new_content = []
                added_lines = []
                removed_lines = []
                line_number = 0
            
            # Line number info
            elif line.startswith('@@'):
                match = re.search(r'\+(\d+)', line)
                line_number = int(match.group(1)) if match else 0
            
            # Added line
            elif line.startswith('+') and not line.startswith('+++'):
                content = line[1:]
                new_content.append(content)
                added_lines.append((line_number, content))
                line_number += 1
            
            # Removed line
            elif line.startswith('-') and not line.startswith('---'):
                content = line[1:]
                old_content.append(content)
                removed_lines.append((line_number, content))
            
            # Context line
            elif not line.startswith('\\'):
                old_content.append(line)
                new_content.append(line)
                line_number += 1
        
        # Add last file
        if current_file:
            changes.append(FileChange(
                file_path=current_file,
                old_content='\n'.join(old_content),
                new_content='\n'.join(new_content),
                added_lines=added_lines,
                removed_lines=removed_lines,
                language=self._detect_language(current_file)
            ))
        
        return changes
    
    def _detect_language(self, file_path: str) -> str:
        """Detect programming language from file extension"""
        ext_map = {
            '.py': 'python',
            '.js': 'javascript',
            '.ts': 'typescript',
            '.jsx': 'javascript',
            '.tsx': 'typescript',
            '.java': 'java',
            '.go': 'go',
            '.rs': 'rust',
            '.cpp': 'cpp',
            '.c': 'c',
            '.rb': 'ruby',
            '.php': 'php',
        }
        ext = '.' + file_path.split('.')[-1] if '.' in file_path else ''
        return ext_map.get(ext, 'unknown')
```

### Step 2.2: Security Scanner (2 hours)

**File: `backend/app/services/security_scanner.py`**
```python
import re
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class Vulnerability:
    file: str
    line: int
    type: str
    severity: str
    description: str
    recommendation: str

class SecurityScanner:
    VULNERABILITY_PATTERNS = {
        'sql_injection': {
            'patterns': [
                r'execute\s*\([^)]*\+[^)]*\)',
                r'cursor\.execute\s*\([^)]*%[^)]*\)',
                r'query\s*=\s*["\'].*["\'].*\+',
            ],
            'severity': 'CRITICAL',
            'description': 'Potential SQL injection vulnerability',
            'recommendation': 'Use parameterized queries or ORM'
        },
        'xss': {
            'patterns': [
                r'innerHTML\s*=\s*[^;]*\+',
                r'dangerouslySetInnerHTML',
                r'document\.write\s*\(',
            ],
            'severity': 'HIGH',
            'description': 'Potential XSS vulnerability',
            'recommendation': 'Sanitize user input and use safe DOM methods'
        },
        'hardcoded_secrets': {
            'patterns': [
                r'password\s*=\s*["\'][^"\']{8,}["\']',
                r'api_key\s*=\s*["\'][^"\']{20,}["\']',
                r'secret\s*=\s*["\'][^"\']{20,}["\']',
                r'token\s*=\s*["\'][^"\']{20,}["\']',
            ],
            'severity': 'CRITICAL',
            'description': 'Hardcoded secret detected',
            'recommendation': 'Use environment variables for secrets'
        },
        'path_traversal': {
            'patterns': [
                r'open\s*\([^)]*\+[^)]*\)',
                r'\.\./',
            ],
            'severity': 'HIGH',
            'description': 'Potential path traversal vulnerability',
            'recommendation': 'Validate and sanitize file paths'
        },
        'command_injection': {
            'patterns': [
                r'os\.system\s*\(',
                r'subprocess\.call\s*\([^)]*\+',
                r'eval\s*\(',
                r'exec\s*\(',
            ],
            'severity': 'CRITICAL',
            'description': 'Potential command injection',
            'recommendation': 'Avoid dynamic code execution, use safe alternatives'
        }
    }
    
    async def scan(self, changes: List) -> List[Vulnerability]:
        """Scan code changes for security vulnerabilities"""
        vulnerabilities = []
        
        for change in changes:
            content = change.new_content
            
            for vuln_type, config in self.VULNERABILITY_PATTERNS.items():
                for pattern in config['patterns']:
                    matches = re.finditer(pattern, content, re.IGNORECASE)
                    
                    for match in matches:
                        line_num = content[:match.start()].count('\n') + 1
                        
                        vulnerabilities.append(Vulnerability(
                            file=change.file_path,
                            line=line_num,
                            type=vuln_type,
                            severity=config['severity'],
                            description=config['description'],
                            recommendation=config['recommendation']
                        ))
        
        return vulnerabilities
```

### Step 2.3: AI Service (2 hours)

**File: `backend/app/services/ai_service.py`**
```python
import json
import hashlib
from typing import List, Dict, Optional
import httpx
from app.core.config import settings
from app.utils.cache import CacheService

class AIService:
    def __init__(self):
        self.cache = CacheService()
        self.watsonx_url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation"
        self.openai_url = "https://api.openai.com/v1/chat/completions"
    
    async def review_code(self, changes: List, context: Dict) -> Dict:
        """AI-powered code review"""
        prompt = self._build_review_prompt(changes, context)
        
        # Check cache
        cache_key = self._generate_cache_key(prompt)
        cached = await self.cache.get(cache_key)
        if cached:
            return json.loads(cached)
        
        # Call AI provider
        try:
            response = await self._call_watsonx(prompt)
        except Exception as e:
            print(f"Watsonx failed: {e}, falling back to OpenAI")
            response = await self._call_openai(prompt)
        
        # Parse and validate
        result = self._parse_response(response)
        
        # Cache result
        await self.cache.set(cache_key, json.dumps(result), ttl=1800)
        
        return result
    
    def _build_review_prompt(self, changes: List, context: Dict) -> str:
        """Build optimized prompt for code review"""
        files_summary = "\n".join([
            f"- {c.file_path} ({len(c.added_lines)} added, {len(c.removed_lines)} removed)"
            for c in changes
        ])
        
        changes_detail = "\n\n".join([
            f"File: {c.file_path}\nLanguage: {c.language}\n\nChanges:\n{c.new_content[:1000]}"
            for c in changes[:3]  # Limit to 3 files
        ])
        
        return f"""You are an expert code reviewer. Analyze the following code changes.

FILES CHANGED:
{files_summary}

CODE CHANGES:
{changes_detail}

INSTRUCTIONS:
1. Review for code quality, security, performance, and best practices
2. Identify specific issues with line numbers
3. Suggest concrete improvements
4. Classify severity: CRITICAL, HIGH, MEDIUM, LOW, INFO

OUTPUT FORMAT (JSON only):
{{
  "findings": [
    {{
      "file": "path/to/file",
      "line": 42,
      "severity": "HIGH",
      "category": "security",
      "issue": "Brief description",
      "explanation": "Detailed explanation",
      "suggestion": "How to fix"
    }}
  ],
  "summary": "Overall assessment",
  "score": 85,
  "strengths": ["Good practices"],
  "improvements": ["Areas to improve"]
}}

Respond ONLY with valid JSON."""
    
    async def _call_watsonx(self, prompt: str) -> str:
        """Call IBM watsonx.ai"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.watsonx_url,
                headers={
                    "Authorization": f"Bearer {settings.WATSONX_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model_id": "ibm/granite-13b-chat-v2",
                    "input": prompt,
                    "parameters": {
                        "max_new_tokens": 2000,
                        "temperature": 0.3,
                        "top_p": 0.9
                    },
                    "project_id": settings.WATSONX_PROJECT_ID
                },
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()["results"][0]["generated_text"]
    
    async def _call_openai(self, prompt: str) -> str:
        """Call OpenAI GPT-4 as fallback"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.openai_url,
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4-turbo-preview",
                    "messages": [
                        {"role": "system", "content": "You are an expert code reviewer."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 2000
                },
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
    
    def _parse_response(self, response: str) -> Dict:
        """Parse and validate AI response"""
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if not json_match:
            raise ValueError("No JSON found in response")
        
        result = json.loads(json_match.group())
        
        # Validate required fields
        required = ['findings', 'summary', 'score']
        for field in required:
            if field not in result:
                result[field] = [] if field == 'findings' else 'No summary' if field == 'summary' else 50
        
        return result
    
    def _generate_cache_key(self, prompt: str) -> str:
        """Generate cache key from prompt"""
        return f"ai_review:{hashlib.md5(prompt.encode()).hexdigest()}"
```

### Step 2.4: PR Review Service (2 hours)

**File: `backend/app/services/pr_review_service.py`**
```python
import asyncio
from typing import Dict, List
from app.services.code_parser import CodeParser
from app.services.security_scanner import SecurityScanner
from app.services.ai_service import AIService

class PRReviewService:
    def __init__(self):
        self.code_parser = CodeParser()
        self.security_scanner = SecurityScanner()
        self.ai_service = AIService()
    
    async def analyze_pr(self, pr_diff: str, repository_id: str = None) -> Dict:
        """Analyze PR with AI-powered review"""
        # Parse diff
        changes = self.code_parser.parse_diff(pr_diff)
        
        if not changes:
            return {
                "status": "error",
                "message": "No changes detected in diff"
            }
        
        # Run parallel analysis
        ai_review, security_scan = await asyncio.gather(
            self.ai_service.review_code(changes, {}),
            self.security_scanner.scan(changes)
        )
        
        # Merge security findings into AI review
        for vuln in security_scan:
            ai_review['findings'].append({
                "file": vuln.file,
                "line": vuln.line,
                "severity": vuln.severity,
                "category": "security",
                "issue": vuln.description,
                "explanation": f"Security scanner detected: {vuln.type}",
                "suggestion": vuln.recommendation
            })
        
        # Calculate metrics
        metrics = self._calculate_metrics(changes)
        
        # Adjust score based on security findings
        critical_count = sum(1 for f in ai_review['findings'] if f['severity'] == 'CRITICAL')
        if critical_count > 0:
            ai_review['score'] = max(0, ai_review['score'] - (critical_count * 15))
        
        return {
            "status": "completed",
            "score": ai_review['score'],
            "summary": ai_review['summary'],
            "findings": ai_review['findings'],
            "metrics": metrics,
            "strengths": ai_review.get('strengths', []),
            "improvements": ai_review.get('improvements', [])
        }
    
    def _calculate_metrics(self, changes: List) -> Dict:
        """Calculate code metrics"""
        total_added = sum(len(c.added_lines) for c in changes)
        total_removed = sum(len(c.removed_lines) for c in changes)
        
        return {
            "files_changed": len(changes),
            "lines_added": total_added,
            "lines_removed": total_removed,
            "net_lines": total_added - total_removed
        }
```

### Step 2.5: Review API Endpoint (2 hours)

**File: `backend/app/api/v1/endpoints/reviews.py`**
```python
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.db.session import get_db
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewAnalyzeRequest, ReviewResponse
from app.services.pr_review_service import PRReviewService
from app.api.dependencies import get_current_user

router = APIRouter()
review_service = PRReviewService()

@router.post("/analyze", response_model=ReviewResponse)
async def analyze_review(
    request: ReviewAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Analyze PR diff and generate review"""
    # Create review record
    review = Review(
        user_id=current_user.id,
        repository_id=request.repository_id,
        status="processing"
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    
    try:
        # Analyze PR
        result = await review_service.analyze_pr(
            request.pr_diff,
            request.repository_id
        )
        
        # Update review
        review.status = result['status']
        review.score = result['score']
        review.summary = result['summary']
        review.findings = result['findings']
        review.metrics = result['metrics']
        
        await db.commit()
        await db.refresh(review)
        
        return ReviewResponse(
            review_id=review.id,
            status=review.status,
            score=review.score,
            summary=review.summary,
            findings=review.findings,
            metrics=review.metrics,
            created_at=review.created_at,
            updated_at=review.updated_at
        )
    
    except Exception as e:
        review.status = "failed"
        await db.commit()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get review by ID"""
    result = await db.execute(
        select(Review).where(
            Review.id == review_id,
            Review.user_id == current_user.id
        )
    )
    review = result.scalar_one_or_none()
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return review

@router.get("/", response_model=List[ReviewResponse])
async def list_reviews(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 20
):
    """List user's reviews"""
    result = await db.execute(
        select(Review)
        .where(Review.user_id == current_user.id)
        .order_by(Review.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    reviews = result.scalars().all()
    return reviews
```

---

## 🎨 PHASE 3: FRONTEND (Hours 17-24)

### Step 3.1: API Client (1 hour)

**File: `frontend/src/lib/api.ts`**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API methods
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, full_name: string) =>
    api.post('/auth/register', { email, password, full_name }),
};

export const reviewsAPI = {
  analyze: (pr_diff: string, repository_id?: string, options?: any) =>
    api.post('/reviews/analyze', { pr_diff, repository_id, options }),
  get: (id: string) => api.get(`/reviews/${id}`),
  list: (skip = 0, limit = 20) => api.get(`/reviews?skip=${skip}&limit=${limit}`),
};
```

### Step 3.2: Key Components (3 hours)

**File: `frontend/src/components/reviews/ReviewForm.tsx`**
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reviewsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function ReviewForm() {
  const [prDiff, setPrDiff] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await reviewsAPI.analyze(prDiff);
      router.push(`/reviews/${result.review_id}`);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Pull Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste your PR diff here..."
            value={prDiff}
            onChange={(e) => setPrDiff(e.target.value)}
            rows={15}
            className="font-mono text-sm"
          />
          <Button type="submit" disabled={loading || !prDiff.trim()}>
            {loading ? 'Analyzing...' : 'Analyze PR'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

**File: `frontend/src/components/reviews/FindingCard.tsx`**
```typescript
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Finding {
  file: string;
  line: number;
  severity: string;
  category: string;
  issue: string;
  explanation: string;
  suggestion: string;
}

export function FindingCard({ finding }: { finding: Finding }) {
  const severityColors = {
    CRITICAL: 'destructive',
    HIGH: 'destructive',
    MEDIUM: 'warning',
    LOW: 'secondary',
    INFO: 'default',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={severityColors[finding.severity]}>
                {finding.severity}
              </Badge>
              <Badge variant="outline">{finding.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {finding.file}:{finding.line}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-semibold mb-1">{finding.issue}</h4>
          <p className="text-sm text-muted-foreground">{finding.explanation}</p>
        </div>
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm font-medium mb-1">Suggestion:</p>
          <p className="text-sm">{finding.suggestion}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Step 3.3: Pages (2 hours)

**File: `frontend/src/app/(dashboard)/reviews/new/page.tsx`**
```typescript
import { ReviewForm } from '@/components/reviews/ReviewForm';

export default function NewReviewPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">New Code Review</h1>
      <ReviewForm />
    </div>
  );
}
```

**File: `frontend/src/app/(dashboard)/reviews/[id]/page.tsx`**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { reviewsAPI } from '@/lib/api';
import { FindingCard } from '@/components/reviews/FindingCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ReviewDetailPage() {
  const params = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const data = await reviewsAPI.get(params.id as string);
        setReview(data);
      } catch (error) {
        console.error('Failed to fetch review:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!review) return <div>Review not found</div>;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Code Review Results</CardTitle>
            <Badge variant={review.score >= 80 ? 'default' : 'destructive'}>
              Score: {review.score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{review.summary}</p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Files Changed</p>
              <p className="text-2xl font-bold">{review.metrics.files_changed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lines Added</p>
              <p className="text-2xl font-bold text-green-600">
                +{review.metrics.lines_added}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lines Removed</p>
              <p className="text-2xl font-bold text-red-600">
                -{review.metrics.lines_removed}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Findings ({review.findings.length})
        </h2>
        <div className="space-y-4">
          {review.findings.map((finding, index) => (
            <FindingCard key={index} finding={finding} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🚀 PHASE 4: DEPLOYMENT (Hours 25-30)

### Step 4.1: Environment Setup

**Backend `.env`**:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/devinsight
REDIS_URL=redis://host:6379/0
SECRET_KEY=your-secret-key-min-32-chars
WATSONX_API_KEY=your-watsonx-key
WATSONX_PROJECT_ID=your-project-id
OPENAI_API_KEY=your-openai-key
CORS_ORIGINS=https://your-frontend.vercel.app
```

**Frontend `.env.local`**:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

### Step 4.2: Deploy Backend to Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables
5. Create PostgreSQL database
6. Create Redis instance
7. Deploy

### Step 4.3: Deploy Frontend to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

---

## ✅ TESTING CHECKLIST

- [ ] Backend starts without errors
- [ ] Database migrations run successfully
- [ ] User registration works
- [ ] User login works
- [ ] PR analysis endpoint works
- [ ] AI service returns valid responses
- [ ] Security scanner detects vulnerabilities
- [ ] Frontend connects to backend
- [ ] Review form submits successfully
- [ ] Review results display correctly
- [ ] Authentication flow works end-to-end

---

## 🎯 DEMO PREPARATION

1. Prepare sample PR diffs with:
   - Security vulnerability (SQL injection)
   - Performance issue
   - Code quality issue

2. Test complete flow:
   - Register → Login → Analyze PR → View Results

3. Take screenshots of:
   - Dashboard
   - Review form
   - Review results with findings

4. Prepare 3-minute pitch focusing on:
   - Problem (slow code reviews)
   - Solution (AI-powered instant reviews)
   - Demo (live analysis)
   - Impact (70% time reduction)

---

**END OF IMPLEMENTATION GUIDE**