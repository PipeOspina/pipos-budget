import { Timestamp } from 'firebase/firestore';
import { CommonData } from '../../common';
import { generateCRUD, generateReferences } from './../../common';

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

export const { debtDoc, debtHistory, debtsCollection, debtHistoryDoc } = generateReferences<
  Debt,
  'debt'
>('debt');

export const {
  addDebt,
  deleteDebt,
  getDebt,
  getDebtHistory,
  getDebtHistoryDoc,
  getDebts,
  onChangeDebt,
  onChangeDebtHistory,
  onChangeDebtHistoryDoc,
  onChangeDebts,
  updateDebt,
} = generateCRUD<Debt, 'debt'>(
  { collection: debtsCollection, doc: debtDoc, history: debtHistory, historyDoc: debtHistoryDoc },
  'debt',
);
