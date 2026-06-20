import os

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    Float,
    DateTime,
    String
)

from sqlalchemy.orm import (
    declarative_base,
    sessionmaker
)

from datetime import datetime

# ================= DB PATH =================

CURRENT_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

BASE_DIR = os.path.dirname(
    CURRENT_DIR
)

DB_PATH = os.path.join(
    BASE_DIR,
    "database.db"
)

print("\n================ DATABASE =================")
print("DB PATH :", DB_PATH)
print("==========================================\n")

# ================= ENGINE =================

engine = create_engine(
    f"sqlite:///{DB_PATH}",
    echo=False
)

SessionLocal = sessionmaker(
    bind=engine
)

Base = declarative_base()


# ================= MODEL =================

class Analysis(Base):

    __tablename__ = "analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # dataset
    file_type = Column(
        String,
        default="image"
    )

    file_path = Column(String)

    # analysis
    num_fish = Column(Integer)

    avg_length_cm = Column(Float)

    feeding_turns = Column(Integer)

    feeding_score = Column(
        Float,
        default=0
    )

    # process
    status = Column(
        String,
        default="done"
    )

    # timestamp
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ================= INIT DB =================

def init_db():

    Base.metadata.create_all(
        bind=engine
    )