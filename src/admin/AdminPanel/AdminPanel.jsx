import React, { useState, useEffect } from "react";
import PoseTracking from "../../components/PoseTracking/PoseTracking";
import FocusTimer from "../../components/FocusTimer/FocusTimer";
import ProgressCircle from "../../components/ProgressCircle/ProgressCircle";
import FocusFeedback from "../../components/FocusFeedback/FocusFeedback";
import { Box, Card, CardContent, Dialog, Typography, ThemeProvider, Button } from "@mui/material";
import theme from "../../theme";
import videoLogo from "../../assets/logos/focusee.mp4";
import logo from "../../assets/logos/focusee.png";
import closeicon from "../../assets/icon/close-24px.svg";
import AverageStudyTime from "../AverageStudyTime/AverageStudyTime";
import AverageFocusScore from "../AverageFocusScore/AverageFocusScore";
import FocusStreakChart from "../FocusStreakChart/FocusStreakChart";
import "./AdminPanel.scss";

const AdminPanel = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDataType, setModalDataType] = useState("");
  const [inFocus, setInFocus] = useState(false);
  const [studyTimeInSeconds, setStudyTimeInSeconds] = useState(0);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(true);

  const [targetTime, setTargetTime] = useState(3600);
  const [averageStudyTime, setAverageStudyTime] = useState(0);
  const [focusHistory, setFocusHistory] = useState([]);
  const [averageFocusScore, setAverageFocusScore] = useState(0);
  const [focusStreak, setFocusStreak] = useState(0);

  const goalProgress = Math.min((focusSeconds / targetTime) * 100, 100);
  const focusQuality =
    totalSeconds > 0 ? Math.min((focusSeconds / totalSeconds) * 100, 100) : 0;

  const handleTargetChange = (newTargetTimeInSeconds) => {
    setTargetTime(newTargetTimeInSeconds);
  };

  const handleCardClick = (dataType) => {
    setModalDataType(dataType);
    setModalOpen(true);
  };

  const saveFocusData = async () => {
    const focusData = {
      date: new Date().toISOString(),
      focusedTime: focusSeconds,
      outOfFocusTime: totalSeconds - focusSeconds,
      totalTime: totalSeconds,
      score: Math.round(focusQuality),
      goalTime: targetTime,
    };

    try {
      const response = await fetch("http://localhost:5050/update-focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(focusData),
      });
      const result = await response.json();
      if (result.success) {
        console.log("✅ Focus data saved:", result.data);
        fetchFocusHistory();
      } else {
        console.error("❌ Failed to save focus data");
      }
    } catch (error) {
      console.error("🚨 Error saving focus data:", error);
    }
  };

  const fetchFocusHistory = async () => {
    try {
      const response = await fetch("http://localhost:5050/focus-history");
      const result = await response.json();
      if (result.focusData) {
        setFocusHistory(result.focusData);
        const totalFocusedTime = result.focusData.reduce(
          (sum, entry) => sum + entry.focusedTime,
          0
        );
        const avgStudyTime =
          result.focusData.length > 0
            ? totalFocusedTime / result.focusData.length
            : 0;
        setAverageStudyTime(avgStudyTime / 60);
        const totalFocusScore = result.focusData.reduce(
          (sum, entry) => sum + entry.score,
          0
        );
        const avgFocusScore =
          result.focusData.length > 0
            ? totalFocusScore / result.focusData.length
            : 0;
        setAverageFocusScore(avgFocusScore);
      }
    } catch (error) {
      console.error("🚨 Error fetching focus history:", error);
    }
  };

  useEffect(() => {
    fetchFocusHistory();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box className="admin-panel-container">
        {/* Instruction Modal */}
        <Dialog
          open={instructionsModalOpen}
          onClose={() => setInstructionsModalOpen(false)}
          fullScreen
        >
          <Box className="modal-content modal-center">
            <img src={logo} alt="Focusee Logo" className="modal-logo" />
            <img
              src={closeicon}
              alt="close"
              className="modal-closeicon"
              onClick={() => setInstructionsModalOpen(false)}
            />
            <Typography className="modal-title">
              Welcome to <strong>FOCUSEE</strong>
            </Typography>
            <Typography className="modal-message">
              Before we start, please ensure:
              <br /><br />
              <strong>CHECK YOUR FOCUS ZONE:</strong>
              <br />
              Remove distractions and ensure your face is centered.
              <br />
              If you're not studying or picking up items, keep outside the focus zone.
              <br /><br />
              <strong>FOCUS GOAL & TIMER:</strong>
              <br />
              Set your focus goal and timer (6-minute increments).
              <br />
              Let's see how focused you are today!
            </Typography>
            <Button
              className="modal-button"
              onClick={() => setInstructionsModalOpen(false)}
            >
              S T A R T
            </Button>
          </Box>
        </Dialog>

        {/* 로고 영역 */}
        <Box className="logo-container">
          <video
            src={videoLogo}
            autoPlay
            muted
            loop
            playsInline
            className="logo-video"
          />
        </Box>

        {/* 웹캠 영역 */}
        <div className="webcam-section">
          <div className="overlay-container">
            <PoseTracking onFocusChange={setInFocus} progress={goalProgress} />
            <FocusFeedback
              focusScore={focusQuality}
              showFeedback={totalSeconds > 0}
            />
          </div>
          <div className="down-row">
            <div className="progress-section">
              <ProgressCircle
                progress={goalProgress}
                targetTime={targetTime}
                handleTargetChange={handleTargetChange}
              />
            </div>
            <div className="timer-section">
              <FocusTimer
                inFocus={inFocus}
                setStudyTimeInSeconds={setStudyTimeInSeconds}
                setFocusSeconds={setFocusSeconds}
                setTotalSeconds={setTotalSeconds}
                targetTime={targetTime}
                // onStop prop 전달: FocusTimer에서 Stop 버튼이 눌리면 saveFocusData()를 호출
                onStop={() => saveFocusData()}
              />
            </div>
          </div>
        </div>

        {/* 카드 영역 */}
        <Box className="card-container">
          <Card className="card" onClick={() => handleCardClick("averageStudyTime")}>
            <CardContent>
              <Typography className="card-title">Average Study Time</Typography>
              <Typography className="card-value">
                {averageStudyTime ? averageStudyTime.toFixed(2) : "0.00"} min
              </Typography>
            </CardContent>
          </Card>
          <Card className="card" onClick={() => handleCardClick("averageFocusScore")}>
            <CardContent>
              <Typography className="card-title">Average Focus Score</Typography>
              <Typography className="card-value">
                {averageFocusScore ? averageFocusScore.toFixed(2) : "0.00"}%
              </Typography>
            </CardContent>
          </Card>
          <Card className="card" onClick={() => handleCardClick("focusStreak")}>
            <CardContent>
              <Typography className="card-title">Focus Streak</Typography>
              <Typography className="card-value">
                {focusStreak} days streak
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* 모달 영역 */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="lg">
          <Box className="modal-content">
            {modalDataType === "averageStudyTime" && (
              <AverageStudyTime setAverageStudyTime={setAverageStudyTime} />
            )}
            {modalDataType === "averageFocusScore" && <AverageFocusScore />}
            {modalDataType === "focusStreak" && <FocusStreakChart focusHistory={focusHistory} />}
            <Button onClick={() => setModalOpen(false)}>C L O S E</Button>
            <img
              src={closeicon}
              alt="close"
              className="modal-closeicon"
              onClick={() => setModalOpen(false)}
            />
          </Box>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default AdminPanel;
