export const discountsConfig = {
    auto: {
        multipolicyProperty: {
            needPolicyNumber: true,
            description: 'Multi-Policy Discount - Property',
            options: [
                { label: 'No', value: 'No' },
                { label: 'HO-3', value: 'HO3' },
                { label: 'DF-3 (owner-occupied)', value: 'DF3' },
                { label: 'HO-4', value: 'HO4' },
                { label: 'HO-6', value: 'HO6' },
                { label: 'DF-6 (owner-occupied)', value: 'DF6' }
            ]
        },
        multipolicyUmbrella: {
            needPolicyNumber: true,
            description: 'Multi-Policy Discount - Umbrella',
            options: [
                { label: 'No', value: 'No' },
                { label: 'Yes', value: 'Yes' }
            ]
        },
        program: {
            needPolicyNumber: false,
            description: 'Program',
            options: [
                { label: 'Public Employee', value: 'Civil Servant' },
                { label: 'Public Employee - Firefighter', value: 'Firefighter' },
                { label: 'Public Employee - Educator', value: 'Educator' },
                { label: 'Public Employee - Law Enforcement', value: 'Law Enforcement' },
                { label: 'Affinity Group', value: 'Affinity Group' },
                { label: 'Non Public Employee', value: 'Non-Civil Servant' }
            ],
            affinityGroup: {
                description: '',
                options: [
                    { value: "BANK1", label: "Customers of Pacific Coast Bankers' Bank" },
                    { value: "ALLSC", label: "Employees of Accredited Private Schools (Both K - 12 and Colleges and Universities)" },
                    { value: "AAGCA", label: "Members of Apartment Owners Associations Located Within California" },
                    { value: "CACOC", label: "Members of Chambers of Commerce Located Within California" },
                    { value: "CACUU", label: "Members of Credit Unions Located Within California" },
                    { value: "CAPUC", label: "Employees of California Energy, Telecommunications and Water Utilities" },
                    { value: "CCSPE", label: "Members of California Society of Professional Engineers" },
                    { value: "CSEAG", label: "Members of CSE Agents Association" },
                    { value: "PAUSA", label: "Members of Pacific Association of United States Track and Field" },
                    { value: "BANDB", label: "Members of California Association of Bed and Breakfast Inns" },
                    { value: "CACCM", label: "Members of Cross Country Motor Club" }
                ]
            }
        }
    }
}


