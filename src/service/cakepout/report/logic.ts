import { LogicBase, messageAttribute } from "../../logicBase";
import GroupAccount from "../groupAccount/model";
import Account from "../account/model";
import Journal from "../journal/model";
import GroupAccountAttributes from "../groupAccount/dto";
import { BalanceReportAttributes, GroupBalanceReportAttributes, GroupingCashFlow, listOfAccount, resultCashFlow, } from "./dto";
import accountingYear from "../../../helper/accountingYear";
import account from "../../../helper/account";
import { AccountAttributes } from "../account/dto";
import { Op } from "sequelize";
import ledger from "../../../helper/ledger";
import Ledger from "../ledger/model";
import { LedgerAttributes } from "../ledger/dto";

class Logic extends LogicBase {
    private async getJournalByDate(
        groupAccount: number,
        start: string,
        end: string
    ): Promise<Array<GroupAccountAttributes>> {
        const journal = await GroupAccount.findAll({
            where: {
                group_account: groupAccount,
            },
            include: [
                {
                    model: Account,
                    as: "account",
                    include: [
                        {
                            model: Journal,
                            where: {
                                transaction_date: {
                                    [Op.between]: [start, end],
                                },
                            },
                        },
                    ],
                },
            ],
        });
        return journal;
    }
    public async incomeStatement(
        start: any,
        end: any
    ): Promise<messageAttribute<listOfAccount>> {
        let listAccountNumber = [4, 5];
        let income: any = [];
        let totalIncome = 0;
        let cost: any = [];
        let totalCost = 0;
        for (let i in listAccountNumber) {
            let journals = await this.getJournalByDate(
                listAccountNumber[i],
                start,
                end
            );
            for (let g in journals) {
                let accounts: any = journals[g].account;
                for (let a in accounts) {
                    let journalInAccount = accounts[a].journals;
                    let total = 0;
                    if (journalInAccount.length !== 0) {
                        for (let t in journalInAccount) {
                            total = total + journalInAccount[t].amount;
                        }
                    }
                    let account = {
                        account_number: accounts[a].account_number,
                        name: accounts[a].name,
                        total: total,
                    };
                    if (journals[g].group_account === 4) {
                        totalIncome = totalIncome + total;
                        income.push(account);
                    } else if (journals[g].group_account === 5) {
                        totalCost = totalCost + total;
                        cost.push(account);
                    }
                }
            }
        }
        const result: listOfAccount = {
            income,
            cost,
            totalCost,
            totalIncome,
            incomeStatement: totalIncome - totalCost,
        };
        return this.message(200, result);
    }

    /**cash flow statement
     *  1. Operational
     *  2. Investation
     *  3. Funding
     */

    private async getGroupAccount(groupAccount: number, month: Array<number>, asset: boolean): Promise<Array<GroupAccountAttributes>> {
        let incluedes: any = [
            {
                model: Account,
                as: "account",
                order: [['account_number', 'ASC']],
                include: [
                    {
                        model: Ledger,
                        where: {
                            month_index: {
                                [Op.in]: month,
                            },
                            open: false,
                        },
                    },
                ],
            },
        ]
        if (asset) {
            incluedes[0]["where"] = { asset: true }
        }
        const group = await GroupAccount.findAll({
            where: {
                group_account: groupAccount,
            },
            include: incluedes,
            order: [["account", "account_number", "ASC"]]
        });
        return group;
    }

    //end of cash flow statemen
    private calculateGroup(data: any): number {
        let total: number = 0;
        for (let g in data) {
            for (let a in data[g]!.account) {
                for (let l in data[g]!.account[a]!.ledgers) {
                    total += data[g]!.account[a]!.ledgers[l].total;
                }
            }
        }
        return total;
    }

    private groupingCashFlow(data: Array<GroupAccountAttributes>): Array<GroupingCashFlow> {
        let result = []
        for (let d in data) {
            let account = data![d].account!
            for (let a in account) {
                result.push({ account_number: account![a].account_number, name: account![a].name, total: account![a].ledgers![0].total })
            }
        }

        return result
    }



    public async cashFlowStatement(month: number): Promise<messageAttribute<resultCashFlow>> {
        let arrayIndexMonth = Array.from({ length: month }, (_, i) => i);
        const totalAsset = this.calculateGroup(await this.getGroupAccount(1, arrayIndexMonth, false));
        const income: Array<GroupingCashFlow> = this.groupingCashFlow(await this.getGroupAccount(4, [month - 1], false))
        const cost: Array<GroupingCashFlow> = this.groupingCashFlow(await this.getGroupAccount(5, [month - 1], false))
        const investation: Array<GroupingCashFlow> = this.groupingCashFlow(await this.getGroupAccount(1, [month - 1], true))
        const funding: Array<GroupingCashFlow> = this.groupingCashFlow(await this.getGroupAccount(3, [month - 1], false))
        const result: resultCashFlow = {
            operational: {
                income: income,
                cost: cost,
            },
            investation: investation,
            funding: funding
        }

        return this.message(200, result);
    }

    // private async getJournal(groupAccount: number): Promise<any> {
    //     const journal = await GroupAccount.findAll({
    //         where: {
    //             group_account: groupAccount
    //         },
    //         include: [{
    //             model: Account,
    //             as: "account",
    //             include: [
    //                 {
    //                     model: Journal,

    //                 }
    //             ]
    //         }]
    //     })
    //     return journal
    // }

    // private async getJournalByMounth(start: string, end: string, asset: boolean, closing: boolean): Promise<Array<JournalAttributes>> {
    //     const journal = await Journal.findAll({
    //         include: [
    //             {
    //                 model: Account,
    //                 where: {
    //                     asset: asset
    //                 }
    //             }
    //         ],
    //         where: {
    //             transaction_date: {
    //                 [Op.between]: [start, end]
    //             },
    //             closing: closing
    //         },
    //         order: [['transaction_date', 'asc'], ['reference', 'asc']]
    //     })
    //     return journal
    // }

    // private async filterJournal(start: string, end: string): Promise<Array<any>> {
    //     const journal: Array<JournalAttributes> = await this.getJournalByMounth(start, end, true, true)
    //     let reference = "";
    //     let kas = { name: "", nominal: 0, account: "", status: "", references: "", id: "" }
    //     let operationalKas = []
    //     let collectOperationalKas: any = []
    //     for (let i = 0; i < journal.length; i++) {
    //         let accountSplit = journal[i].account!.account_number.split(".")
    //         let journal_ = journal[i]
    //         if (journal_.reference !== reference) {
    //             if (accountSplit[0] === "1") {
    //                 if (operationalKas.length >= 2) {
    //                     collectOperationalKas.push(operationalKas)
    //                     operationalKas = []
    //                 } else {
    //                     operationalKas = []
    //                 }
    //                 reference = journal_.reference
    //                 kas.name = journal_.account!.name
    //                 kas.nominal = journal_.amount
    //                 kas.status = journal_.status
    //                 kas.account = journal_.account!.name
    //                 kas.references = journal_.reference
    //                 kas.id = journal_.uuid

    //             }
    //         } else {
    //             if (accountSplit[0] === "1") {
    //                 kas.name = journal_.account!.name
    //                 kas.nominal = journal_.amount
    //                 kas.status = journal_.status
    //                 kas.account = journal_.account!.name
    //                 kas.references = journal_.reference
    //                 kas.id = journal_.uuid

    //             }
    //         }
    //         operationalKas.push(kas)
    //         kas = { name: "", nominal: 0, account: "", status: "", references: "", id: "" }
    //     }
    //     return collectOperationalKas
    // }

    // private async groupNameCashFlow(name: string, data: Array<any>) {

    //     let account = { name, accounts: [], total: 0 }
    //     let totalLedger = 0
    //     let accounts: any = []
    //     for (const d in data) {
    //         let justAccount = data[d].account
    //         for (const e in justAccount) {
    //             let account_ = { account_number: "", account_name: "", total: 0 }
    //             account_.account_name = justAccount[e].name
    //             account_.account_number = justAccount[e].account_number
    //             if (justAccount[e].ledger.length != 0) {
    //                 account_.total = justAccount[e].ledger[0].total
    //                 totalLedger += justAccount[e].ledger[0].total
    //             }
    //             accounts.push(account_)
    //         }

    //     }
    //     account.accounts = accounts
    //     account.total = totalLedger
    //     return account

    // }
    // private async getLedgerByGroupAndMonthIndex(group_account: number, month_index: number, asset: boolean, open: boolean): Promise<GroupAccountAttributes[]> {
    //     const allLedger = await GroupAccount.findAll({
    //         where: {
    //             group_account
    //         },
    //         order: [
    //             [{ model: Account, as: 'account' }, 'account_number', 'asc']
    //         ],
    //         include: [
    //             {
    //                 model: Account,
    //                 as: 'account',
    //                 where: {
    //                     asset
    //                 },
    //                 include: [
    //                     {
    //                         model: Ledger,
    //                         where: {
    //                             month_index,
    //                             open
    //                         }
    //                     }
    //                 ]
    //             }
    //         ]
    //     })
    //     return allLedger
    // }
    // public async cashFlowStatement(): Promise<messageAttribute<any>> {
    //     const saldoAwal = await this.getLedgerByGroupAndMonthIndex(1, 4, false, false)
    //     const saldoAwalProcess = await this.groupNameCashFlow("Saldo Awal", saldoAwal)
    //     const operasionalPendapatan = await this.getLedgerByGroupAndMonthIndex(4, 5, false, false)
    //     const operasionalPendapatanProcess = await this.groupNameCashFlow("Operasional Pendapatan", operasionalPendapatan)
    //     const operasionalPengeluaran = await this.getLedgerByGroupAndMonthIndex(5, 5, false, false)
    //     const operasionalPengeluaranProcess = await this.groupNameCashFlow("Operasional Pengeluaran", operasionalPengeluaran)
    //     const pendanaan = await this.getLedgerByGroupAndMonthIndex(3, 5, false, false)
    //     const pendanaanProcess = await this.groupNameCashFlow("Pendanaan", pendanaan)
    //     const ok = [saldoAwalProcess, [{ name: "Operasional", pendapatan: operasionalPendapatanProcess, pengeluaran: operasionalPengeluaranProcess }], pendanaanProcess]
    //     const filter = await this.filterJournal('2024-05-01', '2024-05-31')
    //     return this.message(200, filter)
    // }

    private generateMonth = (start: number, stop: number, step: number) =>
        Array.from(
            { length: (stop - start) / step + 1 },
            (_, index) => start + index * step
        );

    private async getAccountByGroup(
        accounts: AccountAttributes[],
        listMonth: number[],
        year: string,
        group_account_name: string
    ): Promise<GroupBalanceReportAttributes> {
        let finalResult: (Omit<
            AccountAttributes,
            "activity_id" | "group_account_id"
        > & { amount: number })[] = [];
        let finalAmount = 0;
        for (let i in accounts) {
            let totalAccountAmount = 0;
            const allLedger: LedgerAttributes[] = await ledger.getAllLedgerByOpenClosed(year, listMonth, accounts[i]?.uuid!)
            for (let j of allLedger) {
                finalAmount += j.total || 0;
                totalAccountAmount += j.total || 0;
            }
            finalResult.push({
                uuid: accounts[i].uuid,
                account_number: accounts[i].account_number,
                name: accounts[i].name,
                amount: totalAccountAmount,
                asset: accounts[i]?.asset,
            });
        }
        return { group_account_name, finalAmount, accounts: finalResult };
    }

    private async getGroupBalanceReport(
        index: number,
        listMonth: number[]
    ): Promise<{ finalAmount: number; group: GroupBalanceReportAttributes[] }> {
        const activeYear = await accountingYear.getActiveAccountingYear();
        const result = [];
        let finalAmount = 0;
        const group = await account.getGroupAccountByNumberGroup(index);
        for (let j in group) {
            const grouping = group[j] as GroupAccountAttributes & {
                account: AccountAttributes[];
            };
            const restructurBalanceReport = await this.getAccountByGroup(
                grouping.account,
                listMonth,
                activeYear!.tahun,
                grouping.name
            );
            result.push(restructurBalanceReport);
            finalAmount += restructurBalanceReport.finalAmount;
        }
        return { finalAmount, group: result };
    }

    public async getBalanceSheetReport(
        monthIndex: number
    ): Promise<messageAttribute<BalanceReportAttributes>> {
        let listMonth: number[] = []
        if (monthIndex < 6) {
            listMonth = this.generateMonth(6, 11, 1)
            listMonth.splice(0, 0, ...Array.from(Array(monthIndex + 1).keys()))
        } else {
            listMonth = this.generateMonth(6, monthIndex, 1)
        }
        const harta = await this.getGroupBalanceReport(1, listMonth);
        const kewajiban = await this.getGroupBalanceReport(2, listMonth);
        const modal = await this.getGroupBalanceReport(3, listMonth);
        const pendapatan = await this.getGroupBalanceReport(4, listMonth)
        const beban = await this.getGroupBalanceReport(5, listMonth)
        const labaRugi = pendapatan?.finalAmount - beban?.finalAmount
        return this.message(200, {
            harta: harta,
            kewajiban: kewajiban,
            modal: modal,
            labaRugi: labaRugi,
        });
    }
}

export default new Logic();
