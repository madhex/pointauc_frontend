import React, { CSSProperties } from 'react';
import { CircularProgress } from '@material-ui/core';
import './LoadingPage.scss';

interface LoadingPageProps {
  helpText?: string;
  style?: CSSProperties;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ helpText, style }) => {
  return (
    <div className="loading-page" style={style}>
      <CircularProgress className="loading-page-spinner" />
      {!!helpText && <div style={{ color: '#fff' }}>{helpText}</div>}
    </div>
  );
};

export default LoadingPage;
