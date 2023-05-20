import { Profile } from "@prisma/client"

export const filterUserForClient = (profile: Profile) => {
  return {
    id: profile.id,
    username: profile.username,
    rating: Number(profile.rating),
  }
}
