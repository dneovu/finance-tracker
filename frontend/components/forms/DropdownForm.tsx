import { FormEvent } from 'react';
import SubmitButton from '../common/SubmitButton';

interface DropdownFormProps {
  children: React.ReactNode;
  title: string;
  buttonText: string;
  setIsOpen: () => void;
  isOpen: boolean;
  handleSubmitForm: (e: FormEvent) => Promise<void>;
}

const DropdownForm = ({
  children,
  title,
  buttonText,
  setIsOpen,
  isOpen,
  handleSubmitForm,
}: DropdownFormProps) => {
  return (
    <div className="text-primary w-full">
      <div className="flex cursor-pointer items-center" onClick={setIsOpen}>
        <h2 className="text-2xl select-none">{title}</h2>
        <span
          className={`mt-1 ml-1 transform text-[0.6rem] transition-transform select-none ${isOpen ? 'rotate-180' : ''}`} // стрелка меняет направление
        >
          &#9660;
        </span>
      </div>

      <form
        className={`my-3 flex w-fit flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`} // анимация
        onSubmit={handleSubmitForm}
      >
        {children}
        <SubmitButton text={buttonText} />
      </form>
    </div>
  );
};

export default DropdownForm;
