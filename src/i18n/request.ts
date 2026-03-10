import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// サポートしている言語
const locales = ["ja", "en"];

export default getRequestConfig(async ({ requestLocale }) => {
  // localeを待機
  const locale = await requestLocale;

  // localeが取得できない、またはサポート外の場合は404（またはデフォルト言語）にする
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  return {
    // localeを string型 として確定させる
    locale: locale as string,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
