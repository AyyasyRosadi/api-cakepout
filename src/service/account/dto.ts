import GroupAccountAttributes from "../groupAccount/dto";

export interface AccountAttributes {
    uuid: string;
    name: string;
    group_account_id: string;
    account_number: string;
    activity_id: string | null;
    group_account?:GroupAccountAttributes;
}

export interface AccountPaginationAttributes {
    page: number;
    totalPages: number;
    totalItems: number;
    data: Array<AccountAttributes>;
}
