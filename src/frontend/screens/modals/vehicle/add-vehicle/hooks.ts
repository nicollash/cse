import { useEffect, useState } from 'react'
import { getMakeList, getModelList } from '~/frontend/utils'

export const useYearList = () => {
  const [value, setValue] = useState<Array<string>>([])

  useEffect(() => {
    const year = new Date().getFullYear() + 1
    const years = []
    for (let i = 1967; i <= year; i++) {
      years.push(i)
    }
    setValue(years)
  }, [])

  return value
}

export const useMakeList = (year: string) => {
  const [value, setValue] = useState<Array<{ label: string; value: string }>>([])

  useEffect(() => {
    if (year) {
      getMakeList(year)
        .then((res) =>
          res.sort((a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0)),
        )
        .then(setValue)
    }
  }, [year])

  return value
}

export const useModelList = (year: string, make: string) => {
  const [value, setValue] = useState<Array<{ label: string; value: string }>>([])

  useEffect(() => {
    if (year && make) {
      getModelList(year, make)
        .then((res) =>
          res.sort((a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0)),
        )
        .then(setValue)
    }
  }, [year, make])

  return value
}
