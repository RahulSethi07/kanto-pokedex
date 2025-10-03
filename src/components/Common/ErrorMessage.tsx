import React from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className={styles.error} role="alert">
    <p>{message}</p>
    {onRetry && (
      <button type="button" className={styles.retry} onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
