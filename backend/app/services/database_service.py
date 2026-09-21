import logging

from app.core.db import get_db
from app.models.article import Article, ArticleCreate, Subscriber
from app.crud import create_article

logger = logging.getLogger(__name__)

session = get_db()


def save_article_summary(article: ArticleCreate) -> Article:
    logger.info("Saving article summary: source=%s title=%s", article.source, article.title)
    try:
        saved_article = create_article(session=session, article_in=article)
    except Exception:
        logger.error(
            "Failed to save article summary: source=%s title=%s",
            article.source,
            article.title,
            exc_info=True,
        )
        raise
    logger.info("Saved article summary: article_id=%s", saved_article.id)
    return saved_article


def get_pending_whatsapp_recipients(article_id: int) -> list[Subscriber]:
    logger.info("Loading pending WhatsApp recipients: article_id=%s", article_id)
    try:
        recipients = list_consenting_subscribers(session, article_id)
    except Exception:
        logger.error(
            "Failed to load pending WhatsApp recipients: article_id=%s",
            article_id,
            exc_info=True,
        )
        raise
    logger.info(
        "Loaded pending WhatsApp recipients: article_id=%s recipients=%s",
        article_id,
        len(recipients),
    )
    return recipients


def mark_whatsapp_summary_sent(article_id: int, subscriber_id: int) -> None:
    logger.info(
        "Marking WhatsApp summary sent: article_id=%s subscriber_id=%s",
        article_id,
        subscriber_id,
    )
    try:
        mark_article_notification_sent(session, article_id, subscriber_id)
    except Exception:
        logger.error(
            "Failed to mark WhatsApp summary sent: article_id=%s subscriber_id=%s",
            article_id,
            subscriber_id,
            exc_info=True,
        )
        raise
    logger.info(
        "Marked WhatsApp summary sent: article_id=%s subscriber_id=%s",
        article_id,
        subscriber_id,
    )
