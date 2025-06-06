interface InputWithValidationProps {
  labelName: string;
  id: string;
  type: string;
  value: string;
  minLength?: number;
  setValue: (value: string) => void;
  isValid: (value: string) => boolean;
}

const InputWithValidation = ({
  labelName,
  id,
  type,
  value,
  minLength,
  setValue,
  isValid,
}: InputWithValidationProps) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-[1rem]">
      {labelName}
    </label>
    <input
      className={`border-2 px-2 py-1 rounded-sm focus:outline-none ${
        isValid(value) ? 'border-secondary' : 'border-primary'
      }`}
      type={type}
      name={id}
      id={id}
      autoComplete="on"
      maxLength={20}
      value={value}
      minLength={minLength}
      required
      onChange={(e) => setValue(e.target.value)}
    />
  </div>
);

export default InputWithValidation;
