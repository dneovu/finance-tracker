const RouteWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background font-inter relative flex min-h-screen w-full flex-col p-4 md:px-16 md:py-8 lg:px-32 lg:py-16">
      {children}
    </div>
  );
};

export default RouteWrapper;
