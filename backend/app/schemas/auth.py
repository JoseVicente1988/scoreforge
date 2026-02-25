from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """
    Payload used to create a new dashboard user account.

    Used by: POST /auth/register

    Validation rules:
    - username: 3..50 chars
    - password: 6..256 chars (hashed server-side; never stored as plaintext)
    """

    username: str = Field(
        min_length=3,
        max_length=50,
        description="Unique username for the dashboard account (3-50 characters).",
        examples=["josevicente"],
    )
    email: EmailStr = Field(
        description="User email address (validated format).",
        examples=["jose@example.com"],
    )
    password: str = Field(
        min_length=6,
        max_length=256,
        description="Plain password. It will be hashed server-side and never stored as plaintext.",
        examples=["MyStrongPassword123!"],
    )


class UserOut(BaseModel):
    """
    Public representation of a user returned by the API.

    Used by: auth responses (register/login depending on implementation).
    """

    id: int = Field(description="User unique identifier.")
    username: str = Field(description="User username.")
    email: EmailStr = Field(description="User email address.")

    class Config:
        from_attributes = True


class LoginIn(BaseModel):
    """
    Payload used to authenticate a dashboard user.

    Used by: POST /auth/login
    """

    username: str = Field(
        description="Username of the dashboard account.",
        examples=["josevicente"],
    )
    password: str = Field(
        description="Plain password. Compared with stored password hash.",
        examples=["MyStrongPassword123!"],
    )


class TokenOut(BaseModel):
    """
    JWT token response returned after successful authentication.

    Used by: POST /auth/login
    """

    access_token: str = Field(
        description="JWT access token to be used in the Authorization header.",
        examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
    )
    token_type: str = Field(
        default="bearer",
        description="Token type for Authorization header usage.",
        examples=["bearer"],
    )
