export const hasSameValue = (arr) =>
  arr.filter((el) => el !== arr[0]).length === 0;

export const maskDOB = (dob: Date): string => {
  try {
    if (dob) {
      return "**/**/".concat(dob.getFullYear().toString());
    }
  } catch (error) {
    console.log(error);
  }

  return "**/**/****";
};
