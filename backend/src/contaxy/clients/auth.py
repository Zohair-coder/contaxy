from typing import Dict, List, Optional

import requests
from pydantic import parse_raw_as
from requests.models import Response
from starlette.responses import RedirectResponse

from contaxy.clients.shared import handle_errors
from contaxy.operations.auth import AuthOperations
from contaxy.schema import (
    AuthorizedAccess,
    OAuth2TokenRequestFormNew,
    OAuthToken,
    OAuthTokenIntrospection,
    OpenIDUserInfo,
    TokenType,
    User,
    UserInput,
    UserRegistration,
)
from contaxy.schema.auth import ApiToken, OAuth2Error


def handle_oauth_error(response: Response) -> None:
    if response.status_code != 400:
        return

    response_data = response.json()
    if "error" in response_data:
        raise OAuth2Error(response_data["error"])


class AuthClient(AuthOperations):
    def __init__(self, client: requests.Session):
        self._client = client

    def login_page(self) -> RedirectResponse:
        pass

    def logout_session(self) -> RedirectResponse:
        pass

    def create_token(
        self,
        token_subject: str,
        scopes: List[str],
        token_type: TokenType,
        description: Optional[str] = None,
    ) -> str:
        pass

    def list_api_tokens(self, token_subject: str) -> List[ApiToken]:
        pass

    def verify_access(
        self, token: str, permission: Optional[str] = None, disable_cache: bool = False
    ) -> AuthorizedAccess:
        pass

    def change_password(
        self,
        user_id: str,
        password: str,
    ) -> None:
        response = self._client.put(f"/users/{user_id}:change-password", data=password)
        handle_errors(response)

    def verify_password(
        self,
        user_id: str,
        password: str,
    ) -> bool:
        pass

    # Permission Operations

    def add_permission(
        self,
        resource_name: str,
        permission: str,
    ) -> None:
        pass

    def remove_permission(
        self, resource_name: str, permission: str, remove_sub_permissions: bool = False
    ) -> None:
        pass

    def list_permissions(
        self, resource_name: str, resolve_roles: bool = True
    ) -> List[str]:
        pass

    def list_resources_with_permission(
        self, permission: str, resource_name_prefix: Optional[str] = None
    ) -> List[str]:
        pass

    def request_token(
        self, token_request_form: OAuth2TokenRequestFormNew, request_kwargs: Dict = {}
    ) -> OAuthToken:
        response = self._client.post(
            "/auth/oauth/token",
            data=token_request_form.dict(exclude_unset=True),
            **request_kwargs,
        )
        handle_oauth_error(response)
        handle_errors(response)

        if token_request_form.set_as_cookie is True:
            # No return value since it is set as cookie
            return None  # type: ignore
        return parse_raw_as(OAuthToken, response.text)

    def revoke_token(
        self,
        token: str,
        # token_type_hint: Optional[str] = None,
    ) -> None:
        response = self._client.post("/auth/oauth/revoke", data={"token": token})
        handle_oauth_error(response)
        handle_errors(response)

    def introspect_token(
        self,
        token: str,
        # token_type_hint: Optional[str] = None,
    ) -> OAuthTokenIntrospection:
        response = self._client.post("/auth/oauth/introspect", data={"token": token})
        handle_errors(response)
        return parse_raw_as(OAuthTokenIntrospection, response.text)

    def get_userinfo(
        self,
        token: str,
        # token_type_hint: Optional[str] = None,
    ) -> OpenIDUserInfo:
        # TODO: How to implement?
        pass

    def login_callback(
        self,
        code: str,
        state: Optional[str] = None,
    ) -> RedirectResponse:
        # TODO: how to implement?
        pass

    # User Operations

    def list_users(self, request_kwargs: Dict = {}) -> List[User]:
        response = self._client.get("/users", **request_kwargs)
        handle_errors(response)
        return parse_raw_as(List[User], response.text)

    def create_user(
        self,
        user_input: UserRegistration,
        technical_user: bool = False,
        request_kwargs: Dict = {},
    ) -> User:
        response = self._client.post(
            "/users",
            json=user_input.dict(exclude_unset=True),
            params={"technical_user": technical_user},
            **request_kwargs,
        )
        handle_errors(response)
        return parse_raw_as(User, response.text)

    def get_user(self, user_id: str, request_kwargs: Dict = {}) -> User:
        response = self._client.get(f"/users/{user_id}", **request_kwargs)
        handle_errors(response)
        return parse_raw_as(User, response.text)

    def update_user(
        self, user_id: str, user_input: UserInput, request_kwargs: Dict = {}
    ) -> User:
        response = self._client.get(
            f"/users/{user_id}",
            json=user_input.dict(exclude_unset=True),
            **request_kwargs,
        )
        handle_errors(response)
        return parse_raw_as(User, response.text)

    def delete_user(self, user_id: str, request_kwargs: Dict = {}) -> None:
        response = self._client.delete(f"/users/{user_id}", **request_kwargs)
        handle_errors(response)