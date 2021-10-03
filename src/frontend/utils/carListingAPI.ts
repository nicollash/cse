export const getMakeList = (year: string) => {
  return fetch(`/api/vehicle/make-list?year=${year}`).then((res) => res.json());
};

export const getModelList = (year: string, make: string) => {
  return fetch(`/api/vehicle/model-list?year=${year}&make=${make}`).then((res) =>
    res.json()
  );
};
