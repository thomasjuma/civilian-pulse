from pydantic import ConfigDict, EmailStr
from sqlmodel import Field, SQLModel


# Shared properties
class ArticleBase(SQLModel):
    title: str
    source: str
    summary: str
    full_text: str
    date: str
    image: str = ""
    source_url: str | None = None


# Properties to receive via API on creation
class ArticleCreate(ArticleBase):
    pass


# Properties to return via API, id is always required
class Article(ArticleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


# Properties to receive via API on subscriber upsert
class SubscriberUpsert(SQLModel):
    clerk_user_id: str | None = None
    email: EmailStr
    whatsapp_number: str = Field(min_length=7)
    has_whatsapp_consent: bool


# Properties to return via API, id is always required
class Subscriber(SQLModel):
    id: int
    clerk_user_id: str | None
    email: EmailStr
    whatsapp_number: str
    has_whatsapp_consent: bool
    consented_at: str | None


# Ingestion operation result
class IngestionResult(SQLModel):
    candidates_found: int
    articles_processed: int
    whatsapp_messages_sent: int
