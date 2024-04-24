
export interface defaultMessage{
    message: string,
}

export interface messageAttribute<T> {
    data:T|defaultMessage
    status:number,
}


export  class LogicBase{
    public message<T>(status:number, data:T):messageAttribute<T>{
        return {data:data, status:status}
    }
}