export const valiPhone = (p) => {
  const phoneRegex = /^1\d{10}$/;
  return phoneRegex.test(p);
};