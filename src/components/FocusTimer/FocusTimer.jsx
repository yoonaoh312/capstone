import React, { useState, useEffect, useRef } from "react";
import "./FocusTimer.scss";

const FocusTimer = ({
  inFocus = true,
  setStudyTimeInSeconds = () => {},
  setFocusSeconds = () => {},
  setTotalSeconds = () => {},
  onTimerComplete,
  onStop, 
  targetTime,
}) => {
  const [status, setStatus] = useState("ready"); 
  const [totalSec, setTotalSecLocal] = useState(0);
  const [focusSec, setFocusSecLocal] = useState(0);
  const [outOfFocusSec, setOutOfFocusSec] = useState(0);
  const [studySec, setStudySec] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (status === "tracking") {
      intervalRef.current = setInterval(() => {
        setTotalSecLocal((prev) => prev + 1);
        if (inFocus) {
          setFocusSecLocal((prev) => prev + 1);
          setStudySec((prev) => prev + 1);
        } else {
          setOutOfFocusSec((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [status, inFocus]);

  useEffect(() => {
    setTotalSeconds(totalSec);
    setFocusSeconds(focusSec);
    setStudyTimeInSeconds(studySec);
  }, [totalSec, focusSec, studySec, setTotalSeconds, setFocusSeconds, setStudyTimeInSeconds]);

  const handleStart = () => {
    setTotalSecLocal(0);
    setFocusSecLocal(0);
    setOutOfFocusSec(0);
    setStudySec(0);
    setStatus("tracking");
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setStatus("paused");
  };

  const handleResume = () => {
    setStatus("tracking");
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setStatus("finished");
    
    if (typeof onStop === "function") {
      onStop({ totalSec, focusSec, outOfFocusSec, studySec });
    }
  };

  const handleRestart = () => {
    setTotalSecLocal(0);
    setFocusSecLocal(0);
    setOutOfFocusSec(0);
    setStudySec(0);
    setStatus("ready");
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const progressPercentage = Math.min((focusSec / targetTime) * 100, 100);

  useEffect(() => {
    if (progressPercentage >= 100 && status === "tracking") {
      handleStop();
      if (typeof onTimerComplete === "function") {
        onTimerComplete({ totalSec, focusSec, outOfFocusSec, studySec });
      }
    }
  }, [progressPercentage, status, onTimerComplete, totalSec, focusSec, outOfFocusSec, studySec]);

  return (
    <div className="focus-timer-container">
      <div className="timer-buttons">
        {status === "ready" && <button onClick={handleStart}>▶ Start</button>}
        {status === "tracking" && (
          <>
            <button onClick={handlePause}>⏸ Pause</button>
            <button onClick={handleStop}>⏹ Stop</button>
          </>
        )}
        {status === "paused" && (
          <>
            <button onClick={handleResume}>▶ Resume</button>
            <button onClick={handleStop}>⏹ Stop</button>
          </>
        )}
        {status === "finished" && <button onClick={handleRestart}>↻ Restart</button>}
      </div>
      <div className="timer-status">
        <div className="timer-box total-study">
          <p>📌 Total Study Time</p>
          <span>{formatTime(totalSec)}</span>
        </div>
        <div className="timer-box focus">
          <p>✅ Focus Time</p>
          <span>{formatTime(focusSec)}</span>
        </div>
        <div className="timer-box out-of-focus">
          <p>🚨 Out of Focus Time</p>
          <span>{formatTime(outOfFocusSec)}</span>
        </div>
        <div className="timer-box score">
          <p>🎯 Focus Score</p>
          <span>{totalSec > 0 ? Math.round((focusSec / totalSec) * 100) : 0} pts</span>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
