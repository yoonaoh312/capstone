import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { UilChart } from '@iconscout/react-unicons';
import './DecoratedCard.scss';

const DecoratedCard = ({ title, value, icon: IconComponent, onClick }) => {
  return (
    <Card className="card decorated-card" onClick={onClick}>
      <CardContent style={{ textAlign: 'center' }}>
        {IconComponent && <IconComponent size="40" color="#ecf0f1" />}
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
