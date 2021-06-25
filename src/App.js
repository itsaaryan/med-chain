import React, { Component } from "react";
import Web3 from "web3";
import MetaMaskGuide from "./pages/MetaMaskGuide";
import Admin from "./abis/Admin.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "semantic-ui-react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import AdminPageCreate from "./pages/Admin/AdminCreateUser";
import AdminPage from "./pages/Admin/Admin";
import { connect } from "react-redux";
import SupplierPage from "./pages/Supplier/Supplier";
import CreateRawPackhage from "./pages/Supplier/CreateRawPackhage";
import TransporterPage from "./pages/Transporter/Transporter";
import RawPackagesManufacturer from "./pages/Medicine/RawPackages";
import CreateMedicine from "./pages/Medicine/CreateMedicine";
import Medicine from "./pages/Medicine/Medicine";
import Distributor from "./pages/Distributor/Distributor";
import ReceiveMedicine from "./pages/Distributor/ReceiveMedicine";
import {
  dispatchAdminContract,
  dispatchCurrentEthAccount,
} from "./store/actions/contractActions";

class App extends Component {
  state = {
    isMetaMaskPresent: true,
    account: null,
    admin: {},
  };

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  loadWeb3 = async () => {
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
  };

  loadBlockChainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts) {
      this.setState({ account: accounts[0] });
      this.props.dispatchCurrentEthAccount(accounts[0]);
    }
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      this.setState({ admin });
      this.props.dispatchAdminContract(admin);
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  render() {
    return this.state.isMetaMaskPresent ? (
      <BrowserRouter>
        <Container>
          <ToastContainer />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/admin" exact component={AdminPage} />
            <Route
              path="/admin/register-user"
              exact
              component={AdminPageCreate}
            />
            <Route path="/supplier" exact component={SupplierPage} />
            <Route
              path="/supplier/new-raw-package"
              exact
              component={CreateRawPackhage}
            />
            <Route path="/transporter" exact component={TransporterPage} />
            <Route
              path="/medicine/raw-packages-atmanufacturer"
              exact
              component={RawPackagesManufacturer}
            />
            <Route
              path="/medicine/create-medicine"
              exact
              component={CreateMedicine}
            />
            <Route path="/medicine" exact component={Medicine} />
            <Route path="/distributor" exact component={Distributor} />
            <Route
              path="/distributor/receive-medicine"
              exact
              component={ReceiveMedicine}
            />
          </Switch>
        </Container>
      </BrowserRouter>
    ) : (
      <MetaMaskGuide />
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  dispatchAdminContract,
  dispatchCurrentEthAccount,
})(App);
