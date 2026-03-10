export function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-green-200">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8 font-['VT323'] tracking-wide">
        {title}
      </h1>
      {children}
    </div>
  );
}
