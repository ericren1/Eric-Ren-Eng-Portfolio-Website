import { useState } from 'react';
import { fallbackCompanyLogo, getCompanyLogo } from '../data/companyLogos';

export default function CompanyLogo({ company, src }) {
  const [failed, setFailed] = useState(false);
  const image = failed ? fallbackCompanyLogo : src || getCompanyLogo(company);
  return <img className="company-logo" src={image} width="48" height="48" loading="lazy" decoding="async"
    alt={image === fallbackCompanyLogo ? 'Logo unavailable for '+company : company+' logo'}
    onError={() => { if (image !== fallbackCompanyLogo) setFailed(true); }} />;
}
