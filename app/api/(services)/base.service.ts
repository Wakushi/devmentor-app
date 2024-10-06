import { adminDb } from "@/firebase-admin"

type DocData = Record<string, any>

export async function addDocument({
  collectionPath,
  data,
  customId,
}: {
  collectionPath: string
  data: DocData
  customId?: string
}): Promise<string> {
  try {
    if (customId) {
      const docRef = adminDb.collection(collectionPath).doc(customId)
      await docRef.set(data)
      return customId
    } else {
      const docRef = await adminDb.collection(collectionPath).add(data)
      return docRef.id
    }
  } catch (error) {
    console.error("Error adding document:", error)
    throw error
  }
}

export async function getDocument(
  collectionPath: string,
  docId: string
): Promise<DocData | null> {
  try {
    const docRef = adminDb.collection(collectionPath).doc(docId)
    const doc = await docRef.get()
    if (doc.exists) {
      return { id: doc.id, ...doc.data() } as DocData
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting document:", error)
    throw error
  }
}

export async function getDocumentByField({
  collectionPath,
  field,
  fieldValue,
}: {
  collectionPath: string
  field: string
  fieldValue: any
}): Promise<DocData | null> {
  try {
    const docRef = adminDb
      .collection(collectionPath)
      .where(field, "==", fieldValue)
    const snapshot = await docRef.get()

    if (snapshot.empty) {
      return null
    }

    const document = snapshot.docs[0].data()
    return { ...document, id: snapshot.docs[0].id }
  } catch (error) {
    console.error("Error getting document:", error)
    throw error
  }
}

export async function updateDocument(
  collectionPath: string,
  docId: string,
  data: Partial<DocData>
): Promise<void> {
  try {
    await adminDb.collection(collectionPath).doc(docId).update(data)
  } catch (error) {
    console.error("Error updating document:", error)
    throw error
  }
}

export async function deleteDocument(
  collectionPath: string,
  docId: string
): Promise<void> {
  try {
    await adminDb.collection(collectionPath).doc(docId).delete()
  } catch (error) {
    console.error("Error deleting document:", error)
    throw error
  }
}

export async function batchWrite(operations: (() => void)[]): Promise<void> {
  const batch = adminDb.batch()
  operations.forEach((operation) => operation())

  try {
    await batch.commit()
  } catch (error) {
    console.error("Error performing batch write:", error)
    throw error
  }
}
