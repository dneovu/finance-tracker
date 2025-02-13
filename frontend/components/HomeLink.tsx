import { NavLink } from 'react-router';

interface HomeLinkProps {
  route: string;
  text: string;
}

const HomeLink = ({ route, text }: HomeLinkProps) => {
  return (
    <NavLink
      className="text-primary hover:text-secondary w-fit text-5xl hover:italic"
      to={route}
      end
    >
      {text}
    </NavLink>
  );
};

export default HomeLink;
