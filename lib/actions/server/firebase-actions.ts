import { adminDb } from "@/firebase-admin"
import { Session } from "@/lib/types/session.type"
import { Mentor, Student, User } from "@/lib/types/user.type"
import { Address } from "viem"

const USER_COLLECTION = "users"
const SESSION_COLLECTION = "sessions" // Temporary, should be onchain

export const createUser = async (user: User): Promise<User | null> => {
  try {
    const newUser = {
      ...user,
      registered: true,
      address: user.address as Address,
    }
    const docRef = await adminDb.collection(USER_COLLECTION).add(newUser)
    const createdUser: User = { ...newUser, id: docRef.id }

    return createdUser
  } catch (error) {
    console.error("Error adding user:", error)
    throw new Error("Failed to add user")
  }
}

export const createSession = async (
  session: Session
): Promise<Session | null> => {
  try {
    const docRef = await adminDb.collection(SESSION_COLLECTION).add(session)
    const createdSession: Session = { ...session, id: docRef.id }
    return createdSession
  } catch (error) {
    console.error("Error adding session:", error)
    throw new Error("Failed to add session")
  }
}

export const getUserByAddress = async (
  address: string
): Promise<User | Mentor | Student | null> => {
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

export async function getSessionsByStudentAddress(
  studentAddress: Address
): Promise<Session[] | null> {
  try {
    const collectionRef = adminDb.collection(SESSION_COLLECTION)
    const snapshot = await collectionRef
      .where("studentAddress", "==", studentAddress)
      .get()

    if (snapshot.empty) {
      console.log("No matching documents.")
      return null
    }

    const mentorByAddress: Map<Address, Mentor> = new Map()
    const sessions: Session[] = []

    for (let doc of snapshot.docs) {
      let mentor: Mentor | null = null

      const { mentorAddress } = doc.data()

      if (mentorByAddress.has(mentorAddress)) {
        mentor = mentorByAddress.get(mentorAddress)!
      } else {
        mentor = (await getUserByAddress(mentorAddress)) as Mentor
        mentorByAddress.set(mentorAddress, mentor)
      }

      sessions.push({
        ...doc.data(),
        id: doc.id,
        mentor,
      } as Session)
    }

    return sessions
  } catch (error: any) {
    console.error("Error retrieving documents:", error)
    throw new Error("Failed to retrieve click by ip")
  }
}
