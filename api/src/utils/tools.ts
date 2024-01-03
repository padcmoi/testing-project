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
