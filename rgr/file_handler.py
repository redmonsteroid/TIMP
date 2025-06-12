import csv
import json
import os

def load_data(path):
    ext = os.path.splitext(path)[-1].lower()
    if ext == '.csv':
        with open(path, newline='', encoding='utf-8') as f:
            return list(csv.DictReader(f))
    elif ext == '.json':
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    else:
        raise ValueError("Поддерживаются только форматы CSV и JSON")

def save_data(data, path):
    ext = os.path.splitext(path)[-1].lower()
    if ext == '.csv':
        if not data:
            raise ValueError("Нет данных для записи")
        with open(path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
    elif ext == '.json':
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    else:
        raise ValueError("Поддерживаются только форматы CSV и JSON")
