import socket

def server() -> None:
    HOST = '172.17.8.82'  # Внутренний адрес VDS
    PORT = 6666            # Порт выше 1024
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:

        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
           
            server_socket.bind((HOST, PORT))
            server_socket.listen(2)
            print(f"Сервер запущен на {HOST}:{PORT}")
            
            while True:
           
                conn, addr = server_socket.accept()
                print(f"Подключение от: {addr}")
                
                with conn:
                    while True:
                      
                        data = conn.recv(1024)
                        if not data:
                            break
                        
                    
                        print(f"Получено от {addr}: {data.decode()}")
                        
                        
                        conn.sendall(data)
                        
                print(f"Соединение с {addr} закрыто")
                
        except KeyboardInterrupt:
            print("\nСервер остановлен")
        except Exception as e:
            print(f"Ошибка: {e}")
        finally:
            server_socket.close()

if __name__ == '__main__':
    server()