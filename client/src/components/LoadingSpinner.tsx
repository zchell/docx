import React from 'react'
import styles from '../styles/LoadingSpinner.module.css'

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} aria-label="Loading...">
        <div className={styles.spinnerInner}></div>
      </div>
      <p className={styles.loadingText}>Loading product information...</p>
    </div>
  )
}

export default LoadingSpinner