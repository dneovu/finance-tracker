import useUser from '../hooks/useUser';
import { Routes, Route, Navigate, Outlet } from 'react-router';
import Login from '../routes/Login';
import Register from '../routes/Register';
import { User } from '../types';
import Home from '../routes/Home';

interface HiddenRouteProps {
  user: User | null;
  redirectPath?: string;
}

const HiddenRoute = ({ user, redirectPath = '/' }: HiddenRouteProps) => {
  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export const App = () => {
  const { user } = useUser();

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route element={<HiddenRoute user={user} />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
};
