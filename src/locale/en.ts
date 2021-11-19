export default {
  MainTitle: 'CSE QuickQuote',
  Header: {
    Support: 'Support',
    LiveChat: 'Live Chat',
    SearchPlaceholder: 'Enter name or quote number',
    Logout: 'Logout',
  },
  Menu: {
    Home: 'Home',
    Quotes: 'Quotes',
  },
  Common: {
    Yes: 'Yes',
    No: 'No',
    Ok: 'Ok',
    Save: 'Save',
    Update: 'Update',
    Close: 'Close',
    Cancel: 'Cancel',
    Car: 'Auto',
    Home: 'Home',
    VIN: 'VIN',
    OdometerReading: 'Odometer reading',
    PayMonthly: 'Pay monthly',
    PayInFull: 'Pay in full',
    Coverage: 'Coverage',
    ContinueToReview: 'Continue To Review',
    ContinueToCheckout: 'Continue to Checkout',
    CustomizePlan: 'Customize Plan',
    EffectiveDate: 'Effective Date',
    TotalPremium: 'Total Premium',
    MonthlyAverage: 'Monthly average',
    Details: 'Details',
    Plan: 'Plan',
    EmailAddress: 'Email address',
    Agent: 'Agent',
    Phone: 'Phone',
    Email: 'Email',
    Policy: 'Policy',
    Cars: 'Vehicles',
    Drivers: 'Drivers',
    ReviewItems: 'Review Items',
    RequiredItems: 'Required Items',
    FirstName: 'First Name',
    LastName: 'Last Name',
    Auto: 'Auto',
    UniqueSettingApplied: 'Unique setting applied',
    CookieConsentMessage: 'This website uses cookies to improve user experience. By using our website you consent to all cookies in accordance with our Cookie Policy.',
    CookieConsentBotton: 'ACCEPT ALL',
    Errors: {
      RequiredFirstName: 'First Name is required',
      RequiredLastName: 'Last Name is required',
      RequiredAddress: 'Address is required',
      RequiredUnitNumber: 'Unit Number is required',
      InvalidAddress: 'The address is not correct, please enter a valid address',
      InvalidUnitNumber:
        'The Unit Number is not correct, please enter a valid unit number',
      InvalidEmailAddress:
        'The email address is not correct, please enter a valid email address',
      InvalidPhoneNumber:
        'The phone number is not correct, please enter a valid phone number',
      RequireEmailAddress: 'Email is required',
      RequirePhoneNumber: 'Phone number is required',
      NoneAvailable: 'None Available',
    },
  },
  CommonErrors: {},
  Login: {
    Heading: 'Login',
    UserName: 'Username',
    Password: 'Password',
    HaveQuestions: 'Have Questions?',
    WeAreHereToHelp: 'We are here to help',
    Login: 'Login',
    Errors: {
      RequiredUserName: 'User Name is required',
      RequiredPassword: 'Password is required',
      MinLengthPassword: 'Password must be at least 8 characters',
    },
  },
  Main: {
    Title: 'Main',
    Heading: 'Smarter Insurance',
    GetQuote: 'Get Quote',
    AddressPlaceholder: 'Address, City, State or Zip Code',
  },
  QuoteError: {
    Title: "We couldn't find you",
    Heading: "We weren't able to locate your information based on that address.",
    SubHeading:
      "Please use your current or previous address and we'll give it another try",
    AddressPlaceholder: 'Enter your current or previous address',
  },
  QuoteList: {
    Title: 'Quote List',
    Name: 'Name',
    Date: 'Date',
    EffectiveDate: 'Effective Date',
    LastUpdateDate: 'Last Update Date',
    QuoteNumber: 'Quote Number',
    StreetAddress: 'Street Address',
    Result: 'Result',
    Error: {
      QuoteNotFound: 'No quote found, displaying most recent quotes',
      NoSearchResult: 'No quote found, displaying most recent quotes',
      NoSearchResultAndNoRecentInfo: 'No quote found',
    },
  },
  Pagination: {
    Prev: 'Prev',
    Next: 'Next',
  },
  Customize: {
    Title: 'Customize',
    ChoosePolicy: 'Choose a Policy',
    ChoosePolicyDesc:
      'To provide an accurate quote, we will gather information on claims, driving experience, and credit information (if applicable in state) from sources for driver and household.',
    Add: 'Add',
    ChoosePlan: 'Choose a Plan',
    ChoosePlanDesc: [
      'Choose from 3 plans, each of them providing great coverage.',
      'The Basic Plan is based on your current insurance policy to make it easy to compare. Standard Plan, if you want a bit more coverage or Premium Plan to provide the best value.',
    ],
    AppliedDiscounts: 'Applied Discounts',
    RequiredInformation: 'Required Information',
    AssignedDriver: 'Assigned Driver',
    AdditionalPremiumCredits: 'Additional Premium & Credits'
  },
  CarModal: {
    AddCar: 'Add Car',
    EditCar: 'Edit Car',
    DeleteCar: 'Delete Car',
    Or: 'Or',
    CarVinNumber: "Car's VIN Number",
    ModelYear: 'Year',
    Make: 'Make',
    Model: 'Model',
    Condition: 'Condition',
    LeasedOrPurchased: 'Leased or purchased',
    LeasedOrPurchasedDescription: 'Is this car leased, financed or purchased?',
    PurchaseDate: 'Purchase Date',
    PurchaseDateDescription: 'Date you purchased, financed or leased this car.',
    PrimaryDriver: 'Primary Driver',
    PrimaryDriverDescription: 'Who is driving this car the majority of the time?',
    PrimaryUse: 'Primary Use',
    PrimaryUseDescription:
      'Commute (to/from work, school) , Pleasure (recreational driving only), Business/Artisan (business errands, sales calls), Farming (agriculture, ranching)',
    MilesDriven: 'Miles Driven',
    MilesDrivenDescription:
      'An estimate of the daily miles driven for the car  based on the usage selected.',
    AnnualMileage: 'Annual Mileage',
    AnnualMileageDescription:
      'An estimate of the annual miles driven for the car has been provided based on the usage selected. If this is not an accurate estimate, please enter the correct number of miles. The average is 13,000 miles.',
    EstimateAnnualMiles: 'Estimated annual miles',
    EstimateAnnualMilesDescription:
      'An estimate of the annual miles driven for the car has been provided based on the usage selected. If this is not an accurate estimate, please enter the correct number of miles. The average is 13,000 miles.',
    RecommendedMileage: (v: number) => `Verified mileage is ${v.toLocaleString()}`,
    CostNew: 'Cost New',
    CostNewDescription:
      'Cost New Amount.',
    GarazingZip: 'Garaging Zip is',
    ZipCode: 'Zipcode',
    DeleteCarConfirm: 'Are you sure that you want to delete this car?',

    Errors: {
      RequiredVinNumber: 'VIN Number is Required',
      VinNumberMaxLimitExceed: 'Max length is 17',
      RequiredModelYear: 'Model Year is Required',
      RequiredMake: 'Make is Required',
      RequiredModel: 'Model is Required',
    },
  },
  ReviewCoverages: {
    Title: 'Review coverages',
    MobileTitle: 'Review',
    AutoPolicy: 'Auto Policy',
    DriversCovered: 'Drivers Covered',
    TotalTermPrice: 'Total Term Price',
    PolicyTermPrice: 'Policy Term Price',
    Limits: 'Limits',
    BodilyInjury: 'Bodily Injury Per Person/Accident',
    UninsuredMotorist: 'Uninsured Motorist Per Person/Accident',
    UninsuredMotoristPropertyDamage: 'Uninsured Motorist Property Damage',
    MedicalPayments: 'Medical Payments per Person',
    PropertyDamage: 'Property Damage',
    CarsCovered: 'Cars covered',
    UWQuestionsTitle: 'Vehicle-level Eligibility',
    ShareThisQuote: 'Share This Quote',
    ShareQuoteDescription: 'The quote details will be sent to this email address',
    ShareQuote: 'Share quote',

    AgentInformation: 'Agent information',
  },
  DriverModal: {
    AddDriver: 'Add Driver',
    EditDriver: 'Edit Driver',
    DeleteDriver: 'Delete Driver',
    DeleteDriverConfirm: 'Are you sure that you want to delete this Driver?',

    FirstName: 'First Name',
    LastName: 'Last Name',
    BirthDate: 'Birth Date',
    Gender: 'Gender',
    MaritalStatus: 'Marital Status',
    Occupation: 'Occupation',
    LicenseState: 'License State',
    LicenseNumber: 'License Number',
    AgeFirstLicensed: 'Age First Licensed',
    NonDriverType: 'Non-Driver Type',
    Errors: {
      RequiredFirstName: 'First Name is required',
      RequiredLastName: 'Last Name is required',
      RequiredBirthDate: 'Birth Date is required',
      RequiredLicenseState: 'License State is required',
      RequiredLicenseNumber: 'License Number is required',
      RequiredOccupation: 'Occupation is required',
      RequiredNonDriverType: 'Non-Driver Type is required',
    },
  },
  RequiredInformation: {
    Heading: 'Required Information',
    ReadingDate: 'Reading date',
  },
  Coverage: {
    CustomCoverage: 'Custom Coverage',
    CarPolicy: 'Car policy',
    Liability: 'Liability',
    UninsuredMotoristBodilyInjury: 'Uninsured motorist bodily injury',
    MedicalPayments: 'Medical payments',
    PropertyDamage: 'Property damage',
    UM_PD_WCD_Applies: 'UM-PD / WCD Applies',
    UM_PD_WCD_AppliesDesc: 'Uninsured Property Damage/Waive Liability',
    BodilyInjuryLimitPerPerson: 'Bodily injury limit per person',
    BodilyInjuryLimitPerAccident: 'Bodily injury limit per accident',
    UninsuredMotoristPerPerson: 'Uninsured motorist per person',
    UninsuredMotoristPerAccident: 'Uninsured motorist per accident',
    CarCoverage: 'Car coverage',
    Comprehensive: 'Comprehensive',
    CollisionDeductible: 'Collision deductible',
    DailyRentalCarLimit: 'Daily Rental Car Limit',
    MedicalPartsAndAccessibility: 'Medical parts and accessibility',
    RoadsideAssistance: 'Roadside Assistance',
    FullGlass: 'Full glass',
    LoanLeaseGap: 'Loan Lease Gap',
    OriginalReplacementCost: 'Original replacement cost',
    WaiveLiability: 'Waive liability',
    BodilyInjury: 'Bodily Injury',
    UninsuredMotorist: 'Uninsured motorist',
    Deductible: 'Deductible',
    ApplyToAllCars: 'Apply to all cars',
    ApplyToIndividualCars: 'Apply to individual cars',
  },
  ErrorModal: {
    Oops: 'Oops..!',
    SomethingWentWrong: 'Something went wrong...',
    GoHome: 'Go Home',
    VisitSPINN: 'Please visit SPInn to continue quoting'
  },
  Checkout: {
    Title: 'Checkout',
    BillingInformation: 'Billing Information',
    FirstName: 'First Name',
    LastName: 'Last Name',
    MailingAddress: 'Mailing Address',
    CommunicationInformation: 'Communication Information',
    Confirmation: (agentName, agency) =>
      `I ${agentName} from ${agency} confirm ... blah blah blah`,
    PaymentInformation: 'Payment Information',
    PaymentFrequency: 'Payment Frequency',
    PaymentMethod: 'Payment Method',
    AddPaymentMethod: 'Add Payment Method',
    PayAndIssuePolicy: 'Pay And Issue Policy',
    Today: 'Today',
    And: 'and',
    Save: 'save',
    Convenient: 'Convenient',
    MonthlyDescription: (remainedPayments, price, total) =>
      `+${remainedPayments} payments of $${price} for a total of $${total}`,
    InstallmentFee: (price) => `Includes a $${price} installment fee per payment`,
    FullPay: 'Full pay',
    Monthly: 'Monthly',
    BankWithdrawal: 'Bank Withdrawal',
    CreditCard: 'Credit Card',
    NeedConfirm: 'Please check this checkbox',

    Congratulations: 'Congratulations',
    PolicyIssued: 'Your policy has been issued. Your policy number is:',
    IssueFollowup:
      'You will receive your policy documents to your email account that you will need to sign using Docusign. Welcome to CSE!',
  },
  PriorIncidents: {
    Heading: 'Prior incidents',
    Description:
      'We have received notification that there are some prior incidents that have affected the rate. Please review the review page and then continue if you would like to purchase the policy.',
  },
  DiscountsModal: {
    Errors: {
      RequiredRelatedPolicyNumber: 'Policy Number is required',
      RequiredRelatedPolicyNumber2: 'Policy Number is required',
      RequiredAffinityGroupCd: 'Affinity Group is required'
    }
  },
  UserInfoModal: {
    title: 'Communication Information'
  },
  AIModal: {
    Errors: {
      RequiredCountry: 'Country is required',
      RequiredCity: 'City is required',
      RequiredZip: 'Zip code is required',
      RequiredPostalCode: 'Postal Code is required',
      ZipFormat: 'Must match nnnnn or nnnnn-nnnn',
      StateRequired: 'State is required',
      AddressRequired: 'Address is required',
      AddressLine2Required: 'Address Line2 is required',
      NameRequired: 'Name is required',
      TrustRequired: 'Trust/ee is required',
      LegalLanguageRequired: 'Legal Language is required',
      InterestTypeRequired: 'Interest Type is required'
    },
    Title: 'Additional Interest',
    AddNewSection: {
      NameLabel: 'Name',
      TrustLabel: 'Trust/ee',
      LoanLabel: 'Loan Number',
      LegalLanguageLabel: 'Legal Language',
      InterestType: 'Interest Type',
      Address: {
        Label: 'Address',
        AddressPlaceholder: 'Address',
        Address2Placeholder: 'Address Line 2',
        CityPlaceholder: 'City',
        StateProvCdPlaceholder: 'State',
        ZipPlaceholder: 'Zip',
        PostalCodePlaceholder: 'Postal Code',
      },
      HasAnInterestInLabel: 'Has an interest in:',
      AddItem: 'Add Item'
    }
  },
  LossHistoryModal: {
    Errors: {
      LossDt: 'Loss Date is required',
      LossCauseCd: 'Cause of Loss is required',
      DriverName: 'Driver Name is required',
      AtFaultCd: 'At Fault is required',
    },
    Title: 'Loss History',
    AddNewSection: {
      LossDate: 'Loss Date',
      CauseOfLoss: 'Cause of Loss',
      ClaimNumber: 'Claim Number',
      ClaimStatus: 'Claim Status',
      CatastropheN: 'Catastrophe #',
      CarrierName: 'Carrier Name',
      PolicyType: 'Policy Type',
      PolicyNumber: 'Policy Number',
      LossAmount: 'Loss Amount',
      PaidAmount: 'Paid Amount',
      VehicleVIN: 'Vehicle VIN',
      LicenseState: 'License State',
      AtFault: 'At Fault',
      DriverName: 'Driver Name',
      LicenseNumber: 'License Number',
      Comments: 'Comments',
      LossDescription: 'Loss Description',
      Save: 'Save',
      AddItem: 'Add Item'
    }
  }
}
