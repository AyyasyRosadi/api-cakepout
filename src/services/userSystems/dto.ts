import RoleAttributes from "../roles/dto";
import SystemAttributes from "../systems/dto";

export default interface UserSystemAttributes {
    role?: RoleAttributes;
    sistem?: SystemAttributes;
    id: number;
    uuid_user: string;
    uuid_sistem: string;
    uuid_role: string;
    super_admin: boolean;
}

