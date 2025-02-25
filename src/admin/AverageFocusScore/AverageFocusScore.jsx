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
            date: entry.date.split("T")[0], // 날짜만 추출 ("YYYY-MM-DD")
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
        {/* 차트 컨테이너를 스크롤 래퍼로 감쌉니다 */}
        <div className="chart-scroll-wrapper">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={focusData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                {/* XAxis에서 tickFormatter를 수정하여 "MM-DD"만 표시 */}
                <XAxis
                  dataKey="date"
                  tickFormatter={(tick) => tick.substring(5)}
                  padding={{ left: 0, right: 0 }}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4b5ae4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <Typography variant="h8" gutterBottom>
          For mobile users, the complete graph is viewable on screens with a minimum width of 550px.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AverageFocusScore;
