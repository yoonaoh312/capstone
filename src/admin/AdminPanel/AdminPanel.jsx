import React, { useState } from "react";
import PoseTracking from "../../components/PoseTracking/PoseTracking";
import FocusTimer from "../../components/FocusTimer/FocusTimer";
import FocusFeedback from "../../components/FocusFeedback/FocusFeedback";
import WeeklyFocusChart from "../WeeklyFocusChart/WeeklyFocusChart";
import { Box, Card, CardContent, Dialog, Typography, ThemeProvider } from "@mui/material";
import theme from "../../theme";
import logo from "../../assets/logo/focusee.png";
import "./AdminPanel.scss";

const AdminPanel = () => {
  // 부모에서 시간 관련 상태를 관리합니다.
  const [inFocus, setInFocus] = useState(false);
  const [studyTimeInSeconds, setStudyTimeInSeconds] = useState(0);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [openChart, setOpenChart] = useState(false);

  // 집중도(%) 계산 (총 시간이 0이면 0%)
  const progress = totalSeconds ? (focusSeconds / totalSeconds) * 100 : 0;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, p: 3 }}>
        {/* 로고 */}
        <Box sx={{ mb: 2 }}>
          <img src={logo} alt="Focusee Logo" style={{ width: "400px", height: "auto" }} />
        </Box>

        {/* 웹캠 & 피드백 오버레이 컨테이너 */}
        <div className="overlay-container">
          <PoseTracking onFocusChange={setInFocus} progress={progress} />
          {/* 타이머가 시작된 후(totalSeconds > 0)만 피드백 표시 */}
          <FocusFeedback progress={progress} showFeedback={totalSeconds > 0} />
        </div>

        {/* Focus Timer */}
        <FocusTimer 
          inFocus={inFocus} 
          setStudyTimeInSeconds={setStudyTimeInSeconds} 
          setFocusSeconds={setFocusSeconds} 
          setTotalSeconds={setTotalSeconds}
        />

        {/* 카드 영역 */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Card
            sx={{ boxShadow: 3, borderRadius: 3, p: 2, minWidth: 200, cursor: "pointer" }}
            onClick={() => setOpenChart(true)}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Total Study Time
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {studyTimeInSeconds} sec
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{ boxShadow: 3, borderRadius: 3, p: 2, minWidth: 200, cursor: "pointer" }}
            onClick={() => setOpenChart(true)}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Focus Score
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {progress.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{ boxShadow: 3, borderRadius: 3, p: 2, minWidth: 200, cursor: "pointer" }}
            onClick={() => setOpenChart(true)}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Growth Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                +12%
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* 주간 포커스 차트 모달 */}
        <Dialog open={openChart} onClose={() => setOpenChart(false)} fullWidth maxWidth="md">
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Weekly Focus Chart
            </Typography>
            <WeeklyFocusChart />
          </Box>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default AdminPanel;
