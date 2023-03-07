import React, { Component } from 'react'
import Img from 'react-cool-img'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ScrollToTop from 'react-scroll-to-top'
import Web3 from 'web3'
import ZonuletNFT from '../../abis/ZonuletNFT.json'

class NftForSale extends Component {
  render() {
    return (
      <div>
        <div className="head-title col-auto mx-4">
          <h4 className="mb-0 font-weight-normal">Old NFTs For Sale</h4>
        </div>
        <div className="container-fluid mb-5 explore-adj">
          <div className="row justify-content-around">
            <p align="center" className="text-secondary">
              This is where you can explore Zonulet NFTs for sale, you can purchase any NFT listed here with ZONU!
            </p>
            <div align="center">
              <a href="/explore/newest" className="btn btn-primary">
                Newest NFTs For Sale
              </a>
              <br />
              <br />
            </div>
            <ReactPlaceholder
              type="rect"
              ready={this.state.ready}
              showLoadingAnimation={true}
              color="#333"
              style={{ width: '300px', height: '300px', borderRadius: '15px' }}
            >
              {this.state.images.map((id, key) => {
                return (
                  // (this.state.approved[key] && (this.state.owners[key] !== this.state.account) && this.state.ready === true) ?
                  // <ReactPlaceholder type='rect' ready={this.state.approved[key] && this.state.ready} showLoadingAnimation={true} color='#333' style={{ width: '300px', height: '300px', borderRadius: '15px' }}>

                  this.state.approved[key] && this.state.ready === true ? (
                    <div key={key} className="col-md-3 card bg-light m-3 p-0">
                      <Link
                        to={{
                          pathname: `/nft/${this.state.imageData_id[key]}`,
                          // state: {name: "vikas"}
                        }}
                      >
                        <form onSubmit={event => {}}>
                          <div className="col-auto max-250">
                            <div className="text-secondary idbadge" align="center">
                              ID #{this.state.imageData_id[key]}
                            </div>
                            {typeof this.state.imageData_ipfsData[key] !== 'undefined' ? (
                              this.state.imageData_mimeType[key] === 'image/jpeg' ||
                              this.state.imageData_mimeType[key] === 'image/png' ||
                              this.state.imageData_mimeType[key] === 'image/gif' ? (
                                <img
                                  alt="NFT"
                                  className="token rounded"
                                  src={`${process.env.REACT_APP_INFURA_GATEAWAY}` + this.state.imageData_ipfsData[key]}
                                />
                              ) : this.state.imageData_mimeType[key] === 'video/mp4' ? (
                                <video
                                  alt="NFT"
                                  className="token rounded"
                                  autoPlay={true}
                                  muted={true}
                                  loop={true}
                                  controls
                                  playsInline
                                  src={`${process.env.REACT_APP_INFURA_GATEAWAY}` + this.state.imageData_ipfsData[key]}
                                  type="video/mp4"
                                >
                                  <source
                                    src={
                                      `${process.env.REACT_APP_INFURA_GATEAWAY}` + this.state.imageData_ipfsData[key]
                                    }
                                    type="video/mp4"
                                  ></source>
                                </video>
                              ) : this.state.imageData_mimeType[key] === 'model/gltf-binary' ? (
                                <model-viewer
                                  src={`${process.env.REACT_APP_INFURA_GATEAWAY}` + this.state.imageData_ipfsData[key]}
                                  alt={this.state.imageData_name[key]}
                                  ar
                                  ar-modes="webxr scene-viewer quick-look"
                                  environment-image="neutral"
                                  auto-rotate
                                  camera-controls
                                  style={{ width: '100%', height: '250px' }}
                                ></model-viewer>
                              ) : null
                            ) : null}
                          </div>
                          <div className="m-2" align="center">
                            {this.state.imageData_name[key]}
                          </div>
                          <div className="m-2" align="center">
                            {'Price: ' + this.state.imageData_price[key]}
                            <img alt="main" className="eth-class" src="../zonulet_stndr_1.svg" />
                          </div>
                        </form>
                      </Link>
                    </div>
                  ) : null

                  // </ReactPlaceholder>
                )
              })}
            </ReactPlaceholder>
          </div>
        </div>
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      sale_contract: null,
      totalSupply: 0,
      images: [],
      owners: [],
      imageData_name: [],
      imageData_ipfsData: [],
      imageData_mimeType: [],
      imageData_category: [],
      imageData_price: [],
      imageData_id: [],
      selling_to: '',
      selling_price: null,
      token_sale_contract: null,
      token_price: 0,
      approved: [],
    }
  }

  async componentWillMount() {
    await this.loadBlockchain()
    // await this.loadTokenSaleContract()
  }

  async loadBlockchain() {

    const web3 = new Web3('https://polygon-mumbai.infura.io/v3/da9c85c80bd0432dad730f1d5fbfd70b')


    const networkId = 80001
    const networkData = ZonuletNFT.networks[networkId]
    if (networkData) {
      const abi = ZonuletNFT.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)

      // console.log(contract)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      // console.log(totalSupply)
      this.setState({ totalSupply })

      const abiblack = [{"stateMutability":"nonpayable","type":"constructor","inputs":[]},{"type":"event","name":"SetBlackListedAddress","inputs":[{"internalType":"address","indexed":true,"name":"hashAddress","type":"address"},{"name":"blacklisted","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false},{"inputs":[{"name":"nftID","indexed":true,"type":"uint256","internalType":"uint256"},{"name":"blacklisted","type":"bool","indexed":false,"internalType":"bool"}],"name":"SetBlackListedNFT","anonymous":false,"type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"idupdates","type":"function","outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"inputs":[],"name":"owner","stateMutability":"view","type":"function","outputs":[{"internalType":"address","type":"address","name":""}]},{"type":"function","outputs":[{"type":"address","name":"","internalType":"address"}],"stateMutability":"view","name":"updates","inputs":[{"type":"uint256","internalType":"uint256","name":""}]},{"outputs":[],"stateMutability":"nonpayable","inputs":[{"internalType":"address","name":"addy","type":"address"},{"internalType":"bool","name":"blacklisted","type":"bool"}],"type":"function","name":"setBlackListedAddress"},{"inputs":[{"internalType":"uint256","name":"nftID","type":"uint256"},{"internalType":"bool","name":"blacklisted","type":"bool"}],"name":"setBlackListedNFT","outputs":[],"type":"function","stateMutability":"nonpayable"},{"outputs":[{"type":"bool","internalType":"bool","name":""}],"stateMutability":"view","name":"getBlackListedAddress","inputs":[{"name":"blAddress","internalType":"address","type":"address"}],"type":"function"},{"type":"function","name":"getBlackListedNFT","inputs":[{"name":"nftID","type":"uint256","internalType":"uint256"}],"stateMutability":"view","outputs":[{"internalType":"bool","type":"bool","name":""}]},{"stateMutability":"view","name":"AddyCount","type":"function","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"inputs":[]},{"outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"type":"function","inputs":[],"name":"IDCount","stateMutability":"view"}]      

      const contractblack = new web3.eth.Contract(abiblack, '0x701E0F3d41b70d180A856099EBe3494E4277c804')

      var SI_SYMBOL = ['', 'k', 'M', 'B', 'T', 'P', 'E']

      function abbreviateNumber(number) {
        // what tier? (determines SI symbol)
        var tier = (Math.log10(Math.abs(number)) / 3) | 0

        // if zero, we don't need a suffix
        if (tier == 0) return number

        // get suffix and determine scale
        var suffix = SI_SYMBOL[tier]
        var scale = Math.pow(10, tier * 3)

        // scale the number
        var scaled = number / scale

        // format number and add suffix
        return scaled.toFixed(1) + suffix
      }

     
      for (var i = 0; i < totalSupply; i++) {
        const metadata = await contract.methods.imageData(i).call()
        const blacklisted = await contractblack.methods.getBlackListedNFT(i).call()
        // console.log(metadata)
        if (!blacklisted) {
          this.setState({
            images: [...this.state.images, metadata.name],
            imageData_name: [...this.state.imageData_name, metadata.name],
            imageData_ipfsData: [...this.state.imageData_ipfsData, metadata.ipfsData],
            imageData_mimeType: [...this.state.imageData_mimeType, metadata.mimeType],
            imageData_category: [...this.state.imageData_category, metadata.category],
            imageData_price: [...this.state.imageData_price, abbreviateNumber(metadata.price)],
            imageData_id: [...this.state.imageData_id, i],
          })
          var approv = await contract.methods.isApprovedOrOwner('0xB13cb334ADAD49BCa571C7aB2995800EDBaa94b1', i).call() //ZonuletNFTSale
          this.setState({ approved: [...this.state.approved, approv] })

          this.setState({ ready: true })
        }
      }

   
    } else {
      toast.error("Switch to Matic Testnet!")
    }


  }


}
export default NftForSale
