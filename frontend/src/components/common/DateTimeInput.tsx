interface DateTimeInputProps {
  id: string;
  value: string;
  setValue: (dateTime: string) => void;
  minDateTime?: string;
  labelText: string;
  isRequired?: boolean;
}

const DateTimeInput = ({
  id,
  value,
  setValue,
  minDateTime,
  labelText,
  isRequired,
}: DateTimeInputProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{labelText}</label>
      <input
        id={id}
        type="datetime-local"
        className="border-primary rounded-sm border-2 px-2 py-1 focus:outline-none"
        value={value}
        required={isRequired ?? true}
        onChange={(e) => setValue(e.target.value)}
        min={minDateTime} // блокируем выбор прошлого времени
      />
    </div>
  );
};

export default DateTimeInput;
