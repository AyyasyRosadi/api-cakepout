import { ActionAttributes } from "../service/interfaces";


class MessageHelper {
    public sendMessage(status: boolean, message?: string): ActionAttributes {
        return status ? { status: true, message: message ? message : 'succes' } : { status: false, message: message ? message :  'bad request' }
    }
}

export default new MessageHelper