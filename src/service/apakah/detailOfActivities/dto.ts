export default interface DetailOfActivityAttributes{
    id: string;
    description: string;
    unit_id:number;
    vol: number;
    unit_price: number;
    thawing_method: string;
    from: number;
    until:number;
    total:number;
    sub_activity_id:string;
    activity_id:string;
    academic_year:string;
    income_id:string;
    sharing_program:boolean;
    post:number;
}