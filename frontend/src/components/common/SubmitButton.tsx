const SubmitButton = ({
  text,
  className,
  onClick,
  isLoading,
}: {
  text: string;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}) => {
  return (
    <button
      className={`bg-secondary hover:bg-primary disabled:hover:bg-secondary text-background cursor-pointer rounded-sm border-2 px-3 py-2 transition-all disabled:cursor-default ${className || ''}`}
      onClick={onClick}
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? 'Загрузка...' : `${text}`}
    </button>
  );
};

export default SubmitButton;
