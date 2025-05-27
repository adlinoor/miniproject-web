"use client";

export default function AppBackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-white to-gray-50 text-gray-900">
      {children}
    </div>
  );
}
