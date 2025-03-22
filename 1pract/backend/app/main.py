from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import Base
from app.api.endpoints import router

# Создайте экземпляр приложения перед добавлением middleware
app = FastAPI()

# Добавьте middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создайте таблицы в БД
Base.metadata.create_all(bind=engine)

# Подключите роутер
app.include_router(router)

# Эндпоинт для healthcheck
@app.get("/health")
async def health_check():
    return {"status": "ok"}