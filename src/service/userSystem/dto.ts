import RoleAttributes from "../role/dto";
import SystemAttributes from "../system/dto";

export default interface UserSystemAttributes {
    role?: RoleAttributes;
    sistem?: SystemAttributes;
    id: number;
    uuid_user: string;
    uuid_sistem: string;
    uuid_role: string;
    super_admin: boolean;
}

