import { FormEvent } from 'react';
import SubmitButton from '../common/SubmitButton';

interface DropdownFormProps {
  children: React.ReactNode;
  title: string;
  buttonText: string;
  isButtonLoading?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  handleSubmitForm: (e: FormEvent) => void;
}

const DropdownForm = ({
  children,
  title,
  buttonText,
  setIsOpen,
  isOpen,
  handleSubmitForm,
  isButtonLoading,
}: DropdownFormProps) => {
  return (
    <div className="text-primary w-fit">
      <div
        className="flex cursor-pointer items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-2xl select-none">{title}</h2>
        <span
          className={`mt-1 ml-1 transform text-[0.6rem] transition-transform select-none ${isOpen ? 'rotate-180' : ''}`} // стрелка меняет направление
        >
          &#9660;
        </span>
      </div>

      <form
        className={`my-3 flex w-fit min-w-[250px] flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`} // анимация
        onSubmit={handleSubmitForm}
      >
        {children}
        <SubmitButton text={buttonText} isLoading={isButtonLoading} />
      </form>
    </div>
  );
};

export default DropdownForm;
