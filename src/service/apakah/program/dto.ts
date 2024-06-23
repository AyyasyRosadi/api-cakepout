import ComponentAttributes from "../component/dto";

export default interface ProgramAttributes {
    id: string;
    institution_no:number;
    program_no:number;
    item: string;
    modifable: boolean;
    academic_year: string;
    component?:Array<ComponentAttributes>
}