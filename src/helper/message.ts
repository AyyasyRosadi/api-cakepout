import { ActionAttributes } from "../service/interfaces";


class MessageHelper {
    public sendMessage(status: boolean): ActionAttributes {
        return status ? { status: true, message: 'succes' } : { status: false, message: 'bad request' }
    }
}

export default new MessageHelper