import { AccountAttributes } from "../account/dto";

export type account = {
    account_number: string,
    name: string,
    total: number
}

export type listOfAccount = {
    income: Array<account>,
    cost: Array<account>,
    totalCost: number,
    totalIncome: number,
    incomeStatement: number
}


export interface GroupBalanceReportAttributes {
    group_account_name: string
    finalAmount: number;
    accounts: Array<Omit<AccountAttributes, 'group_account_id' | 'activity_id'> & { amount: number }>
}

export interface BalanceReportAttributes {
    harta: { finalAmount: number, group: GroupBalanceReportAttributes[] };
    kewajiban: { finalAmount: number, group: GroupBalanceReportAttributes[] };
    modal: { finalAmount: number, group: GroupBalanceReportAttributes[] };
    labaRugi: number;
}