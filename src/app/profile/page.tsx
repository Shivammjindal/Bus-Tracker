"use client"

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const ConductorProfile = () => {
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [passengerCount, setPassengerCount] = useState("");

  const handleUpdate = () => {
    alert("Status Updated Successfully!");
  };

  return (
    <motion.div 
      className="flex flex-col items-center p-6 space-y-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md shadow-lg p-6 rounded-2xl">
        <CardContent className="flex flex-col items-center space-y-4">
          <motion.div whileHover={{ scale: 1.1 }}>
          </motion.div>
          <h2 className="text-xl font-bold">Conductor Profile</h2>
          <p className="text-gray-500">Update your current status</p>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md shadow-lg p-6 rounded-2xl space-y-4">
        <motion.div whileFocus={{ scale: 1.05 }} className="space-y-2">
          <label className="font-semibold">Current Location</label>
          <Input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </motion.div>

        <motion.div whileFocus={{ scale: 1.05 }} className="space-y-2">
          <label className="font-semibold">Passenger Count</label>
          <Input
            type="number"
            placeholder="Enter count"
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
          />
        </motion.div>

        <motion.div whileFocus={{ scale: 1.05 }} className="space-y-2">
          <label className="font-semibold">Status Update</label>
          <Textarea
            placeholder="E.g., Bus delayed due to traffic"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Button className="w-full mt-4" onClick={handleUpdate}>
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default ConductorProfile;