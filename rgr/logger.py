from datetime import datetime

LOG_FILE = 'anonymizer.log'

def log_message(level, message):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(f"[{timestamp}] {level}: {message}\n")

def log_info(message):
    log_message("INFO", message)

def log_error(message):
    log_message("ERROR", message)
