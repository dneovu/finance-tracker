interface SelectInputProps {
  id: string;
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  labelText: string;
  value?: number | string;
}

const SelectInput = ({
  id,
  children,
  onChange,
  value,
  labelText,
}: SelectInputProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{labelText}</label>
      <select
        id={id}
        className="border-primary bg-background rounded-sm border-2 px-2 py-[0.4rem] focus:outline-none"
        onChange={onChange}
        value={value}
      >
        {children}
      </select>
    </div>
  );
};

export default SelectInput;
