import { FromSchema } from "json-schema-to-ts"
export const userSchema = {
  $id: "http://example.com/schemas/user.json",
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "integer" },
  },
  required: ["name", "age"],
  additionalProperties: false,
} as const

export const usersSchema = {
  type: "array",
  items: {
    $ref: "http://example.com/schemas/user.json",
  },
} as const

export type Users = FromSchema<
  typeof usersSchema,
  { references: [typeof userSchema] }
>
