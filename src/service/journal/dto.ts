import AccountAttributes from "../account/dto";

export interface JournalAttributes{
    uuid:string,
    reference:string;
    transaction_date:Date;
    amount:number;
    status:string;
    accounting_year:string;
    account_id:string;
}

export interface JournalPaginationAttributes {
    page: number;
    totalPages: number;
    totalItems: number;
    data: Array<JournalAttributes>;
    debit: number;
    kredit: number;
}

export interface AccountBegeningBalanceAttributes{
    Harta: Array<AccountAttributes>
    Kewajiban:Array<AccountAttributes>
    Modal:Array<AccountAttributes>
}
