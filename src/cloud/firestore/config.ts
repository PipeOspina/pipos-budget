import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldValue,
  FirestoreError,
  getFirestore,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { app } from '../firebase';

export const db = getFirestore(app);

export const getCollectionReference = <DocumentDataType = DocumentData>(name: string) => {
  return collection(db, name) as CollectionReference<DocumentDataType>;
};

export const getDocReference = <DocumentDataType = DocumentData>(
  collectionName: string,
  ...path: string[]
) => {
  return doc(db, collectionName, ...path) as DocumentReference<DocumentDataType>;
};

export type CollectionObserver<DataType = any> = {
  next: (doc: QuerySnapshot<DataType>) => void;
  error?: (error: FirestoreError) => void;
  complete?: () => void;
};

export type DocObserver<DataType = any> = {
  next: (doc: DocumentSnapshot<DataType>) => void;
  error?: (error: FirestoreError) => void;
  complete?: () => void;
};

export type OnCollectionChange<DataType = any> = (
  observer: CollectionObserver<DataType>,
) => Unsubscribe;

export type OnDocChange<DataType = any> = (
  id: string,
  observer: DocObserver<DataType>,
) => Unsubscribe;

export type UpdateDoc<DataType = any> = (id: string, doc: UpdatableDoc<DataType>) => Promise<void>;

export type UpdatableDoc<DataType = any> = {
  [Key in keyof DataType]?: DataType[Key] | FieldValue;
};
