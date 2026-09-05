from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
import bcrypt
from collections import defaultdict
from sqlalchemy.orm import Session

# ============================================================
# DATABASE
# ============================================================

from database import (
    init_db,
    SessionLocal,
    UserDB,
    DoubtDB,
    DoubtVoteDB,
    AnswerDB,
    ProjectDB,
    SolutionDB
)

# Initialize database
init_db()


# ============================================================
# AI SERVICE
# ============================================================

from ai_service import (
    solve_doubt_with_ai,
    cluster_questions_with_ai
)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="ConnectED — Core AI & Database API",
    description=(
        "Production backend providing student authentication, "
        "database CRUD operations, and AI intelligence layer."
    ),
    version="2.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ============================================================
# PYDANTIC REQUEST MODELS
# ============================================================

class UserSignUpRequest(BaseModel):
    name: str
    email: str
    password: str
    college: str
    branch: Optional[str] = "Computer Science"
    year: Optional[str] = "1st Year"
    career_goal: Optional[str] = "Software Engineer"


class UserLoginRequest(BaseModel):
    email: str
    password: str


class DoubtSolveRequest(BaseModel):
    question: str
    subject: Optional[str] = "General Engineering"
    context: Optional[str] = ""


class AnswerRequest(BaseModel):
    doubt_id: str
    content: str
    author_id: Optional[str] = None
    author_alias: str = "Anonymous"


class DoubtClusterRequest(BaseModel):
    questions: List[str]


class ProjectAdvisorRequest(BaseModel):
    title: str
    description: str


class CareerRoadmapRequest(BaseModel):
    career: str


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def read_root():

    return {
        "status": "online",
        "service": "ConnectED Production Database & AI Backend",
        "database": "SQLite / PostgreSQL Ready",
        "version": "2.0.0"
    }


# ============================================================
# DATABASE OVERVIEW
# ============================================================

@app.get("/api/database/overview")
def database_overview(db: Session = Depends(get_db)):

    tables = [
        ("users", UserDB),
        ("doubts", DoubtDB),
        ("projects", ProjectDB),
        ("solutions", SolutionDB),
    ]

    table_data = []

    for table_name, model in tables:

        table_data.append({
            "name": table_name,
            "count": db.query(model).count()
        })

    recent_users = (
        db.query(UserDB)
        .order_by(UserDB.created_at.desc())
        .limit(5)
        .all()
    )

    recent_doubts = (
        db.query(DoubtDB)
        .order_by(DoubtDB.created_at.desc())
        .limit(5)
        .all()
    )

    return {

        "tables": table_data,

        "recent_users": [
            {
                "id": item.id,
                "name": item.name,
                "college": item.college,
                "created_at": item.created_at
            }
            for item in recent_users
        ],

        "recent_doubts": [
            {
                "id": item.id,
                "title": item.title,
                "category": item.category,
                "created_at": item.created_at
            }
            for item in recent_doubts
        ]
    }


# ============================================================
# AUTHENTICATION
# ============================================================

@app.post("/api/auth/signup")
def signup(
    payload: UserSignUpRequest,
    db: Session = Depends(get_db)
):

    existing = (
        db.query(UserDB)
        .filter(UserDB.email == payload.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user_id = f"usr-{uuid.uuid4().hex[:8]}"

    hashed_password = bcrypt.hashpw(
        payload.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = UserDB(
        id=user_id,
        name=payload.name,
        email=payload.email,
        hashed_password=hashed_password,
        college=payload.college,
        branch=payload.branch,
        year=payload.year,
        career_goal=payload.career_goal,
        reputation_points=100
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {

        "status": "success",

        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "college": new_user.college,
            "branch": new_user.branch,
            "year": new_user.year,
            "careerGoal": new_user.career_goal,
            "reputationPoints": new_user.reputation_points
        }
    }


@app.post("/api/auth/login")
def login(
    payload: UserLoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(UserDB)
        .filter(UserDB.email == payload.email)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_valid = bcrypt.checkpw(
        payload.password.encode("utf-8"),
        user.hashed_password.encode("utf-8")
    )

    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {

        "status": "success",

        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "college": user.college,
            "branch": user.branch,
            "year": user.year,
            "careerGoal": user.career_goal,
            "reputationPoints": user.reputation_points
        }
    }


# ============================================================
# AI — SOLVE DOUBT
# ============================================================

@app.post("/api/ai/doubt")
def api_solve_doubt(
    payload: DoubtSolveRequest,
    db: Session = Depends(get_db)
):

    if not payload.question.strip():

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    # --------------------------------------------
    # Ask AI
    # --------------------------------------------

    result = solve_doubt_with_ai(
        question=payload.question,
        subject=payload.subject or "General Engineering",
        context=payload.context or ""
    )

    # --------------------------------------------
    # Create database record
    # --------------------------------------------

    doubt = DoubtDB(
        id=f"doubt-{uuid.uuid4().hex[:8]}",
        title=payload.question[:100],
        content=payload.question,
        category=payload.subject or "General Engineering",

        is_anonymous=True,
        author_id=None,
        author_alias="Anonymous",

        language="en",

        upvotes=1,

        # Important:
        # AI clustering will fill this later.
        cluster_topic=None
    )

    db.add(doubt)
    db.commit()
    db.refresh(doubt)

    return {

        "status": "success",

        "doubt": {
            "id": doubt.id,
            "title": doubt.title,
            "content": doubt.content,
            "category": doubt.category
        },

        **result
    }


# ============================================================
# GET ALL DOUBTS
# ============================================================

@app.get("/api/doubts")
def get_doubts(
    db: Session = Depends(get_db)
):

    doubts = (
        db.query(DoubtDB)
        .order_by(DoubtDB.created_at.desc())
        .all()
    )

    result = []

    for doubt in doubts:

        answers = (
            db.query(AnswerDB)
            .filter(AnswerDB.doubt_id == doubt.id)
            .order_by(AnswerDB.created_at.asc())
            .all()
        )

        result.append({

            "id": doubt.id,

            "title": doubt.title,

            "content": doubt.content,

            "category": doubt.category,

            "is_anonymous": doubt.is_anonymous,

            "author_alias": doubt.author_alias,

            "language": doubt.language,

            "upvotes": doubt.upvotes,

            "cluster_topic": doubt.cluster_topic,

            "created_at": (
                doubt.created_at.isoformat()
                if doubt.created_at
                else None
            ),

            "answers": [

                {
                    "id": answer.id,

                    "content": answer.content,

                    "author_alias": answer.author_alias,

                    "upvotes": answer.upvotes,

                    "created_at": (
                        answer.created_at.isoformat()
                        if answer.created_at
                        else None
                    )
                }

                for answer in answers
            ]
        })

    return {

        "status": "success",

        "doubts": result
    }


# ============================================================
# ADD ANSWER
# ============================================================

@app.post("/api/doubts/{doubt_id}/answers")
def add_answer(
    doubt_id: str,
    payload: AnswerRequest,
    db: Session = Depends(get_db)
):

    if not payload.content.strip():

        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty"
        )

    # --------------------------------------------
    # Check doubt
    # --------------------------------------------

    doubt = (
        db.query(DoubtDB)
        .filter(DoubtDB.id == doubt_id)
        .first()
    )

    if not doubt:

        raise HTTPException(
            status_code=404,
            detail="Doubt not found"
        )

    # --------------------------------------------
    # Create answer
    # --------------------------------------------

    answer = AnswerDB(

        id=f"answer-{uuid.uuid4().hex[:8]}",

        doubt_id=doubt_id,

        content=payload.content,

        author_id=payload.author_id,

        author_alias=(
            payload.author_alias
            or "Anonymous"
        ),

        upvotes=0
    )

    db.add(answer)

    db.commit()

    db.refresh(answer)

    return {

        "status": "success",

        "answer": {

            "id": answer.id,

            "doubt_id": answer.doubt_id,

            "content": answer.content,

            "author_alias": answer.author_alias,

            "upvotes": answer.upvotes,

            "created_at": (
                answer.created_at.isoformat()
                if answer.created_at
                else None
            )
        }
    }


# ============================================================
# UPVOTE DOUBT
# ============================================================

@app.post("/api/doubts/{doubt_id}/upvote")
def upvote_doubt(
    doubt_id: str,
    user_id: str,
    db: Session = Depends(get_db)
):

    doubt = (
        db.query(DoubtDB)
        .filter(DoubtDB.id == doubt_id)
        .first()
    )

    if not doubt:

        raise HTTPException(
            status_code=404,
            detail="Doubt not found"
        )

    existing_vote = (
        db.query(DoubtVoteDB)
        .filter(
            DoubtVoteDB.doubt_id == doubt_id,
            DoubtVoteDB.user_id == user_id
        )
        .first()
    )

    if existing_vote:

        return {

            "status": "already_voted",

            "doubt_id": doubt_id,

            "upvotes": doubt.upvotes,

            "message": (
                "You have already upvoted this doubt."
            )
        }

    vote = DoubtVoteDB(

        id=f"vote-{uuid.uuid4().hex[:8]}",

        doubt_id=doubt_id,

        user_id=user_id
    )

    db.add(vote)

    doubt.upvotes = (
        doubt.upvotes or 0
    ) + 1

    db.commit()

    db.refresh(doubt)

    return {

        "status": "success",

        "doubt_id": doubt.id,

        "upvotes": doubt.upvotes,

        "message": (
            "Doubt upvoted successfully."
        )
    }


# ============================================================
# ⭐ AI QUESTION CLUSTERING
# ============================================================

@app.post("/api/cluster-doubts")
def cluster_doubts(
    payload: DoubtClusterRequest,
    db: Session = Depends(get_db)
):

    try:

        # --------------------------------------------
        # Validate
        # --------------------------------------------

        questions = [
            q.strip()
            for q in payload.questions
            if q and q.strip()
        ]

        if not questions:

            return {

                "status": "success",

                "clusters": [],

                "clustered_topics": [],

                "totalClusters": 0,

                "totalDoubts": 0
            }

        # Limit AI request
        questions = questions[:50]

        print(
            f"\n🧠 AI clustering {len(questions)} questions..."
        )

        # --------------------------------------------
        # CALL AI CLUSTERING ENGINE
        # --------------------------------------------

        ai_result = cluster_questions_with_ai(
            questions
        )

        print(
            "🧠 AI cluster result:",
            ai_result
        )

        # --------------------------------------------
        # Extract clusters
        # --------------------------------------------

        ai_clusters = (
            ai_result.get("clusters", [])
            if isinstance(ai_result, dict)
            else []
        )

        formatted_clusters = []

        # --------------------------------------------
        # Process every AI cluster
        # --------------------------------------------

        for index, cluster in enumerate(ai_clusters):

            topic = (
                cluster.get("topic")
                or cluster.get("topicTitle")
                or "General Engineering"
            )

            description = (
                cluster.get("description")
                or cluster.get("learning_gap_detected")
                or "Related questions identified by ConnectED AI."
            )

            question_indexes = (
                cluster.get("question_indexes")
                or []
            )

            # Make sure indexes are integers
            valid_indexes = []

            for q_index in question_indexes:

                try:

                    q_index = int(q_index)

                    if (
                        0 <= q_index < len(questions)
                    ):
                        valid_indexes.append(q_index)

                except (
                    ValueError,
                    TypeError
                ):
                    continue

            # ----------------------------------------
            # Save AI topic into database
            # ----------------------------------------

            for q_index in valid_indexes:

                question_text = questions[q_index]

                doubt = (
                    db.query(DoubtDB)
                    .filter(
                        DoubtDB.content == question_text
                    )
                    .order_by(
                        DoubtDB.created_at.desc()
                    )
                    .first()
                )

                if doubt:

                    doubt.cluster_topic = topic

            # ----------------------------------------
            # Create frontend response
            # ----------------------------------------

            formatted_clusters.append({

                "id": f"cluster-{index + 1}",

                "topic": topic,

                "topicTitle": topic,

                "description": description,

                "question_indexes": valid_indexes,

                "question_count": len(valid_indexes),

                "questionCount": len(valid_indexes),

                "affected_colleges_count": 0,

                "affectedCollegesCount": 0,

                "learning_gap_detected": cluster.get(
                    "learning_gap_detected",
                    False
                ),

                "learning_gap": cluster.get(
                    "learning_gap_detected",
                    False
                ),

                "recommended_resources": cluster.get(
                    "recommended_resources",
                    []
                )
            })

        # --------------------------------------------
        # Commit database changes
        # --------------------------------------------

        db.commit()

        print(
            f"✅ Generated {len(formatted_clusters)} AI clusters"
        )

        # --------------------------------------------
        # Return both formats
        # --------------------------------------------

        return {

            "status": "success",

            "clusters": formatted_clusters,

            # Your current frontend expects this
            "clustered_topics": formatted_clusters,

            "totalClusters": len(
                formatted_clusters
            ),

            "totalDoubts": len(
                questions
            )
        }

    except Exception as e:

        db.rollback()

        print(
            "❌ AI clustering error:",
            str(e)
        )

        raise HTTPException(

            status_code=500,

            detail=(
                f"Failed to generate AI clusters: {str(e)}"
            )
        )


# ============================================================
# GET STORED CLUSTERS
# ============================================================

@app.get("/api/clusters")
def get_clusters(
    db: Session = Depends(get_db)
):

    doubts = (
        db.query(DoubtDB)
        .order_by(DoubtDB.created_at.desc())
        .all()
    )

    if not doubts:

        return {

            "status": "success",

            "clusters": []
        }

    clusters = {}

    for doubt in doubts:

        topic = (
            doubt.cluster_topic
            or doubt.category
            or "General Engineering"
        )

        if topic not in clusters:

            clusters[topic] = {

                "id": (
                    f"cluster-{len(clusters) + 1}"
                ),

                "topicTitle": topic,

                "description": (
                    f"Questions related to {topic}"
                ),

                "questionCount": 0,

                "college_set": set()
            }

        clusters[topic][
            "questionCount"
        ] += 1

        # ----------------------------------------
        # College analytics
        # ----------------------------------------

        if doubt.author_id:

            user = (
                db.query(UserDB)
                .filter(
                    UserDB.id == doubt.author_id
                )
                .first()
            )

            if user and user.college:

                clusters[topic][
                    "college_set"
                ].add(user.college)

    result = []

    for cluster in clusters.values():

        result.append({

            "id": cluster["id"],

            "topicTitle": cluster[
                "topicTitle"
            ],

            "description": cluster[
                "description"
            ],

            "questionCount": cluster[
                "questionCount"
            ],

            "affectedCollegesCount": len(
                cluster["college_set"]
            )
        })

    return {

        "status": "success",

        "clusters": result
    }


# ============================================================
# GET CLUSTER-DOUBTS
#
# IMPORTANT:
# This endpoint is GET only.
# It reads already-generated clusters.
#
# POST /api/cluster-doubts
# generates AI clusters.
# ============================================================

@app.get("/api/cluster-doubts")
def get_doubt_clusters(
    db: Session = Depends(get_db)
):

    try:

        doubts = (
            db.query(DoubtDB)
            .order_by(DoubtDB.created_at.desc())
            .all()
        )

        clusters = defaultdict(list)

        for doubt in doubts:

            topic = (
                doubt.cluster_topic
                or doubt.category
                or "General Engineering"
            )

            clusters[topic].append(doubt)

        result = []

        for index, (
            topic,
            cluster_doubts
        ) in enumerate(clusters.items()):

            colleges = set()

            for doubt in cluster_doubts:

                # Use actual college if available
                if doubt.author_id:

                    user = (
                        db.query(UserDB)
                        .filter(
                            UserDB.id ==
                            doubt.author_id
                        )
                        .first()
                    )

                    if user and user.college:

                        colleges.add(
                            user.college
                        )

                # Fallback
                elif doubt.author_alias:

                    colleges.add(
                        doubt.author_alias
                    )

            result.append({

                "id": (
                    f"cluster-{index + 1}"
                ),

                "topicTitle": topic,

                "description": (
                    f"{len(cluster_doubts)} "
                    "student questions have been "
                    "grouped under this topic."
                ),

                "questionCount": len(
                    cluster_doubts
                ),

                "affectedCollegesCount": len(
                    colleges
                ),

                "doubtIds": [
                    d.id
                    for d in cluster_doubts
                ]
            })

        return {

            "status": "success",

            "clusters": result,

            "totalClusters": len(result),

            "totalDoubts": len(doubts)
        }

    except Exception as e:

        print(
            f"Cluster reading error: {e}"
        )

        raise HTTPException(

            status_code=500,

            detail=(
                f"Failed to load clusters: {str(e)}"
            )
        )


# ============================================================
# AI CAREER ROADMAP
# ============================================================

@app.post("/api/ai/roadmap")
def career_roadmap(
    payload: CareerRoadmapRequest
):

    career = payload.career.strip()

    if not career:

        raise HTTPException(
            status_code=400,
            detail="Career is required"
        )

    result = solve_doubt_with_ai(

        question=(
            "Create a concise, career-specific "
            f"roadmap for the career: {career}"
        ),

        subject="Career roadmap",

        context=(
            "Create sections for career overview, "
            "what to study, required skills, "
            "relevant tools only when appropriate, "
            "projects or practical experience, "
            "qualifications only when genuinely "
            "relevant, step-by-step progression, "
            "internship or experience path, "
            "career progression, and 3-5 immediate "
            "next steps. Adapt every section to "
            "this profession. Do not assume this "
            "is an engineering career, that "
            "programming or projects are required, "
            "or that certifications are mandatory."
        )
    )

    return {

        "status": "success",

        "career": career,

        "roadmap": result.get(
            "answer",
            ""
        ),

        **result
    }


# ============================================================
# AI PROJECT ADVISOR
# ============================================================

@app.post("/api/ai/project-advisor")
def project_advisor(
    payload: ProjectAdvisorRequest
):

    if (
        not payload.title.strip()
        or not payload.description.strip()
    ):

        raise HTTPException(

            status_code=400,

            detail=(
                "Project title and description "
                "are required"
            )
        )

    result = solve_doubt_with_ai(

        question=(
            "Analyze this project idea.\n"
            f"Title: {payload.title}\n"
            f"Plan: {payload.description}"
        ),

        subject=(
            "Project feasibility, architecture, "
            "risks, skills, and team planning"
        ),

        context=(
            "Return a practical feasibility report "
            "with complexity, duration, required "
            "skills, bottlenecks, mitigations, "
            "team roles, and relevant opportunities."
        )
    )

    return {

        "status": "success",

        **result
    }


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )