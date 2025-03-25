import mongoose from "mongoose";

const connect = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URL!)
        console.log('MongoDb Connected')
    }
    catch(error: unknown){
        console.log('Fail to connect with db', error)
    }
}

export { connect }