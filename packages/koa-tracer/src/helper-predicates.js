export const isProduction = () => process.env.NODE_ENV === 'production'
export const isObject = (obj) => typeof obj === 'object'
export const isError = (err) => err instanceof Error

export const showErrorTrace = () => isProduction() || !!process.env.DEBUG
