interface DateInputProps {
  id: string;
  value: string;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minDate?: string;
  labelText: string;
}

const DateInput = ({
  id,
  value,
  setValue,
  minDate,
  labelText,
}: DateInputProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{labelText}</label>
      <input
        id={id}
        type="date"
        className="border-primary rounded-sm border-2 px-2 py-1 focus:outline-none"
        value={value}
        required
        onChange={(e) => setValue(e)}
        min={minDate} // блокируем выбор прошлой даты
      />
    </div>
  );
};

export default DateInput;
