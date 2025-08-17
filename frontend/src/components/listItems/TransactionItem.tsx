import { format } from 'date-fns';
import { ApiResponse, Transaction } from '../../types';
import { toZonedTime } from 'date-fns-tz';
import Cross from '@/assets/images/Cross.svg?react';
import Wallet from '@/assets/images/Wallet.svg?react';

interface TransactionItemProps {
  transaction: Transaction;
  deleteTransaction: (id: number) => Promise<ApiResponse>;
  userTimeZone: string;
}

const TransactionItem = ({
  transaction,
  deleteTransaction,
  userTimeZone,
}: TransactionItemProps) => {
  const dateTime = format(
    toZonedTime(new Date(transaction.date + 'Z'), userTimeZone),
    'dd.MM.yy HH:mm'
  );

  return (
    <li className="bg-primary hover:border-secondary shadow-secondary group flex h-fit max-w-[30rem] items-center rounded-lg border border-gray-300 p-4 pr-3 tracking-wide shadow-sm transition-all duration-300 hover:shadow-sm">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-2">
          <p className="text-md font-semibold">
            {transaction.amount} ₽ {transaction.category.name}
          </p>
          <Wallet
            width={22}
            height={22}
            className={`${transaction.category.type ? 'fill-green-800' : 'fill-red-800'}`}
          />
        </div>
        <p className="item">{dateTime}</p>
      </div>

      <button
        onClick={() => deleteTransaction(transaction.id)}
        className="cursor-pointer p-1"
      >
        <Cross
          width={12}
          height={12}
          className="fill-background hover:fill-secondary ml-3 transition-all"
        />
      </button>
    </li>
  );
};

export default TransactionItem;
