import random
from fake_data import first_names, last_names, patronymics, addresses


def mask_fio(fio):
    if not isinstance(fio, str) or not fio.strip():
        return ''
    parts = fio.split()
    masked_parts = []
    for part in parts:
        if len(part) > 1:
            masked = part[0] + '*' * (len(part) - 1)
        else:
            masked = part  # Одна буква — оставляем как есть
        masked_parts.append(masked)
    return ' '.join(masked_parts)

def mask_address(addr):
    if not isinstance(addr, str) or not addr.strip():
        return ''
    visible_len = 4
    masked_len = max(len(addr) - visible_len, 0)
    return addr[:visible_len] + '*' * masked_len

def mask_value_generic(value):
    if not isinstance(value, str):
        return value
    return '*' * len(value) if value else ''

def mask_fields(data, fields):
    for row in data:
        for field in fields:
            if field in row:
                val = row[field]
                fld_lower = field.lower()
                if fld_lower == 'фио':
                    row[field] = mask_fio(val)
                elif fld_lower == 'адрес':
                    row[field] = mask_address(val)
                else:
                    row[field] = mask_value_generic(val)
    return data

def remove_fields(data, fields):
    for row in data:
        for field in fields:
            if field in row:
                del row[field]
    return data

def generate_fake_fio():
    return f"{random.choice(last_names)} {random.choice(first_names)} {random.choice(patronymics)}"

def generate_fake_address():
    return random.choice(addresses)

def generate_fake_fields(data, fields):
    for row in data:
        for field in fields:
            field_lower = field.lower()
            if field_lower == "фио":
                row[field] = generate_fake_fio()
            elif field_lower == "адрес":
                row[field] = generate_fake_address()
            else:
                raise ValueError(f"Поле '{field}' не поддерживается для генерации фиктивных данных.")
    return data