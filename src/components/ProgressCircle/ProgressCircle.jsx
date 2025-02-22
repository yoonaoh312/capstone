import React from "react";
import "./ProgressCircle.scss";

const ProgressCircle = ({ progress, targetTime, handleTargetChange }) => {
  const circumference = 2 * Math.PI * 50; // radius = 50
  const strokeOffset = Math.max(circumference - (progress / 100) * circumference, 0);

  // 마우스 휠 이벤트 핸들러: 스크롤로 목표 시간 값을 조정
  const onWheel = (e) => {
    e.preventDefault(); // 기본 스크롤 동작 방지
    const currentVal = parseFloat(e.target.value) || 0;
    // 휠 방향에 따라 값을 0.1씩 증가 또는 감소
    const delta = e.deltaY;
    const newVal = delta < 0 ? currentVal + 0.1 : currentVal - 0.1;
    if (newVal > 0) {
      // synthetic event 객체 생성 후 handleTargetChange 호출
      handleTargetChange({ target: { value: newVal.toString() } });
    }
  };

  return (
    <div className="progress-circle-container">
      <svg width="150" height="150" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#ddd"
          strokeWidth="10"
          fill="none"
        />
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
        <label htmlFor="targetTime">Target Time (hours): </label>
        <input
          id="targetTime"
          type="number"
          min="0.1"
          step="0.1"
          value={targetTime / 3600}
          onChange={handleTargetChange}
          onWheel={onWheel}
        />
      </div>
    </div>
  );
};

export default React.memo(ProgressCircle);
