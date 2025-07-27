export const getFormattedDate = () => `${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;

export const getProjectDomain = (country: string) => {
  const baseDomain = country === 'fr' ? 'nocibe' : 'douglas';
  return `www.${baseDomain}.${country}`;
};
