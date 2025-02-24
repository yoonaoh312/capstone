import React, { useRef, useEffect } from "react";
import "./ProgressCircle.scss";

const ProgressCircle = ({ progress, targetTime, handleTargetChange }) => {
  const circumference = 2 * Math.PI * 50; // 원의 둘레 (반지름 = 50)
  const strokeOffset = Math.max(circumference - (progress / 100) * circumference, 0);
  const inputRef = useRef(null);

  // onWheel 이벤트 핸들러: 스크롤 방향에 따라 targetTime(초)을 업데이트
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1; // 아래로 스크롤하면 감소, 위로 스크롤하면 증가
    const currentHours = targetTime / 3600;
    const newHours = Math.max(currentHours + delta, 0.1); // 최소 0.1시간 유지
    console.log("Wheel event:", { delta, newHours });
    handleTargetChange(newHours * 3600);
  };

  // onChange 이벤트: 사용자가 직접 입력 시 처리
  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      handleTargetChange(value * 3600);
    }
  };

  useEffect(() => {
    const inputEl = inputRef.current;
    if (inputEl) {
      // passive 옵션을 false로 설정하여 preventDefault()를 허용하도록 등록
      inputEl.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (inputEl) {
        inputEl.removeEventListener("wheel", handleWheel);
      }
    };
  }, [targetTime]);

  return (
    <div className="progress-circle-container">
      <svg width="150" height="150" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" stroke="#ddd" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#4b5ae4"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <span className="progress-text">{progress.toFixed(1)}%</span>

      <div className="target-time-input">
        <label htmlFor="targetTime" className="target-time-label">
          TARGET TIME (hours):
        </label>
        <input
          id="targetTime"
          type="number"
          min="0.1"
          step="0.1"
          value={(targetTime / 3600).toFixed(1)}
          onChange={handleInputChange}
          ref={inputRef}
        />
      </div>
    </div>
  );
};

export default React.memo(ProgressCircle);
