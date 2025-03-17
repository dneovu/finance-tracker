interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className={'min-h-screen bg-slate-200'}>
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-red-50 bg-slate-50 p-8">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
