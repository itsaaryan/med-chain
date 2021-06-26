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
import RetailerPage from "./pages/Retailer/Retailer";
import Navbar from "./components/Navbar";
import {
  dispatchAdminContract,
  dispatchCurrentEthAccount,
} from "./store/actions/contractActions";
import SaleStatus from "./pages/Retailer/SaleStatus";

class App extends Component {
  state = {
    isMetaMaskPresent: true,
    account: null,
    admin: {},
    role: 0,
    isOwner: false,
  };

  async componentWillMount() {
    await this.loadWeb3();
    if (this.state.isMetaMaskPresent) await this.loadBlockChainData();
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
      const role = await admin?.methods?.getRole(accounts[0]).call();
      const owner = await admin?.methods?.owner().call();
      this.setState({ admin, role, isOwner: accounts[0] === owner });
      this.props.dispatchAdminContract(admin);
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  adminRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={AdminPage} />
        <Route path="/register-user" exact component={AdminPageCreate} />
      </Switch>
    );
  };

  supplierRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={SupplierPage} />
        <Route path="/new-raw-package" exact component={CreateRawPackhage} />
      </Switch>
    );
  };

  transporterRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={TransporterPage} />
      </Switch>
    );
  };

  manufacturerRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={Medicine} />
        <Route
          path="/raw-packages-atmanufacturer"
          exact
          component={RawPackagesManufacturer}
        />
        <Route path="/create-medicine" exact component={CreateMedicine} />
      </Switch>
    );
  };

  distributorRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={Distributor} />
        <Route path="/receive-medicine" exact component={ReceiveMedicine} />
      </Switch>
    );
  };

  retailerRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={RetailerPage} />
        <Route path="/sale-status" exact component={SaleStatus} />
      </Switch>
    );
  };

  homeRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
    );
  };

  renderRoutes = () => {
    const role = this.state.role;
    console.log(role);
    if (this.state.isOwner) return this.adminRoutes();
    else if (role === "1") return this.supplierRoutes();
    else if (role === "2") return this.transporterRoutes();
    else if (role === "3") return this.manufacturerRoutes();
    else if (role === "4") return this.distributorRoutes();
    else if (role === "5") return this.retailerRoutes();
    else return this.homeRoutes();
  };

  render() {
    return this.state.isMetaMaskPresent ? (
      <BrowserRouter>
        <Navbar account={this.state.account} isOwner={this.state.isOwner} />
        <Container>
          <ToastContainer />
          {this.renderRoutes()}
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
