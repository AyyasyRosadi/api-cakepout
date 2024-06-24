export interface DetailOfActivityAttributes{
    id: string;
    description: string;
    unit_id:number;
    vol: number;
    unit_price: number;
    thawing_method: string;
    from: number;
    until:number;
    total:number;
    sub_activity_id:string|null;
    activity_id:string;
    academic_year:string;
    institution_income_id:string;
    sharing_program:boolean;
    post:number;
}

export interface detailOfActivityList {
    description:string;
    unit_id:number, 
    vol:number;
    unit_price:number;
    thawing_method:string;
    from:number;
    until:number;
    total:number;
    academic_year:string;
    sharing_program:boolean;
    post:number;
    institution_income_id: string;
}