import { body } from "express-validator"

export const todoValidator = {
  validators: {
    label: body("label")
      .isEmpty()
      .withMessage((_, meta) => "La todo ne peut être vide"),
  },
  sanitize: {
    me(keys: string[]) {
      const allowedKeys: string[] = ["label"]
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
