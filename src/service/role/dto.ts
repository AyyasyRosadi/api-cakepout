import SystemAttributes from "../system/dto";

export default interface RoleAttributes{
    uuid:string;
    nama_role:string;
    uuid_sistem:string;
    sistem?:SystemAttributes;
}