const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const Scholarship = require("../models/scholarship");
const Category = require("../models/category");
const Country = require("../models/country");
const University = require("../models/university");

/*
 * This seed is intentionally idempotent. Run it again after refreshing the
 * official calls and the existing catalogue records will be updated in place.
 *
 * `deadline` is the last date verified for the named cycle. A draft record is
 * used when the next call is not published yet; it must be reviewed before it
 * is made visible to students. The applicationUrl always points to the
 * official programme or application portal.
 *
 * The current Scholarship schema requires a university reference even when a
 * national programme accepts applications to several institutions. In those
 * cases the reference is a clearly labelled programme-wide scope record, not
 * an invented university or a claim that one institution is guaranteed.
 */

const categories = [
  ["Multi-disciplinary", "Programmes accepting several academic fields"],
  ["Computer Science & Technology", "Computing, data, AI and technology fields"],
  ["Business & Social Sciences", "Business, economics, policy and social sciences"],
  ["Medicine & Health", "Medicine, health and related life sciences"],
  ["Engineering & Natural Sciences", "Engineering, mathematics and natural sciences"],
];

const countries = [
  ["Russia", "RU"],
  ["Saudi Arabia", "SA"],
  ["United Kingdom", "GB"],
  ["Brunei Darussalam", "BN"],
  ["Malaysia", "MY"],
  ["Romania", "RO"],
  ["Japan", "JP"],
  ["Türkiye", "TR"],
  ["China", "CN"],
  ["Azerbaijan", "AZ"],
  ["Kazakhstan", "KZ"],
  ["Hungary", "HU"],
];

const scopeUniversity = (name, country, city, website) => ({
  name,
  country,
  city,
  website,
});

const scholarships = [
  {
    title: "Russian Government Scholarship",
    provider: "Ministry of Science and Higher Education of the Russian Federation",
    country: "Russia",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Participating Russian universities · national quota",
      "Russia",
      "Multiple cities",
      "https://education-in-russia.com/",
    ),
    description:
      "Government-funded study places for international applicants through the official Education in Russia portal. Tuition coverage, preparatory study and living support depend on the available quota and the current call.",
    fundingType: "Tuition + quota support",
    deadline: "2027-01-15",
    applicationUrl: "https://education-in-russia.com/",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD"],
      eligibleFields: ["Multiple fields subject to available quotas"],
    },
    requiredDocuments: [
      { type: "Passport", required: true },
      { type: "Diploma or current study certificate", required: true },
      { type: "Academic transcript", required: true },
      { type: "Medical certificate", required: true },
      { type: "Motivation letter", required: false },
    ],
    status: "draft",
  },
  {
    title: "Open Doors International Olympiad",
    provider: "Association of Global Universities · Open Doors",
    country: "Russia",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Participating Russian universities · Open Doors",
      "Russia",
      "Multiple cities",
      "https://od.globaluni.ru/",
    ),
    description:
      "An online competition for foreign citizens and stateless applicants. Winners and runners-up can obtain tuition-free study opportunities in Russia within the government quota framework, subject to the official rules and track.",
    fundingType: "Tuition-free quota opportunity",
    deadline: "2026-11-01",
    applicationUrl: "https://od.globaluni.ru/",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD", "Postdoc"],
      eligibleFields: [
        "Computer and Data Science",
        "Engineering and Technology",
        "Business and Management",
        "Medicine and related fields",
      ],
    },
    requiredDocuments: [
      { type: "Passport or identity document", required: true },
      { type: "Academic information", required: true },
      { type: "Portfolio", required: true },
      { type: "Motivation letter", required: true },
    ],
    status: "published",
  },
  {
    title: "Saudi Government Scholarship",
    provider: "Saudi Ministry of Education · Study in Saudi",
    country: "Saudi Arabia",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Participating Saudi universities · Study in Saudi",
      "Saudi Arabia",
      "Multiple cities",
      "https://studyinsaudi.moe.gov.sa/",
    ),
    description:
      "International study opportunities submitted through the official Study in Saudi portal. Available programmes, benefits, language rules and deadlines vary by university and programme, so the portal remains the final source of truth.",
    fundingType: "Programme-dependent funding",
    deadline: "2027-05-21",
    applicationUrl: "https://studyinsaudi.moe.gov.sa/",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD"],
      eligibleFields: ["Multiple fields subject to university requirements"],
    },
    requiredDocuments: [
      { type: "Passport", required: true },
      { type: "Academic certificates and transcript", required: true },
      { type: "Medical certificate", required: true },
      { type: "Language certificate if required", required: false },
    ],
    status: "draft",
  },
  {
    title: "Chevening Scholarships",
    provider: "UK Foreign, Commonwealth & Development Office",
    country: "United Kingdom",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Eligible UK universities · Chevening courses",
      "United Kingdom",
      "Multiple cities",
      "https://www.chevening.org/scholarships/",
    ),
    description:
      "A fully funded one-year UK master's scholarship. Applicants must meet the official citizenship, return-home, work-experience, course-choice and offer requirements; the 2026/27 application deadline is 6 October 2026.",
    fundingType: "Fully funded",
    deadline: "2026-10-06",
    applicationUrl: "https://www.chevening.org/scholarships/",
    eligibility: {
      eligibleDegrees: ["Master"],
      eligibleFields: ["All eligible one-year UK master's fields"],
    },
    requiredDocuments: [
      { type: "Degree certificate or proof of graduation", required: true },
      { type: "Two references", required: true },
      { type: "Work experience details", required: true },
      { type: "Three eligible UK course choices", required: true },
    ],
    status: "published",
  },
  {
    title: "Brunei Darussalam Government Scholarship",
    provider: "Ministry of Foreign Affairs of Brunei Darussalam",
    country: "Brunei Darussalam",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Brunei higher education institutions · BDGS",
      "Brunei Darussalam",
      "Bandar Seri Begawan",
      "https://www.mfa.gov.bn/pages/scholarship.aspx",
    ),
    description:
      "A government scholarship for foreign students at participating Brunei institutions. The catalogue keeps the latest published cycle as closed until the Ministry posts a new call.",
    fundingType: "Tuition + stipend + accommodation",
    deadline: "2026-02-15",
    applicationUrl: "https://www.mfa.gov.bn/pages/scholarship.aspx",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD"],
      eligibleFields: ["Programmes listed in the current BDGS call"],
    },
    requiredDocuments: [
      { type: "Passport and birth certificate", required: true },
      { type: "Certified academic certificates and transcripts", required: true },
      { type: "Certified English translations", required: false },
      { type: "Statement of purpose", required: true },
      { type: "Security vetting documents", required: true },
    ],
    status: "closed",
  },
  {
    title: "Malaysia International Scholarship (MIS)",
    provider: "Malaysia Ministry of Higher Education",
    country: "Malaysia",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Eligible Malaysian universities · MIS",
      "Malaysia",
      "Multiple cities",
      "https://biasiswa.mohe.gov.my/INTER/index.php",
    ),
    description:
      "A Malaysian government award for international postgraduate study. The official portal confirms the 2026/27 cycle is closed; the next call and its dates must be checked before publishing a new cycle.",
    fundingType: "Tuition + monthly allowance",
    deadline: "2027-04-03",
    applicationUrl: "https://biasiswa.mohe.gov.my/INTER/index.php",
    eligibility: {
      eligibleDegrees: ["Master", "PhD"],
      eligibleFields: ["Priority areas listed by the Ministry"],
      minGPA: 3.5,
      maxAge: 45,
    },
    requiredDocuments: [
      { type: "Passport", required: true },
      { type: "Academic transcript", required: true },
      { type: "English proficiency evidence", required: true },
      { type: "Two recommendation letters", required: true },
      { type: "CV and research proposal where applicable", required: false },
    ],
    status: "draft",
  },
  {
    title: "Romanian Government Scholarship",
    provider: "Romanian Ministry of Foreign Affairs",
    country: "Romania",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Romanian universities · MFA scholarship placements",
      "Romania",
      "Multiple cities",
      "https://scholarships.studyinromania.gov.ro/",
    ),
    description:
      "A scholarship for non-EU applicants. Bachelor and master's studies are generally in Romanian with a preparatory year; medicine, dental medicine and pharmacy are excluded by the official programme information.",
    fundingType: "Tuition + stipend + accommodation",
    deadline: "2026-03-31",
    applicationUrl: "https://scholarships.studyinromania.gov.ro/scholarship-about",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD"],
      eligibleFields: ["Fields listed by the Romanian call; medicine excluded"],
    },
    requiredDocuments: [
      { type: "Diploma and academic transcripts", required: true },
      { type: "Birth certificate", required: true },
      { type: "Passport or identity document", required: true },
      { type: "CV", required: true },
      { type: "PhD study-intent and supervisor documents", required: false },
    ],
    status: "closed",
  },
  {
    title: "ARICE Romanian Scholarships",
    provider: "Romanian Agency for Investments and Foreign Trade (ARICE)",
    country: "Romania",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Romanian universities · ARICE placements",
      "Romania",
      "Multiple cities",
      "https://arice.gov.ro/1/burse-2026/",
    ),
    description:
      "Romanian government scholarships administered through ARICE for international candidates. The award level, available places and deadline follow the official annual ARICE announcement; the catalogue keeps the next unannounced cycle in draft.",
    fundingType: "Tuition + monthly scholarship",
    deadline: "2027-04-01",
    applicationUrl: "https://arice.gov.ro/1/burse-2026/",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD"],
      eligibleFields: ["Fields and places listed in the annual ARICE call"],
    },
    requiredDocuments: [
      { type: "ARICE application form", required: true },
      { type: "Diplomas and transcripts", required: true },
      { type: "Passport or identity document", required: true },
      { type: "CV and recommendation", required: true },
      { type: "Medical certificate", required: true },
    ],
    status: "draft",
  },
  {
    title: "MEXT Undergraduate Scholarship",
    provider: "Japan Ministry of Education, Culture, Sports, Science and Technology",
    country: "Japan",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Japanese universities · MEXT embassy recommendation",
      "Japan",
      "Multiple cities",
      "https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/",
    ),
    description:
      "The MEXT undergraduate route is applied for through the Japanese embassy or consulate in the applicant's country. The embassy sets the local schedule and applicants must follow the current official guideline.",
    fundingType: "Tuition + monthly stipend",
    deadline: "2027-05-31",
    applicationUrl: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-undergraduate.html",
    eligibility: {
      eligibleDegrees: ["Bachelor"],
      eligibleFields: ["Fields permitted by the current MEXT guideline"],
    },
    requiredDocuments: [
      { type: "MEXT application form", required: true },
      { type: "Academic transcripts and graduation certificate", required: true },
      { type: "Health certificate", required: true },
      { type: "Recommendation letter", required: true },
      { type: "Passport or identity document", required: true },
    ],
    status: "draft",
  },
  {
    title: "Türkiye Scholarships",
    provider: "Presidency for Turks Abroad and Related Communities",
    country: "Türkiye",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Turkish universities · Türkiye Scholarships placement",
      "Türkiye",
      "Multiple cities",
      "https://www.turkiyeburslari.gov.tr/",
    ),
    description:
      "A government scholarship with university placement, tuition, accommodation, health insurance and a flight benefit. The official calendar runs annually from 10 January to 20 February; the catalogue uses 20 February 2027 for the next expected window.",
    fundingType: "Fully funded",
    deadline: "2027-02-20",
    applicationUrl: "https://www.turkiyeburslari.gov.tr/applysteps",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD", "Research"],
      eligibleFields: ["Multiple fields; programme-specific criteria apply"],
    },
    requiredDocuments: [
      { type: "Identity document or passport", required: true },
      { type: "Recent photo", required: true },
      { type: "Diploma or graduation certificate", required: true },
      { type: "Academic transcript", required: true },
      { type: "Language or international exam result if required", required: false },
    ],
    status: "published",
  },
  {
    title: "Chinese Government Scholarship (CSC)",
    provider: "China Scholarship Council",
    country: "China",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Chinese universities · CSC partner institutions",
      "China",
      "Multiple cities",
      "https://www.campuschina.org/",
    ),
    description:
      "Chinese Government Scholarship applications use the official Campus China/CSC route or a designated embassy or university channel. Deadlines vary by route and host institution, so the next call remains a draft until announced.",
    fundingType: "Tuition + accommodation + stipend",
    deadline: "2027-03-31",
    applicationUrl: "https://www.campuschina.org/",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD", "Chinese language"],
      eligibleFields: ["Fields offered by the selected host institution"],
    },
    requiredDocuments: [
      { type: "Passport", required: true },
      { type: "Diploma and academic transcript", required: true },
      { type: "Foreigner physical examination form", required: true },
      { type: "Language certificate where required", required: false },
      { type: "Pre-admission or acceptance document where required", required: false },
    ],
    status: "draft",
  },
  {
    title: "Heydar Aliyev International Education Grant",
    provider: "Study in Azerbaijan · Government of Azerbaijan",
    country: "Azerbaijan",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Azerbaijani universities · Heydar Aliyev programme",
      "Azerbaijan",
      "Multiple cities",
      "https://studyinazerbaijan.edu.az/financial-support",
    ),
    description:
      "Azerbaijan's international education grant for eligible countries and study levels. The official 2026/27 call listed a first-stage deadline of 15 April 2026 and requires document, health and language evidence according to the call.",
    fundingType: "Tuition + 800 AZN monthly stipend + housing + travel",
    amount: 800,
    currency: "AZN",
    deadline: "2026-04-15",
    applicationUrl: "https://studyinazerbaijan.edu.az/financial-support",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD", "General medicine", "Medical residency"],
      eligibleFields: ["Fields offered by participating Azerbaijani institutions"],
    },
    requiredDocuments: [
      { type: "Passport", required: true },
      { type: "Diplomas and academic transcripts", required: true },
      { type: "Medical certificate including required tests", required: true },
      { type: "CV and motivation letter", required: true },
      { type: "Language certificate where required", required: false },
    ],
    status: "closed",
  },
  {
    title: "Transilvania Academica Scholarship",
    provider: "Transilvania University of Brașov",
    country: "Romania",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Transilvania University of Brașov",
      "Romania",
      "Brașov",
      "https://www.unitbv.ro/en/354-international/international-programs/2510-transilvania-academica-scolarship.html",
    ),
    description:
      "A university scholarship for exceptional non-EU/EEA applicants at Bachelor, Master and Doctoral level. The official university page is the source for the next call and application dates.",
    fundingType: "Tuition + stipend + accommodation",
    deadline: "2027-04-10",
    applicationUrl: "https://www.unitbv.ro/en/354-international/international-programs/2510-transilvania-academica-scolarship.html",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD"],
      eligibleFields: ["Programmes available at Transilvania University"],
    },
    requiredDocuments: [
      { type: "Academic diploma and transcript", required: true },
      { type: "Passport", required: true },
      { type: "CV", required: true },
      { type: "Motivation letter", required: true },
    ],
    status: "draft",
  },
  {
    title: "Kazakhstan Government Scholarship for Foreign Students",
    provider: "Kazakhstan Ministry of Science and Higher Education",
    country: "Kazakhstan",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Kazakhstan higher education institutions · government scholarship",
      "Kazakhstan",
      "Multiple cities",
      "https://www.bolashak.gov.kz/en/scholarship-program",
    ),
    description:
      "A government scholarship route for foreign students applying to Kazakhstani higher and postgraduate institutions through the official Study in Kazakhstan system. The official 2026 window ran from 30 March to 31 May.",
    fundingType: "Tuition + monthly stipend",
    deadline: "2027-05-31",
    applicationUrl: "https://studyin.kz/admission",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD"],
      eligibleFields: ["Programmes offered by participating institutions"],
    },
    requiredDocuments: [
      { type: "Passport", required: true },
      { type: "Diploma and academic transcript", required: true },
      { type: "Medical certificate", required: true },
      { type: "Motivation letter", required: true },
      { type: "Language evidence where required", required: false },
    ],
    status: "draft",
  },
  {
    title: "Stipendium Hungaricum",
    provider: "Hungarian Government",
    country: "Hungary",
    category: "Multi-disciplinary",
    university: scopeUniversity(
      "Hungarian universities · Stipendium Hungaricum",
      "Hungary",
      "Multiple cities",
      "https://stipendiumhungaricum.hu/",
    ),
    description:
      "Hungary's government scholarship programme covering tuition and student support at participating institutions. Applicants apply through the official programme route and their sending partner; the 2026/27 call closed on 15 January 2026.",
    fundingType: "Tuition + stipend + accommodation support",
    deadline: "2026-01-15",
    applicationUrl: "https://stipendiumhungaricum.hu/apply/",
    eligibility: {
      eligibleDegrees: ["Bachelor", "Master", "PhD", "One-tier master"],
      eligibleFields: ["Study fields available in the current call"],
    },
    requiredDocuments: [
      { type: "Passport or identity document", required: true },
      { type: "Diploma and academic transcript", required: true },
      { type: "Motivation letter", required: true },
      { type: "Language certificate where required", required: false },
      { type: "Medical certificate and nomination", required: false },
    ],
    status: "closed",
  },
];

const upsertCategory = async (name, description) =>
  Category.findOneAndUpdate(
    { name },
    { $set: { name, description } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

const upsertCountry = async (name, code) =>
  Country.findOneAndUpdate(
    { code },
    { $set: { name, code } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

const upsertUniversity = async (university) =>
  University.findOneAndUpdate(
    {
      name: university.name,
      country: university.country,
      city: university.city,
    },
    { $set: university },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

const run = async () => {
  if (!process.env.MONGODBURL) {
    throw new Error("MONGODBURL is not configured");
  }

  await mongoose.connect(process.env.MONGODBURL);

  const categoryMap = new Map();
  for (const [name, description] of categories) {
    categoryMap.set(name, await upsertCategory(name, description));
  }

  const countryMap = new Map();
  for (const [name, code] of countries) {
    countryMap.set(name, await upsertCountry(name, code));
  }

  let changed = 0;
  for (const seed of scholarships) {
    const category = categoryMap.get(seed.category);
    const country = countryMap.get(seed.country);
    const university = await upsertUniversity(seed.university);

    const payload = {
      ...seed,
      category: category._id,
      country: country._id,
      university: university._id,
    };
    delete payload.universityName;

    await Scholarship.findOneAndUpdate(
      { title: seed.title },
      { $set: payload },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
    );
    changed += 1;
  }

  console.log(`Scholarship catalogue seeded: ${changed} records updated.`);
  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error("Scholarship seed failed:", error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exitCode = 1;
});
