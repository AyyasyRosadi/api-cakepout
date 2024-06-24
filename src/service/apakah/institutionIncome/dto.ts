export default interface InstitutionIncomeAttributes{
    id: string;
    institution_id: number;
    name:string;
    academic_year: string
    total: number;
    budgeted:number;
    income_group_id:string;
}