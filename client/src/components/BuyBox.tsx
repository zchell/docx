import React from 'react'
import styles from '../styles/BuyBox.module.css'

interface BuyBoxProps {
  price: {
    currency: string
    current: string
    original: string
    savings: string
    dynamicOriginalPrice: string
  }
  action: {
    action: string
    actionText: string
    behaviorTag: number
    disabled: boolean
  }
}

const BuyBox = ({ action }: BuyBoxProps) => {
  const [downloadState, setDownloadState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleDownload = async () => {
    if (downloadState === 'loading') return

    setDownloadState('loading')

    try {
      // Create a hidden link to trigger the download
      const downloadLink = document.createElement('a')
      downloadLink.href = '/api/download/word-free'
      downloadLink.download = 'Word_Free_1Year_Setup.msi'
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      
      // Trigger the download
      downloadLink.click()
      document.body.removeChild(downloadLink)
      
      // Show success state
      setDownloadState('success')
      
      // Reset state after 3 seconds
      setTimeout(() => {
        setDownloadState('idle')
      }, 3000)
      
    } catch (error) {
      console.error('Download error:', error)
      setDownloadState('error')
      
      // Reset state after 3 seconds
      setTimeout(() => {
        setDownloadState('idle')
      }, 3000)
    }
  }

  const getButtonText = () => {
    switch (downloadState) {
      case 'loading':
        return 'Starting Download...'
      case 'success':
        return '✓ Download Started!'
      case 'error':
        return '❌ Download Failed - Try Again'
      default:
        return 'Download Free Version'
    }
  }

  const getButtonClass = () => {
    switch (downloadState) {
      case 'loading':
        return `${styles.downloadButton} ${styles.loading}`
      case 'success':
        return `${styles.downloadButton} ${styles.success}`
      case 'error':
        return `${styles.downloadButton} ${styles.error}`
      default:
        return styles.downloadButton
    }
  }

  return (
    <div className={styles.buyBox}>
      <div className={styles.priceSection}>
        <div className={styles.currentPrice}>
          Free for 1 Year
        </div>
        <div className={styles.originalPrice}>
          Was $179.99
        </div>
        <div className={styles.savings}>
          Save $179.99
        </div>
      </div>
      
      <button
        className={getButtonClass()}
        onClick={handleDownload}
        disabled={action.disabled || downloadState === 'loading'}
        aria-label={action.actionText}
      >
        {downloadState === 'loading' && (
          <span className={styles.spinner} aria-hidden="true"></span>
        )}
        {getButtonText()}
      </button>
      
      <div className={styles.licenseInfo}>
        <p>✓ Free 1-year license included</p>
        <p>✓ Compatible with Windows & Mac</p>
        <p>✓ Full Microsoft Word functionality</p>
      </div>
    </div>
  )
}

export default BuyBox