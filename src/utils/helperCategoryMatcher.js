const SERVICE_RULES = [
  {
    service: 'Electrician',
    keywords: ['electrician', 'electrical', 'electric'],
  },
  {
    service: 'Plumber',
    keywords: ['plumber', 'plumbing'],
  },
  {
    service: 'Carpenter',
    keywords: ['carpenter', 'carpentry'],
  },
  {
    service: 'Painter',
    keywords: ['painter', 'painting'],
  },
  {
    service: 'Cleaning',
    keywords: ['cleaning', 'cleaner', 'housekeeping'],
  },
  {
    service: 'AC / Appliance Repair',
    keywords: [
      'ac repair',
      'ac service',
      'ac mechanic',
      'a c repair',
      'a c service',
      'appliance repair',
      'fridge repair',
      'refrigerator repair',
      'washing machine repair',
    ],
  },
  {
    service: 'Civil Contractor',
    keywords: [
      'civil contractor',
      'civil work',
      'mason',
      'mistri',
    ],
  },
  {
    service: 'Fabrication / Welding',
    keywords: [
      'fabrication',
      'fabricator',
      'welding',
      'welder',
    ],
  },
  {
    service: 'RO / Gas Stove Repair',
    keywords: [
      'ro repair',
      'ro service',
      'water purifier',
      'gas stove',
      'gas repair',
    ],
  },
  {
    service: 'TV Repair',
    keywords: ['tv repair', 'tv service', 'television repair'],
  },

  {
    service: 'Catering',
    keywords: ['catering', 'caterer', 'caterers'],
  },
  {
    service: 'Decoration',
    keywords: ['decoration', 'decorator', 'decorators'],
  },
  {
    service: 'Photography',
    keywords: [
      'photography',
      'photographer',
      'photo studio',
      'photo graphy',
    ],
  },
  {
    service: 'Mehndi / Makeup',
    keywords: [
      'mehndi',
      'mehandi',
      'makeup',
      'make up',
      'makeup artist',
    ],
  },
  {
    service: 'Sound / DJ',
    keywords: ['sound system', 'sound service', 'dj'],
  },

  {
    service: 'Doctor / Clinic',
    keywords: ['doctor', 'clinic'],
  },
  {
    service: 'Physiotherapist',
    keywords: ['physiotherapist', 'physio', 'physiotherapy'],
  },
  {
    service: 'Home Nursing',
    keywords: ['home nursing', 'nursing', 'nurse'],
  },
  {
    service: 'Ambulance',
    keywords: ['ambulance'],
  },

  {
    service: 'Car Mechanic',
    keywords: ['car mechanic', 'car garage', 'car repair'],
  },
  {
    service: 'Bike Mechanic',
    keywords: [
      'bike mechanic',
      'bike garage',
      'bike repair',
      'two wheeler repair',
    ],
  },
  {
    service: 'Tyre / Puncture',
    keywords: ['puncture', 'tyre service', 'tyre shop', 'tire shop'],
  },
  {
    service: 'Towing Service',
    keywords: ['towing', 'tow service'],
  },
  {
    service: 'Car Wash',
    keywords: ['car wash', 'car washing'],
  },

  {
    service: 'Driver',
    keywords: ['driver', 'driving service'],
  },
  {
    service: 'Tutor',
    keywords: ['tutor', 'tuition', 'teacher'],
  },
  {
    service: 'CA / Tax Consultant',
    keywords: [
      'chartered accountant',
      'tax consultant',
      'gst consultant',
      'income tax',
    ],
  },
  {
    service: 'Advocate',
    keywords: ['advocate', 'lawyer'],
  },
  {
    service: 'Computer / IT Support',
    keywords: [
      'computer repair',
      'computer service',
      'laptop repair',
      'laptop service',
      'it support',
    ],
  },
  {
    service: 'Cook',
    keywords: ['cook', 'cooking service'],
  },
  {
    service: 'Labour Contractor',
    keywords: ['labour contractor', 'labor contractor'],
  },
  {
    service: 'Laundry / Dhobi',
    keywords: ['laundry', 'dhobi', 'dry clean', 'dryclean'],
  },
  {
    service: 'Snake Rescue',
    keywords: ['snake rescue', 'snake catcher'],
  },
  {
    service: 'Tailor',
    keywords: ['tailor', 'tailoring'],
  },
]

function normalize(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[().,_/\\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function containsKeyword(name, keyword) {
  const normalizedName = ` ${normalize(name)} `
  const normalizedKeyword = normalize(keyword)

  if (!normalizedKeyword) return false

  return normalizedName.includes(` ${normalizedKeyword} `)
}

export function suggestHelperService(contactName, serviceTypes = []) {
  if (!contactName) return null

  const rules = SERVICE_RULES.flatMap((rule) =>
    rule.keywords.map((keyword) => ({
      service: rule.service,
      keyword,
    }))
  ).sort(
    (a, b) =>
      normalize(b.keyword).length - normalize(a.keyword).length
  )

  const matchedRule = rules.find((rule) =>
    containsKeyword(contactName, rule.keyword)
  )

  if (!matchedRule) return null

  const serviceType = serviceTypes.find(
    (type) =>
      normalize(type.name_en) === normalize(matchedRule.service)
  )

  if (!serviceType) return null

  return {
    categoryId: serviceType.category_id,
    serviceTypeId: serviceType.id,
    serviceTypeName: serviceType.name_en,
    keyword: matchedRule.keyword,
  }
}