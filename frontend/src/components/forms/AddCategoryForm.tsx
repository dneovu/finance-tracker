import { FormEvent, useState } from 'react';
import useCategories from '@/hooks/useCategories';
import DropdownForm from './DropdownForm';
import InputWithValidation from '../common/InputWithValidation';
import SelectInput from '../common/SelectInput';

const AddCategoryForm = () => {
  const { addCategory, isAddingCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedType, setSelectedType] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const addCategoryHandler = async (e: FormEvent) => {
    e.preventDefault();
    await addCategory(newCategoryName, Boolean(selectedType));
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
        <SelectInput
          id="type-select"
          labelText="Тип"
          onChange={(e) => setSelectedType(Number(e.target.value))}
          value={selectedType}
        >
          <option value={0}>Расход</option>
          <option value={1}>Доход</option>
        </SelectInput>
      </div>
    </DropdownForm>
  );
};

export default AddCategoryForm;
