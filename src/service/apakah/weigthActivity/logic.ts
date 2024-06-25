import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Activity from "../activity/model";
import SubActivity from "../subActivity/model";
import { Answer, WeightQuestionAttributes } from "./dto";
import WeightActivity from "./model";
import WeightAnswer from "./modelAnswer";
import WeightQuestion from "./modelQustion";
import { questions } from "./question";

class WeightActivityLogic extends LogicBase{
    public async generateQuesion():Promise<messageAttribute<defaultMessage>>{
        for(let q in questions){
            await WeightQuestion.create({id:questions[q].no, question:questions[q].question})
            const answers = questions[q].answers
            for(let a in answers){
                await WeightAnswer.create({answer:answers[a].answer, weight_question_id:questions[q].no, weight:answers[a].value})
            }
        }
        return this.message(200, {message:"saved"})
    }

    public async getQuestion():Promise<messageAttribute<WeightQuestionAttributes[]>>{
        const quesiton = await WeightQuestion.findAll({include:[{model:WeightAnswer}], order:[[WeightAnswer,"id", "ASC"]]})
        return this.message(200, quesiton)
    }

    public async create(activityId:string, answer:Array<Answer>):Promise<messageAttribute<defaultMessage>>{
        let total = 0;
        const sub = await SubActivity.findOne({where:{id:activityId}})
        console.log("******")
        console.log(answer.length)
        console.log("******")
        for(let a in answer){
            const weightActivity = await WeightActivity.findOne({where:{activity_id:activityId, weight_question_id:answer[a].question_id}})
            if(weightActivity){
                await WeightActivity.update({weight_question_id:answer[a]!.question_id, weight_answer_id:answer[a].answer_id}, {where:{activity_id:activityId}})
            }else{
                await WeightActivity.create({activity_id:activityId, weight_question_id:answer[a]!.question_id, weight_answer_id:answer[a].answer_id})
            }
            total = total + answer[a].weight
        }
        let weight = total/answer.length
        if(sub){
            await SubActivity.update({weight:weight},{where:{id:activityId}})
        }else{
            await Activity.update({weight:weight},{where:{id:activityId}})
        }
        console.log("finish")
        return this.message(200, {message:"created"})
    }
}

export default new WeightActivityLogic