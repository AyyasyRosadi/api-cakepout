import BaseRouter from "../../router/base";
import controller from "./controller";
import validator from "./validator";

class JournalReferenceNumberRouter extends BaseRouter {
    routes(): void {
        this.router.get('/', controller.getAllJournalReferenceNumber)
        this.router.get('/:uuid', controller.getJournalReferenceNumberByUuid)
        this.router.get('/year/:account_year', controller.getJournalReferenceNumberByYear)
        this.router.post('/', validator.type(), controller.addJournalReferenceNumber)
        this.router.put('/:uuid', validator.type(), controller.updateJournalReferenceNumber)
        this.router.delete('/:uuid', controller.deleteJournalReferenceNumber)
    }
}

export default new JournalReferenceNumberRouter().router;