export const questions = {
    autoIndividuals: {
        OtherOwners: {
            desciption: 'With the exception of any encumbrances, is this vehicle in whole or in part owned by or registered to someone other than the named insured or the spouse of the named insured?',
            options: [{
                label: 'Yes',
                value: 'YES',
            }, {
                label: 'No',
                value: 'NO',
            }]
        },
        SpecialModificationsEquipment: {
            desciption: 'Does this vehicle have special modifications or equipment, or is it a specially built or customized car, van, or pickup?',
            options: [{
                label: 'Yes',
                value: 'YES',
            }, {
                label: 'No',
                value: 'NO',
            }]
        },
        ExistingDamage: {
            desciption: 'Does this vehicle have existing body or glass damage?',
            options: [{
                label: 'Yes',
                value: 'YES',
            }, {
                label: 'No',
                value: 'NO',
            }]
        }
    },
    autoP1: {
        Acknowledgement: {
            desciption: 'The answers to the questions below are true and correct to the best of my knowledge.',
            subText: 'Applicant certifies this vehicle is <10,000 lbs GVW.',
            boldDesciption: true,
            boldSubText: true,
            options: [{
                label: 'Yes',
                value: 'YES',
            }, {
                label: 'No',
                value: 'NO',
            }]
        }
    },
    autoP2: {
        cserules_isForRent: {
            desciption: 'Is any vehicle rented to others?',
            options: [{
                label: 'Yes',
                value: 'Yes',
            }, {
                label: 'No',
                value: 'No',
            }]
        },
        cserules_isResidence:
        {
            desciption: 'Is any vehicle used as a residence?',
            options: [{
                label: 'Yes',
                value: 'Yes',
            }, {
                label: 'No',
                value: 'No',
            }]
        },
        cserules_notStreetLic:
        {
            desciption: 'Is any vehicle not licensed for street usage?',
            options: [{
                label: 'Yes',
                value: 'Yes',
            }, {
                label: 'No',
                value: 'No',
            }]
        },
        cserules_physDamWithPriorLiability:
        {
            desciption: 'Is Physical Damage coverage requested on any vehicle that was previously insured with liability coverage only?',
            options: [{
                label: 'Yes',
                value: 'Yes',
            }, {
                label: 'No',
                value: 'No',
            }]
        },
        cserules_useBusiness:
        {
            desciption: 'Is any vehicle used for business purposes?',
            options: [{
                label: 'Yes',
                value: 'Yes',
            }, {
                label: 'No',
                value: 'No',
            }]
        }
    }
}




