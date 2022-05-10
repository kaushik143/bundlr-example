import '../styles/globals.css'
import { providers, utils } from 'ethers'
import Bundlr from '@bundlr-network/client'
import { useState, useRef } from 'react'

import { MainContext } from '../context'

function MyApp({ Component, pageProps }) {
    const [bundlrInstance, setBundlrInstance] = useState()
    const [balance, setBalance] = useState()
    const bundlrRef = useRef()

    async function initialize() {
        await window.ethereum.enable()
        const provider = new providers.Web3Provider(window.ethereum)
        await provider._ready

        const bundlr = new Bundlr("http://node1.bundlr.network", "matic", provider)
        
        setBundlrInstance(bundlr)
        bundlrRef.current = bundlr
        fetchBalance()
    }

    async function fetchBalance() {
        const bal = await bundlrRef.current.getLoadedBalance()
        setBalance(utils.formatEther(bal.toString()))
    }
    return (
        <div style={containerStyle}>
            <MainContext.Provider
                value={{
                    initialize,
                    fetchBalance,
                    balance,
                    bundlrInstance
                }}
            >
            {balance && <p>Balance: {balance}</p>}
            <Component {...pageProps} />
            </MainContext.Provider>
        </div>
        
    )
}

const containerStyle = {
    width: '900px',
    padding: '10px 20px',
    margin: '0 auto'
}
export default MyApp
