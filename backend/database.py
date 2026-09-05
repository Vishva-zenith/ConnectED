from sqlalchemy import create_engine, Column, Integer, String, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

# SQLite database URL (can be swapped for PostgreSQL via DATABASE_URL env var)
SQLALCHEMY_DATABASE_URL = "sqlite:///./connected.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    college = Column(String, nullable=False)
    branch = Column(String)
    year = Column(String)
    career_goal = Column(String)
    bio = Column(Text, nullable=True)
    avatar = Column(String, nullable=True)
    reputation_points = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
class StudentSkillDB(Base):
    __tablename__ = "student_skills"

    id = Column(String, primary_key=True, index=True)

    user_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=False
    )

    skill_name = Column(
        String,
        nullable=False
    )

    level = Column(
        String,
        default="Beginner"
    )

    verified = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

class ConnectionDB(Base):
    __tablename__ = "connections"

    id = Column(String, primary_key=True, index=True)

    sender_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=False
    )

    receiver_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=False
    )

    status = Column(
        String,
        default="pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

class DoubtDB(Base):
    __tablename__ = "doubts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    cluster_topic = Column(String, nullable=True)
    is_anonymous = Column(Boolean, default=True)
    author_id = Column(String, ForeignKey("users.id"))
    author_alias = Column(String)
    language = Column(String, default="en")
    upvotes = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
class DoubtVoteDB(Base):
    __tablename__ = "doubt_votes"

    id = Column(String, primary_key=True, index=True)

    doubt_id = Column(
        String,
        ForeignKey("doubts.id"),
        nullable=False
    )

    user_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )    
class AnswerDB(Base):
    __tablename__ = "answers"

    id = Column(String, primary_key=True, index=True)
    doubt_id = Column(String, ForeignKey("doubts.id"), nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(String, ForeignKey("users.id"), nullable=True)
    author_alias = Column(String, default="Anonymous")
    upvotes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ProjectDB(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    problem_statement = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    stage = Column(String, default="Idea")
    duration = Column(String)
    creator_id = Column(String, ForeignKey("users.id"))
    required_skills = Column(Text) # Comma separated
    missing_skills = Column(Text) # Comma separated
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SolutionDB(Base):
    __tablename__ = "solutions"

    id = Column(String, primary_key=True, index=True)
    project_title = Column(String, nullable=False)
    problem = Column(Text, nullable=False)
    possible_cause = Column(Text)
    solution = Column(Text, nullable=False)
    author_name = Column(String)
    author_college = Column(String)
    tags = Column(Text) # Comma separated
    upvotes = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database tables initialized successfully.")
