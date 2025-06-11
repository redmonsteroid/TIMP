from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.routers import users, passwords, categories
from app.routers import errors

app = FastAPI(title="Password Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(StarletteHTTPException, errors.http_exception_handler)
app.add_exception_handler(Exception, errors.internal_exception_handler)

app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(passwords.router, prefix="/api/passwords", tags=["Passwords"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])

@app.get("/")
async def root():
    return {"message": "Password Manager API is running"}
