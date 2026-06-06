//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLocalized = (obj: any, language: string) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[language] || obj.ru || obj.en || Object.values(obj)[0] || '';
};
