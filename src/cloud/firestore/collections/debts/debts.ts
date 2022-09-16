import {
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  CommonData,
  getCollectionReference,
  getDocHistoryReference,
  getDocReference,
  HistoryDocumentType,
  OnCollectionChange,
  OnDocChange,
  UpdateDoc,
} from '../../config';
import { UpdatableDoc } from './../../config';

export enum DebtType {
  CREDIT_CARD = 'DEBT_TYPE_CREDIT_CARD',
  FREE_INVESTMENT = 'DEBT_TYPE_FREE_INVESTMENT',
  PERSONAL_LOAN = 'DEBT_TYPE_PERSONAL_LOAN',
  OTHER = 'DEBT_TYPE_OTHER',
}

export enum DebtFeeType {
  PERCENTAGE = 'DEBT_FEE_PERCENTAGE',
  VALUE = 'DEBT_FEE_VALUE',
}

export interface DebtFee {
  name: string;
  value: number;
  type: DebtFeeType;
  dues: number[];
  divideBetweenDues: boolean;
}

export type DebtPaymentFee = Omit<DebtFee, 'dues' | 'divideBetweenDues'> & {
  restDues: number;
};

export interface DebtPayment {
  nextDue: number | null;
  nextCapitalAmount: number | null;
  nextInterestAmount: number | null;
  nextOtherFees: DebtPaymentFee[] | null;
  nextTotalAmount: number | null;
  nextDate: Timestamp | null;

  lastDue: number | null;
  lastCapitalAmount: number | null;
  lastInterestAmount: number | null;
  lastOtherFees: DebtPaymentFee[] | null;
  lastTotalAmount: number | null;
  lastDate: Timestamp | null;
  lastMonthPayed: boolean | null;
}

export interface Debt {
  // General
  name: string;
  type: DebtType;
  agreedDues: number;
  initialCapitalAmount: number;
  anualInterestPercentage: number;
  otherFees: DebtFee[];
  totalDebtAmount: number;
  acquirementDate: Timestamp;
  cancelationDate: Timestamp | null;
  expirationDate: Timestamp | null;
  automaticDebt: boolean;
  automaticDebtDate: Timestamp | null;

  // Computed
  payment: DebtPayment;
  active: boolean;
  reported: boolean;
  refinanced: boolean;
  inArrears: boolean;
  dailyInterest: boolean;
  interestFromBuyingDay: boolean;
}

export type DebtData = CommonData & Debt;

export const debtCollection = getCollectionReference<DebtData>('debts');
export const debtDoc = (id: string) => getDocReference<DebtData>('debts', id);
export const debtHistory = (id: string) => getDocHistoryReference<Debt>('debts', id);

const activeWhereStatement = where('active', '==', true);
const activeDebtsCollection = query(debtCollection, activeWhereStatement);

export const getDebts = () => getDocs(activeDebtsCollection);
export const onChangeDebts: OnCollectionChange<DebtData> = (observer) =>
  onSnapshot(activeDebtsCollection, observer);

export const getDebt = (id: string) => getDoc(debtDoc(id));
export const onChangeDebt: OnDocChange<DebtData> = (observer, id) =>
  onSnapshot(debtDoc(id), observer);

export const addDebt = async (debt: Debt) => {
  const now = new Date();
  const date = Timestamp.fromDate(now);

  const newDebtRef = await addDoc(debtCollection, {
    ...debt,
    creationDate: date,
    editionDate: date,
  });

  addDoc(debtHistory(newDebtRef.id), {
    after: debt,
    before: {},
    date: date,
    type: HistoryDocumentType.CREATE,
  });

  return newDebtRef;
};

export const updateDebt: UpdateDoc<Debt> = async (debt, id) => {
  const now = new Date();
  const date = Timestamp.fromDate(now);

  updateDoc(debtDoc(id), {
    ...debt,
    editionDate: date,
  });

  const lastDebt: Partial<DebtData> = (await getDebt(id)).data() ?? {};
  const debtBeforeEdition: UpdatableDoc<DebtData> = {};

  for (const key in debt) {
    debtBeforeEdition[key] = lastDebt[key];
  }

  return addDoc(debtHistory(id), {
    after: debt,
    before: debtBeforeEdition,
    date,
    type: HistoryDocumentType.UPDATE,
  });
};

export const deleteDebt = async (id: string) => {
  const { creationDate: _, editionDate: __, ...debtData } = (await getDebt(id)).data() ?? {};

  addDoc(debtHistory(id), {
    after: {},
    before: debtData,
    date: Timestamp.fromDate(new Date()),
    type: HistoryDocumentType.DELETE,
  });

  return deleteDoc(debtDoc(id));
};
