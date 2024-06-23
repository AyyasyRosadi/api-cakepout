import ActivityAttributes from "../activity/dto";

export default interface ComponentAttributes{
    id: string;
    component_no: number;
    item: string;
    modifable:boolean;
    program_id: string;
    academic_year:string;
    institution_no:number;
    activity?:Array<ActivityAttributes>
}

export interface ComponentBreakDown{
    no:string;
    id:string;
    item:string;
    total:number;
}