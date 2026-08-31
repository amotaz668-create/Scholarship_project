import { ReferenceItem } from '../models/api.models';

export interface CountryCoordinates {
  latitude: number;
  longitude: number;
}

export interface NormalizedCountry {
  name: string;
  code?: string;
}

// Geographic metadata only. Opportunity names and counts are always derived from the API.
const COORDINATES_BY_CODE: Readonly<Record<string, CountryCoordinates>> = {
  AF: { latitude: 33.9, longitude: 67.7 }, AL: { latitude: 41.2, longitude: 20.2 }, DZ: { latitude: 28.0, longitude: 1.7 }, AD: { latitude: 42.5, longitude: 1.5 }, AO: { latitude: -11.2, longitude: 17.9 }, AG: { latitude: 17.1, longitude: -61.8 }, AR: { latitude: -38.4, longitude: -63.6 }, AM: { latitude: 40.1, longitude: 45.0 }, AU: { latitude: -25.3, longitude: 133.8 }, AT: { latitude: 47.5, longitude: 14.6 }, AZ: { latitude: 40.1, longitude: 47.6 }, BS: { latitude: 25.0, longitude: -77.4 }, BH: { latitude: 26.1, longitude: 50.6 }, BD: { latitude: 23.7, longitude: 90.4 }, BB: { latitude: 13.2, longitude: -59.5 }, BY: { latitude: 53.7, longitude: 27.9 }, BE: { latitude: 50.5, longitude: 4.5 }, BZ: { latitude: 17.2, longitude: -88.5 }, BJ: { latitude: 9.3, longitude: 2.3 }, BT: { latitude: 27.5, longitude: 90.4 }, BO: { latitude: -16.3, longitude: -63.6 }, BA: { latitude: 43.9, longitude: 17.7 }, BW: { latitude: -22.3, longitude: 24.7 }, BR: { latitude: -14.2, longitude: -51.9 }, BN: { latitude: 4.5, longitude: 114.7 }, BG: { latitude: 42.7, longitude: 25.5 }, BF: { latitude: 12.2, longitude: -1.6 }, BI: { latitude: -3.4, longitude: 29.9 }, CV: { latitude: 16.0, longitude: -24.0 }, KH: { latitude: 12.6, longitude: 104.9 }, CM: { latitude: 7.4, longitude: 12.4 }, CA: { latitude: 56.1, longitude: -106.3 }, CF: { latitude: 6.6, longitude: 20.9 }, TD: { latitude: 15.5, longitude: 18.7 }, CL: { latitude: -35.7, longitude: -71.5 }, CN: { latitude: 35.9, longitude: 104.2 }, CO: { latitude: 4.6, longitude: -74.3 }, KM: { latitude: -11.9, longitude: 43.9 }, CG: { latitude: -0.2, longitude: 15.8 }, CD: { latitude: -4.0, longitude: 21.8 }, CR: { latitude: 9.7, longitude: -83.8 }, CI: { latitude: 7.5, longitude: -5.5 }, HR: { latitude: 45.1, longitude: 15.2 }, CU: { latitude: 21.5, longitude: -77.8 }, CY: { latitude: 35.1, longitude: 33.4 }, CZ: { latitude: 49.8, longitude: 15.5 }, DK: { latitude: 56.3, longitude: 9.5 }, DJ: { latitude: 11.8, longitude: 42.6 }, DM: { latitude: 15.4, longitude: -61.4 }, DO: { latitude: 18.7, longitude: -70.2 }, EC: { latitude: -1.8, longitude: -78.2 }, EG: { latitude: 26.8, longitude: 30.8 }, SV: { latitude: 13.8, longitude: -88.9 }, GQ: { latitude: 1.7, longitude: 10.3 }, ER: { latitude: 15.2, longitude: 39.8 }, EE: { latitude: 58.6, longitude: 25.0 }, SZ: { latitude: -26.5, longitude: 31.5 }, ET: { latitude: 9.1, longitude: 40.5 }, FJ: { latitude: -17.7, longitude: 178.1 }, FI: { latitude: 61.9, longitude: 25.7 }, FR: { latitude: 46.2, longitude: 2.2 }, GA: { latitude: -0.8, longitude: 11.6 }, GM: { latitude: 13.4, longitude: -15.3 }, GE: { latitude: 42.3, longitude: 43.4 }, DE: { latitude: 51.2, longitude: 10.5 }, GH: { latitude: 7.9, longitude: -1.0 }, GR: { latitude: 39.1, longitude: 21.8 }, GD: { latitude: 12.1, longitude: -61.7 }, GT: { latitude: 15.8, longitude: -90.2 }, GN: { latitude: 9.9, longitude: -11.3 }, GW: { latitude: 12.0, longitude: -15.2 }, GY: { latitude: 4.9, longitude: -58.9 }, HT: { latitude: 19.0, longitude: -72.3 }, HN: { latitude: 15.2, longitude: -86.2 }, HU: { latitude: 47.2, longitude: 19.5 }, IS: { latitude: 64.9, longitude: -19.0 }, IN: { latitude: 20.6, longitude: 78.9 }, ID: { latitude: -0.8, longitude: 113.9 }, IR: { latitude: 32.4, longitude: 53.7 }, IQ: { latitude: 33.2, longitude: 43.7 }, IE: { latitude: 53.1, longitude: -8.2 }, IL: { latitude: 31.0, longitude: 34.9 }, IT: { latitude: 41.9, longitude: 12.6 }, JM: { latitude: 18.1, longitude: -77.3 }, JP: { latitude: 36.2, longitude: 138.3 }, JO: { latitude: 30.6, longitude: 36.2 }, KZ: { latitude: 48.0, longitude: 66.9 }, KE: { latitude: -0.0, longitude: 37.9 }, KI: { latitude: 1.9, longitude: -157.4 }, KP: { latitude: 40.3, longitude: 127.5 }, KR: { latitude: 35.9, longitude: 127.8 }, KW: { latitude: 29.3, longitude: 47.5 }, KG: { latitude: 41.2, longitude: 74.8 }, LA: { latitude: 19.9, longitude: 102.5 }, LV: { latitude: 56.9, longitude: 24.6 }, LB: { latitude: 33.9, longitude: 35.9 }, LS: { latitude: -29.6, longitude: 28.2 }, LR: { latitude: 6.4, longitude: -9.4 }, LY: { latitude: 26.3, longitude: 17.2 }, LI: { latitude: 47.2, longitude: 9.6 }, LT: { latitude: 55.2, longitude: 23.9 }, LU: { latitude: 49.8, longitude: 6.1 }, MG: { latitude: -18.8, longitude: 46.9 }, MW: { latitude: -13.3, longitude: 34.3 }, MY: { latitude: 4.2, longitude: 101.9 }, MV: { latitude: 3.2, longitude: 73.2 }, ML: { latitude: 17.6, longitude: -4.0 }, MT: { latitude: 35.9, longitude: 14.4 }, MH: { latitude: 7.1, longitude: 171.2 }, MR: { latitude: 21.0, longitude: -10.9 }, MU: { latitude: -20.3, longitude: 57.6 }, MX: { latitude: 23.6, longitude: -102.6 }, FM: { latitude: 7.4, longitude: 150.6 }, MD: { latitude: 47.4, longitude: 28.4 }, MC: { latitude: 43.7, longitude: 7.4 }, MN: { latitude: 46.9, longitude: 103.8 }, ME: { latitude: 42.7, longitude: 19.4 }, MA: { latitude: 31.8, longitude: -7.1 }, MZ: { latitude: -18.7, longitude: 35.5 }, MM: { latitude: 21.9, longitude: 95.9 }, NA: { latitude: -22.9, longitude: 18.5 }, NR: { latitude: -0.5, longitude: 166.9 }, NP: { latitude: 28.4, longitude: 84.1 }, NL: { latitude: 52.1, longitude: 5.3 }, NZ: { latitude: -40.9, longitude: 174.9 }, NI: { latitude: 12.9, longitude: -85.2 }, NE: { latitude: 17.6, longitude: 8.1 }, NG: { latitude: 9.1, longitude: 8.7 }, MK: { latitude: 41.6, longitude: 21.7 }, NO: { latitude: 60.5, longitude: 8.5 }, OM: { latitude: 21.5, longitude: 55.9 }, PK: { latitude: 30.4, longitude: 69.3 }, PW: { latitude: 7.5, longitude: 134.6 }, PA: { latitude: 8.5, longitude: -80.8 }, PG: { latitude: -6.3, longitude: 143.9 }, PY: { latitude: -23.4, longitude: -58.4 }, PE: { latitude: -9.2, longitude: -75.0 }, PH: { latitude: 12.9, longitude: 121.8 }, PL: { latitude: 51.9, longitude: 19.1 }, PT: { latitude: 39.4, longitude: -8.2 }, QA: { latitude: 25.4, longitude: 51.2 }, RO: { latitude: 45.9, longitude: 25.0 }, RU: { latitude: 61.5, longitude: 105.3 }, RW: { latitude: -1.9, longitude: 29.9 }, KN: { latitude: 17.4, longitude: -62.8 }, LC: { latitude: 13.9, longitude: -61.0 }, VC: { latitude: 13.3, longitude: -61.2 }, WS: { latitude: -13.8, longitude: -172.1 }, SM: { latitude: 43.9, longitude: 12.5 }, ST: { latitude: 0.2, longitude: 6.6 }, SA: { latitude: 23.9, longitude: 45.1 }, SN: { latitude: 14.5, longitude: -14.5 }, RS: { latitude: 44.0, longitude: 21.0 }, SC: { latitude: -4.7, longitude: 55.5 }, SL: { latitude: 8.5, longitude: -11.8 }, SG: { latitude: 1.4, longitude: 103.8 }, SK: { latitude: 48.7, longitude: 19.7 }, SI: { latitude: 46.2, longitude: 14.9 }, SB: { latitude: -9.6, longitude: 160.2 }, SO: { latitude: 5.2, longitude: 46.2 }, ZA: { latitude: -30.6, longitude: 22.9 }, SS: { latitude: 6.9, longitude: 31.3 }, ES: { latitude: 40.5, longitude: -3.7 }, LK: { latitude: 7.9, longitude: 80.8 }, SD: { latitude: 12.9, longitude: 30.2 }, SR: { latitude: 3.9, longitude: -56.0 }, SE: { latitude: 60.1, longitude: 18.6 }, CH: { latitude: 46.8, longitude: 8.2 }, SY: { latitude: 34.8, longitude: 38.9 }, TJ: { latitude: 38.9, longitude: 71.3 }, TZ: { latitude: -6.4, longitude: 34.9 }, TH: { latitude: 15.9, longitude: 100.9 }, TL: { latitude: -8.9, longitude: 125.7 }, TG: { latitude: 8.6, longitude: 1.2 }, TO: { latitude: -21.2, longitude: -175.2 }, TT: { latitude: 10.7, longitude: -61.2 }, TN: { latitude: 33.9, longitude: 9.5 }, TR: { latitude: 39.0, longitude: 35.2 }, TM: { latitude: 38.9, longitude: 59.6 }, TV: { latitude: -7.1, longitude: 177.6 }, UG: { latitude: 1.4, longitude: 32.3 }, UA: { latitude: 48.4, longitude: 31.2 }, AE: { latitude: 24.0, longitude: 53.8 }, GB: { latitude: 55.4, longitude: -3.4 }, US: { latitude: 39.8, longitude: -98.6 }, UY: { latitude: -32.5, longitude: -55.8 }, UZ: { latitude: 41.4, longitude: 64.6 }, VU: { latitude: -15.4, longitude: 166.9 }, VA: { latitude: 41.9, longitude: 12.5 }, VE: { latitude: 6.4, longitude: -66.6 }, VN: { latitude: 14.1, longitude: 108.3 }, YE: { latitude: 15.6, longitude: 48.5 }, ZM: { latitude: -13.1, longitude: 27.8 }, ZW: { latitude: -19.0, longitude: 29.2 }, PS: { latitude: 31.9, longitude: 35.2 }, TW: { latitude: 23.7, longitude: 121.0 }, XK: { latitude: 42.6, longitude: 20.9 }
};

const COUNTRY_ALIASES: Readonly<Record<string, NormalizedCountry>> = {
  'uk': { name: 'United Kingdom', code: 'GB' }, 'great britain': { name: 'United Kingdom', code: 'GB' }, 'britain': { name: 'United Kingdom', code: 'GB' }, 'united kingdom': { name: 'United Kingdom', code: 'GB' },
  'usa': { name: 'United States', code: 'US' }, 'us': { name: 'United States', code: 'US' }, 'united states': { name: 'United States', code: 'US' }, 'united states of america': { name: 'United States', code: 'US' },
  'turkey': { name: 'Turkey', code: 'TR' }, 'turkiye': { name: 'Turkey', code: 'TR' },
  'russia': { name: 'Russia', code: 'RU' }, 'russian federation': { name: 'Russia', code: 'RU' },
  'south korea': { name: 'South Korea', code: 'KR' }, 'republic of korea': { name: 'South Korea', code: 'KR' }, 'korea republic of': { name: 'South Korea', code: 'KR' },
  'north korea': { name: 'North Korea', code: 'KP' }, 'democratic peoples republic of korea': { name: 'North Korea', code: 'KP' },
  'uae': { name: 'United Arab Emirates', code: 'AE' }, 'united arab emirates': { name: 'United Arab Emirates', code: 'AE' },
  'czech republic': { name: 'Czechia', code: 'CZ' }, 'czechia': { name: 'Czechia', code: 'CZ' },
  'brunei': { name: 'Brunei Darussalam', code: 'BN' }, 'brunei darussalam': { name: 'Brunei Darussalam', code: 'BN' },
  'ivory coast': { name: 'Cote d Ivoire', code: 'CI' }, 'cote divoire': { name: 'Cote d Ivoire', code: 'CI' },
  'laos': { name: 'Laos', code: 'LA' }, 'moldova': { name: 'Moldova', code: 'MD' }, 'tanzania': { name: 'Tanzania', code: 'TZ' },
  'bolivia': { name: 'Bolivia', code: 'BO' }, 'venezuela': { name: 'Venezuela', code: 'VE' }, 'syria': { name: 'Syria', code: 'SY' }, 'palestine': { name: 'Palestine', code: 'PS' },
  'vatican city': { name: 'Vatican City', code: 'VA' }, 'kosovo': { name: 'Kosovo', code: 'XK' }
};

const countryKey = (value: string): string => value
  .replaceAll('\u00c3\u00bc', '\u00fc')
  .replaceAll('\u00c3\u00b6', '\u00f6')
  .replaceAll('\u00c3\u00a9', '\u00e9')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

export function normalizeCountryName(value: string | null | undefined): NormalizedCountry | null {
  const name = value?.trim();
  if (!name) return null;

  const alias = COUNTRY_ALIASES[countryKey(name)];
  return alias ?? { name };
}

export function countryCoordinates(country: Pick<ReferenceItem, 'name' | 'code'> | null | undefined): CountryCoordinates | null {
  if (!country) return null;

  const normalized = normalizeCountryName(country.name);
  // The country name is the source of truth when it maps to a known ISO code.
  // This prevents stale/mismatched database codes from sending (for example)
  // a Russia scholarship to Egypt. The stored code is only a fallback.
  const normalizedCode = normalized?.code?.toUpperCase();
  const storedCode = country.code?.trim().toUpperCase();
  const code = normalizedCode && COORDINATES_BY_CODE[normalizedCode] ? normalizedCode : storedCode;
  return code ? COORDINATES_BY_CODE[code] ?? null : null;
}

/** Converts latitude/longitude into percentages for the Web Mercator world-map asset. */
export function webMercatorPosition({ latitude, longitude }: CountryCoordinates): { x: number; y: number } {
  const boundedLatitude = Math.max(-85.05112878, Math.min(85.05112878, latitude));
  const latitudeRadians = boundedLatitude * Math.PI / 180;
  return {
    x: ((longitude + 180) / 360) * 100,
    y: (1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) * 50
  };
}
