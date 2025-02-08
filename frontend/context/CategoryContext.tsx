import { createContext } from 'react';
import { ApiResponse, Categories } from '../types';

interface CategoryContextType {
  categories: Categories;
  isCategoriesLoading: boolean;
  addCategory: (name: string, type: boolean) => Promise<ApiResponse>;
  deleteCategory: (id: number) => Promise<ApiResponse>;
}

const categoryContextReject = async () =>
  Promise.reject('CategoryContext not provided');

const defaultCategoryContext: CategoryContextType = {
  categories: [],
  isCategoriesLoading: false,
  addCategory: categoryContextReject,
  deleteCategory: categoryContextReject,
};

const CategoryContext = createContext<CategoryContextType>(
  defaultCategoryContext
);

export default CategoryContext;
