import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './DecoratedCard.scss';

const DecoratedCard = ({ title, value, onClick }) => {
  return (
    <Card className="card decorated-card" onClick={onClick}>
      <CardContent style={{ textAlign: 'center' }}>
        {/*
          아이콘에 className="icon"을 부여하여 SCSS에서 스타일링할 수 있도록 합니다.
        */}
        <ShowChartIcon className="icon" />
        <Typography className="card-title" style={{ marginTop: '0.5rem' }}>
          {title}
        </Typography>
        <Typography className="card-value">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DecoratedCard;
