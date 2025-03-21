import React, { useState, useEffect } from 'react';

interface AmountInputProps {
  amount: string;
  setAmount: (value: string) => void;
}

const AmountInput = ({ amount, setAmount }: AmountInputProps) => {
  const [inputValue, setInputValue] = useState(amount);

  useEffect(() => {
    setInputValue(amount); // синхронизация с внешним состоянием
  }, [amount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D+/g, '').replace(/^0+(?=\d)/, '');

    setAmount(value);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="amount">Сумма:</label>
      <div className="relative w-full">
        <input
          className="border-primary w-full appearance-none rounded-sm border-2 px-2 py-1 pr-6 focus:outline-none"
          type="text"
          inputMode="numeric"
          name="amount"
          id="amount"
          value={inputValue}
          onChange={handleChange}
          pattern="\d*"
          maxLength={6}
        />
        <span className="text-primary absolute top-1/2 right-2 -translate-y-1/2">
          ₽
        </span>
      </div>
    </div>
  );
};

export default AmountInput;
