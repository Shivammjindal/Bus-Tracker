import BusRoute from "@/models/busroute.model";
import { connect } from "@/app/db/connect";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

connect()

interface Stop {
    id: number
    location: string
    verified: boolean
    lon?: string
    lat?: string
    name : string
    time : string
}

interface Location {
    value?: string
    verified: boolean
    lon? : string
    lat? : string
    name : string
    time : string
}

interface BodyStructure{
    name: string,
    start: Location,
    stops: Stop[],
    destination: Location
}

interface FinalStore{
    name : string,
    distance : number,
    time: string
}

export async function POST(request:NextRequest){
    try{
        const body:BodyStructure = await request.json()
        
        if(!body?.name || !body?.start || !body?.destination){
            return new NextResponse('Invalid Data', { status: 500 })
        }

        const locations = []
        
        const startLoc = [body.start.lon, body.start.lat]
        locations.push(startLoc)

        body.stops.map((stop) => {
            const stopLoc = [stop.lon, stop.lat]
            locations.push(stopLoc)
        })
        
        const destLoc = [body.destination.lon, body.destination.lat]
        locations.push(destLoc)

        const headers = {
            "Authorization" : `Bearer ${process.env.MAP_KEY}`
        }

        const data = {
            "locations" : locations,
            "metrics": ["distance"],"resolve_locations":"true","sources":[0]
        }

        const response = await axios.post("https://api.openrouteservice.org/v2/matrix/driving-car",data,{
            headers: headers
        })

        const finalResponse:number[] = response.data.distances[0]

        const Data:FinalStore[] = []
        Data.push({name: body.start.name, distance: 0, time: body.start.time})

        let i = 1

        body.stops.map((stop) => {
            Data.push({
                name: stop.name,
                distance: finalResponse[i],
                time: stop.time
            })

            i += 1
        })

        Data.push({
            name: body.destination.name,
            distance: finalResponse[i],
            time: body.destination.time
        })

        const newBusRoute = await BusRoute.create({
            name: body.name,
            route: Data
        })

        return NextResponse.json(newBusRoute)
    }
    catch(err){
        console.log("E/ :: ",err)
        return new NextResponse('Internal Server Error',{status: 500})
    }
}