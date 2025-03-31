import socket

def client() -> None:
    """
    Эхо-клиент с улучшенной обработкой соединений и ошибок
    """
    HOST = '217.71.129.139'  # Внешний IP сервера (гипервизора)
    PORT = 5478               # Порт сервера
    
    try:
        # Создаем сокет с использованием контекстного менеджера
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            print(f"Попытка подключения к серверу {HOST}:{PORT}...")
            
            # Устанавливаем соединение с таймаутом 5 секунд
            client_socket.settimeout(5.0)
            client_socket.connect((HOST, PORT))
            print("Подключение установлено. Введите 'bye' для выхода.")
            
            while True:
                try:
                    # Получаем ввод пользователя
                    message = input(" >> ")
                    
                    # Проверяем команду выхода
                    if message.lower().strip() == 'bye':
                        print("Завершение работы клиента...")
                        break
                    
                    # Отправляем сообщение
                    client_socket.sendall(message.encode())
                    
                    # Получаем ответ (макс 1024 байт)
                    data = client_socket.recv(1024)
                    if not data:
                        print("Сервер закрыл соединение")
                        break
                        
                    print(f"Ответ сервера: {data.decode()}")
                    
                except socket.timeout:
                    print("Таймаут ожидания ответа от сервера")
                    break
                except KeyboardInterrupt:
                    print("\nПрерывание пользователем")
                    break
                    
    except ConnectionRefusedError:
        print(f"Не удалось подключиться к серверу {HOST}:{PORT}")
    except socket.gaierror:
        print("Ошибка разрешения имени хоста")
    except Exception as e:
        print(f"Произошла ошибка: {e}")
    finally:
        print("Клиент завершает работу")

if __name__ == '__main__':
    client()