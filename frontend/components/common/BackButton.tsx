import LeftArrow from '../../assets/images/LeftArrow.svg?react';

const BackButton = () => {
  return (
    <div className="sticky bottom-2 mt-8">
      <button
        className="bg-primary hover:bg-secondary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all"
        onClick={() => window.history.back()}
      >
        <LeftArrow fill="#27272a" width={32} height={32} />
      </button>
    </div>
  );
};

export default BackButton;
