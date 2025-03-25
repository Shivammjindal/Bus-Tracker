"use client"

import { FaBus } from "react-icons/fa"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Tracker(){

  const [tocity, setToCity] = useState<string>("")
  const [arrival, setArrival] = useState<boolean>(true)
  // const [travel, setTravel] = useState<number>(171)
  const travel = 29
  const [distrem, setDistRem] = useState<number>(0)
  const [fromTop, setfromTop] = useState<number>(0)
  const [index, setIndex] = useState<number>(0)
  const isRefreshing = false;

  let locate = 0

  console.log(index)
 
  const data = [
    {
      place:"Gohana",
      dist: "0 km"
    },
    {
      place:"Sonipat",
      dist: "40 km"
    },
    {
      place:"Kashmiri Gate Isbt Delhi",
      dist: "99 km"
    },
    {
      place:"Balabhgarh",
      dist:"133 km"
    },
    {
      place:"Palwal",
      dist:"164 km"
    },
    {
      place:"Kosi Kalan",
      dist:"212"
    },
    {
      place:"Mathura",
      dist:"249 km"
    }
  ]

  const handleRefresh = () => {
    
  };

  const stops = parseInt(data[data.length-1].dist)*4 + 24

  useEffect(() => {

    let i = 0
    for(; i <= data.length-1; i++){
      if(travel <= parseInt(data[i].dist)){
        break
      }
    }

    if(i == data.length){
      setToCity(data[i-1].place)
      setArrival(true)
      setIndex(i-1)
    }
    else{
      if(Math.abs(Math.round(parseInt(data[i].dist)-travel)) > 0){
        setArrival(false);
      }
      setToCity(data[i].place)
      setIndex(i)
      setDistRem(Math.abs(Math.round(parseInt(data[i].dist)-travel)))
    }
  },[travel])

  useEffect(() => {
    if(travel <= parseInt(data[data.length-1].dist)){
      setfromTop(travel * 4)
    }
    else{
      setfromTop(parseInt(data[data.length-1].dist) * 4)
    }
  },[distrem,travel])

  return (
    <>

      <div className="mt-3 p-2 flex flex-col text-2xl ml-28 font-medium justify-center">
        <div className="m-1">
          Bus Name : 
        </div>
        <div className="m-1">
          From : 
        </div>
        <div className="m-1"> 
          To : 
        </div>
      </div>
      <Button onClick={handleRefresh} disabled={isRefreshing} className="ml-32 disabled:cursor-not-allowed bg-green-600 text-md hover:bg-green-700 transition-all duration-700">Refresh</Button>
      <div className="relative mb-56 h-full w-screen">
        <div className={`relative left-32 top-20 w-5 rounded-3xl bg-blue-500`} style={{ height: `${stops}px` }} >
          <div className="relative flex flex-col justify-between items-center py-1 h-full">
            <div style={{ top: `${fromTop}px`}} className="absolute w-9 h-9 z-40 rounded-full bg-blue-200">
              <FaBus className="absolute text-lg text-blue-700 w-full top-2"/>
              <div className="absolute text-white rounded-lg left-10 bg-green-600 font-medium min-w-56 p-2">
                {arrival ? <div>Arrived {tocity}</div> : <div>{distrem} km to {tocity}</div>}
              </div>
            </div>
            {
              data.map((loc) => {
                const temp = locate
                locate += parseInt(loc.dist)*4 - temp
                return( <div key={loc.place} style={{ top: `${locate}px`}} className="mt-1 absolute w-4 h-4 rounded-full bg-blue-200">
                <div className="absolute left-8 min-w-64">
                  <div>
                    {loc.place}
                  </div>
                  <div className="absolute top-5">
                    {loc.dist}  
                  </div> 
                </div>
              </div>)
              })
            }
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </>
  )
}