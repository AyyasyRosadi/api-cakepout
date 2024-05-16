import { AccountAttributes } from "../account/dto";
import GroupAccountAttributes from "../groupAccount/dto";

export interface JournalAttributes {
    uuid: string,
    reference: string;
    transaction_date: Date;
    amount: number;
    status: string;
    accounting_year: string;
    account_id: string;
    description: string;
    closing:boolean;
    automatic_generate:boolean;
    account?:AccountAttributes;
}

export interface JournalPaginationAttributes {
    page: number;
    totalPages: number;
    totalItems: number;
    data: Array<JournalAttributes>;
    debit: number;
    kredit: number;
}

export interface AccountBegeningBalanceAttributes {
    harta: Array<GroupAccountAttributes>
    kewajiban: Array<GroupAccountAttributes>
    modal: Array<GroupAccountAttributes>
}


export interface AccountBegeningBalanceData {
    value: number,
    id: string
}

export interface SaveAccountBeginingBalance {
    harta: Array<AccountBegeningBalanceData>
    kewajiban: Array<AccountBegeningBalanceData>
    modal: Array<AccountBegeningBalanceData>
    account_balancing: number | null;
    description: string;
}
