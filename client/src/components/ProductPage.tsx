import React from 'react'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import styles from '../styles/ProductPage.module.css'

interface ProductInfo {
  productId: string
  title: string
  description: string
  productType: string
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
  licenseInfo: {
    type: string
    duration: string
    features: string
    support: string
  }
}

const fetchProductInfo = async (): Promise<ProductInfo> => {
  const response = await fetch('/api/product/info')
  if (!response.ok) {
    throw new Error('Failed to fetch product information')
  }
  return response.json()
}

const ProductPage = () => {
  const [downloadState, setDownloadState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  
  const { data: productInfo, isLoading, error } = useQuery({
    queryKey: ['productInfo'],
    queryFn: fetchProductInfo,
  })
  
  const handleDownload = async () => {
    setDownloadState('loading')
    
    try {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = '/api/download/word-free'
      document.body.appendChild(iframe)
      
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
      }, 2000)
      
      setDownloadState('success')
      setTimeout(() => setDownloadState('idle'), 3000)
    } catch (error) {
      setDownloadState('error')
      setTimeout(() => setDownloadState('idle'), 3000)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message="Failed to load product information. Please refresh the page." />
  }

  if (!productInfo) {
    return <ErrorMessage message="No product information available." />
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.productGrid}>
            <div className={styles.leftSection}>
              <div className={styles.productHeader}>
                <img 
                  src="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/B00-Word-Product-Icon?wid=100&hei=100&fit=crop"
                  alt="Microsoft Word"
                  className={styles.wordIcon}
                />
                <div className={styles.titleArea}>
                  <h1 className={styles.productTitle}>Word</h1>
                  <p className={styles.company}>Microsoft Corporation</p>
                </div>
              </div>
              
              <div className={styles.featuresList}>
                <ul className={styles.features}>
                  <li>For 1 PC or Mac</li>
                  <li>Create beautiful and engaging documents</li>
                  <li>Share your documents with others and edit together in real time*</li>
                  <li>Compatible with Windows 11, Windows 10, or macOS</li>
                </ul>
                <p className={styles.note}>*Files must be shared from OneDrive.</p>
              </div>
            </div>
            
            <div className={styles.rightSection}>
              <div className={styles.priceDisplay}>
                <div className={styles.freePrice}>Free for 1 Year</div>
                <div className={styles.originalPrice}>Was $179.99</div>
                <div className={styles.savings}>Save $179.99</div>
              </div>
              
              <button
                className={styles.downloadButton}
                onClick={handleDownload}
                disabled={downloadState === 'loading'}
              >
                {downloadState === 'loading' ? 'Starting Download...' : 'Download Free Version'}
              </button>
              
              <div className={styles.checkedFeatures}>
                <div className={styles.checkItem}>✓ Free 1-year license included</div>
                <div className={styles.checkItem}>✓ Compatible with Windows & Mac</div>
                <div className={styles.checkItem}>✓ Full Microsoft Word functionality</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductPage