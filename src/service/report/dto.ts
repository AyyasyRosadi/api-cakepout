import { AccountAttributes } from "../account/dto";

export type account = {
    account_number:string,
    name:string,
    total:number
}

export type listOfAccount={
    income:Array<account>,
    cost:Array<account>,
    totalCost:number,
    totalIncome:number,
    incomeStatement:number
}


export interface BalanceReportAttributes {
    finalAmount: number;
    accounts: Array<Omit<AccountAttributes,'group_account_id'|'activity_id'> & { amount: number }>
}
