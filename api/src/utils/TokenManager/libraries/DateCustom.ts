/**
 * To add new methods to initial Date constructor
 */
class DateCustom extends Date {
  protected _date: Date
  protected _divider: number

  constructor(value: string | number | Date = Date.now()) {
    super()
    this._date = new Date(value)
    this._divider = 0
  }

  /**
   * divise the final sum
   * IE:
   * console.log(new DateCustom().changeHours(+7)) // 1704930924359
   * console.log(new DateCustom().divider(1000).changeHours(+7)) //  1704930924
   */
  divider(divider: number) {
    this._divider = divider
    return this
  }

  /**  convert to MySQL date */
  static toMysqlDate(value: string | number | Date = Date.now()) {
    return new Date(value).toISOString().slice(0, 19).replace("T", " ")
  }

  /** increase or decrease the months and returns a timestamp */
  changeMonths(months: number) {
    const value = this._date.setMonth(this._date.getMonth() + months)
    if (this._divider > 0) return parseInt(`${value / this._divider}`)
    else return value
  }

  /** increase or decrease the days and returns a timestamp */
  changeDays(days: number) {
    const value = this._date.setDate(this._date.getDate() + days)
    if (this._divider > 0) return parseInt(`${value / this._divider}`)
    else return value
  }

  /** increase or decrease the hours and returns a timestamp */
  changeHours(hours: number) {
    const value = this._date.setHours(this._date.getHours() + hours)
    if (this._divider > 0) return parseInt(`${value / this._divider}`)
    else return value
  }

  /** increase or decrease the minutes and returns a timestamp */
  changeMinutes(minutes: number) {
    const value = this._date.setMinutes(this._date.getMinutes() + minutes)
    if (this._divider > 0) return parseInt(`${value / this._divider}`)
    else return value
  }

  /** increase or decrease the seconds and returns a timestamp */
  changeSeconds(seconds: number) {
    const value = this._date.setSeconds(this._date.getSeconds() + seconds)
    if (this._divider > 0) return parseInt(`${value / this._divider}`)
    else return value
  }
}

export default DateCustom
