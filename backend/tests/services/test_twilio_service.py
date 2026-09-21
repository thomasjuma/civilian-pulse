"""Unit tests for the Twilio WhatsApp service."""
from collections.abc import Generator
from unittest.mock import MagicMock, patch

import pytest
from twilio.base.exceptions import TwilioRestException  # type: ignore[import-untyped]

from app.services.twilio_service import (
    SendResult,
    TwilioWhatsAppClient,
    WhatsAppMessage,
    WhatsAppService,
    get_whatsapp_service,
)


@pytest.fixture
def twilio_credentials() -> dict[str, str]:
    """Return valid Twilio credentials for testing."""
    return {
        "account_sid": "AC_test_account_sid",
        "auth_token": "test_auth_token",
        "from_number": "whatsapp:+14155238886",
    }


@pytest.fixture(autouse=True)
def patched_settings(
    twilio_credentials: dict[str, str],
) -> Generator[MagicMock]:
    """Patch module-level settings with valid Twilio credentials."""
    mock_settings = MagicMock()
    mock_settings.TWILIO_ACCOUNT_SID = twilio_credentials["account_sid"]
    mock_settings.TWILIO_AUTH_TOKEN = twilio_credentials["auth_token"]
    mock_settings.TWILIO_WHATSAPP_FROM = twilio_credentials["from_number"]
    mock_settings.twilio_enabled = True

    with patch("app.services.twilio_service.settings", mock_settings):
        yield mock_settings


@pytest.fixture(autouse=True)
def mock_twilio_client() -> Generator[MagicMock]:
    """Patch the Twilio REST Client used by the service module."""
    with patch("app.services.twilio_service.Client") as mock_client_class:
        mock_instance = MagicMock()
        mock_client_class.return_value = mock_instance
        yield mock_instance


@pytest.fixture
def twilio_client(
    twilio_credentials: dict[str, str],
) -> TwilioWhatsAppClient:
    """Return a TwilioWhatsAppClient instance backed by mocked dependencies."""
    return TwilioWhatsAppClient(
        account_sid=twilio_credentials["account_sid"],
        auth_token=twilio_credentials["auth_token"],
        from_number=twilio_credentials["from_number"],
    )


def test_whatsapp_message_dataclass_defaults() -> None:
    message = WhatsAppMessage(to="whatsapp:+15551234567", body="Hello")
    assert message.to == "whatsapp:+15551234567"
    assert message.body == "Hello"
    assert message.media_url is None


def test_send_result_dataclass_defaults() -> None:
    result = SendResult(success=True)
    assert result.success is True
    assert result.message_sid is None
    assert result.error is None


def test_twilio_whatsapp_client_init_with_explicit_credentials(
    twilio_credentials: dict[str, str],
) -> None:
    client = TwilioWhatsAppClient(**twilio_credentials)

    assert client._account_sid == twilio_credentials["account_sid"]
    assert client._auth_token == twilio_credentials["auth_token"]
    assert client._from_number == twilio_credentials["from_number"]


def test_twilio_whatsapp_client_init_with_settings_credentials(
    twilio_credentials: dict[str, str],
) -> None:
    client = TwilioWhatsAppClient()

    assert client._account_sid == twilio_credentials["account_sid"]
    assert client._auth_token == twilio_credentials["auth_token"]
    assert client._from_number == twilio_credentials["from_number"]


def test_twilio_whatsapp_client_init_missing_credentials_raises() -> None:
    with patch("app.services.twilio_service.settings") as mock_settings:
        mock_settings.TWILIO_ACCOUNT_SID = None
        mock_settings.TWILIO_AUTH_TOKEN = None
        mock_settings.TWILIO_WHATSAPP_FROM = None

        with pytest.raises(ValueError, match="Twilio credentials not configured"):
            TwilioWhatsAppClient()


def test_send_success(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
    twilio_credentials: dict[str, str],
) -> None:
    mock_message = MagicMock()
    mock_message.sid = "SM123"
    mock_message.status = "queued"
    mock_twilio_client.messages.create.return_value = mock_message

    message = WhatsAppMessage(to="+15551234567", body="Test message")
    result = twilio_client.send(message)

    assert result.success is True
    assert result.message_sid == "SM123"
    assert result.error is None
    mock_twilio_client.messages.create.assert_called_once_with(
        from_=twilio_credentials["from_number"],
        to="whatsapp:+15551234567",
        body="Test message",
    )


def test_send_adds_whatsapp_prefix(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_twilio_client.messages.create.return_value = MagicMock(sid="SM456", status="queued")

    message = WhatsAppMessage(to="+15551234567", body="Hello")
    twilio_client.send(message)

    _, kwargs = mock_twilio_client.messages.create.call_args
    assert kwargs["to"] == "whatsapp:+15551234567"


def test_send_preserves_existing_whatsapp_prefix(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_twilio_client.messages.create.return_value = MagicMock(sid="SM789", status="queued")

    message = WhatsAppMessage(to="whatsapp:+15551234567", body="Hello")
    twilio_client.send(message)

    _, kwargs = mock_twilio_client.messages.create.call_args
    assert kwargs["to"] == "whatsapp:+15551234567"


def test_send_with_media_url(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_twilio_client.messages.create.return_value = MagicMock(sid="SM999", status="queued")

    media_urls = ["https://example.com/image.png"]
    message = WhatsAppMessage(
        to="whatsapp:+15551234567",
        body="See attached",
        media_url=media_urls,
    )
    twilio_client.send(message)

    _, kwargs = mock_twilio_client.messages.create.call_args
    assert kwargs["media_url"] == media_urls


def test_send_twilio_exception(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    error = TwilioRestException(400, "https://api.twilio.com", "Invalid number", 21211)
    mock_twilio_client.messages.create.side_effect = error

    message = WhatsAppMessage(to="+15551234567", body="Test")
    result = twilio_client.send(message)

    assert result.success is False
    assert result.message_sid is None
    assert result.error == "Twilio error: Invalid number (Code: 21211)"


def test_send_unexpected_exception(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_twilio_client.messages.create.side_effect = RuntimeError("Network failure")

    message = WhatsAppMessage(to="+15551234567", body="Test")
    result = twilio_client.send(message)

    assert result.success is False
    assert result.message_sid is None
    assert result.error == "Unexpected error sending WhatsApp message: Network failure"


def test_send_template_success(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_message = MagicMock()
    mock_message.sid = "SMtpl123"
    mock_message.status = "queued"
    mock_twilio_client.messages.create.return_value = mock_message

    result = twilio_client.send_template(
        to="+15551234567",
        template_sid="HX123",
    )

    assert result.success is True
    assert result.message_sid == "SMtpl123"
    assert result.error is None
    mock_twilio_client.messages.create.assert_called_once_with(
        from_=twilio_client._from_number,
        to="whatsapp:+15551234567",
        content_sid="HX123",
    )


def test_send_template_with_variables(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_twilio_client.messages.create.return_value = MagicMock(sid="SMtpl456", status="queued")
    variables = {"name": "Alice"}

    twilio_client.send_template(
        to="+15551234567",
        template_sid="HX456",
        template_variables=variables,
    )

    _, kwargs = mock_twilio_client.messages.create.call_args
    assert kwargs["content_variables"] == variables


def test_send_template_adds_whatsapp_prefix(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_twilio_client.messages.create.return_value = MagicMock(sid="SMtpl789", status="queued")

    twilio_client.send_template(to="+15551234567", template_sid="HX789")

    _, kwargs = mock_twilio_client.messages.create.call_args
    assert kwargs["to"] == "whatsapp:+15551234567"


def test_send_template_twilio_exception(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    error = TwilioRestException(404, "https://api.twilio.com", "Template not found", 20404)
    mock_twilio_client.messages.create.side_effect = error

    result = twilio_client.send_template(to="+15551234567", template_sid="HX000")

    assert result.success is False
    assert result.error == "Twilio template error: Template not found (Code: 20404)"


def test_send_template_unexpected_exception(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_twilio_client.messages.create.side_effect = RuntimeError("Timeout")

    result = twilio_client.send_template(to="+15551234567", template_sid="HX000")

    assert result.success is False
    assert result.error == "Unexpected error sending template: Timeout"


def test_get_message_status_success(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_message = MagicMock()
    mock_message.status = "delivered"
    mock_twilio_client.messages.return_value.fetch.return_value = mock_message

    status = twilio_client.get_message_status("SM123")

    assert status == "delivered"
    mock_twilio_client.messages.assert_called_once_with("SM123")


def test_get_message_status_returns_none_when_empty(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_message = MagicMock()
    mock_message.status = None
    mock_twilio_client.messages.return_value.fetch.return_value = mock_message

    status = twilio_client.get_message_status("SM123")

    assert status is None


def test_get_message_status_twilio_exception(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    error = TwilioRestException(404, "https://api.twilio.com", "Not found", 20404)
    mock_twilio_client.messages.return_value.fetch.side_effect = error

    status = twilio_client.get_message_status("SM123")

    assert status is None


def test_whatsapp_service_with_custom_sender() -> None:
    mock_sender = MagicMock()
    mock_sender.send.return_value = SendResult(success=True, message_sid="SMabc")

    service = WhatsAppService(sender=mock_sender)
    result = service.send_message(to="+15551234567", body="Hello")

    assert result.success is True
    assert result.message_sid == "SMabc"
    mock_sender.send.assert_called_once()


def test_whatsapp_service_default_sender_when_twilio_enabled(
    patched_settings: MagicMock,
) -> None:
    patched_settings.twilio_enabled = True

    service = WhatsAppService()

    assert isinstance(service._sender, TwilioWhatsAppClient)


def test_whatsapp_service_default_sender_when_twilio_disabled_raises(
    patched_settings: MagicMock,
) -> None:
    patched_settings.twilio_enabled = False

    with pytest.raises(ValueError, match="Twilio not configured"):
        WhatsAppService()


def test_whatsapp_service_send_message() -> None:
    mock_sender = MagicMock()
    mock_sender.send.return_value = SendResult(success=True, message_sid="SMxyz")
    service = WhatsAppService(sender=mock_sender)

    result = service.send_message(
        to="+15551234567",
        body="Service test",
        media_url=["https://example.com/file.pdf"],
    )

    assert result.success is True
    assert result.message_sid == "SMxyz"
    sent_message = mock_sender.send.call_args[0][0]
    assert sent_message.to == "+15551234567"
    assert sent_message.body == "Service test"
    assert sent_message.media_url == ["https://example.com/file.pdf"]


def test_whatsapp_service_send_bulk() -> None:
    mock_sender = MagicMock()
    mock_sender.send.side_effect = [
        SendResult(success=True, message_sid="SM1"),
        SendResult(success=True, message_sid="SM2"),
    ]
    service = WhatsAppService(sender=mock_sender)

    results = service.send_bulk(
        recipients=["+15551111111", "+15552222222"],
        body="Bulk message",
    )

    assert len(results) == 2
    assert results[0].message_sid == "SM1"
    assert results[1].message_sid == "SM2"
    assert mock_sender.send.call_count == 2


def test_whatsapp_service_send_template_message_success(
    twilio_client: TwilioWhatsAppClient,
    mock_twilio_client: MagicMock,
) -> None:
    mock_twilio_client.messages.create.return_value = MagicMock(sid="SMtpl", status="queued")
    service = WhatsAppService(sender=twilio_client)

    result = service.send_template_message(
        to="+15551234567",
        template_sid="HXabc",
        template_variables={"name": "Bob"},
    )

    assert result.success is True
    assert result.message_sid == "SMtpl"


def test_whatsapp_service_send_template_message_with_non_twilio_sender_raises() -> None:
    mock_sender = MagicMock()
    service = WhatsAppService(sender=mock_sender)

    with pytest.raises(ValueError, match="Template messages require TwilioWhatsAppClient"):
        service.send_template_message(to="+15551234567", template_sid="HXabc")


def test_get_whatsapp_service(
    patched_settings: MagicMock,
) -> None:
    patched_settings.twilio_enabled = True
    service = get_whatsapp_service()

    assert isinstance(service, WhatsAppService)
    assert isinstance(service._sender, TwilioWhatsAppClient)
