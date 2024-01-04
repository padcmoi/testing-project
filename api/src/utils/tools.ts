import _bcrypt from "bcrypt"
import { v5 as uuidv5 } from "uuid"

// Create UUID with V5
export const generateUUID = (id: string | number, random: boolean = true, namespace: string = "659c6952-3586-51f6-a652-515b77539136") => {
  return uuidv5(`${id}-${random ? Math.floor(Math.random() * 65535) * Math.floor(Math.random() * 65535) : ""}`, namespace)
}

const saltRounds = 10

export const bcrypt = {
  async hash(myPlaintextPassword: string) {
    const hash = await _bcrypt.hash(myPlaintextPassword, saltRounds)

    return hash
  },
  async match(myPlaintextPassword: string, hash: string) {
    const match = await _bcrypt.compare(myPlaintextPassword, hash)

    return match
  },
  matchSync(myPlaintextPassword: string, hash: string) {
    return _bcrypt.compareSync(myPlaintextPassword, hash)
  },
}

export function slugify(str: string) {
  return String(str)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // remove consecutive hyphens
}
