import React, { Component } from "react";
import Web3 from "web3";
import MetaMaskGuide from "./pages/MetaMaskGuide";
import Admin from "./abis/Admin.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class App extends Component {
  state = {
    isMetaMaskPresent: true,
  };

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadWeb3() {
    this.setState({ isMetaMaskPresent: true });
    if (window.ethereum) {
      window.ethereum.request({
        method: "eth_requestAccounts",
      });
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      this.setState({ isMetaMaskPresent: false });
    }
  }

  loadBlockChainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const owner = await admin.methods.owner().call();
      console.log(owner);
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  render() {
    return this.state.isMetaMaskPresent ? (
      <div>
        <ToastContainer />
        Hi
      </div>
    ) : (
      <MetaMaskGuide />
    );
  }
}
