export function getKlookThailandUrl(path: string): string {
  const aid = process.env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID || '133386';
  return `https://affiliate.klook.com/redirect?aid=${aid}&aff_adid=1411178&k_site=${encodeURIComponent('https://www.klook.com/th/' + path)}`;
}

export function getAgodaThailandUrl(cityName: string): string {
  return `http://affiliateapi7643.agoda.com/affiliateservice/lt_v1?city=${encodeURIComponent(cityName)}`;
}
