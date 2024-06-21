import GroupAccountAttributes from "../groupAccount/dto";
import { LedgerAttributes } from "../ledger/dto";

export interface AccountAttributes {
    uuid: string;
    name: string;
    group_account_id: string;
    account_number: string;
    activity_id: string | null;
    asset: boolean;
    group_account?:GroupAccountAttributes;
    ledgers?:Array<LedgerAttributes>

}

export interface AccountPaginationAttributes {
    page: number;
    totalPages: number;
    totalItems: number;
    data: Array<AccountAttributes>;
}
