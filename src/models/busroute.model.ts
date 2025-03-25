import mongoose from "mongoose"

const BusRouteSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        route:[
            {
                name:{
                    type: String,
                },
                distance:{
                    type: Number,
                },
                time:{
                    type: String
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

const BusRoute = mongoose.models.busroutes || mongoose.model('busroutes',BusRouteSchema)
export default BusRoute