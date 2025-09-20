import React from 'react'
import { useQuery } from '@tanstack/react-query'
import BuyBox from './BuyBox'
import ProductHeader from './ProductHeader'
import ProductDetails from './ProductDetails'
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

const ProductPage: React.FC = () => {
  const { data: productInfo, isLoading, error } = useQuery({
    queryKey: ['productInfo'],
    queryFn: fetchProductInfo,
  })

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
          <div className={styles.grid}>
            <div className={styles.productInfo}>
              <ProductHeader 
                title={productInfo.title}
                productType={productInfo.productType}
              />
              
              <div className={styles.productImage}>
                <img 
                  src="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/B00-Word-Product-Icon?wid=200&hei=200&fit=crop"
                  alt="Microsoft Word"
                  className={styles.productIcon}
                />
              </div>
              
              <ProductDetails 
                description={productInfo.description}
                licenseInfo={productInfo.licenseInfo}
              />
            </div>
            
            <div className={styles.buyBoxContainer}>
              <BuyBox 
                price={productInfo.price}
                action={productInfo.action}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductPage