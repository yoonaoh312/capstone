import React, { useState } from "react";
import PoseTracking from "../../components/PoseTracking/PoseTracking";
import FocusTimer from "../../components/FocusTimer/FocusTimer";
import FocusFeedback from "../../components/FocusFeedback/FocusFeedback";
import WeeklyFocusChart from "../WeeklyFocusChart/WeeklyFocusChart";
import { Box, Card, CardContent, Dialog, Typography, ThemeProvider, Button } from "@mui/material";
import theme from "../../theme";
import videoLogo from "../../assets/logo/focusee.mp4"; // focusee.mp4 비디오 파일
import logo from "../../assets/logo/focusee.png"; // 작은 로고 이미지
import "./AdminPanel.scss";

// 시간을 "00:00:00" 형식으로 변환하는 함수
const formatTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const AdminPanel = () => {
  // 시간 관련 상태 (부모)
  const [inFocus, setInFocus] = useState(false);
  const [studyTimeInSeconds, setStudyTimeInSeconds] = useState(0);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [openChart, setOpenChart] = useState(false);
  const [graphModalOpen, setGraphModalOpen] = useState(false);
  const [modalDataType, setModalDataType] = useState("");
  // 타이머 완료 시 최종 시간 데이터 저장
  const [finalTimerStats, setFinalTimerStats] = useState({
    totalSec: 0,
    focusSec: 0,
    outOfFocusSec: 0,
    studySec: 0,
  });
  const [congratsModalOpen, setCongratsModalOpen] = useState(false);
  // Instructions 모달 상태
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(true);

  // 집중도(%) 계산 (총 시간이 0이면 0%)
  const progress = totalSeconds ? (focusSeconds / totalSeconds) * 100 : 0;

  // FocusTimer가 100% 달성 시 호출될 콜백 (모달 열기)
  const handleTimerComplete = (stats) => {
    setFinalTimerStats(stats);
    setCongratsModalOpen(true);
  };

  // 카드 클릭 시 dataType에 따라 모달 열기
  const handleCardClick = (dataType) => {
    setModalDataType(dataType);
    setGraphModalOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="admin-panel-container">
        {/* 로고 영역: focusee.mp4 비디오 사용 */}
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

        {/* 웹캠 & 피드백 오버레이 컨테이너 */}
        <div className="overlay-container">
          <PoseTracking onFocusChange={setInFocus} progress={progress} />
          <FocusFeedback progress={progress} showFeedback={totalSeconds > 0} />
        </div>

        {/* Focus Timer */}
        <FocusTimer
          inFocus={inFocus}
          setStudyTimeInSeconds={setStudyTimeInSeconds}
          setFocusSeconds={setFocusSeconds}
          setTotalSeconds={setTotalSeconds}
          onTimerComplete={handleTimerComplete}
        />

        {/* 카드 영역 */}
        <Box className="card-container">
          <Card className="card" onClick={() => handleCardClick("averageStudyTime")}>
            <CardContent>
              <Typography className="card-title">
                Average Study Time (a day)
              </Typography>
              <Typography className="card-value">
                {formatTime(studyTimeInSeconds)}
              </Typography>
            </CardContent>
          </Card>

          <Card className="card" onClick={() => handleCardClick("averageFocusScore")}>
            <CardContent>
              <Typography className="card-title">
                Average Focus Score
              </Typography>
              <Typography className="card-value">
                {progress.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>

          <Card className="card" onClick={() => handleCardClick("focusGoalAchievement")}>
            <CardContent>
              <Typography className="card-title">
                Average Focus Goal Achievement
              </Typography>
              <Typography className="card-value">
                {totalSeconds > 0 ? Math.round((focusSeconds / totalSeconds) * 100) : 0}%
              </Typography>
            </CardContent>
          </Card>

          <Card className="card" onClick={() => handleCardClick("studyStreak")}>
            <CardContent>
              <Typography className="card-title">
                Study Streak
              </Typography>
              <Typography className="card-value">
                5 days
              </Typography>
            </CardContent>
          </Card>

          <Card className="card" onClick={() => handleCardClick("consistency")}>
            <CardContent>
              <Typography className="card-title">
                Consistency
              </Typography>
              <Typography className="card-value">
                85%
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* 주간 포커스 차트 모달 */}
        <Dialog open={openChart} onClose={() => setOpenChart(false)} fullWidth maxWidth="md">
          <Box className="modal-content">
            <Typography className="modal-title">Weekly Focus Chart</Typography>
            <WeeklyFocusChart />
          </Box>
        </Dialog>

        {/* 그래프 모달 (간단 텍스트 모달) */}
        <Dialog open={graphModalOpen} onClose={() => setGraphModalOpen(false)} fullWidth maxWidth="sm">
          <Box className="modal-content modal-center">
            <Typography className="modal-title">[Graph Modal: {modalDataType}]</Typography>
            <button onClick={() => setGraphModalOpen(false)}>Close</button>
          </Box>
        </Dialog>

        {/* 타이머 100% 달성 시 모달 (축하 메시지 및 최종 데이터) */}
        <Dialog open={congratsModalOpen} onClose={() => setCongratsModalOpen(false)} fullWidth maxWidth="sm">
          <Box className="modal-content modal-center">
            <Typography className="modal-title">Congratulations!</Typography>
            <Typography className="modal-message">You made it 🎉</Typography>
            <Typography className="modal-info">
              Total Study Time: {formatTime(finalTimerStats.studySec)}
            </Typography>
            <Typography className="modal-info">
              Total Focus Time: {formatTime(finalTimerStats.focusSec)}
            </Typography>
            <Typography className="modal-info">
              Focus Score:{" "}
              {finalTimerStats.totalSec > 0
                ? Math.round((finalTimerStats.focusSec / finalTimerStats.totalSec) * 100)
                : 0}
              %
            </Typography>
            <button onClick={() => setCongratsModalOpen(false)}>Close</button>
          </Box>
        </Dialog>

        {/* Instructions 모달 */}
        <Dialog open={instructionsModalOpen} onClose={() => setInstructionsModalOpen(false)} fullWidth maxWidth="sm">
          <Box className="modal-content modal-center">
            <img src={logo} alt="Focusee Logo" className="modal-logo" />
            <Typography className="modal-title">Welcome to Focusee!</Typography>
            <Typography className="modal-message">
              Before we start, please ensure:
              <br />
              1. <strong>CHECK YOUR FOCUS ZONE:</strong>
              <br />
              🧐 Remove distractions and ensure your face is centered.
              <br />
              🚫 When picking up an item, check if your face leaves the green box.<br />If not, move it further away.
              <br />
              2. <strong>FOCUS GOAL & TIMER:</strong>
              <br />
              ⏱️ Set your focus goal and timer (6-minute increments).<br />You can adjust them during the session.
              <br />
              Let's see how focused you are today!
            </Typography>
            <Button className="modal-button" onClick={() => setInstructionsModalOpen(false)}>
              S T A R T
            </Button>

          </Box>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default AdminPanel;
