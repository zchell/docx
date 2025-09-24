import * as React from 'react'
import styles from '../styles/ProductHeader.module.css'

interface ProductHeaderProps {
  title: string
  productType: string
}

const ProductHeader = ({ title, productType }: ProductHeaderProps) => {
  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <a href="/" className={styles.breadcrumbLink}>Microsoft Store</a>
          </li>
          <li>
            <a href="/microsoft-365" className={styles.breadcrumbLink}>Microsoft 365</a>
          </li>
          <li aria-current="page" className={styles.breadcrumbCurrent}>Word</li>
        </ol>
      </nav>
      
      <div className={styles.titleSection}>
        <span className={styles.productType}>{productType}</span>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  )
}

export default ProductHeader