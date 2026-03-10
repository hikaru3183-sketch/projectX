import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider"; // 追加
import "../globals.css";
import Header from "@/components/layout/Header";

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const locales = ["ja", "en"];
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    // suppressHydrationWarning は theme 切り替え時の警告抑制に必須
    <html lang={locale} suppressHydrationWarning>
      <body className="m-0 p-0 overflow-auto">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="bg-gray-700">
              <Header />
            </div>
            <main>{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}