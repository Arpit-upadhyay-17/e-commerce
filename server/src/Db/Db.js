import mongoose from "mongoose";


export const connection = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");
}