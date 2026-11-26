from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, sessionmaker

try:
    from .config import settings
except ImportError:  # Vercel runs the backend service with backend/ as its root.
    from config import settings

# Supabase provides postgresql:// URLs, while this project installs Psycopg 3.
# SQLAlchemy's bare postgresql:// default selects Psycopg 2, which is not installed.
raw_database_url = settings.database_url
if raw_database_url.startswith("postgres://"):
    raw_database_url = "postgresql://" + raw_database_url[len("postgres://"):]
db_url = make_url(raw_database_url)
if db_url.get_backend_name() == "postgresql" and db_url.drivername == "postgresql":
    db_url = db_url.set(drivername="postgresql+psycopg")

connect_args = {}
if db_url.get_backend_name() == "sqlite":
    connect_args["check_same_thread"] = False
elif db_url.get_backend_name() == "postgresql":
    if db_url.port == 6543:
        # Supabase shared transaction pooler does not support prepared statements.
        connect_args["prepare_threshold"] = None
    if db_url.host and (db_url.host.endswith(".supabase.co") or db_url.host.endswith(".pooler.supabase.com")) and "sslmode" not in db_url.query:
        db_url = db_url.update_query_dict({"sslmode": "require"})

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