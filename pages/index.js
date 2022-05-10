import { useContext, useState } from 'react'
import { MainContext } from '../context'
import BigNumber from 'bignumber.js'

export default function Home() {
    const [file, setFile] = useState()
    const [image, setImage] = useState()
    const [URI, setURI] = useState()
    const [amount, setAmount] = useState()

    const {
        initialize,
        fetchBalance,
        balance,
        bundlrInstance
    } = useContext(MainContext)

    async function initializeBundlr() {
        initialize()
    }
    
    async function fundWallet() {
        if (!amount) return
        const amountParsed = parseInput(amount)
        console.log(amountParsed)
        let response = await bundlrInstance.fund(amountParsed)
        console.log('Wallet funded: ', response)
        fetchBalance()
    }

    function parseInput(input) {
        const conv = new BigNumber(input).multipliedBy(bundlrInstance.currencyConfig.base[1])
        console.log(conv)
        if (conv.isLessThan(1)) {
        console.log('error: value too small')
        return
        } else {
            return conv
        }
    }

    async function uploadFile() {
        let tx = await bundlrInstance.uploader.upload(file, [{ name: "Content-Type", value: "image/png" }])
        console.log('tx: ', tx)
        setURI(`http://arweave.net/${tx.data.id}`)
    }
    function onFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            const image = URL.createObjectURL(file)
            setImage(image)
            let reader = new FileReader()
            reader.onload = function () {
                if (reader.result) {
                    setFile(Buffer.from(reader.result))
                }
            }
            reader.readAsArrayBuffer(file)
        }
    }
    return (
      <div style={containerStyle}>
            {!balance && <button onClick={initializeBundlr}>Initialize</button>}
            {
            balance && (
                <div>
                        <h3>Balance {balance}</h3>
                </div>)
            }
            <div style={{ padding: '20px 0px'}}>
                <input onChange={e => {
                    console.log(e.target.value)
                    setAmount(e.target.value)
                }} />
              <button onClick={fundWallet}>Fund Wallet</button>
            </div>
            <div style={{ padding: '20px 0px'}}>
                <input type="file" onChange={onFileChange}
                 />
              <button onClick={uploadFile}>Upload file</button>
            </div>
            {image && <image src={image} />}
            {URI && <a href={URI}> URI</a>}
    </div> 
    
    )
}


const containerStyle = {
    padding: '100px 20px'
}