import React from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => (
  <div className={styles.wrapper}>
    <ErrorMessage message="The page you are looking for could not be found." />
    <Link to="/list" className={styles.link}>
      Return to roster
    </Link>
  </div>
);

export default NotFound;
