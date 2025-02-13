const SubmitButton = ({
  text,
  className,
  onClick,
}: {
  text: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className={`bg-secondary hover:bg-primary text-background cursor-pointer rounded-sm border-2 px-3 py-2 transition-all ${className || ''}`}
      onClick={onClick}
      type="submit"
    >
      {text}
    </button>
  );
};

export default SubmitButton;
