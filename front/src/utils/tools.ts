export const daysDiffs = (date1: Date, date2: Date) => Math.floor((date2.getTime() - date1.getTime()) / (24 * 3600 * 1000))
