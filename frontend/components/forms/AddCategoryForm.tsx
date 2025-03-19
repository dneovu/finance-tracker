import { FormEvent, useState } from 'react';
import useCategories from '../../hooks/useCategories';
import DropdownForm from './DropdownForm';
import InputWithValidation from '../common/InputWithValidation';

const AddCategoryForm = () => {
  const { addCategory, isAddingCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedType, setSelectedType] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const addCategoryHandler = async (e: FormEvent) => {
    e.preventDefault();
    await addCategory(newCategoryName, selectedType);
    setNewCategoryName('');
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleSubmitForm={addCategoryHandler}
      isButtonLoading={isAddingCategory}
      title="Добавить категорию"
      buttonText="Добавить"
    >
      <div className="flex flex-col gap-5">
        <InputWithValidation
          labelName="Имя категории"
          id="add-category"
          type="text"
          value={newCategoryName}
          setValue={setNewCategoryName}
          minLength={1}
          isValid={() => newCategoryName.length > 0}
        />
        <div className="flex flex-col">
          <label htmlFor="type-select">Тип</label>
          <select
            name="type-select"
            id="type-select"
            className="border-primary bg-background rounded-sm border-2 px-2 py-[0.4rem] focus:outline-none"
            onChange={(e) => setSelectedType(Boolean(Number(e.target.value)))}
          >
            <option value="0">Расход</option>
            <option value="1">Доход</option>
          </select>
        </div>
      </div>
    </DropdownForm>
  );
};

export default AddCategoryForm;
