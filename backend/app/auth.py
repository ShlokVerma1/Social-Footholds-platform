from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from app.core import security, supabase
from app.models import User

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Verify Supabase JWT and return user profile."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        token = credentials.credentials
        user_response = supabase.auth.get_user(token)
        user_data = user_response.user
        if not user_data:
            raise credentials_exception

        # Fetch profile from profiles table
        profile = supabase.table('profiles').select('*').eq('id', str(user_data.id)).single().execute()
        if not profile.data:
            raise credentials_exception

        return User(
            id=str(user_data.id),
            email=user_data.email,
            name=profile.data.get('name', ''),
            role=profile.data.get('role', 'creator'),
        )
    except HTTPException:
        raise
    except Exception:
        raise credentials_exception

async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that ensures the current user holds the admin role."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
