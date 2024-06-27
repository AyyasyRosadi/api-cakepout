import { queryToString } from "../../../helper/convertQuery";
import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SYSTEMAPAKAH } from "../../constant";
import BaseRouter from "../../routerBase"
import logic from "./logic";
import { Request, Response } from "express";
import validator from "./validator";

class ActivityRouter extends BaseRouter {
    routes(): void {
        this.router.get("/:component_id",
            // authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
                const { component_id } = req.params
                const data = await logic.getAllActivityBreakDown(component_id)
                return res.status(data.status).json(data.data);
        });
        
        this.router.post("/",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { component_id, name, continue_activity } = req.body;
                const activityStatus = await logic.create(component_id, name, continue_activity);
                return res.status(activityStatus.status).json(activityStatus.data);
        });

        this.router.delete("/:id",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
                const { id } = req.params
                const status = await logic.delete(id)
                return res.status(status.status).json(status.data)
        });

        this.router.put("/:id",
            async (req: Request, res: Response): Promise<Response> => {
                const {id} = req.params
                const {name} = req.body
                const status = await logic.update(id, name)
                return res.status(status.status).json(status.data)
        });
    }

}
export default new ActivityRouter().router