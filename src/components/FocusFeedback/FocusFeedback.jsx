import React from "react";
import "./FocusFeedback.scss";

const FocusFeedback = ({ progress, showFeedback }) => {
  // 타이머가 아직 시작되지 않았으면 아무것도 렌더링하지 않음
  if (!showFeedback) return null;

  const getFeedbackMessage = (progress) => {
    if (progress <= 70)
      return { message: "You need to try harder.", color: "#f44336", emoji: "😕" };
    if (progress < 80)
      return { message: "You're doing well, keep it up!", color: "#ff9800", emoji: "😊" };
    if (progress < 90)
      return { message: "Great job, but try a bit harder!", color: "#ffeb3b", emoji: "🙂" };
    return { message: "Awesome, you're doing amazing!", color: "#4caf50", emoji: "🎉" };
  };

  const feedback = getFeedbackMessage(progress);

  return (
    <div className="feedback" style={{ color: feedback.color }}>
      <p>{feedback.emoji} {feedback.message}</p>
    </div>
  );
};

export default FocusFeedback;
