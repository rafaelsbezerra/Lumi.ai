from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, sessionmaker

try:
    from .config import settings
except ImportError:  # Vercel runs the backend service with backend/ as its root.
    from config import settings

db_url = make_url(settings.database_url)
connect_args = {}
if db_url.get_backend_name() == "sqlite":
    connect_args["check_same_thread"] = False
elif db_url.get_backend_name() == "postgresql" and db_url.port == 6543:
    # Supabase shared transaction pooler does not support prepared statements.
    connect_args["prepare_threshold"] = None

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_size=settings.database_pool_size,
    max_overflow=settings.database_max_overflow,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
