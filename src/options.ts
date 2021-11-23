export const VehicleOptions = {
  Condition: ['New', 'Used'],
  LeasedOrPurchased: ['Purchased', 'Leased', 'Financed'],
  PrimaryUse: [
    {
      label: 'Pleasure',
      value: 'Pleasure',
    },
    {
      label: 'Business',
      value: 'Business',
    },
    {
      label: 'Work',
      value: 'Commute',
    },
  ],
  AnnualMileage: ['Verified', 'Unverified'],
  GaragingZip: ['No', 'Yes'],
  PropertyDamage: [
    'None',
    '5000',
    '10000',
    '25000',
    '50000',
    '100000',
    '150000',
    '200000',
    '250000',
  ],
}

export const DriverOptions = {
  Gender: [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ],
  MaritalStatus: ['Single', 'Married'],
  DriverTypeCd: [
    {
      label: 'Excluded',
      value: 'Excluded',
    },
    {
      label: 'Underage',
      value: 'UnderAged',
    },
    {
      label: 'Non-operator',
      value: 'NonOperator',
    },
  ],
  Occupation: [
    {
      label: 'Public Employee',
      value: 'Civil Servant',
    },
    {
      label: 'Public Employee - Firefighter',
      value: 'Firefighter',
    },
    {
      label: 'Public Employee - Educator',
      value: 'Educator',
    },
    {
      label: 'Public Employee - Law Enforcement',
      value: 'Law Enforcement',
    },
    {
      label: 'Affinity Group',
      value: 'Affinity Group',
    },
    {
      label: 'Non Public Employee',
      value: 'Non-Civil Servant',
    },
  ],
  DriverStatus: [
    {
      value: 'Primary',
      label: 'Principal',
    },
    {
      value: 'Occasional',
      label: 'Occasional',
    },
    {
      value: 'Away At School',
      label: 'Away At School (100+ miles)',
    },
  ],
  LicenseState: [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DC', label: 'D.C.' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
    { value: 'AE', label: 'AE' },
    { value: 'AP', label: 'AP' },
    { value: 'AA', label: 'AA' },
    { value: '99', label: 'Foreign Address' },
  ],
}

export const PaymentOptions = {
  PaymentFrequency: {
    full: 'full',
    monthly: 'monthly',
  },
  PaymentMethod: {
    bankWithdrawal: 'Bank Withdrawal',
    creditCard: 'Credit Card',
  },
}

export const CarCoverageOptions = {
  BodilyInjury: [
    '15000/30000',
    '25000/50000',
    '50000/100000',
    '100000/300000',
    '300000/300000',
    '250000/500000',
    '500000/500000',
  ],
  PropertyDamage: [
    { label: 'None', value: '0' },
    { label: '5000', value: '5000' },
    { label: '10000', value: '10000' },
    { label: '25000', value: '25000' },
    { label: '100000', value: '100000' },
    { label: '150000', value: '150000' },
    { label: '200000', value: '200000' },
    { label: '250000', value: '250000' },
  ],
  UninsuredMotorist: [
    { label: 'None', value: '0' },
    { label: '15000/30000', value: '15000/30000' },
    { label: '25000/50000', value: '25000/50000' },
    { label: '50000/100000', value: '50000/100000' },
    { label: '100000/300000', value: '100000/300000' },
    { label: '300000/300000', value: '300000/300000' },
    { label: '250000/500000', value: '250000/500000' },
    { label: '500000/500000', value: '500000/500000' },
  ],
  MedicalPayments: [
    { label: 'None', value: '0' },
    { label: '1000', value: '1000' },
    { label: '2000', value: '2000' },
    { label: '5000', value: '5000' },
  ],
  Comprehensive: [
    {
      value: 'None',
      label: 'No Coverage',
    },
    {
      value: '100',
      label: '100',
    },
    {
      value: '250',
      label: '250',
    },
    {
      value: '500',
      label: '500',
    },
    {
      value: '1000',
      label: '1000',
    },
    {
      value: '1500',
      label: '1500',
    },
    {
      value: '2500',
      label: '2500',
    },
  ],
  CollisionDeductible: [
    {
      value: 'None',
      label: 'No Coverage',
    },
    {
      value: '100',
      label: '100',
    },
    {
      value: '200',
      label: '200',
    },
    {
      value: '300',
      label: '300',
    },
    {
      value: '500',
      label: '500',
    },
    {
      value: '1000',
      label: '1000',
    },
    {
      value: '1500',
      label: '1500',
    },
    {
      value: '2500',
      label: '2500',
    },
  ],
  DailyRentalCarLimit: [
    {
      value: 'None',
      label: 'None',
    },
    {
      value: '25/400',
      label: '25/day - 400 max',
    },
    {
      value: '35/900',
      label: '35/day - 900 max',
    },
    {
      value: '50/1500',
      label: '50/day - 1500 max',
    },
    {
      value: '75/2100',
      label: '75/day - 2100 max',
    },
  ],
  MedicalPartsAndAccessibility: [
    {
      value: 'None',
      label: 'None',
    },
    {
      value: '500',
      label: '500',
    },
    {
      value: '1000',
      label: '1000',
    },
    {
      value: '1500',
      label: '1500',
    },
    {
      value: '2000',
      label: '2000',
    },
    {
      value: '2500',
      label: '2500',
    },
    {
      value: '3000',
      label: '3000',
    },
    {
      value: '3500',
      label: '3500',
    },
    {
      value: '4000',
      label: '4000',
    },
    {
      value: '4500',
      label: '4500',
    },
    {
      value: '5000',
      label: '5000',
    },
  ],
}
