export function capitalize(string: string) {
  if (!string) return string
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function uppercase(string: string) {
  if (!string) return string
  return string.toUpperCase()
}

export function lowercase(string: string) {
  if (!string) return string
  return string.toLowerCase()
}

export function isValidMail(value: string) {
  if (!value) return false
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(value)
}

export function limitChar(text: string, limit: number, reductor: string = "") {
  if (text.length > limit) {
    text = text.substring(0, limit)
    text += reductor
  }

  return text
}

export function ellipsis(str: string, limit: number = 5) {
  return str.length > limit ? `${str.substring(0, limit)}...` : str
}
