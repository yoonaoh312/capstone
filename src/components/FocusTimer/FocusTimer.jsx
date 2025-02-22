import React, { useState, useEffect, useRef } from "react";
import ProgressCircle from "../ProgressCircle/ProgressCircle";
import "./FocusTimer.scss";

const FocusTimer = ({
  inFocus = true,
  setStudyTimeInSeconds,
  setFocusSeconds,
  setTotalSeconds,
  onTimerComplete, // 모달 열기 위한 콜백, 타이머 완료 시 현재 시간을 전달
}) => {
  // FocusTimer 내부 상태
  const [status, setStatus] = useState("ready"); // "ready", "tracking", "paused", "finished"
  const [totalSec, setTotalSec] = useState(0);
  const [focusSec, setFocusSec] = useState(0);
  const [outOfFocusSec, setOutOfFocusSec] = useState(0);
  const [studySec, setStudySec] = useState(0);
  // 목표 시간(초): 기본값 360초 = 0.1시간 (6분)
  const [targetTime, setTargetTime] = useState(360);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (status === "tracking") {
      intervalRef.current = setInterval(() => {
        setTotalSec(prev => prev + 1);
        if (inFocus) {
          setFocusSec(prev => prev + 1);
          setStudySec(prev => prev + 1);
        } else {
          setOutOfFocusSec(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [status, inFocus]);

  // 부모에게 상태 전달 (setter 함수가 전달된 경우에만)
  useEffect(() => {
    if (typeof setTotalSeconds === "function") setTotalSeconds(totalSec);
    if (typeof setFocusSeconds === "function") setFocusSeconds(focusSec);
    if (typeof setStudyTimeInSeconds === "function") setStudyTimeInSeconds(studySec);
  }, [totalSec, focusSec, studySec, setTotalSeconds, setFocusSeconds, setStudyTimeInSeconds]);

  const handleStart = () => {
    setTotalSec(0);
    setFocusSec(0);
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
  };

  const handleRestart = () => {
    setTotalSec(0);
    setFocusSec(0);
    setOutOfFocusSec(0);
    setStudySec(0);
    setStatus("ready");
  };

  // 사용자가 입력한 목표 시간을 시간 단위로 받고 초로 변환 (예: 1.1 → 1.1 * 3600)
  const handleTargetChange = (e) => {
    const hours = parseFloat(e.target.value);
    if (!isNaN(hours) && hours > 0) {
      setTargetTime(hours * 3600);
    }
  };

  // 초를 00:00:00 형식으로 변환하는 함수
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // 목표 시간 대비 집중 시간 진행률 계산 (최대 100%)
  const progressPercentage = Math.min((focusSec / targetTime) * 100, 100);

  // 진행률 100% 달성 시 타이머 멈추고 부모에 현재 상태 전달
  useEffect(() => {
    if (progressPercentage >= 100 && status === "tracking") {
      handleStop();
      if (typeof onTimerComplete === "function") {
        onTimerComplete({
          totalSec,
          focusSec,
          outOfFocusSec,
          studySec,
        });
      }
    }
  }, [progressPercentage, status, onTimerComplete, totalSec, focusSec, outOfFocusSec, studySec]);

  return (
    <div className="focus-timer-container">
      <h2>Focus Timer</h2>
      {/* ProgressCircle 컴포넌트 내부에 목표 시간 입력 필드를 렌더링 */}
      <ProgressCircle
        progress={progressPercentage}
        targetTime={targetTime}
        handleTargetChange={handleTargetChange}
      />

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
          <span>
            {totalSec > 0 ? Math.round((focusSec / totalSec) * 100) : 0} pts
          </span>
        </div>
      </div>

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
    </div>
  );
};

FocusTimer.defaultProps = {
  setTotalSeconds: () => {},
  setFocusSeconds: () => {},
  setStudyTimeInSeconds: () => {},
};

export default FocusTimer;
