import React from 'react';
import styles from './LoadingIndicator.module.css';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = 'Loading…' }) => (
  <div className={styles.loading} role="status" aria-live="polite">
    <span className={styles.spinner} aria-hidden="true" />
    <span className={styles.text}>{message}</span>
  </div>
);

export default LoadingIndicator;
