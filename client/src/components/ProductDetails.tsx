import React from 'react'
import styles from '../styles/ProductDetails.module.css'

interface ProductDetailsProps {
  description: string
  licenseInfo: {
    type: string
    duration: string
    features: string
    support: string
  }
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ description, licenseInfo }) => {
  const descriptionLines = description.split('\n').filter(line => line.trim())

  return (
    <div className={styles.details}>
      <section className={styles.description}>
        <h2 className={styles.sectionTitle}>What's included</h2>
        <ul className={styles.featureList}>
          {descriptionLines.map((line, index) => (
            <li key={index} className={styles.feature}>
              {line.replace('• ', '').trim()}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.licenseSection}>
        <h3 className={styles.sectionTitle}>License Information</h3>
        <div className={styles.licenseGrid}>
          <div className={styles.licenseItem}>
            <strong>License Type:</strong> {licenseInfo.type}
          </div>
          <div className={styles.licenseItem}>
            <strong>Duration:</strong> {licenseInfo.duration}
          </div>
          <div className={styles.licenseItem}>
            <strong>Features:</strong> {licenseInfo.features}
          </div>
          <div className={styles.licenseItem}>
            <strong>Support:</strong> {licenseInfo.support}
          </div>
        </div>
      </section>

      <section className={styles.systemRequirements}>
        <h3 className={styles.sectionTitle}>System Requirements</h3>
        <div className={styles.requirementGrid}>
          <div className={styles.requirement}>
            <strong>Windows:</strong> Windows 11, Windows 10, or Windows Server 2019
          </div>
          <div className={styles.requirement}>
            <strong>Mac:</strong> macOS 10.14 or later
          </div>
          <div className={styles.requirement}>
            <strong>Memory:</strong> 4 GB RAM minimum, 8 GB recommended
          </div>
          <div className={styles.requirement}>
            <strong>Storage:</strong> 2.5 GB available disk space
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetails