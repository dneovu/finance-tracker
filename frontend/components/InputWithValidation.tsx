interface AuthInputProps {
  labelName: string;
  id: string;
  type: string;
  value: string;
  setValue: (value: string) => void;
  isValid: (value: string) => boolean;
}

const AuthInput = ({
  labelName,
  id,
  type,
  value,
  setValue,
  isValid,
}: AuthInputProps) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-[1rem]">{labelName}</label>
    <input
      className={`border-2 px-2 py-1 focus:outline-none ${
        isValid(value) ? 'border-secondary' : 'border-primary'
      }`}
      type={type}
      name={id}
      id={id}
      autoComplete="on"
      maxLength={20}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  </div>
);

export default AuthInput;
