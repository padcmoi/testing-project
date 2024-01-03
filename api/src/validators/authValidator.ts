import { body } from "express-validator"
import { apiStore } from "../db"

const strongPassword = { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 }

export const authValidator = {
  validators: {
    email: body("email")
      .isEmail()
      .withMessage((_, meta) => "email invalide")
      .custom(async (email: string | undefined, meta) => {
        const user = (await apiStore.prepare("SELECT userId FROM Users WHERE email = ?").get(email ?? "")) as { userId: string }[] | null
        if (user) throw new Error("Cet email est utilisé")
      }),
    password: body("password")
      .isStrongPassword(strongPassword)
      .withMessage((_, meta) => "Mot de passe non sécurisé, trop faible"),
  },
  sanitize: {
    me(keys: string[]) {
      const allowedKeys: string[] = ["email"]
      const filteredKeys: string[] = []

      for (const key of keys) {
        if (!allowedKeys.includes(key)) continue
        filteredKeys.push(key)
      }

      // eslint-disable-next-line quotes
      return body(filteredKeys).trim().blacklist(`<>&\`/\\"`)
    },
  },
}
