export default interface DisbursementOfFundAttributes{
    uuid:string;
    amount:number;
    status:boolean;
    withdraw:boolean;
    accounting_year:string;
    month_index:number;
    sharing_program:boolean;
    recipient:string|null;
    ptk_id:string|null;
    activity_id:string;
    reference_of_jurnal:string|null;
}