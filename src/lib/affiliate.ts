export function getKlookThailandUrl(path: string): string {
  const destination = `https://www.klook.com/th/${path}`;
  return `https://affiliate.klook.com/redirect?aid=133386&aff_adid=1411178&k_site=${encodeURIComponent(destination)}&utm_source=supersyam&utm_medium=affiliate&utm_campaign=thailand-${encodeURIComponent(path)}`;
}

export function getAgodaThailandUrl(cityName: string): string {
  return `https://affiliateapi7643.agoda.com/affiliateservice/lt_v1?city=${encodeURIComponent(cityName)}&utm_source=supersyam&utm_medium=affiliate&utm_campaign=hotel-${encodeURIComponent(cityName)}`;
}

export function getPartnerBookingUrl(type: string, location: string): string {
  if (type === 'โรงแรม') return getAgodaThailandUrl(location);
  const destination = type === 'รถเช่า' ? 'car-rental' : type === 'ตั๋วรถทัวร์' ? 'bus-tickets' : 'activity';
  return getKlookThailandUrl(destination);
}
