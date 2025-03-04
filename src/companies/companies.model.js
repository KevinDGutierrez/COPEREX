import { Schema, model } from "mongoose";

const companySchema = Schema({
        name:{
            type: String,
            required: true
        },
        phone:{
            type: String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        levelOfimpact:{
            type: String,
            required: true,
            enum: [ "alto","medio", "bajo" ],
        },
        yearsOfExperience:{
            type: Number,
            required: true
        },
        category:{
            type: String,
            required: true
        },
        status:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false   
    }
);

export default model("Company", companySchema);