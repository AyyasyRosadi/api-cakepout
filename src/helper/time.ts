import moment from "moment-timezone";
import accountingYear from "./accountingYear"


class TimeHelper {
    public formatTime(date: Date): string {
        return moment(date).format("YYYY-MM-DD HH:mm:ss")
    }
    public formatAsiaMakassar(date: Date): string {
        return moment(date).tz('Asia/Makassar').format("YYYY-MM-DD HH:mm:ss")
    }
    public formatAsiaJakarta(date: Date): string {
        return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    }
    public formatUtc(date: Date): string {
        return moment(date).utc().format("YYYY-MM-DD HH:mm:ss")
    }
    public dateOnly(date:Date):string{
        return moment(date).format("YYYY-MM-DD")
    }
    public date(date: string) {
        return moment(date).toDate()
    }
    public dateAsiaMakassar(date: Date): Date {
        return moment(date).tz("Asia/Makassar").toDate()
    }
    public dateAsiaJakarta(date: Date): Date {
        return moment(date).tz("Asia/Jakarta").toDate()
    }
    public dateUtc(date: Date): Date {
        return moment(date).utc().toDate()
    }
    public getLastDayOnMonth(date:string):Date{
        return moment(date).endOf('month').toDate()   
    }

    public async getDateStartEnd(month: number):Promise<Array<string>>{
        let accountingYear_ = await  accountingYear.getActiveAccountingYear()
        let yearSplit = accountingYear_!.tahun.split("/")
        if(month<=6){
            return [`${yearSplit[1]}-${month.toString().length===1?`0${month}`:month.toString()}-01`,`${yearSplit[1]}-${month.toString().length===1?`0${month}`:month.toString()}-${new Date(parseInt(yearSplit[0]), month, 0).getDate()}`]
        }else{
            return [`${yearSplit[0]}-${month.toString().length===1?`0${month}`:month.toString()}-01`,`${yearSplit[0]}-${month.toString().length===1?`0${month}`:month.toString()}-${new Date(parseInt(yearSplit[1]), month, 0).getDate()}`]
        }
    }
}

export default new TimeHelper