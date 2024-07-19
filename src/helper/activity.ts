import ActivityAttributes, { ActivityBreakDown, SubActivityBreakDown } from "../service/apakah/activity/dto";
import Activity from "../service/apakah/activity/model";
import DetailOfActivity from "../service/apakah/detailOfActivities/model";
import SubActivity from "../service/apakah/subActivity/model";
import YearActiveInSystem from "../service/yearActiveInSystem/model";


export default new class ActivityHelper{

    public async calculate(data: any): Promise<ActivityBreakDown[]> {
        let activityNow: ActivityBreakDown[] = [];
        const activity = data.map((element: any) => element.get({ plain: true }))

        for (let a in activity) {
            let total = 0;
            let subActivity = activity[a].sub_activities
            let subActivityNow: SubActivityBreakDown[] = []
            if (subActivity.length > 0) {
                for (let s in subActivity) {
                    let totalSub = 0;
                    let detailOfActivityOnSubActivity = subActivity[s].detail_of_activities
                    for (let d in detailOfActivityOnSubActivity) {
                        totalSub = totalSub + detailOfActivityOnSubActivity[d].total
                    }
                    // totalWeight = totalWeight + subActivity[s].weight;
                    total = total + totalSub
                    subActivityNow.push({ no: subActivity[s].sub_activity_no, id: subActivity[s].id, name: subActivity[s].name, continue: subActivity[s].continue, total: totalSub, weight: subActivity[s].weight })
                }
            }
            let detailOfActivity = activity[a].detail_of_activities
            for (let d in detailOfActivity) {
                if (detailOfActivity[d].sub_activity_id === null) {
                    total += detailOfActivity[d].total
                }
            }
            activityNow.push({ no: activity[a].activity_no, id: activity[a].id, name: activity[a].name, continue: activity[a].continue, total: total, sub_activity: subActivityNow.length > 0 ? subActivityNow : null, weight: activity[a].weight })
        }
        return activityNow
    }

    private async getActivityByStatus(statusActivity:number, institutionNo:number, academic_year:string):Promise<ActivityAttributes[]>{
        const activity = await Activity.findAll({
            where: { status: statusActivity, institution_no: institutionNo, academic_year: academic_year },
            include: [
                {
                    model: DetailOfActivity
                },
                {
                    model: SubActivity,
                    include: [
                        {
                            model: DetailOfActivity
                        }
                    ]
                }
            ]
        });
        return activity
    }

    public async getAllActivityByStatus(status:number, institutionNo: number):Promise<ActivityBreakDown[]>{
        const academicYear = await YearActiveInSystem.findOne({where:{name:"apakah"}})
        const activity = await this.getActivityByStatus(status, institutionNo, academicYear!.academic_year)
        return await this.calculate(activity)
    }

}