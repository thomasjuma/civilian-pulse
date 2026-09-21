"""Add WhatsApp signup fields to users.

Revision ID: 7c1d2e8f4a90
Revises: fe56fa70289e
"""

import sqlalchemy as sa
from alembic import op

revision = "7c1d2e8f4a90"
down_revision = "fe56fa70289e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "user",
        sa.Column("whatsapp_number", sa.String(length=16), nullable=True),
    )
    op.add_column(
        "user",
        sa.Column(
            "whatsapp_messaging_consent",
            sa.Boolean(),
            nullable=True,
            server_default=sa.text("false"),
        ),
    )
    op.execute(
        'UPDATE "user" SET whatsapp_messaging_consent = false '
        "WHERE whatsapp_messaging_consent IS NULL"
    )
    op.alter_column(
        "user",
        "whatsapp_messaging_consent",
        existing_type=sa.Boolean(),
        nullable=False,
        server_default=sa.text("false"),
    )
    op.create_index(
        "ix_user_whatsapp_number", "user", ["whatsapp_number"], unique=True
    )


def downgrade() -> None:
    op.drop_index("ix_user_whatsapp_number", table_name="user")
    op.drop_column("user", "whatsapp_messaging_consent")
    op.drop_column("user", "whatsapp_number")
