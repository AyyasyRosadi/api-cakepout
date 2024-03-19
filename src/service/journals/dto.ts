export default interface JournalAttributes{
    uuid:string,
    reference:string;
    transaction_date:Date;
    amount:number;
    status:string;
    accounting_year:string;
    account_id:string;
}