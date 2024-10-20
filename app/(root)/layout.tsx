import type { Metadata } from "next";
import { Header } from "@/shared/components/shared/header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Next Pizza | Главная",
};

export default function HomeLayout({
  children,
  modal, // modal = @modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
      <Suspense>
        {/* внутри хедера есть useSearchParams,
        ему нужно время, чтоб он получил параметры, можно
        обойтись без fallback */}
        <Header />
      </Suspense>
      {children}
      {modal}
    </main>
  );
}
