/**
 * Single source of truth for all compliance-page copy that contains
 * business-specific details. Fill in the values here and every compliance
 * page updates automatically. Leave a field as the placeholder string until
 * the information is confirmed — the placeholder makes it easy to grep for
 * unfilled entries before launch.
 */
export const COMPLIANCE = {
  businessName: "[BUSINESS NAME]",
  businessAddress: "[BUSINESS ADDRESS]",
  city: "[CITY]",
  state: "[STATE]",
  zip: "[ZIP]",
  country: "United States",
  jurisdiction: "[STATE/JURISDICTION]",

  privacyEmail: "[PRIVACY EMAIL]",
  supportEmail: "[SUPPORT EMAIL]",
  dmcaEmail: "[DMCA EMAIL ADDRESS]",
  complianceEmail: "[COMPLIANCE EMAIL]",

  domain: "[DOMAIN]",
  legalEntityName: "[LEGAL ENTITY NAME]",

  custodianOfRecords: {
    name: "[FULL LEGAL NAME OF CUSTODIAN]",
    address: "[BUSINESS ADDRESS — STREET]",
    city: "[CITY]",
    state: "[STATE]",
    zip: "[ZIP]",
    country: "United States",
  },

  dmcaAgent: {
    name: "[DESIGNATED AGENT NAME]",
    address: "[BUSINESS ADDRESS]",
    email: "[DMCA EMAIL ADDRESS]",
  },

  lastUpdated: "[DATE]",
  effectiveDate: "[DATE]",
} as const;
