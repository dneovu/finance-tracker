import { useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import useTransactions from '@/hooks/useTransactions';
import DateTimeInput from './common/DateTimeInput';
import DropdownForm from './forms/DropdownForm';
import TransactionItem from './listItems/TransactionItem';

const TransactionFilter = () => {
  const { transactions, deleteTransaction, areTransactionsLoading } =
    useTransactions();
  const [fromDateTime, setFromDateTime] = useState('');
  const [toDateTime, setToDateTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  if (areTransactionsLoading) {
    return <p className="text-primary mb-4">Загрузка...</p>;
  }

  const resetHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setFromDateTime('');
    setToDateTime('');
  };

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const transactionsArray = Object.values(transactions);

  const filteredTransactions = transactionsArray.filter((transaction) => {
    // Преобразуем дату транзакции в локальное время
    const transactionDate = toZonedTime(
      new Date(transaction.date + 'Z'),
      userTimeZone
    );

    // Преобразуем время фильтра в локальное время
    const fromDateTimeZoned = fromDateTime
      ? new Date(toZonedTime(new Date(fromDateTime), userTimeZone))
      : null;

    const toDateTimeZoned = toDateTime
      ? new Date(toZonedTime(new Date(toDateTime), userTimeZone))
      : null;

    return (
      (!fromDateTimeZoned || transactionDate >= fromDateTimeZoned) &&
      (!toDateTimeZoned || transactionDate <= toDateTimeZoned)
    );
  });

  if (filteredTransactions.length === 0) {
    return <p className="text-primary mb-4">У вас пока нет транзакций.</p>;
  }

  return (
    <>
      <DropdownForm
        title="Фильтр транзакций"
        buttonText="Сбросить"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSubmitForm={resetHandler}
      >
        <DateTimeInput
          id="from-date-time"
          value={fromDateTime}
          setValue={setFromDateTime}
          labelText="От:"
        />

        <DateTimeInput
          id="to-date-time"
          value={toDateTime}
          setValue={setToDateTime}
          labelText="До:"
        />
      </DropdownForm>

      <div className="text-primary mt-4 mb-6 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Ваши транзакции</h2>
        <ul className="text-background space-y-2">
          {filteredTransactions.map((t) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              deleteTransaction={deleteTransaction}
              userTimeZone={userTimeZone}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default TransactionFilter;
