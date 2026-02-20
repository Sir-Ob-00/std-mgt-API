import mongoose from "mongoose";

const connectDb = async(url)=> {
    try{
        await mongoose.connect(url);
        console.log("Database connected successfully");
    }catch(e){
        console.log("Error connecting to database", e);
        process.exit(1);
    }
};

export default connectDb;