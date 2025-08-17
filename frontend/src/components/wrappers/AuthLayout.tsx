interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className={'bg-background text-primary min-h-screen'}>
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-light-bg flex flex-col items-center justify-center gap-3 rounded-md border-2 border-red-50 p-8">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
