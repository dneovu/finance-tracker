import { useEffect, useState } from 'react';
import {
  ApiResponse,
  Categories,
  CategoriesResponse,
  ProviderProps,
} from '@/types';
import CategoryContext from './CategoryContext';
import api from '@/utils/api';
import { AxiosResponse } from 'axios';
import useAuth from '@/hooks/useAuth';
import handleProviderError from '@/utils/handleProviderError';

const CateroryProvider = ({ children }: ProviderProps) => {
  const { isUserAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Categories>({});
  // состояния загрузки
  const [areCategoriesLoading, setAreCategoriesLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setAreCategoriesLoading(true);
      try {
        const res: AxiosResponse<CategoriesResponse> =
          await api.get('/categories');
        if (res.data.categories) {
          setCategories(res.data.categories);
          console.log(res.data);
        }
      } catch (error) {
        return handleProviderError(error);
      } finally {
        setAreCategoriesLoading(false);
      }
    };

    if (isUserAuthenticated) fetchCategories();
  }, [isUserAuthenticated]);

  const addCategory = async (name: string, type: boolean) => {
    try {
      setIsAddingCategory(true);
      const res: AxiosResponse<CategoriesResponse> = await api.post(
        '/add-category',
        {
          name,
          type,
        }
      );
      const newCategory = res.data.categories;
      if (newCategory) {
        // обновление категории в стейте
        setCategories((prevCategories) => ({
          ...prevCategories,
          ...newCategory,
        }));
      }
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    } finally {
      setIsAddingCategory(false);
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
      return handleProviderError(error);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        areCategoriesLoading,
        addCategory,
        deleteCategory,
        isAddingCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CateroryProvider;
