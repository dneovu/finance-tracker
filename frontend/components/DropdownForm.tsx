  import { FormEvent } from 'react';
  import SubmitButton from './SubmitButton';

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
      <div className="w-full text-primary">
        <div className="flex cursor-pointer items-center" onClick={setIsOpen}>
          <h2 className="select-none text-2xl">{title}</h2>
          <span
            className={`select-none ml-1 mt-1 transform text-[0.6rem] transition-transform ${isOpen ? 'rotate-180' : ''}`} // стрелка меняет направление
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
