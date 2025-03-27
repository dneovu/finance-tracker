import { ApiResponse, Category } from '../../types';
import notify from '../../utils/notify';

interface CategoryItemProps {
  category: Category;
  deleteCategory: (id: number) => Promise<ApiResponse>;
}

const CategoryItem = ({ category, deleteCategory }: CategoryItemProps) => {
  const handleDelete = async (id: number) => {
    const res = await deleteCategory(id);

    if (res.status === 'error') {
      notify.error(res.message);
    }
  };

  return (
    <div className="bg-primary hover:border-secondary shadow-secondary group flex h-fit max-w-[30rem] items-center justify-between gap-4 rounded-lg border border-gray-300 p-4 tracking-wide shadow-sm transition-all duration-300">
      <div className="flex flex-col">
        <p className="text-background text-lg font-semibold">{category.name}</p>
      </div>
      <button
        onClick={() => handleDelete(category.id)}
        className="text-background hover:text-secondary mt-2 cursor-pointer transition-all"
      >
        Удалить
      </button>
    </div>
  );
};

export default CategoryItem;
