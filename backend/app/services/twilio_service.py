"""
Twilio WhatsApp Service

This module provides a clean OOP interface for sending WhatsApp messages via Twilio.
"""
import logging
from dataclasses import dataclass
from typing import Protocol

from twilio.base.exceptions import TwilioException  # type: ignore[import-untyped]
from twilio.rest import Client  # type: ignore[import-untyped]

from app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class WhatsAppMessage:
    """Immutable data class representing a WhatsApp message."""
    to: str  # Format: "whatsapp:+15551234567"
    body: str
    media_url: list[str] | None = None


@dataclass(frozen=True)
class SendResult:
    """Immutable result of a send operation."""
    success: bool
    message_sid: str | None = None
    error: str | None = None


class IMessageSender(Protocol):
    """Protocol defining the interface for message senders."""

    def send(self, message: WhatsAppMessage) -> SendResult:
        """Send a WhatsApp message."""
        ...


class TwilioWhatsAppClient(IMessageSender):
    """
    Twilio WhatsApp client implementing the IMessageSender interface.

    This class follows the Single Responsibility Principle - it only handles
    sending WhatsApp messages via Twilio.
    """

    def __init__(
        self,
        account_sid: str | None = None,
        auth_token: str | None = None,
        from_number: str | None = None,
    ) -> None:
        """
        Initialize the Twilio WhatsApp client.

        Args:
            account_sid: Twilio Account SID (defaults to settings)
            auth_token: Twilio Auth Token (defaults to settings)
            from_number: WhatsApp from number (defaults to settings)
        """
        self._account_sid = account_sid or settings.TWILIO_ACCOUNT_SID
        self._auth_token = auth_token or settings.TWILIO_AUTH_TOKEN
        self._from_number = from_number or settings.TWILIO_WHATSAPP_FROM

        if not self._account_sid or not self._auth_token or not self._from_number:
            raise ValueError(
                "Twilio credentials not configured. "
                "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM in environment."
            )

        self._client = Client(self._account_sid, self._auth_token)
        logger.info("Twilio WhatsApp client initialized")

    def send(self, message: WhatsAppMessage) -> SendResult:
        """
        Send a WhatsApp message via Twilio.

        Args:
            message: WhatsAppMessage containing recipient, body, and optional media

        Returns:
            SendResult with success status and message SID or error
        """
        try:
            # Ensure the to number has whatsapp: prefix
            to_number = message.to
            if not to_number.startswith("whatsapp:"):
                to_number = f"whatsapp:{to_number}"

            # Prepare message parameters
            msg_params: dict[str, object] = {
                "from_": self._from_number,
                "to": to_number,
                "body": message.body,
            }

            # Add media URLs if provided
            if message.media_url:
                msg_params["media_url"] = message.media_url

            # Send the message
            twilio_message = self._client.messages.create(**msg_params)

            logger.info(
                f"WhatsApp message sent successfully. SID: {twilio_message.sid}, "
                f"To: {to_number}, Status: {twilio_message.status}"
            )

            return SendResult(
                success=True,
                message_sid=twilio_message.sid,
            )

        except TwilioException as e:
            error_msg = f"Twilio error: {e.msg} (Code: {e.code})"
            logger.error(error_msg)
            return SendResult(success=False, error=error_msg)

        except Exception as e:
            error_msg = f"Unexpected error sending WhatsApp message: {str(e)}"
            logger.error(error_msg)
            return SendResult(success=False, error=error_msg)

    def send_template(
        self,
        to: str,
        template_sid: str,
        template_variables: dict[str, str] | None = None,
    ) -> SendResult:
        """
        Send a WhatsApp template message via Twilio.

        Args:
            to: Recipient phone number
            template_sid: Twilio Content Template SID
            template_variables: Variables for the template

        Returns:
            SendResult with success status
        """
        try:
            to_number = to
            if not to_number.startswith("whatsapp:"):
                to_number = f"whatsapp:{to_number}"

            msg_params: dict[str, object] = {
                "from_": self._from_number,
                "to": to_number,
                "content_sid": template_sid,
            }

            if template_variables:
                msg_params["content_variables"] = template_variables

            twilio_message = self._client.messages.create(**msg_params)

            logger.info(
                f"WhatsApp template message sent. SID: {twilio_message.sid}, "
                f"To: {to_number}, Template: {template_sid}"
            )

            return SendResult(success=True, message_sid=twilio_message.sid)

        except TwilioException as e:
            error_msg = f"Twilio template error: {e.msg} (Code: {e.code})"
            logger.error(error_msg)
            return SendResult(success=False, error=error_msg)

        except Exception as e:
            error_msg = f"Unexpected error sending template: {str(e)}"
            logger.error(error_msg)
            return SendResult(success=False, error=error_msg)

    def get_message_status(self, message_sid: str) -> str | None:
        """
        Fetch the status of a previously sent message.

        Args:
            message_sid: The SID of the message to check

        Returns:
            Message status string or None if not found
        """
        try:
            message = self._client.messages(message_sid).fetch()
            return str(message.status) if message.status else None
        except TwilioException as e:
            logger.error(f"Error fetching message status: {e.msg}")
            return None


class WhatsAppService:
    """
    High-level WhatsApp service that orchestrates message sending.

    This class follows the Facade Pattern - it provides a simplified
    interface for common WhatsApp operations.
    """

    def __init__(self, sender: IMessageSender | None = None) -> None:
        """
        Initialize the WhatsApp service.

        Args:
            sender: Message sender implementation (defaults to Twilio client if configured)

        Raises:
            ValueError: If Twilio is not configured and no sender is provided
        """
        self._sender: IMessageSender
        if sender is None:
            if settings.twilio_enabled:
                self._sender = TwilioWhatsAppClient()
            else:
                raise ValueError(
                    "Twilio not configured. "
                    "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM in environment, "
                    "or provide a custom IMessageSender implementation."
                )
        else:
            self._sender = sender

    def send_message(
        self,
        to: str,
        body: str,
        media_url: list[str] | None = None,
    ) -> SendResult:
        """
        Send a WhatsApp message.

        Args:
            to: Recipient phone number (with or without whatsapp: prefix)
            body: Message body text
            media_url: Optional list of media URLs to attach

        Returns:
            SendResult with success status
        """
        message = WhatsAppMessage(to=to, body=body, media_url=media_url)
        return self._sender.send(message)

    def send_bulk(
        self,
        recipients: list[str],
        body: str,
        media_url: list[str] | None = None,
    ) -> list[SendResult]:
        """
        Send the same message to multiple recipients.

        Args:
            recipients: List of phone numbers
            body: Message body text
            media_url: Optional list of media URLs

        Returns:
            List of SendResults for each recipient
        """
        results = []
        for recipient in recipients:
            result = self.send_message(recipient, body, media_url)
            results.append(result)
        return results

    def send_template_message(
        self,
        to: str,
        template_sid: str,
        template_variables: dict[str, str] | None = None,
    ) -> SendResult:
        """
        Send a WhatsApp template message.

        Args:
            to: Recipient phone number
            template_sid: Twilio Content Template SID
            template_variables: Template variable substitutions

        Returns:
            SendResult with success status
        """
        if not isinstance(self._sender, TwilioWhatsAppClient):
            raise ValueError(
                "Template messages require TwilioWhatsAppClient. "
                "Provide a TwilioWhatsAppClient instance to use template messages."
            )
        return self._sender.send_template(to, template_sid, template_variables)


def get_whatsapp_service() -> WhatsAppService:
    """
    Factory function to get a WhatsApp service instance.

    This follows the Factory Pattern - encapsulates the creation logic
    and allows for easy testing with different implementations.

    Returns:
        Configured WhatsAppService instance
    """
    return WhatsAppService()
