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

export async function addSubDocument<T>({
  parentCollectionPath,
  childCollectionPath,
  parentDocId,
  data,
}: {
  parentCollectionPath: string
  childCollectionPath: string
  parentDocId: string
  data: DocData
}): Promise<T> {
  try {
    const docRef = adminDb
      .collection(parentCollectionPath)
      .doc(parentDocId)
      .collection(childCollectionPath)

    const addedDocRef = await docRef.add(data)
    const doc = await addedDocRef.get()

    return { id: doc.id, ...doc.data() } as T
  } catch (error) {
    console.error("Error adding document:", error)
    throw error
  }
}

export async function getDocument<T>(
  collectionPath: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = adminDb.collection(collectionPath).doc(docId)
    const doc = await docRef.get()
    if (doc.exists) {
      return { id: doc.id, ...doc.data() } as T
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting document:", error)
    throw error
  }
}

export async function getSubCollection<T>({
  parentCollectionPath,
  childCollectionPath,
  docId,
}: {
  parentCollectionPath: string
  childCollectionPath: string
  docId: string
}): Promise<T[] | []> {
  try {
    const docSnapshot = await adminDb
      .collection(parentCollectionPath)
      .doc(docId)
      .collection(childCollectionPath)
      .get()

    const documents = docSnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as T)
    )

    return documents
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

export async function updateDocument<T>({
  collectionPath,
  docId,
  data,
}: {
  collectionPath: string
  docId: string
  data: Partial<T>
}): Promise<T> {
  const docRef = adminDb.collection(collectionPath).doc(docId)

  try {
    await docRef.update(data)

    const updatedDoc = await docRef.get()

    if (!updatedDoc.exists) {
      throw new Error("Document does not exist after update")
    }

    return updatedDoc.data() as T
  } catch (error) {
    console.error("Error updating document:", error)
    throw error
  }
}

export async function updateSubDocument<T>({
  parentCollectionPath,
  parentDocId,
  childCollectionPath,
  childDocId,
  data,
}: {
  parentCollectionPath: string
  parentDocId: string
  childCollectionPath: string
  childDocId: string
  data: Partial<T>
}): Promise<T> {
  const docRef = adminDb
    .collection(parentCollectionPath)
    .doc(parentDocId)
    .collection(childCollectionPath)
    .doc(childDocId)

  try {
    await docRef.update(data)

    const updatedDoc = await docRef.get()

    if (!updatedDoc.exists) {
      throw new Error("Document does not exist after update")
    }

    return updatedDoc.data() as T
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

export async function deleteSubDocument({
  parentCollectionPath,
  parentDocId,
  childCollectionPath,
  childDocId,
}: {
  parentCollectionPath: string
  parentDocId: string
  childCollectionPath: string
  childDocId: string
}): Promise<void> {
  try {
    await adminDb
      .collection(parentCollectionPath)
      .doc(parentDocId)
      .collection(childCollectionPath)
      .doc(childDocId)
      .delete()
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
