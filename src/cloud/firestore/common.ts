import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldValue,
  FirestoreError,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  Timestamp,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { capitalize } from '~/utils';
import { db } from './config';

// Types
export type CommonData = DocumentData & {
  creationDate: Timestamp;
  editionDate: Timestamp;
};

export type HistoryDocument<DocumentDataType = DocumentData> = {
  before: Partial<DocumentDataType>;
  after: Partial<DocumentDataType>;
  date: Timestamp;
  type: HistoryDocumentType;
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

export type CommonReferences<DataType = any> = {
  collection: CollectionReference<CommonData & DataType>;
  doc: (id: string) => DocumentReference<CommonData & DataType>;
  history: (id: string) => CollectionReference<HistoryDocument<DataType>>;
  historyDoc: (docId: string, id: string) => DocumentReference<HistoryDocument<DataType>>;
};

export type CommonParsedReferences<DataType = any> = {
  [Reference in keyof Omit<
    CommonReferences<DataType>,
    'collection'
  > as Capitalize<Reference>]: CommonReferences<DataType>[Reference];
} & {
  sCollection: CommonReferences<DataType>['collection'];
};

export type MappedCommonReferences<DataType = any, DocumentName extends string = ''> = {
  [ParsedReference in keyof CommonParsedReferences<DataType> as `${DocumentName}${ParsedReference}`]: CommonParsedReferences<DataType>[ParsedReference];
};

export type CommonQueries<DataType = any> = {
  get: (id: string) => Promise<
    DocumentSnapshot<
      DocumentData & {
        creationDate: Timestamp;
        editionDate: Timestamp;
      } & DataType
    >
  >;
  onChange: OnDocChange<
    DocumentData & {
      creationDate: Timestamp;
      editionDate: Timestamp;
    } & DataType
  >;
  update: UpdateDoc<DataType>;
  delete: (id: string) => Promise<void>;
  add: (docData: DataType) => Promise<
    DocumentReference<
      DataType & {
        creationDate: Timestamp;
        editionDate: Timestamp;
      }
    >
  >;
};

export type CommonGetterQueries<DataType = any> = {
  get: () => Promise<
    QuerySnapshot<
      DocumentData & {
        creationDate: Timestamp;
        editionDate: Timestamp;
      } & CommonData &
        DataType
    >
  >;
  onChange: OnCollectionChange<
    DocumentData & {
      creationDate: Timestamp;
      editionDate: Timestamp;
    } & CommonData &
      DataType
  >;
};

export type CommonHistoryGetters<DataType = any> = {
  get: (docId: string) => Promise<QuerySnapshot<DocumentData & HistoryDocument<DataType>>>;
  onChange: OnCollectionChange<
    DocumentData & {
      creationDate: Timestamp;
      editionDate: Timestamp;
    } & DataType
  >;
};

export type CommonHistoryDocGetters<DataType = any> = {
  get: (
    docId: string,
    id: string,
  ) => Promise<DocumentSnapshot<DocumentData & HistoryDocument<DataType>>>;
  onChange: OnDocChange<
    DocumentData & {
      creationDate: Timestamp;
      editionDate: Timestamp;
    } & DataType
  >;
};

export type MappedCommonQueries<DataType = any, DocumentName extends string = ''> = {
  [ParseQuery in keyof CommonQueries<DataType> as `${ParseQuery}${Capitalize<DocumentName>}`]: CommonQueries<DataType>[ParseQuery];
} & {
  [ParseQuery in keyof CommonGetterQueries<DataType> as `${ParseQuery}${Capitalize<DocumentName>}s`]: CommonGetterQueries<DataType>[ParseQuery];
} & {
  [ParseQuery in keyof CommonHistoryGetters<DataType> as `${ParseQuery}${Capitalize<DocumentName>}History`]: CommonHistoryGetters<DataType>[ParseQuery];
} & {
  [ParseQuery in keyof CommonHistoryDocGetters<DataType> as `${ParseQuery}${Capitalize<DocumentName>}HistoryDoc`]: CommonHistoryDocGetters<DataType>[ParseQuery];
};

// Enums
export enum HistoryDocumentType {
  CREATE = 'HISTORY_DOCUMENT_TYPE_CREATE',
  UPDATE = 'HISTORY_DOCUMENT_TYPE_UPDATE',
  DELETE = 'HISTORY_DOCUMENT_TYPE_DELETE',
}

// Functions
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

export const getDocHistoryDocReference = <DocumentDataType = DocumentData>(
  collectionName: string,
  docId: string,
  historyDocId: string,
) =>
  getDocReference<HistoryDocument<DocumentDataType>>(
    collectionName,
    docId,
    'history',
    historyDocId,
  );

export const generateReferences = <DataType = DocumentData, DocumentName extends string = ''>(
  documentName: DocumentName,
): MappedCommonReferences<DataType, DocumentName> => {
  const collectionName = `${documentName}s`;
  return {
    [`${collectionName}Collection`]: getCollectionReference<CommonData & DataType>(collectionName),
    [`${documentName}Doc`]: (id: string) =>
      getDocReference<CommonData & DataType>(collectionName, id),
    [`${documentName}History`]: (id: string) =>
      getDocHistoryReference<DataType>(collectionName, id),
    [`${documentName}HistoryDoc`]: (docId: string, id: string) =>
      getDocHistoryDocReference<DataType>(collectionName, docId, id),
  };
};

export const generateCRUD = <DataType = DocumentData, DocumentName extends string = ''>(
  { collection, doc, history, historyDoc }: CommonReferences<DataType>,
  documentName: DocumentName,
): MappedCommonQueries<DataType, DocumentName> => {
  type Data = CommonData & DataType;

  const customGetDocs = () => getDocs(collection);
  const customOnChangeDocs: OnCollectionChange<Data> = (observer) =>
    onSnapshot(collection, observer);

  const customGetDoc = (id: string) => getDoc(doc(id));
  const customOnChangeDoc: OnDocChange<Data> = (observer, id) => onSnapshot(doc(id), observer);

  const customAddDoc = async (docData: DataType) => {
    const now = new Date();
    const date = Timestamp.fromDate(now);

    const newDocRef = await addDoc(collection, {
      ...docData,
      creationDate: date,
      editionDate: date,
    });

    addDoc(history(newDocRef.id), {
      after: docData,
      before: {},
      date: date,
      type: HistoryDocumentType.CREATE,
    });

    return newDocRef;
  };

  const customUpdateDoc: UpdateDoc<DataType> = async (docData, id) => {
    const now = new Date();
    const date = Timestamp.fromDate(now);

    const lastDoc = await customGetDoc(id);
    if (!lastDoc.exists()) throw new Error(`Cannot update a non existent ${documentName}`);
    const lastDocData: Partial<Data> = lastDoc.data() ?? {};
    const docBeforeEdition: UpdatableDoc<Data> = {};

    for (const key in docData) {
      docBeforeEdition[key] = lastDocData[key];
    }

    await updateDoc(doc(id), {
      ...docData,
      editionDate: date,
    } as any);

    return addDoc(history(id), {
      after: docData as any,
      before: docBeforeEdition as any,
      date,
      type: HistoryDocumentType.UPDATE,
    });
  };

  const customDeleteDoc = async (id: string) => {
    const docRef = await customGetDoc(id);
    if (!docRef.exists()) throw new Error(`Cannot delete a non existent ${documentName}`);
    const { creationDate: _, editionDate: __, ...debtData } = docRef.data() ?? {};

    await addDoc(history(id), {
      after: {},
      before: debtData as any,
      date: Timestamp.fromDate(new Date()),
      type: HistoryDocumentType.DELETE,
    });

    return deleteDoc(doc(id));
  };

  const customGetHistory = (docId: string) =>
    getDocs(query(history(docId), orderBy('date', 'desc')));
  const customOnChangeHistory: OnCollectionChange<HistoryDocument<DataType>> = (observer, docId) =>
    onSnapshot(query(history(docId), orderBy('date', 'desc')), observer);

  const customGetHistoryDoc = (docId: string, id: string) => getDoc(historyDoc(docId, id));
  const customOnChangeHistoryDoc: OnDocChange<HistoryDocument<DataType>> = (observer, docId, id) =>
    onSnapshot(historyDoc(docId, id), observer);

  return {
    [`get${capitalize(documentName)}s`]: customGetDocs,
    [`onChange${capitalize(documentName)}s`]: customOnChangeDocs,
    [`get${capitalize(documentName)}`]: customGetDoc,
    [`onChange${capitalize(documentName)}`]: customOnChangeDoc,
    [`add${capitalize(documentName)}`]: customAddDoc,
    [`update${capitalize(documentName)}`]: customUpdateDoc,
    [`delete${capitalize(documentName)}`]: customDeleteDoc,
    [`get${capitalize(documentName)}History`]: customGetHistory,
    [`onChange${capitalize(documentName)}History`]: customOnChangeHistory,
    [`get${capitalize(documentName)}HistoryDoc`]: customGetHistoryDoc,
    [`onChange${capitalize(documentName)}HistoryDoc`]: customOnChangeHistoryDoc,
  };
};
