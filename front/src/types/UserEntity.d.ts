export interface UserEntity {
  identifier: string
  loggedIn: boolean
}

export interface UserEntityResponse {
  success: boolean
  user: Omit<UserEntity, "loggedIn"> | null
}
