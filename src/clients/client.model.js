import { Schema, model } from "mongoose";

const clientSchema = Schema({
        name:{
            type: String,
            required: true
        },
        surname:{
            type: String,
            required: true
        },
        email:{
            type: String,
            unique: true,
            required: [true, "email is required"],
        },
        phone:{
            type: String,
            required: true
        },
        address:{
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

export default model("Client", clientSchema);