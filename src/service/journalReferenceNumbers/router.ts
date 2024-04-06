import authentication from "../../middleware/authentication";
import BaseRouter from "../routerBase";
import { ALLROLE } from "../constant";
import controller from "./controller";
import validator from "./validator";

class JournalReferenceNumberRouter extends BaseRouter {
    routes(): void {
        this.router.get('/', authentication.authenticationUser(ALLROLE), controller.getAllJournalReferenceNumber)
        this.router.get('/:uuid', authentication.authenticationUser(ALLROLE), controller.getJournalReferenceNumberByUuid)
        this.router.get('/year/:account_year', authentication.authenticationUser(ALLROLE), controller.getJournalReferenceNumberByYear)
        this.router.post('/', authentication.authenticationUser(ALLROLE), validator.type(), controller.addJournalReferenceNumber)
        this.router.put('/:uuid', authentication.authenticationUser(ALLROLE), validator.type(), controller.updateJournalReferenceNumber)
        this.router.delete('/:uuid', authentication.authenticationUser(ALLROLE), controller.deleteJournalReferenceNumber)
    }
}

export default new JournalReferenceNumberRouter().router;