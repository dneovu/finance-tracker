import { FormEvent, useState } from 'react';
import useCategories from '../hooks/useCategories';

const AddCategoryForm = () => {
  const { addCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  // дефолтный выбранный тип в select - расход
  const [selectedType, setSelectedType] = useState(false);

  const addCategoryHandler = async (e: FormEvent) => {
    e.preventDefault();

    await addCategory(newCategoryName, selectedType);
    setNewCategoryName('');
  };

  return (
    <div className="flex w-fit">
      <form className="flex flex-col gap-5" onSubmit={addCategoryHandler}>
        <div className="flex flex-col">
          <label htmlFor="add-category">Новая категория</label>
          <input
            className="border-2 border-slate-700 px-2 py-1 focus:outline-none"
            type="text"
            name="add-category"
            id="add-category"
            maxLength={20}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="type-select">Тип</label>
          <select
            name="type-select"
            id="type-select"
            className="border-2 border-slate-700 px-2 py-1 focus:outline-none"
            onChange={(e) => setSelectedType(Boolean(Number(e.target.value)))} // option value в true или false
          >
            <option value="0">Расход</option>
            <option value="1">Доход</option>
          </select>
        </div>
        <button
          className="mt-4 cursor-pointer rounded-md border-2 border-slate-700 bg-slate-50 px-4 py-2"
          type="submit"
        >
          Добавить
        </button>
      </form>
    </div>
  );
};

export default AddCategoryForm;
