import useCategories from '../hooks/useCategories';
import { Category } from '../types';
import AddCategoryForm from '../components/AddCategoryForm';

const Categories = () => {
  const { categories, deleteCategory } = useCategories();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="font-bold">Категории</h1>
        {Object.values(categories).map((category: Category) => (
          <div key={category.id} className='flex gap-3'>
            {category.name} {category.type ? 'Доход' : 'Расход'}
            <button onClick={() => deleteCategory(category.id)}>❌</button>
          </div>
        ))}
      </div>

      <AddCategoryForm />
    </div>
  );
};

export default Categories;
