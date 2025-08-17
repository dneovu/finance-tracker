export interface Budget {
  id: number;
  amount: number;
  start_date: string;
  end_date: string;
  category_id: number | null;
}

export type Budgets = Budget[];