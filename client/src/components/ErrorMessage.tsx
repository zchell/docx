import * as React from 'react'
import styles from '../styles/ErrorMessage.module.css'

interface ErrorMessageProps {
  message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.errorBox}>
        <div className={styles.icon}>⚠️</div>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.message}>{message}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  )
}

export default ErrorMessage