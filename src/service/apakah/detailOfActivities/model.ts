import { DataTypes, Model, Optional } from "sequelize";
import db from "../../../config/database";
import DetailOfActivityAttributes from "./dto";

interface DetailOfActivityCreationAttributes extends Optional<DetailOfActivityAttributes, 'id'>{}
interface DetailOfActivityInstance extends Model<DetailOfActivityAttributes, DetailOfActivityCreationAttributes>, DetailOfActivityAttributes{
    created_at:Date;
    updated_at:Date;
}

const RincianKegiatan = db.define<DetailOfActivityInstance>("detail_of_activity", {
    id:{
        type:DataTypes.STRING,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    description:{
        type:DataTypes.TEXT,
    },
    unit_id:{
        type:DataTypes.INTEGER
    },
    vol:{
        type:DataTypes.INTEGER
    },
    unit_price:{
        type:DataTypes.INTEGER
    },
    thawing_method:{
        type:DataTypes.STRING
    },
    from:{
        type:DataTypes.INTEGER
    },
    until:{
        type:DataTypes.INTEGER
    },
    total:{
        type:DataTypes.BIGINT
    },
    sub_activity_id:{
        type:DataTypes.STRING,
        defaultValue:null
        
    },
    activity_id:{
        type:DataTypes.STRING
    },
    academic_year:{
        type:DataTypes.STRING
    },
    income_id:{
        type:DataTypes.STRING
    },
    sharing_program:{
        type:DataTypes.BOOLEAN,
        defaultValue: false
    },
    post:{
        type:DataTypes.INTEGER
    }

})

export default RincianKegiatan