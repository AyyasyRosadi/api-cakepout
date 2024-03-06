export default interface MonthlyAccountCalculationAttributes{
    uuid:string;
    month_index:number;
    accounting_year:string;
    total:number;
    account_id:string;
    open:boolean;
}