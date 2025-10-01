export type InvestmentPurpose =
  | 'Retirement'
  | 'Education / College Fund'
  | 'Business Investment'
  | 'Health'
  | 'Travel / Life Experience';

export const INVESTMENT_PURPOSE_OPTIONS: InvestmentPurpose[] = [
  'Retirement',
  'Education / College Fund',
  'Business Investment',
  'Health',
  'Travel / Life Experience'
];

export type RiskTolerance =
  | 'Conservative'
  | 'Below Average'
  | 'Average'
  | 'Above Average'
  | 'High Risk';

export const RISK_TOLERANCE_OPTIONS: RiskTolerance[] = [
  'Conservative',
  'Below Average',
  'Average',
  'Above Average',
  'High Risk'
];

export type IncomeCategory =
  | '0-20000'
  | '20001-40000'
  | '40001-60000'
  | '60001-80000'
  | '80001-100000'
  | '100001-150000'
  | '150000+';

export const INCOME_CATEGORY_OPTIONS: IncomeCategory[] = [
  '0-20000',
  '20001-40000',
  '40001-60000',
  '60001-80000',
  '80001-100000',
  '100001-150000',
  '150000+'
];

export type InvestmentLength =
  | '0-5 years'
  | '5-7 years'
  | '7-10 years'
  | '10-15 years';

export const INVESTMENT_LENGTH_OPTIONS: InvestmentLength[] = [
  '0-5 years',
  '5-7 years',
  '7-10 years',
  '10-15 years'
];

export interface InvestmentPreferences {
  purpose: InvestmentPurpose;
  risk: RiskTolerance;
  income: IncomeCategory;
  length: InvestmentLength;
  roboAdvisor: boolean;
}