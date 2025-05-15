import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import axios from "axios"
import { ToastProvider } from 'react-toast-notifications'
import { WagmiConfig, createClient } from 'wagmi'
import { MarketplaceProvider } from '../context/MarketplaceContext'
import { PropertyProvider } from '../context/PropertyContext'
import '../util/i18n'

const client = createClient();

// Removed baseURL to avoid unnecessary server dependency
// Each request now goes directly to the resource using ipfs utility

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session}>
        <MarketplaceProvider>
          <PropertyProvider>
            <ToastProvider placement='bottom-left'>
              <Component {...pageProps} />
            </ToastProvider>
          </PropertyProvider>
        </MarketplaceProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}

export default MyApp
