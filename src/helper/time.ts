import moment from "moment-timezone";

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
    public getPresentTime(){
        const date = new Date()
        return date
    }
}

export default new TimeHelper