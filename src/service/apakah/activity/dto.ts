import { DetailOfActivityAttributes } from "../detailOfActivities/dto";
import SubActivityAttributes from "../subActivity/dto";

export default interface ActivityAttributes{
    id: string;
    activity_no: number;
    name: string;
    status: number
    component_id: string;
    institution_no:number;
    academic_year:string;
    continue: boolean;
    sub_activity?:Array<SubActivityAttributes>
    detail_of_activity?:Array<DetailOfActivityAttributes>
}

export interface SubActivityBreakDown{
    no:number;
    id:string;
    name:string;
    total:number;

}

export interface ActivityBreakDown{
    no:number;
    id:string;
    name:string;
    total:number;
    sub_activity?:Array<SubActivityBreakDown>|null
}