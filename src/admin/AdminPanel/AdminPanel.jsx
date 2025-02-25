import React, { useState, useEffect } from "react";
import PoseTracking from "../../components/PoseTracking/PoseTracking";
import FocusTimer from "../../components/FocusTimer/FocusTimer";
import ProgressCircle from "../../components/ProgressCircle/ProgressCircle";
import FocusFeedback from "../../components/FocusFeedback/FocusFeedback";
import { Box, Dialog, Typography, ThemeProvider, Button } from "@mui/material";
import theme from "../../theme";
import videoLogo from "../../assets/logos/focusee.mp4";
import logo from "../../assets/logos/focusee.png";
import closeicon from "../../assets/icon/close-24px.svg";
import AverageStudyTime from "../AverageStudyTime/AverageStudyTime";
import AverageFocusScore from "../AverageFocusScore/AverageFocusScore";
import FocusStreakChart from "../FocusStreakChart/FocusStreakChart";
import DecoratedCard from "../DecoratedCard/DecoratedCard";
import { UilChart } from "@iconscout/react-unicons";
import { supabase } from "../../supabaseClient";
import Footer from "../../components/Footer/Footer";
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
  const [averageFocusScore, setAverageFocusScore] = useState(0);
  const [focusStreak, setFocusStreak] = useState(0);
  const [focusHistory, setFocusHistory] = useState([]);

  const goalProgress = Math.min((focusSeconds / targetTime) * 100, 100);
  const focusQuality = totalSeconds > 0 ? Math.min((focusSeconds / totalSeconds) * 100, 100) : 0;

  const handleTargetChange = (newTargetTimeInSeconds) => {
    setTargetTime(newTargetTimeInSeconds);
  };

  const handleCardClick = (dataType) => {
    setModalDataType(dataType);
    setModalOpen(true);
  };

  const calculateStreak = (data) => {
    const formatDate = (dateString) => dateString.split("T")[0];
    const isConsecutiveDay = (prevDateStr, currentDateStr) => {
      const prevDate = new Date(prevDateStr);
      const currentDate = new Date(currentDateStr);
      const oneDay = 24 * 60 * 60 * 1000;
      return currentDate - prevDate === oneDay;
    };

    const filtered = data
      .filter((entry) => entry.score >= 90)
      .map((entry) => ({ ...entry, date: formatDate(entry.date) }));

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    let streak = 0;
    let maxStreakLocal = 0;
    let previousDate = null;

    filtered.forEach((entry) => {
      if (!previousDate) {
        streak = 1;
      } else {
        streak = isConsecutiveDay(previousDate, entry.date) ? streak + 1 : 1;
      }
      previousDate = entry.date;
      if (streak > maxStreakLocal) maxStreakLocal = streak;
    });
    setFocusStreak(maxStreakLocal);
  };

  const fetchFocusHistory = async () => {
    const { data, error } = await supabase.from("focus_data").select("*");

    if (error) {
      console.error("Error fetching focus history:", error);
    } else if (data) {
      setFocusHistory(data);
      const totalFocusedTime = data.reduce((sum, entry) => sum + entry.focused_time, 0);
      const avgStudyTime = data.length > 0 ? totalFocusedTime / data.length : 0;
      setAverageStudyTime(avgStudyTime / 60);
      const totalFocusScore = data.reduce((sum, entry) => sum + entry.score, 0);
      const avgFocusScore = data.length > 0 ? totalFocusScore / data.length : 0;
      setAverageFocusScore(avgFocusScore);
      calculateStreak(data);
    }
  };

  const saveFocusData = async () => {
    const focusData = {
      date: new Date().toISOString().split("T")[0],
      focused_time: focusSeconds,
      out_of_focus_time: totalSeconds - focusSeconds,
      total_time: totalSeconds,
      score: Math.round(focusQuality),
      goal_time: targetTime,
    };

    const { data, error } = await supabase.from("focus_data").insert([focusData]);

    if (error) {
      console.error("Error saving focus data:", error);
    } else {
      console.log("Focus data saved:", data);
      fetchFocusHistory();
    }
  };

  useEffect(() => {
    fetchFocusHistory();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box className="admin-panel-container">
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
            <Button className="modal-button" onClick={() => setInstructionsModalOpen(false)}>
              S T A R T
            </Button>
          </Box>
        </Dialog>
        

        <Box className="logo-container">
          <video src={videoLogo} autoPlay muted loop playsInline className="logo-video" />
        </Box>

        <div className="webcam-section">
          <div className="overlay-container">
            <PoseTracking onFocusChange={setInFocus} progress={goalProgress} />
            <FocusFeedback focusScore={focusQuality} showFeedback={totalSeconds > 0} />
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
                onStop={() => saveFocusData()}
              />
            </div>
          </div>
        </div>

        <Box className="card-container">
          <DecoratedCard
            title="Average Study Time"
            value={averageStudyTime ? averageStudyTime.toFixed(2) + " min" : "0.00 min"}
            icon={UilChart}
            onClick={() => handleCardClick("averageStudyTime")}
          />
          <DecoratedCard
            title="Average Focus Score"
            value={averageFocusScore ? averageFocusScore.toFixed(2) + "%" : "0.00 %"}
            icon={UilChart}
            onClick={() => handleCardClick("averageFocusScore")}
          />
          <DecoratedCard
            title="Over 90% Focus Streak"
            value={focusStreak > 0 ? `${focusStreak} days` : "0 days"}
            icon={UilChart}
            onClick={() => handleCardClick("focusStreak")}
          />
        </Box>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="lg">
          <Box className="modal-content">
            {modalDataType === "averageStudyTime" && (
              <AverageStudyTime setAverageStudyTime={setAverageStudyTime} />
            )}
            {modalDataType === "averageFocusScore" && <AverageFocusScore />}
            {modalDataType === "focusStreak" && (
              <FocusStreakChart onStreakCalculated={(streak) => setFocusStreak(streak)} />
            )}
            <Button onClick={() => setModalOpen(false)}>C L O S E</Button>
            <img src={closeicon} alt="close" className="modal-closeicon" onClick={() => setModalOpen(false)} />
          </Box>
        </Dialog>
      </Box>
      <Footer />
    </ThemeProvider>
  );
};

export default AdminPanel;
