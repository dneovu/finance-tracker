const RouteWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background font-inter relative min-h-screen w-full p-4 md:p-8 flex flex-col">
      {children}
    </div>
  );
};

export default RouteWrapper;
