import { Request, Response } from "express";
import BaseRouter from "../../routerBase";
import logic from "./logic";
import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SYSTEMAPAKAH } from "../../constant";
import validator from "./validator";
import { detailOfActivityList } from "./dto";


class RouterDetailOfActivity extends BaseRouter {
    routes(): void {
        this.router.get("/:activity_id",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getByActivityId(req.params?.activity_id)
                return res.status(data.status).json(data.data)
            });

        this.router.get("/sub/:sub_activity_id",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getBySubActivityId(req.params?.sub_activity_id)
                return res.status(data.status).json(data.data)
            })


        this.router.post("/",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { activity_id, sub_activity_id, detail_of_activity_list } = req.body;
                const status = await logic.create(activity_id, sub_activity_id, detail_of_activity_list)
                return res.status(status.status).json(status.data)
            });

        this.router.post("/institution",
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getDetailOfActivityByInstitution(req.body?.institution_no)
                return res.status(data.status).json(data.data)
            }
        )

        this.router.delete("/:id",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
                const { id } = req.params
                const status = await logic.delete(id)
                return res.status(status.status).json(status.data)
            });

        this.router.put("/:id",
            async (req: Request, res: Response): Promise<Response> => {
                const { id } = req.params
                let detailOfActivity: detailOfActivityList = { ...req.body };
                const status = await logic.update(id, detailOfActivity)
                return res.status(status.status).json(status.data)
            })
    }
}

export default new RouterDetailOfActivity().router