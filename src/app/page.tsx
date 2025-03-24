"use client"
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const HomePage = () => {
  const [buses, setBuses] = useState([
    { id: 1, name: "Bus 101", lat: 28.6139, lon: 77.209, status: "Running" },
    { id: 2, name: "Bus 202", lat: 28.7041, lon: 77.1025, status: "Cancelled" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.01,
          lon: bus.lon + (Math.random() - 0.5) * 0.01,
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <motion.h1
        className="text-4xl font-bold mb-6 text-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Real-Time Bus Tracker
      </motion.h1>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {buses.map((bus) => (
          <motion.div key={bus.id} whileHover={{ scale: 1.05 }}>
            <Card className="shadow-lg p-6 rounded-xl border border-gray-200 bg-white">
              <CardContent>
                <h2 className="text-xl font-semibold text-gray-800">{bus.name}</h2>
                <Badge
                  className={`px-4 py-2 hover:bg-white text-sm font-bold rounded-lg ${
                    bus.status === "Running" ? "bg-green-100 text-green-700 border border-green-500" : "bg-red-100 text-red-700 border border-red-500"
                  }`}
                >
                  {bus.status}
                </Badge>
                <p className="mt-2 text-gray-600">Latitude: {bus.lat.toFixed(4)}</p>
                <p className="text-gray-600">Longitude: {bus.lon.toFixed(4)}</p>
                <Button variant="outline" className="mt-4 w-full text-blue-600 border-blue-500 hover:bg-blue-100">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HomePage;