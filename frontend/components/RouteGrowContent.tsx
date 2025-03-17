const RouteGrowContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex flex-grow flex-col ${className}`}>{children}</div>
  );
};

export default RouteGrowContent;
