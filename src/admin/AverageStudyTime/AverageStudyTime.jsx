import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import "./AverageStudyTime.scss"; 

const AverageStudyTime = ({ setAverageStudyTime }) => {
  const [focusData, setFocusData] = useState([]);

  useEffect(() => {
    const fetchFocusHistory = async () => {
      try {
        const response = await fetch("http://localhost:5050/focus-history");
        const result = await response.json();

        if (result.focusData) {
          const convertedData = result.focusData.map((entry) => ({
            ...entry,
            focusedTime: Number((entry.focused_time / 60).toFixed(2))
          }));

          setFocusData(convertedData);

          const totalFocusedTime = result.focusData.reduce(
            (sum, entry) => sum + entry.focused_time,
            0
          );
          const avgTime = result.focusData.length > 0 ? totalFocusedTime / result.focusData.length : 0;
      
          setAverageStudyTime(avgTime / 60);
        }
      } catch (error) {
        console.error("🚨 Error fetching focus history:", error);
      }
    };

    fetchFocusHistory();
  }, [setAverageStudyTime]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Average Study Time
        </Typography>
        <div className="chart-container">
          <ResponsiveContainer width="80%" height="80%">
            <AreaChart data={focusData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              {/* Modified tick formatter to display only month and day */}
              <XAxis dataKey="date" tickFormatter={(tick) => tick.split("T")[0].substring(5)} />
              <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="focusedTime" 
                stroke="#4b5ae4" 
                fill="#4b5ae4" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <Typography variant="h8" gutterBottom>
          For mobile users, the complete graph is viewable on screens with a minimum width of 500px.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AverageStudyTime;
