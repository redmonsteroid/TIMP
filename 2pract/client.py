import socket

def main():
    HOST = '217.71.129.139'
    PORT = 5478
    
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(5)
            s.connect((HOST, PORT))
            print("Подключено к серверу. Введите 'bye' для выхода")
            
            while True:
                try:
                    data = s.recv(1024).decode('utf-8')
                    if not data:
                        print("Сервер закрыл соединение")
                        break
                    
                    print(data, end='')
                    
                    if data.endswith('>> '):
                        choice = input().strip().lower()
                        if choice == 'bye':
                            s.sendall(choice.encode('utf-8'))
                            print("Отключение от сервера...")
                            break
                        s.sendall(choice.encode('utf-8'))
                        
                except socket.timeout:
                    print("Таймаут соединения")
                    break
                except KeyboardInterrupt:
                    s.sendall(b'bye')
                    print("\nПринудительное отключение")
                    break
                    
    except ConnectionRefusedError:
        print("Сервер недоступен")
    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        print("Клиент завершает работу")

if __name__ == '__main__':
    main()