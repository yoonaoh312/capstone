import React, { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import "./WeeklyFocusChart.scss";

const WeeklyFocusChart = () => {
  const [focusData, setFocusData] = useState([]);

  useEffect(() => {
    const fetchFocusHistory = async () => {
      try {
        const response = await fetch("http://localhost:5050/focus-history");
        const data = await response.json();

        if (data.focusData) {
          const groupedData = {};
          data.focusData.forEach(({ date, score }) => {
            if (!groupedData[date]) {
              groupedData[date] = { totalScore: 0, count: 0 };
            }
            groupedData[date].totalScore += score;
            groupedData[date].count += 1;
          });

          const averagedData = Object.keys(groupedData).map((date) => ({
            date: date.slice(5),
            score: Math.round(groupedData[date].totalScore / groupedData[date].count) || 0,
          }));

          setFocusData(averagedData);
        }
      } catch (error) {
        console.error("❌ 데이터 불러오기 실패:", error);
      }
    };

    fetchFocusHistory();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Track your progress 📈</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={focusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip 
            formatter={(value) => [`${value}`, "score 📊"]} 
            labelFormatter={() => ""}
          />
          <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={3} name="📊 score" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyFocusChart;
