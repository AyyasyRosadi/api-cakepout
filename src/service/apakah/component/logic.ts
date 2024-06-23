import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import { col, fn } from 'sequelize';
import Component from "./model";
import Program from "../program/model";
import ComponentAttributes from "./dto";

class ComponentLogic extends LogicBase {
    private async getMaxComponent(instituton_no: number, academic_year: string): Promise<number> {
        const max = await Component.findOne({ where: { institution_no: instituton_no, academic_year }, attributes: [[fn('max', col("component_no")), 'max']], raw: true })
        const component: any = max;
        if (component!.max != null) {
            return component?.max
        }
        return 0
    }
    public async getByProgramId(program_id: string, academic_year: string): Promise<messageAttribute<ComponentAttributes[]>> {
        return this.message(200, await Component.findAll({ where: { program_id, academic_year } }))
    }
    public async create(program_id: string, item: string): Promise<messageAttribute<defaultMessage>> {
        const program = await Program.findOne({ where: { id: program_id } })
        const max = await this.getMaxComponent(program!.institution_no, program!.academic_year)
        await Component.create({
            component_no: max + 1,
            item,
            modifable: true,
            program_id: program_id,
            academic_year: program!.academic_year,
            institution_no: program!.institution_no
        })
        return this.message(200, { message: "saved" })

    }
}

export default new ComponentLogic