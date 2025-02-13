const RouteTitle = ({ text }: { text: string }) => {
  return (
    <h1 className="text-primary mb-7 text-3xl font-bold tracking-widest">
      {text}
    </h1>
  );
};

export default RouteTitle;
