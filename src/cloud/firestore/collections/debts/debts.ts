import {
  addDoc,
  deleteDoc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import {
  getCollectionReference,
  getDocReference,
  OnCollectionChange,
  OnDocChange,
  UpdateDoc,
} from '../../config';

export interface Debt {
  name: string;
}

export type DebtData = Debt & DocumentData;

export const debtCollection = getCollectionReference<DebtData>('debts');
export const debtDoc = (id: string) => getDocReference<DebtData>('debts', id);

export const getDebts = () => getDocs(debtCollection);
export const onChangeDebts: OnCollectionChange<DebtData> = (observer) =>
  onSnapshot(debtCollection, observer);

export const getDebt = (id: string) => getDoc(debtDoc(id));
export const onChangeDebt: OnDocChange<DebtData> = (id, observer) =>
  onSnapshot(debtDoc(id), observer);

export const addDebt = (debt: Debt) => addDoc(debtCollection, debt);

export const updateDebt: UpdateDoc<DebtData> = (id, debt) => updateDoc(debtDoc(id), debt);

export const removeDebt = (id: string) => deleteDoc(debtDoc(id));
