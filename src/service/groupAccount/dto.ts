import { AccountAttributes } from "../account/dto";
export default interface GroupAccountAttributes {
    uuid: string;
    group_account: number;
    group_account_label: number;
    name: string;
    account?:Array<AccountAttributes>
}