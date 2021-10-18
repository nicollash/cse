export const logger = (...params) => {
  if (process.env.ENV === 'debug') {
    console.log(...params)
  }
}
