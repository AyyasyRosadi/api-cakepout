export type account = {
    account_number:string,
    name:string,
    total:number
}

export type listOfAccount={
    income:Array<account>,
    cost:Array<account>,
    totalCost:number,
    totalIncome:number,
    incomeStatement:number
}

