import React, { useEffect, useState } from "react";

const FocusZone = ({ pose }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [outOfFocusTime, setOutOfFocusTime] = useState(0);
  const [focusScore, setFocusScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const focusZone = {
    xMin: 100,
    xMax: 500,
    yMin: 50,
    yMax: 350,
  };

  const isPointInsideZone = (point) => {
    if (!point || point.score < 0.5) return false;
    const { x, y } = point.position;
    return x >= focusZone.xMin && x <= focusZone.xMax && y >= focusZone.yMin && y <= focusZone.yMax;
  };

  useEffect(() => {
    if (!pose || !isTracking) return;

    const keypoints = pose.keypoints.reduce((acc, point) => {
      acc[point.part] = point;
      return acc;
    }, {});

    const inFocus = ["nose", "leftWrist", "rightWrist", "leftElbow", "rightElbow"].some(
      (part) => isPointInsideZone(keypoints[part])
    );

    setTotalSessionTime((prev) => prev + 0.1);
    if (!inFocus) {
      setOutOfFocusTime((prev) => prev + 0.1);
    }
  }, [pose, isTracking]);

  const handleStart = () => {
    setIsTracking(true);
    setStartTime(Date.now());
    setTotalSessionTime(0);
    setOutOfFocusTime(0);
  };

  const handleStop = async () => {
    setIsTracking(false);
    const totalTime = totalSessionTime;
    const adjustedFocusTime = Math.max(totalTime - outOfFocusTime, 0);
    const focusPercentage = totalTime > 0 ? (adjustedFocusTime / totalTime) * 100 : 0;

    let feedback = "";
    if (focusPercentage >= 90) {
      feedback = "You are amazing! 👏";
    } else if (focusPercentage >= 80) {
      feedback = "잘했지만, 조금만 더 힘내요! 💪";
    } else if (focusPercentage >= 70) {
      feedback = "좀 더 노력해야 할 것 같아요! 📖";
    } else {
      feedback = "집중력이 부족해요! 😥";
    }
    setFeedbackMessage(feedback);
    setFocusScore(focusPercentage.toFixed(2));

    // ✅ API 저장
    const date = new Date().toISOString().split("T")[0];
    const focusData = {
      score: focusPercentage.toFixed(2),
      focusedTime: adjustedFocusTime.toFixed(2),
      totalTime: totalTime.toFixed(2),
      outOfFocusTime: outOfFocusTime.toFixed(2),
      date,
    };

    console.log("📤 저장할 데이터:", focusData);

    try {
      const response = await fetch("http://localhost:5050/update-focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(focusData),
      });

      const result = await response.json();
      console.log("✅ 데이터 저장 결과:", result);
    } catch (error) {
      console.error("❌ 데이터 저장 실패:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: `${focusZone.yMin}px`,
          left: `${focusZone.xMin}px`,
          width: `${focusZone.xMax - focusZone.xMin}px`,
          height: `${focusZone.yMax - focusZone.yMin}px`,
          border: "3px solid blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          zIndex: 10,
        }}
      ></div>

      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 20 }}>
        <button onClick={handleStart} style={{ marginRight: "10px" }}>
          Start
        </button>
        <button onClick={handleStop}>Stop</button>
      </div>

      {startTime && (
        <div style={{ position: "absolute", top: "60px", left: "20px", zIndex: 20, color: "white" }}>
          <p>Total Time: {totalSessionTime.toFixed(2)} sec</p>
          <p>Focused Time: {(totalSessionTime - outOfFocusTime).toFixed(2)} sec</p>
          <p>Out of Focus Time: {outOfFocusTime.toFixed(2)} sec</p>
          <p>Focus Score: {focusScore}%</p>
          <p>{feedbackMessage}</p>
        </div>
      )}
    </div>
  );
};

export default FocusZone;
