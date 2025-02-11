import useAuth from '../hooks/useAuth';
import { Routes, Route, Navigate, Outlet } from 'react-router';
import Login from '../routes/Login';
import Register from '../routes/Register';
import Home from '../routes/Home';
import Profile from '../routes/Profile';
import Categories from '../routes/Categories';
import Transactions from '../routes/Transactions';

interface RouteProps {
  redirectPath?: string;
}

const GuestRoute = ({ redirectPath = '/' }: RouteProps) => {
  const { user, isUserLoading } = useAuth();

  if (isUserLoading) return <div>Загрузка...</div>;
  return user ? <Navigate to={redirectPath} replace /> : <Outlet />;
};

const ProtectedRoute = ({ redirectPath = '/' }: RouteProps) => {
  const { user, isUserLoading } = useAuth();

  if (isUserLoading) return <div>Загрузка..</div>;
  return user ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route element={<GuestRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="profile" element={<Profile />} />
        <Route path="categories" element={<Categories />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
};
