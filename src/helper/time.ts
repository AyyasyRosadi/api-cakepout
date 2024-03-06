import moment from "moment-timezone";

class TimeHelper{
    public formatTime(date:Date):string{
        return  moment(date).format("YYYY-MM-DD HH:mm:ss")
    }
    public formatAsiaMakassar(date:Date):string{
        return moment(date).tz('Asia/Makassar').format("YYYY-MM-DD HH:mm:ss")
    }
    public formatAsiaJakarta(date:Date):string{
        return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    }
    public formatUtc(date:Date):string{
        return moment(date).utc().format("YYYY-MM-DD HH:mm:ss")
    }
    public dateAsiaMakassar(date:Date):Date{
        return moment(date).tz("Asia/Makassar").toDate()
    }
    public dateAsiaJakarta(date:Date):Date{
        return moment(date).tz("Asia/Jakarta").toDate()
    }
    public dateUtc(date:Date):Date{
        return moment(date).utc().toDate()
    }
}

export default new TimeHelper