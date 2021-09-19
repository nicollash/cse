export const convertStringToDate = (d: string | null) => {
  return d ? new Date(+d.substr(0, 4), +d.substr(4, 2) - 1, +d.substr(6, 2)) : null
}

export const convertDateToString = (d: Date | null) => {
  return d
    ? d
        .toISOString()
        .substr(0, 10)
        .split('-')
        .join('')
    : null
}

export const calculateLicenseDt = (age: number, ageFirstLicensed:number | null) => {
  //MM/dd/yyyy
  let currentDt = new Date().toLocaleDateString("en-US",{ year: 'numeric', month: '2-digit', day: '2-digit' })
  let currentYear = new Date().getFullYear()
  let adjustedYear = currentYear - (age-ageFirstLicensed)
  let licensedDt = currentDt.replace(currentYear.toString(),adjustedYear.toString())
  
  //yyyyMMdd
  let date = licensedDt.substr(6, 4) + licensedDt.substr(0, 2) + licensedDt.substr(3, 2)
  return date
    ? date
    : null
}

export const getPostalCode = (risk) => {
  const addr = risk.DTOVehicle[0].Addr.find(
    (addr) => addr.AddrTypeCd === 'VehicleGarageAddr',
  )
  return addr ? addr.PostalCode : null
}

export const getCorrectVinNumber = (vinNumber: string) => {
  return vinNumber && vinNumber.includes('&') ? '' : vinNumber
}
