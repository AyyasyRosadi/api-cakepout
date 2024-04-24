export interface messageAttribute<T> {
    data:T,
    status:number,
}

export  class LogicBase{
    public message<T>(status:number, data:T):messageAttribute<T>{
        return {data:data, status:status}
    }
}