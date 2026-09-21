"""Service-level pytest configuration.

Overrides the global autouse DB fixture so that unit tests in this directory
do not require a running database.
"""
from collections.abc import Generator

import pytest


@pytest.fixture(scope="session", autouse=True)
def db() -> Generator[None]:
    """No-op database fixture for isolated service unit tests."""
    yield None
