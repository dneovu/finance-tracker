import { useContext } from 'react';
import CategoryContext from '../context/CategoryContext';

const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      'useCategories должен использоваться внутри CategoryProvider'
    );
  }
  return context;
};

export default useCategories;
