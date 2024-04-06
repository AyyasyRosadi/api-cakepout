import { Request, Response } from "express";
import logic from "./logic";


class JournalReferenceNumberController {
    public async getAllJournalReferenceNumber(req: Request, res: Response): Promise<Response> {
        const allJournalReferenceNumber = await logic.getAllJournalReferenceNumber()
        return res.status(200).json(allJournalReferenceNumber)
    }
    public async getJournalReferenceNumberByUuid(req: Request, res: Response): Promise<Response> {
        const oneJournalReferenceNumber = await logic.getJournalReferenceNumberByUuid(req.params?.uuid);
        if (!oneJournalReferenceNumber) {
            return res.status(404).json({ msg: 'journal reference number not found' })
        }
        return res.status(200).json(oneJournalReferenceNumber)
    }
    public async getJournalReferenceNumberByYear(req: Request, res: Response): Promise<Response> {
        const allJournalReferenceNumber = await logic.getJournalReferenceNumberByYear(req.params?.accounting_year)
        return res.status(200).json(allJournalReferenceNumber)
    }
    public async addJournalReferenceNumber(req: Request, res: Response): Promise<Response> {
        const { number, accounting_year } = req.body
        const addJournalReferenceNumber = await logic.addJournalReferenceNumber(number, accounting_year)
        if (!addJournalReferenceNumber.status) {
            return res.status(400).json({ msg: addJournalReferenceNumber.message })
        }
        return res.status(200).json({ msg: addJournalReferenceNumber.message })
    }
    public async updateJournalReferenceNumber(req: Request, res: Response): Promise<Response> {
        const { number, accounting_year } = req.body
        const updateJournalReferenceNumber = await logic.updateJournalReferenceNumber(number, accounting_year, req.params?.uuid)
        if (!updateJournalReferenceNumber.status) {
            return res.status(400).json({ msg: updateJournalReferenceNumber.message })
        }
        return res.status(200).json({ msg: updateJournalReferenceNumber.message })
    }
    public async deleteJournalReferenceNumber(req: Request, res: Response): Promise<Response> {
        const deleteJournalReferenceNumber = await logic.deleteJournalReferenceNumber(req.params?.uuid)
        if (!deleteJournalReferenceNumber.status) {
            return res.status(400).json({ msg: deleteJournalReferenceNumber.message })
        }
        return res.status(200).json({ msg: deleteJournalReferenceNumber.message })
    }
}

export default new JournalReferenceNumberController;