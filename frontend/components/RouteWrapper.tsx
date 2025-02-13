const RouteWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background font-inter min-h-screen w-full p-4 md:p-8">
      {children}
    </div>
  );
};

export default RouteWrapper;
