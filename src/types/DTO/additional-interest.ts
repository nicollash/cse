import { PartyInfo } from "./party";

export type DTOAI = {
    id?: string
    SequenceNumber?: string
    InterestTypeCd?: string
    LegalLanguage?: string
    AccountNumber?: string
    InterestFormCd?: string
    InterestName?: string
    Status?: string
    PreferredDeliveryMethod?: string
    PartyInfo?: Array<PartyInfo>
    LinkReference?: Array<LinkReference>
}

export type LinkReference = {
    id?: string,
    IdRef?: string,
    ModelName?: string,
    Description?: string,
    Status?: string
}