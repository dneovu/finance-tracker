import { useEffect, useState } from 'react';
import { ApiResponse, Categories, Category, ProviderProps } from '../types';
import CategoryContext from './CategoryContext';
import api from '../utils/api';
import axios, { AxiosResponse } from 'axios';
import useAuth from '../hooks/useAuth';

interface CategoriesResponse extends ApiResponse {
  categories?: Categories;
}

interface AddCategoryResponse extends ApiResponse {
  category?: Category;
}

const CateroryProvider = ({ children }: ProviderProps) => {
  const { isUserAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Categories>({});
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    console.log('Текущие категории', categories);
  }, [categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const res: AxiosResponse<CategoriesResponse> =
          await api.get('/categories');
        if (res.data.categories) {
          setCategories(res.data.categories);
          console.log(res.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response);
        } else {
          console.error(error);
        }
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [isUserAuthenticated]);

  const addCategory = async (name: string, type: boolean) => {
    try {
      const res: AxiosResponse<AddCategoryResponse> = await api.post(
        '/add-category',
        {
          name,
          type,
        }
      );
      const newCategory = res.data.category;
      if (newCategory) {
        // обновление категории в стейте
        setCategories((prevCategories) => ({
          ...prevCategories,
          [newCategory.id]: newCategory,
        }));
      }
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
        return { status: 'error', message: 'Unknown error' };
      }
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post(
        '/delete-category',
        {
          id,
        }
      );
      // удаляем категорию из стейта
      setCategories((prevCategories) => {
        const updatedCategories = { ...prevCategories };
        delete updatedCategories[id];
        return updatedCategories;
      });

      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
        return { status: 'error', message: 'Unknown error' };
      }
    }
  };

  return (
    <CategoryContext.Provider
      value={{ categories, isCategoriesLoading, addCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CateroryProvider;
