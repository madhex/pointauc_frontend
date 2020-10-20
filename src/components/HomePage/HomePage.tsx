import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Paper } from '@material-ui/core';
import ROUTES from '../../constants/routes.constants';
import './HomePage.scss';

const HomePage: React.FC = () => {
  return (
    <Paper className="home-page">
      <Link to={ROUTES.AUC_PAGE}>
        <Button variant="contained" color="primary" className="home-page-button">
          Аукцион
        </Button>
      </Link>
      <Link to={ROUTES.VIDEO_REQUESTS}>
        <Button variant="contained" color="primary" className="home-page-button">
          Видео реквесты
        </Button>
      </Link>
      <Link to={ROUTES.CHAT_BOT}>
        <Button variant="contained" color="primary" className="home-page-button">
          Чат бот
        </Button>
      </Link>
    </Paper>
  );
};

export default HomePage;
