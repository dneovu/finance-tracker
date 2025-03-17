import useCategories from '../hooks/useCategories';
import { Category } from '../types';
import AddCategoryForm from '../components/forms/AddCategoryForm';
import RouteWrapper from '../components/wrappers/RouteWrapper';
import RouteTitle from '../components/RouteTitle';
import CategoryItem from '../components/listItems/CategoryItem';
import RouteGrowContent from '../components/wrappers/RouteGrowContent';
import BackButton from '../components/common/BackButton';

const Categories = () => {
  const { categories, deleteCategory } = useCategories();

  const incomeCategories = Object.values(categories).filter(
    (category: Category) => category.type === true
  );
  const expenseCategories = Object.values(categories).filter(
    (category: Category) => category.type === false
  );

  const isIncomeLength = incomeCategories.length > 0;
  const isExpenseLength = expenseCategories.length > 0;

  return (
    <RouteWrapper>
      <RouteGrowContent>
        <RouteTitle text="Категории" />
        <div className="flex flex-col gap-3">
          <AddCategoryForm />
          {!isIncomeLength && !isExpenseLength && (
            <p className="text-primary">У вас пока нет категорий.</p>
          )}
          <div className="flex flex-col gap-3">
            {isIncomeLength && (
              <h2 className="text-primary text-xl font-semibold">Доход</h2>
            )}
            {incomeCategories.map((category: Category) => (
              <CategoryItem
                key={category.id}
                category={category}
                deleteCategory={deleteCategory}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {isExpenseLength && (
              <h2 className="text-primary text-xl font-semibold">Расход</h2>
            )}
            {expenseCategories.map((category: Category) => (
              <CategoryItem
                key={category.id}
                category={category}
                deleteCategory={deleteCategory}
              />
            ))}
          </div>
        </div>
      </RouteGrowContent>
      <BackButton />
    </RouteWrapper>
  );
};

export default Categories;
