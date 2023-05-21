import { Profile } from "@prisma/client"

export const filterUserForClient = (profile: Profile) => {
  return {
    id: profile.id,
    username: profile.username,
    rating: Number(profile.rating),
    vehicleModel: profile.vehicleModel,
    isOwner: profile.isOwner,
    licensePlate: profile.licensePlate,
    phoneNumber: profile.phoneNumber,
    vehicleSize: profile.vehicleSize,
    isDriver: profile.isDriver,
    lastName: profile.lastName,
    firstName: profile.firstName,
    balance: profile.balance,
  }
}
