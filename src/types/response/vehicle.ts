import { Response } from './response'
import { DTORisk } from '../DTO'

export type MakeModelResponse = Response<{
  Option: Array<{
    Name: string
    Value: string
    id: string
  }>
}>

export type NewRiskResponse = Response<{
  DTORisk: Array<DTORisk>
}>
