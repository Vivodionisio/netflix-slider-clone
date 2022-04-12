import {
  CertU,
  CertPG,
  Cert12A,
  Cert12,
  Cert15,
  Cert18,
  CertR18
} from '../assets/images/maturity-badges/cert'

export const certBadgeElement = certification => {
  if (certification === 'U') return <CertU />
  if (certification === 'PG') return <CertPG />
  if (certification === '12A') return <Cert12A />
  if (certification === '12') return <Cert12 />
  if (certification === '15') return <Cert15 />
  if (certification === '18') return <Cert18 />
  if (certification === 'R18') return <CertR18 />
}
