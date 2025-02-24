// FocusStreakCard.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Popover, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const formatDate = (dateString) => dateString.split('T')[0];

const isConsecutiveDay = (prevDateStr, currentDateStr) => {
  const prevDate = new Date(prevDateStr);
  const currentDate = new Date(currentDateStr);
  const oneDay = 24 * 60 * 60 * 1000;
  return currentDate - prevDate === oneDay;
};

const FocusStreakChart = () => {
  const [focusHistory, setFocusHistory] = useState([]);
  const [maxStreak, setMaxStreak] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchFocusHistory = async () => {
    try {
      const response = await fetch('http://localhost:5050/focus-history');
      const result = await response.json();
      if (result.focusData) {
        setFocusHistory(result.focusData);
        calculateStreak(result.focusData);
      }
    } catch (error) {
      console.error('Error fetching focus history:', error);
    }
  };

  const calculateStreak = (data) => {
    const filtered = data
      .filter((entry) => entry.score >= 90)
      .map((entry) => ({
        ...entry,
        date: formatDate(entry.date),
      }));
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
    setMaxStreak(maxStreakLocal);
  };

  useEffect(() => {
    fetchFocusHistory();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? 'focus-streak-popover' : undefined;

  return (
    <>
      <Card onClick={handleClick} style={{ cursor: 'pointer' }}>
        <CardContent>
          <Typography variant="h6">Focus Streak</Typography>
          <Typography variant="h4">{maxStreak} days</Typography>
          <IconButton size="small" onClick={handleClick}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </CardContent>
      </Card>
      <Popover
        id={popoverId}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ width: 500, height: 300, padding: 16 }}>
          <Typography variant="subtitle1" gutterBottom>
            Focus Streak Detail
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={focusHistory}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(tick) => formatDate(tick)} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4b5ae4"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Popover>
    </>
  );
};

export default FocusStreakChart;
