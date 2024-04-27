import GroupAccountAttributes from "../groupAccount/dto";

export default interface AccountAttributes {
    uuid: string;
    name: string;
    group_account_id: string;
    account_number: string;
    activity_id: string | null;
    group_account?:GroupAccountAttributes;
}