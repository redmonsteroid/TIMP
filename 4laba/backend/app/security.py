import os
from cryptography.fernet import Fernet

key = os.getenv("FERNET_SECRET_KEY")
if key is None:
    raise ValueError("Не найден ключ шифрования в переменной окружения FERNET_SECRET_KEY")

fernet = Fernet(key.encode())

def encrypt_password(password: str) -> str:
    return fernet.encrypt(password.encode()).decode()

def decrypt_password(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()
