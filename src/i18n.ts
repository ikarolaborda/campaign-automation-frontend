import { getRequestConfig } from 'next-intl/server';

// @ts-ignore - Next.js/next-intl type definitions issue
export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale || 'en';
  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
}); 