import { adminDb } from "@/firebase-admin"
import { User } from "@/lib/types/user.type"
import { Address } from "viem"

const USER_COLLECTION = "users"

export const createUser = async (user: User): Promise<User | null> => {
  try {
    const newUser = {
      ...user,
      registered: true,
      address: user.address.toLowerCase() as Address,
    }
    const docRef = await adminDb.collection(USER_COLLECTION).add(newUser)
    const createdUser = { ...newUser, firebaseId: docRef.id }

    return createdUser
  } catch (error) {
    console.error("Error adding user:", error)
    throw new Error("Failed to add user")
  }
}

export const getUserByAddress = async (
  address: string
): Promise<User | null> => {
  const userRef = adminDb
    .collection(USER_COLLECTION)
    .where("address", "==", address)
  const snapshot = await userRef.get()

  if (snapshot.empty) {
    return null
  }

  const user = snapshot.docs[0].data()
  return { ...user, id: snapshot.docs[0].id } as User
}
