import { useState } from 'react';
import { toZonedTime, format } from 'date-fns-tz';
import useTransactions from '../hooks/useTransactions';
import DateTimeInput from './common/DateTimeInput';

const TransactionFilter = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [fromDateTime, setFromDateTime] = useState('');
  const [toDateTime, setToDateTime] = useState('');

  const resetHandler = () => {
    setFromDateTime('');
    setToDateTime('');
  };

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const transactionsArray = Object.values(transactions);

  const filteredTransactions = transactionsArray.filter((transaction) => {
    // преобразуем время транзакции в локальное время пользователя
    const transactionDate = toZonedTime(
      new Date(transaction.date + 'Z'),
      userTimeZone
    );

    // преобразуем время фильтра по вводу пользователя в локальное время
    const fromDateTimeZoned = fromDateTime
      ? new Date(
          toZonedTime(new Date(fromDateTime), userTimeZone) // локальное время
        )
      : null;

    const toDateTimeZoned = toDateTime
      ? new Date(
          toZonedTime(new Date(toDateTime), userTimeZone) // локальное время
        )
      : null;

    // сравниваем с локальным временем
    return (
      (!fromDateTimeZoned || transactionDate >= fromDateTimeZoned) &&
      (!toDateTimeZoned || transactionDate <= toDateTimeZoned)
    );
  });

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-2 text-lg font-bold">Фильтр транзакций</h2>

      <div className="mb-4 flex flex-wrap gap-4">
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
      </div>
      <button
        onClick={resetHandler}
        className="w-fit cursor-pointer rounded border p-1"
      >
        Сбросить
      </button>

      <h3 className="text-md mb-2 font-semibold">
        Отфильтрованные транзакции:
      </h3>
      <ul className="rounded border p-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <li
              key={t.id}
              className="flex justify-between border-b p-1 last:border-0"
            >
              {format(
                toZonedTime(new Date(t.date + 'Z'), userTimeZone),
                'dd-MM-yy HH:mm'
              )}{' '}
              | {t.amount} ₽ {t.category.name} (
              {t.category.type ? 'Доход' : 'Расход'})
              <button
                onClick={() => deleteTransaction(t.id)}
                className="cursor-pointer"
              >
                ❌
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">Нет транзакций в этом диапазоне</p>
        )}
      </ul>
    </div>
  );
};

export default TransactionFilter;
