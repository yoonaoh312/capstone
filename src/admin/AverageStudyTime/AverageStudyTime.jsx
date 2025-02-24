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
            // focusedTime를 초에서 분으로 변환하고 소수점 2자리까지 반올림
            focusedTime: Number((entry.focusedTime / 60).toFixed(2)),
          }));

          setFocusData(convertedData);

          const totalFocusedTime = result.focusData.reduce(
            (sum, entry) => sum + entry.focusedTime,
            0
          );
          const avgTime = result.focusData.length > 0 ? totalFocusedTime / result.focusData.length : 0;
          // 평균 공부시간을 분에서 시간으로 변환하려면, 아래와 같이 조정 가능
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
              <XAxis dataKey="date" tickFormatter={(tick) => tick.split("T")[0]} />
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
      </CardContent>
    </Card>
  );
};

export default AverageStudyTime;
