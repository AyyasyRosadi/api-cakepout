import { queryToString } from "../../../helper/convertQuery";
import BaseRouter from "../../routerBase";
import logic from "./logic";
import { Request, Response } from "express";

class SubActivityRouter extends BaseRouter {
    routes(): void {
        this.router.get("/:activity_id", async (req: Request, res: Response): Promise<Response> => {
            const data = await logic.getByActivityId(req.params?.activity_id, queryToString(req.query?.academic_year))
            return res.status(data.status).json(data.data)
        });
        this.router.post("/", async (req: Request, res: Response): Promise<Response> => {
            const { activity_id, name } = req.body;
            const status = await logic.create(activity_id, name)
            return res.status(status.status).json(status.data)
        });

        this.router.delete("/:id", async (req: Request, res: Response): Promise<Response> => {
            const {id} = req.params;
            const status = await logic.delete(id)
            return res.status(status.status).json(status.data)
        });

    }

}

export default new SubActivityRouter().router;