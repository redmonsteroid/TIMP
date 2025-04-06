import socket
import random
import string

def generate_password(length=12):
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(random.choice(chars) for _ in range(length))

def get_security_tip():
    tips = [
        "Никогда не используйте один и тот же пароль для разных сервисов",
        "Включайте двухфакторную аутентификацию везде, где это возможно",
        "Регулярно обновляйте программное обеспечение",
        "Не открывайте вложения в письмах от неизвестных отправителей",
        "Используйте менеджер паролей для хранения учетных данных"
    ]
    return random.choice(tips)

def handle_client(conn, addr):
    try:
        print(f"Подключение от: {addr}")
        while True:
            menu = "\nВыберите действие:\n1 - Сгенерировать пароль\n2 - Получить совет\nbye - Выход\n>> "
            conn.sendall(menu.encode('utf-8'))
            
            data = conn.recv(1024).decode('utf-8').strip().lower()
            if not data:
                break
                
            if data == '1':
                password = generate_password()
                response = f"\nСгенерированный пароль: {password}\n"
            elif data == '2':
                tip = get_security_tip()
                response = f"\nСовет по безопасности: {tip}\n"
            elif data == 'bye':
                conn.sendall("До свидания!".encode('utf-8'))
                break
            else:
                response = "\nНеверный выбор\n"
            
            conn.sendall(response.encode('utf-8'))
            
    except ConnectionResetError:
        print(f"Клиент {addr} отключился")
    finally:
        conn.close()
        print(f"Соединение с {addr} закрыто")

def main():
    HOST = '172.17.8.82'
    PORT = 6666
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind((HOST, PORT))
        s.listen()
        print(f"Сервер запущен на {HOST}:{PORT}")
        
        try:
            while True:
                conn, addr = s.accept()
                handle_client(conn, addr)
        except KeyboardInterrupt:
            print("\nСервер остановлен")

if __name__ == '__main__':
    main()