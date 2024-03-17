import UserSystemAttributes from "../userSystems/dto";

export default interface UserAttributes {
    uuid: string;
    nama: string;
    username: string;
    password: string;
    general_user: boolean;
    user_sistems?: Array<UserSystemAttributes>
}