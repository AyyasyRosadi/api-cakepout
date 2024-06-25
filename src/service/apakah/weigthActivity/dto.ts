export default interface WeightActivityAttributes{
    id: string;
    activity_id:string;
    weight_question_id: number;
    weight_answer_id: number;
}

export interface WeightQuestionAttributes{
    id: number;
    question: string;
}

export interface WeightAnswerAttributes{
    id: number;
    answer: string;
    weight_question_id:number;
    weight:number;
}

export interface Answer{
    question_id:number,
    answer_id:number,
    weight:number
}



