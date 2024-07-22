import { DetailOfActivityAttributes } from "../../apakah/detailOfActivities/dto";
import { SharingProgramAttributes } from "../../apakah/sharingProgram/dto";

export default interface DisbursementOfFundAttributes {
    uuid: string;
    amount: number;
    status: number;
    withdraw: boolean;
    accounting_year: string;
    month_index: number;
    sharing_program: boolean;
    recipient: string | null;
    ptk_id: string | null;
    detail_of_activity_id: string;
    reference_of_jurnal: string | null;
    sharing_program_id: string | null
    sharing_programs?: SharingProgramAttributes;
    rincian_kegiatan?: DetailOfActivityAttributes;
}

export interface GroupingDisbursementOfFund {
    uuid: string;
    amount: number;
    sharing_program_id: string | null;
    sharing_program_name: string | null;
    status: number;
    withdraw: boolean;
    accounting_year: string;
    ptk_id: string | null;
    receipient: string | null;
    reference_of_journal: string | null;
    uraian: string;
    activity_id: string;
    activity?: DisbursementOfFundAttributes[];
}

export interface PaginationGroupingDisbursementOfFund {
    page: number;
    totalPages: number;
    totalItems: number;
    data: Array<GroupingDisbursementOfFund>
}

export interface AddDisbursementOfFund {
    uuid: string;
    name: string;
    amount: number;
    accounting_year: string;
    month_index: number;
    sharing_program: boolean
}