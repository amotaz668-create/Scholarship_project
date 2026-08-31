import { inject, Injectable } from '@angular/core';
import { ReferenceItem } from '../models/api.models';
import { I18nService, Language } from '../i18n/i18n.service';

export interface CountryMetadata {
  code: string;
  name: string;
  flag: string;
}

export type CountryValue = string | Pick<ReferenceItem, 'name' | 'code'> | null | undefined;

// ISO 3166-1 alpha-2 regions represented by the world SVG. The list is metadata,
// never an opportunity list; destination options still come exclusively from scholarships.
const ISO_REGION_CODES = new Set(
  `AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BN BO BM BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EG EE EH ER ES ET FI FJ FK FM FO FR GA GB GE GD GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW`.split(' ')
);

const SPECIAL_ALIASES: Readonly<Record<string, string>> = {
  uk: 'GB',
  britain: 'GB',
  'great britain': 'GB',
  'united kingdom': 'GB',
  us: 'US',
  usa: 'US',
  'u s a': 'US',
  'united states': 'US',
  'united states of america': 'US',
  turkey: 'TR',
  turkiye: 'TR',
  türkiye: 'TR',
  russia: 'RU',
  'russian federation': 'RU',
  uae: 'AE',
  'u a e': 'AE',
  'united arab emirates': 'AE',
  'south korea': 'KR',
  'republic of korea': 'KR',
  'korea republic of': 'KR',
  'north korea': 'KP',
  'democratic peoples republic of korea': 'KP',
  'czech republic': 'CZ',
  czechia: 'CZ',
  brunei: 'BN',
  'brunei darussalam': 'BN',
  'ivory coast': 'CI',
  'cote d ivoire': 'CI',
  laos: 'LA',
  'lao peoples democratic republic': 'LA',
  moldova: 'MD',
  'republic of moldova': 'MD',
  tanzania: 'TZ',
  'united republic of tanzania': 'TZ',
  bolivia: 'BO',
  venezuela: 'VE',
  syria: 'SY',
  palestine: 'PS',
  'state of palestine': 'PS',
  'vatican city': 'VA',
  'holy see': 'VA',
  kosovo: 'XK',
  vietnam: 'VN',
  'viet nam': 'VN',
  capeverde: 'CV',
  'cape verde': 'CV',
  eswatini: 'SZ',
  swaziland: 'SZ'
};

const displayNames = new Map<Language, Intl.DisplayNames | null>();
const generatedAliases = new Map<string, string>();

function key(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, ' ')
    .trim();
}

function namesFor(language: Language): Intl.DisplayNames | null {
  if (displayNames.has(language)) return displayNames.get(language) ?? null;
  let names: Intl.DisplayNames | null = null;
  try {
    names = typeof Intl.DisplayNames === 'function'
      ? new Intl.DisplayNames([language], { type: 'region' })
      : null;
  } catch {
    names = null;
  }
  displayNames.set(language, names);
  return names;
}

function buildGeneratedAliases(): void {
  if (generatedAliases.size) return;
  for (const code of ISO_REGION_CODES) {
    generatedAliases.set(code.toLocaleLowerCase(), code);
    for (const language of ['en', 'ar'] as const) {
      const localized = namesFor(language)?.of(code);
      if (localized && localized !== code) generatedAliases.set(key(localized), code);
    }
  }
}

function sourceParts(value: CountryValue): { name: string; storedCode: string } {
  if (typeof value === 'string') return { name: value.trim(), storedCode: '' };
  return {
    name: value?.name?.trim() ?? '',
    storedCode: value?.code?.trim().toUpperCase() ?? ''
  };
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly i18n = inject(I18nService);

  code(value: CountryValue): string | null {
    const { name, storedCode } = sourceParts(value);
    buildGeneratedAliases();

    // A recognized name wins over a stale database code. The stored ISO code is
    // then the reliable fallback for names that are not in the alias index.
    const fromName = name ? SPECIAL_ALIASES[key(name)] ?? generatedAliases.get(key(name)) : undefined;
    if (fromName && ISO_REGION_CODES.has(fromName)) return fromName;
    if (ISO_REGION_CODES.has(storedCode)) return storedCode;
    if (/^[A-Z]{2}$/.test(name.toUpperCase()) && ISO_REGION_CODES.has(name.toUpperCase())) {
      return name.toUpperCase();
    }
    return null;
  }

  metadata(value: CountryValue, language: Language = this.i18n.language()): CountryMetadata | null {
    const code = this.code(value);
    if (!code) return null;
    const fallback = sourceParts(value).name || code;
    const localized = namesFor(language)?.of(code);
    return {
      code,
      name: localized && localized !== code ? localized : fallback,
      flag: this.flag(code)
    };
  }

  name(value: CountryValue, language: Language = this.i18n.language()): string {
    return this.metadata(value, language)?.name ?? sourceParts(value).name;
  }

  flag(value: CountryValue): string {
    const code = typeof value === 'string' && /^[A-Za-z]{2}$/.test(value)
      ? value.toUpperCase()
      : this.code(value);
    return code
      ? [...code].map((character) => String.fromCodePoint(127397 + character.charCodeAt(0))).join('')
      : '';
  }

  label(value: CountryValue, language: Language = this.i18n.language()): string {
    const metadata = this.metadata(value, language);
    return metadata ? `${metadata.flag} ${metadata.name}` : sourceParts(value).name;
  }
}
