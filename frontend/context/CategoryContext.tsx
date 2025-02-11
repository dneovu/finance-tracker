import { createContext } from 'react';
import { AddCategoryResponse, ApiResponse, Categories } from '../types';

interface CategoryContextType {
  categories: Categories;
  areCategoriesLoading: boolean;
  addCategory: (name: string, type: boolean) => Promise<AddCategoryResponse>;
  deleteCategory: (id: number) => Promise<ApiResponse>;
}

const categoryContextReject = async () =>
  Promise.reject('CategoryContext not provided');

const defaultCategoryContext: CategoryContextType = {
  categories: [],
  areCategoriesLoading: false,
  addCategory: categoryContextReject,
  deleteCategory: categoryContextReject,
};

const CategoryContext = createContext<CategoryContextType>(
  defaultCategoryContext
);

export default CategoryContext;
