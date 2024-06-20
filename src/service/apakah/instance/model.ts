import { Optional, Model, DataTypes } from "sequelize";
import db from '../../../config/database';
import InstitutionAttributes from "./dto";


interface InstitutionCreationAttributes extends Optional<InstitutionAttributes, 'id'>{}
interface InstitutionInstance extends Model<InstitutionAttributes, InstitutionCreationAttributes>, InstitutionAttributes{
    created_at:Date;
    updated_at:Date;
}

const Institution  = db.define<InstitutionInstance>('institution', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
        
    }, 
    name:{
        type:DataTypes.STRING
    }
})

export default Institution