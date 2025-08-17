export interface Category {
  id: number;
  name: string;
  type: boolean; // 0-expense, 1-income
}

export interface Categories {
  [key: number]: Category;
}
