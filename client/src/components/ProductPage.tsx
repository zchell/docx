import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

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
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-microsoft">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Left Section */}
            <div className="space-y-8">
              <div className="flex items-center space-x-6 animate-slide-up">
                <div className="relative">
                  <img 
                    src="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/B00-Word-Product-Icon?wid=100&hei=100&fit=crop"
                    alt="Microsoft Word"
                    className="w-20 h-20 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-microsoft-blue text-white text-xs px-2 py-1 rounded-full font-semibold">FREE</div>
                </div>
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold text-microsoft-gray-900 tracking-tight">Word</h1>
                  <p className="text-microsoft-gray-600 font-medium">Microsoft Corporation</p>
                </div>
              </div>
              
              <div className="space-y-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-microsoft-blue rounded-full mt-2"></div>
                    <span className="text-microsoft-gray-700 leading-relaxed">For 1 PC or Mac</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-microsoft-blue rounded-full mt-2"></div>
                    <span className="text-microsoft-gray-700 leading-relaxed">Create beautiful and engaging documents</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-microsoft-blue rounded-full mt-2"></div>
                    <span className="text-microsoft-gray-700 leading-relaxed">Share your documents with others and edit together in real time*</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-microsoft-blue rounded-full mt-2"></div>
                    <span className="text-microsoft-gray-700 leading-relaxed">Compatible with Windows 11, Windows 10, or macOS</span>
                  </li>
                </ul>
                <p className="text-sm text-microsoft-gray-500 italic border-l-4 border-microsoft-blue pl-4">*Files must be shared from OneDrive.</p>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="lg:pl-8 space-y-6">
              <div className="bg-gradient-to-r from-microsoft-blue to-microsoft-purple text-white p-6 rounded-xl animate-scale-in">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">Free for 1 Year</div>
                  <div className="text-microsoft-blue-100 line-through text-lg">Was $179.99</div>
                  <div className="text-microsoft-green text-xl font-semibold bg-white/20 px-3 py-1 rounded-full inline-block">Save $179.99</div>
                </div>
              </div>
              
              <button
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  downloadState === 'loading' 
                    ? 'bg-microsoft-gray-400 text-white cursor-not-allowed' 
                    : downloadState === 'success'
                    ? 'bg-microsoft-green text-white shadow-lg'
                    : downloadState === 'error'
                    ? 'bg-microsoft-red text-white shadow-lg'
                    : 'bg-microsoft-blue hover:bg-microsoft-blue-hover text-white shadow-lg hover:shadow-xl'
                }`}
                onClick={handleDownload}
                disabled={downloadState === 'loading'}
              >
                {downloadState === 'loading' && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {downloadState === 'loading' ? 'Starting Download...' : 
                 downloadState === 'success' ? '✓ Download Started!' :
                 downloadState === 'error' ? '❌ Try Again' :
                 'Download Free Version'}
              </button>
              
              <div className="space-y-3 bg-microsoft-gray-50 p-6 rounded-xl animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center space-x-3 text-microsoft-green">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Free 1-year license included</span>
                </div>
                <div className="flex items-center space-x-3 text-microsoft-green">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Compatible with Windows & Mac</span>
                </div>
                <div className="flex items-center space-x-3 text-microsoft-green">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Full Microsoft Word functionality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductPage