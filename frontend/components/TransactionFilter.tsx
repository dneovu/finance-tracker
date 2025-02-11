import { useState } from 'react';
import { toZonedTime, format } from 'date-fns-tz';
import useTransactions from '../hooks/useTransactions';

const TransactionFilter = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [fromDate, setFromDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toDate, setToDate] = useState('');
  const [toTime, setToTime] = useState('');

  const resetHandler = () => {
    setFromDate('');
    setFromTime('');
    setToDate('');
    setToTime('');
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
    const fromDateTime =
      fromDate && fromTime
        ? new Date(
            toZonedTime(new Date(`${fromDate}T${fromTime}:00`), userTimeZone) // локальное время
          )
        : null;

    const toDateTime =
      toDate && toTime
        ? new Date(
            toZonedTime(new Date(`${toDate}T${toTime}:00`), userTimeZone) // локальное время
          )
        : null;

    // сравниваем с локальным временем
    return (
      (!fromDateTime || transactionDate >= fromDateTime) &&
      (!toDateTime || transactionDate <= toDateTime)
    );
  });

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-2 text-lg font-bold">Фильтр транзакций</h2>

      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium">От:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded border p-1"
          />
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="ml-2 rounded border p-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">До:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded border p-1"
          />
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="ml-2 rounded border p-1"
          />
        </div>
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
