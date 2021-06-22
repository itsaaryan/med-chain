import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import Supplier from "../../abis/Supplier.json";
import { toast } from "react-toastify";
import RawMaterial from "../../abis/RawMaterial.json";
import RawMaterialRow from "../../components/RawMaterialRow";
import "./Supplier.css";

export default class SupplierPage extends Component {
  state = {
    rawMaterialsInfo: [],
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const SupplierData = await Supplier.networks[networkId];
    if (SupplierData) {
      const supplier = await new web3.eth.Contract(
        Supplier.abi,
        SupplierData.address
      );
      const packageCount = await supplier.methods
        .getPackageCountSupplier(accounts[0])
        .call();
      const allRawPackages = await Promise.all(
        Array(parseInt(packageCount))
          .fill()
          .map((ele, index) =>
            supplier.methods
              .getPackageIdByIndexSupplier(index, accounts[0])
              .call()
          )
      );
      await allRawPackages.forEach(async (rawMaterialAddress) => {
        const rawMaterial = await new window.web3.eth.Contract(
          RawMaterial.abi,
          rawMaterialAddress
        );
        const info = await rawMaterial.methods.getSuppliedRawMatrials().call();
        const newinfo = {
          ownerName: info[1],
          description: info[0],
          location: info[2],
          quantity: info[3],
          transporter: info[4],
          manufacturer: info[5],
          supplier: info[6],
          rawPackageAddress: rawMaterialAddress,
        };
        this.setState({
          rawMaterialsInfo: [...this.state.rawMaterialsInfo, newinfo],
        });
      });
    } else {
      toast.error("The Supplier Contract does not exist on this network!");
    }
  };

  renderRows = () => {
    return this.state.rawMaterialsInfo?.map((rawPackage, index) => {
      return (
        <RawMaterialRow key={index} rawPackage={rawPackage} index={index} />
      );
    });
  };
  render() {
    const { Header, Row, Body, HeaderCell } = Table;
    return (
      <div>
        <h1>All Raw Packages</h1>
        <Table>
          <Header>
            <Row>
              <HeaderCell>S. no.</HeaderCell>
              <HeaderCell>Owner Name</HeaderCell>
              <HeaderCell>Location</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Quantity</HeaderCell>
              <HeaderCell>Transporter</HeaderCell>
              <HeaderCell>Manufacturer</HeaderCell>
              <HeaderCell>RawMaterial Address</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
      </div>
    );
  }
}
