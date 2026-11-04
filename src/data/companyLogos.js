export const fallbackCompanyLogo = '/images/Logos/no logo.jpg';

const logos = {
  td: '/images/Logos/TD Logo.jpg',
  tdsecurities: '/images/Logos/TD Logo.jpg',
  romaeris: '/images/Logos/romaeris_corporation_logo.jpg',
  romaeriscorporation: '/images/Logos/romaeris_corporation_logo.jpg',
  unityhealthtoronto: '/images/Logos/unityhealthtoronto_logo.jpg',
};

export function getCompanyLogo(company) {
  return logos[company.toLowerCase().replace(/[^a-z0-9]/g, '')] || fallbackCompanyLogo;
}
