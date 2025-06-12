import argparse
from file_handler import load_data, save_data
from processor import mask_fields, remove_fields, generate_fake_fields
from logger import log_info, log_error

ALLOWED_FAKE_FIELDS = {"фио", "адрес"}

def validate_fake_fields(fields):
    invalid = [f for f in fields if f.lower() not in ALLOWED_FAKE_FIELDS]
    if invalid:
        raise ValueError(f"Поля не поддерживаются для генерации фиктивных данных: {invalid}")
    return fields

def run_interactive():
    print("=== Утилита анонимизации персональных данных ===")
    input_file = input("Введите путь к входному файлу (CSV или JSON): ").strip()

    try:
        data = load_data(input_file)
        if not data:
            raise ValueError("Файл пуст или повреждён.")

        log_info(f"Файл {input_file} успешно загружен.")
        sample_row = data[0]
        fields = list(sample_row.keys())

        print("\nДоступные поля в файле:")
        for idx, field in enumerate(fields, 1):
            print(f"{idx}. {field}")

        def select_fields(prompt):
            print(f"\n{prompt}")
            print("Введите номера полей через запятую (например: 1,3) или оставьте пустым:")
            selected = input("> ").strip()
            if not selected:
                return []
            try:
                indices = [int(i) - 1 for i in selected.split(",")]
                return [fields[i] for i in indices if 0 <= i < len(fields)]
            except (ValueError, IndexError):
                print("❌ Ошибка ввода. Повторите попытку.")
                return select_fields(prompt)

        print("\nВыберите режим обработки:")
        print("1. Маскировка")
        print("2. Удаление")
        print("3. Генерация фиктивных данных")
        mode = input("Введите номер режима: ").strip()

        if mode == '1':
            fields_to_mask = select_fields("Выберите поля для маскировки")
            data = mask_fields(data, fields_to_mask)
            log_info(f"Маскированы поля: {fields_to_mask}")
        elif mode == '2':
            fields_to_remove = select_fields("Выберите поля для удаления")
            data = remove_fields(data, fields_to_remove)
            log_info(f"Удалены поля: {fields_to_remove}")
        elif mode == '3':
            fields_to_fake = select_fields("Выберите поля для подмены фиктивными данными")
            validate_fake_fields(fields_to_fake)
            data = generate_fake_fields(data, fields_to_fake)
            log_info(f"Подменены поля фиктивными значениями: {fields_to_fake}")
        else:
            print("❌ Неверный режим.")
            return

        output_file = input("\nВведите путь к выходному файлу: ").strip()
        save_data(data, output_file)
        log_info(f"Обработанный файл сохранён: {output_file}")
        print(f"\n✅ Готово! Результат сохранён в {output_file}")

    except Exception as e:
        log_error(f"Ошибка: {str(e)}")
        print(f"\n❌ Произошла ошибка: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description="Утилита анонимизации персональных данных")
    parser.add_argument('--input', help='Путь к исходному файлу (CSV или JSON)')
    parser.add_argument('--output', help='Путь к выходному файлу')
    parser.add_argument('--mask', help='Поля для маскировки (через запятую)')
    parser.add_argument('--remove', help='Поля для удаления (через запятую)')
    parser.add_argument('--fake', help='Поля для подмены фиктивными данными (через запятую)')

    args = parser.parse_args()

    if not any([args.input, args.output, args.mask, args.remove, args.fake]):
        run_interactive()
        return

    if not args.input or not args.output:
        print("❌ Ошибка: аргументы --input и --output обязательны.")
        return

    try:
        data = load_data(args.input)
        log_info(f"Файл {args.input} успешно загружен.")

        if args.mask:
            fields_to_mask = [f.strip() for f in args.mask.split(',')]
            data = mask_fields(data, fields_to_mask)
            log_info(f"Маскированы поля: {fields_to_mask}")

        if args.remove:
            fields_to_remove = [f.strip() for f in args.remove.split(',')]
            data = remove_fields(data, fields_to_remove)
            log_info(f"Удалены поля: {fields_to_remove}")

        if args.fake:
            fields_to_fake = [f.strip() for f in args.fake.split(',')]
            validate_fake_fields(fields_to_fake)
            data = generate_fake_fields(data, fields_to_fake)
            log_info(f"Подменены поля фиктивными значениями: {fields_to_fake}")

        save_data(data, args.output)
        log_info(f"Обработанный файл сохранён: {args.output}")
        print(f"\n✅ Готово! Результат сохранён в {args.output}")

    except Exception as e:
        log_error(f"Ошибка: {str(e)}")
        print(f"\n❌ Произошла ошибка: {str(e)}")

if __name__ == '__main__':
    main()
