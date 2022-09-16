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
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { app } from '../firebase';

export const db = getFirestore(app);

export type CommonData = DocumentData & {
  creationDate: Timestamp;
  editionDate: Timestamp;
};

export enum HistoryDocumentType {
  CREATE = 'HISTORY_DOCUMENT_TYPE_CREATE',
  UPDATE = 'HISTORY_DOCUMENT_TYPE_UPDATE',
  DELETE = 'HISTORY_DOCUMENT_TYPE_DELETE',
}

export type HistoryDocument<DocumentDataType = DocumentData> = {
  before: Partial<DocumentDataType>;
  after: Partial<DocumentDataType>;
  date: Timestamp;
  type: HistoryDocumentType;
};

export const getCollectionReference = <DocumentDataType = DocumentData>(
  name: string,
  ...path: string[]
) => {
  return collection(db, name, ...path) as CollectionReference<DocumentDataType>;
};

export const getDocReference = <DocumentDataType = DocumentData>(
  collectionName: string,
  ...path: string[]
) => {
  return doc(db, collectionName, ...path) as DocumentReference<DocumentDataType>;
};

export const getDocHistoryReference = <DocumentDataType = DocumentData>(
  collectionName: string,
  docId: string,
) => getCollectionReference<HistoryDocument<DocumentDataType>>(collectionName, docId, 'history');

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
  ...docIds: string[]
) => Unsubscribe;

export type OnDocChange<DataType = any> = (
  observer: DocObserver<DataType>,
  ...docIds: string[]
) => Unsubscribe;

export type UpdateDoc<DataType = any> = (
  doc: UpdatableDoc<DataType>,
  ...docIds: string[]
) => Promise<DocumentReference<HistoryDocument<UpdatableDoc<DataType>>>>;

export type UpdatableDoc<DataType = any> = {
  [Key in keyof DataType]?: DataType[Key] | FieldValue;
};
