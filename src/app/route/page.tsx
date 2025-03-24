"use client"
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import './App.css'
import axios from 'axios'

interface Stop {
  id: number
  location: string
  verified: boolean
  lon?: string
  lat?: string
  name?: string
  time?: string
}

interface Location {
  value?: string
  verified: boolean
  lon? : string
  lat? : string
  name? : string
  time?: string
}

export default function App() {

  const [name, setName] = useState<string>("")
  const [startLocation, setStartLocation] = useState<Location>({ value: '', verified: false, time:"" });
  const [destination, setDestination] = useState<Location>({time:'', value: '', verified: false });
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const country = "IN"

  const addStop = () => {
    setStops([...stops, { id: Date.now(), location: '', verified: false }]);
  };

  const updateStop = (params : {id: number, value: string, time: string | undefined}) => {
    setStops(stops.map(stop => (
      stop.id === params.id ? { ...stop, location: params.value, time: params.time } : stop
    )
    ));
  };

  const verifyStartLocation = async () => {
    
    setLoading(true)
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${startLocation.value}&country=${country}`)
    console.log(response)

    setLoading(false)

    if(response.data.length === 0){
        alert('Location is Unable to Verify')
    }
    else{
        alert('Location Varified Successfully')
        setStartLocation({
            value: startLocation.value,
            verified: true,
            time: startLocation.time,
            lon: response.data[0].lon,
            lat: response.data[0].lat,
            name: response.data[0].display_name.split(",")[1],
        })
    }
  };

  const verifyDestinationLocation = async () => {

    setLoading(true)
    console.log(destination.value, country)
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${destination.value}&country=${country}`)
    console.log(response)

    setLoading(false)

    if(response.data.length === 0){
        alert('Location is Unable to Verify')
    }
    else{
        alert('Location Varified Successfully')
        setDestination({
            value: destination.value,
            verified: true,
            time: destination.time,
            lon: response.data[0].lon,
            lat: response.data[0].lat,
            name: response.data[0].display_name.split(",")[1],
        })
    }
  };

  const verifyLocation = async () => {

    const newStops = await Promise.all(stops.map(async (stop) => {

        if(stop.location && !stop?.lat){

            setLoading(true)
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${stop.location}&country=${country}`)
            console.log(response)

            if(response.data.length === 0){
                alert('Location is Unable to Verify')
            }
            else{
                alert('Location Varified Successfully')
                const st:Stop = {
                    id: response.data[0].lon + response.data[0].lat,
                    location: stop.location,
                    verified: true,
                    lon: response.data[0].lon,
                    lat: response.data[0].lat,
                    time: stop.time,
                    name: response.data[0].display_name.split(",")[1].trim(),
                }

                return st
            }
        }
        
        return stop;
    }))

    setLoading(false)
    
    setStops(newStops)
  };

  const creatingRoute = async (e : React.FormEvent) => {
    e.preventDefault()
    const data = {
        start : startLocation,
        stops : stops,
        destination : destination
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reg/route`,data)
    console.log(response)
  }

  const removeStop = (id: number) => {
    setStops(stops.filter(stop => stop.id !== id));
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Add New Route</h1>
      <form className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
        <input type='text' onChange={(e) => setName(e.target.value)} className='text-md w-1/2 p-3' placeholder='Bus Name'/>
        <div className="space-y-2">
          <label htmlFor="start" className="block font-medium">Start Location:</label>
          <div className="flex gap-2">
            <input
              id="start"
              type="text"
              value={startLocation.value}
              onChange={(e) => setStartLocation({ value: e.target.value, verified: false, time: startLocation.time })}
              className={cn(
                "flex-1 px-3 py-2 border rounded-md",
                startLocation.verified && "border-green-500 bg-green-50"
              )}
              required
              placeholder='Enter Postal Code'
            />
            <input
              id="start"
              type="time"
              value={startLocation.time}
              onChange={(e) => setStartLocation({ value: startLocation.value, time: e.target.value, verified: false })}
              className={cn(
                "flex-1 px-3 py-2 border rounded-md",
                startLocation.verified && "border-green-500 bg-green-50"
              )}
              placeholder='Enter Time (24 Hour Format)'
            />
            <motion.button
              type="button"
              onClick={() => verifyStartLocation()}
              className={cn(
                "px-4 py-2 rounded-md text-white disabled:cursor-not-allowed",
                startLocation.verified ? "bg-green-500" : "bg-blue-500"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {startLocation.verified ? '✓ Verified' : 'Verify'}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {stops.map((stop) => (
            <motion.div 
              key={stop.id} 
              className="space-y-2 bg-gray-50 p-4 rounded-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <label className="block font-medium">Stop:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stop.location}
                  onChange={(e) => updateStop({id:stop.id, value:e.target.value, time:stop.time})}
                  className={cn(
                    "flex-1 px-3 py-2 border rounded-md",
                    stop.verified && "border-green-500 bg-green-50"
                  )}
                  required
                  placeholder='Enter Postal Code'
                />
                <input
                  type="time"
                  value={stop.time || ""}
                  onChange={(e) => updateStop({id:stop.id, value:stop.location, time:e.target.value})}
                  className={cn(
                    "flex-1 px-3 py-2 border rounded-md",
                    stop.verified && "border-green-500 bg-green-50"
                  )}
                  placeholder='Enter Time'
                />
                <div className="flex gap-2">
                  <motion.button
                    type="button"
                    onClick={() => verifyLocation()}
                    className={cn(
                      "px-4 py-2 rounded-md text-white",
                      stop.verified ? "bg-green-500" : "bg-blue-500"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {stop.verified ? '✓ Verified' : 'Verify'}
                  </motion.button>
                  <motion.button 
                    type="button" 
                    onClick={() => removeStop(stop.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button 
          type="button" 
          onClick={addStop} 
          className="w-full disabled:cursor-not-allowed px-4 py-2 bg-blue-500 text-white rounded-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Stop
        </motion.button>

        <div className="space-y-2">
          <label htmlFor="destination" className="block font-medium">Destination:</label>
          <div className="flex gap-2">
            <input
              id="destination"
              type="text"
              value={destination.value}
              onChange={(e) => setDestination({time: destination.time, value: e.target.value, verified: false })}
              className={cn(
                "flex-1 px-3 py-2 border rounded-md",
                destination.verified && "border-green-500 bg-green-50"
              )}
              required
              placeholder='Enter Postal Code'
            />
            <input
              id="destination"
              type="time"
              value={destination.time || ""}
              onChange={(e) => setDestination({time: e.target.value, value: destination.value, verified: false })}
              className={cn(
                "flex-1 px-3 py-2 border rounded-md",
                destination.verified && "border-green-500 bg-green-50"
              )}
              required
              placeholder='Enter Postal Code'
            />
            <motion.button
              type="button"
              onClick={() => verifyDestinationLocation()}
              className={cn(
                "px-4 py-2 rounded-md text-white disabled:cursor-not-allowed",
                destination.verified ? "bg-green-500" : "bg-blue-500"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {destination.verified ? '✓ Verified' : 'Verify'}
            </motion.button>
          </div>
        </div>

        <motion.button 
          type="submit" 
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md font-medium text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => creatingRoute(e)}
        >
          Plan Route
        </motion.button>
      </form>
    </main>
  )
}