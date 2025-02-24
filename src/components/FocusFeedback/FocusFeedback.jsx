import React from "react";
import "./FocusFeedback.scss";

const FocusFeedback = ({ focusScore, showFeedback }) => {
  if (!showFeedback) return null;
  const getFeedbackMessage = (score) => {
    if (score <= 70)
      return { message: "You need to try harder.", color: "#f44336", emoji: "😕" };
    if (score < 80)
      return { message: "You're doing well, keep it up!", color: "#ff9800", emoji: "😊" };
    if (score < 90)
      return { message: "Great job, but try a bit harder!", color: "#ffeb3b", emoji: "🙂" };
    return { message: "Awesome, you're doing amazing!", color: "#4caf50", emoji: "🎉" };
  };

  const feedback = getFeedbackMessage(focusScore);

  return (
    <div className="feedback" style={{ color: feedback.color }}>
      <p>
        {feedback.emoji} {feedback.message}
      </p>
    </div>
  );
};

export default FocusFeedback;
