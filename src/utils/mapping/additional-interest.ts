import { AdditionalInterestInfo } from "~/types";
import { DTOAI } from "~/types/DTO/additional-interest";

export const parseAdditionalInterestDTOtoAI = (dtoAI: DTOAI): AdditionalInterestInfo => {
    let ai = {
        id: dtoAI.id,
        sequenceNumber: dtoAI.SequenceNumber,
        interestTypeCd: dtoAI.InterestTypeCd,
        accountNumber: dtoAI.AccountNumber,
        legalLanguage: dtoAI.LegalLanguage,
        interestFormCd: dtoAI.InterestFormCd,
        interestName: dtoAI.InterestName,
        status: dtoAI.Status,
        preferredDeliveryMethod: dtoAI.PreferredDeliveryMethod,
        partyInfo: {
            phone: dtoAI.PartyInfo[0].PhoneInfo[0].PhoneNumber,
            phoneType: dtoAI.PartyInfo[0].PhoneInfo[0].PhoneName,
            mailToName: dtoAI.PartyInfo[0].NameInfo[0].IndexName,
            addr: dtoAI.PartyInfo[0].Addr[0]
        },
        linkReference: dtoAI.LinkReference ? dtoAI.LinkReference.map((linkRef) => ({
            description: linkRef.Description,
            id: linkRef.id,
            idRef: linkRef.IdRef,
            modelName: linkRef.ModelName,
            status: linkRef.Status === 'Active' ? true : false
        })) : []
    }
  
    if (!ai.partyInfo.addr.RegionCd) {
        ai.partyInfo.addr.RegionCd = 'None'
    }    
    return ai    
}


export const parseAdditionalInterestAItoDTO = (additionalInterest: Array<AdditionalInterestInfo>): Array<DTOAI> => {
    return additionalInterest.map((aiInfo, index) => (
        {
            id: aiInfo.id,
            SequenceNumber: aiInfo.sequenceNumber,
            InterestTypeCd: aiInfo.interestTypeCd,
            LegalLanguage: aiInfo.legalLanguage,
            AccountNumber: aiInfo.accountNumber,
            InterestFormCd: aiInfo.interestTypeCd == 'Designated Person' ? 'F.34380A' : 'None',
            InterestName: aiInfo.interestName,
            Status: aiInfo.status,
            PreferredDeliveryMethod: aiInfo.preferredDeliveryMethod ? aiInfo.preferredDeliveryMethod : 'None',
            PartyInfo: [
                {
                    id: `PartyInfo-${index}`,
                    PartyTypeCd: 'AIParty',
                    Status: 'Active',
                    NameInfo: [
                        {
                            id: `NameInfo-${index}`,
                            IndexName: aiInfo.interestName,
                            NameTypeCd: 'AIName'
                        }
                    ],
                    Addr: [
                        {
                            id: `Addr-${index}`,
                            AddrTypeCd: 'AIMailingAddr',
                            Addr1: aiInfo.partyInfo.addr.Addr1,
                            Addr2: aiInfo.partyInfo.addr.Addr2,
                            PostalCode: aiInfo.partyInfo.addr.PostalCode,
                            RegionCd: aiInfo.partyInfo.addr.RegionCd === 'None' ? '' : aiInfo.partyInfo.addr.RegionCd,
                            City: aiInfo.partyInfo.addr.City,
                            StateProvCd: aiInfo.partyInfo.addr.StateProvCd
                        }
                    ],
                    EmailInfo: [
                        {
                            id: `EmailInfo-${index}`,
                            EmailTypeCd: 'AIEmail',
                            PreferredInd: 'No'
                        }
                    ]
                }
            ],
            LinkReference: aiInfo.linkReference
                .filter(linkRef => linkRef.status)
                .map((linkRef) => (
                    {
                        id: linkRef.id,
                        IdRef: linkRef.idRef,
                        ModelName: 'Risk',
                        Description: linkRef.description,
                        //Status: linkRef.status ? 'Active' : ''
                        Status: 'Active'
                    }
                ))
        }
    ))
}