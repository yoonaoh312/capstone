import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import "./AverageFocusScore.scss";

const AverageFocusScore = () => {
  const [focusData, setFocusData] = useState([]);

  useEffect(() => {
    const fetchFocusHistory = async () => {
      try {
        const response = await fetch("http://localhost:5050/focus-history");
        const result = await response.json();

        if (result.focusData) {
          const formattedData = result.focusData.map((entry) => ({
            date: entry.date.split("T")[0], // 날짜만 추출
            score: entry.score,
          }));
          setFocusData(formattedData);
        }
      } catch (error) {
        console.error("🚨 Error fetching focus history:", error);
      }
    };

    fetchFocusHistory();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Average Focus Score
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={focusData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#4b5ae4" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AverageFocusScore;
