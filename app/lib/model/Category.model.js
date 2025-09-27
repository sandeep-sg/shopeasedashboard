import mongoose, { Schema } from "mongoose";

const categorySchema = Schema({
    category:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Category =  mongoose.models.Category || mongoose.model("Category",categorySchema)