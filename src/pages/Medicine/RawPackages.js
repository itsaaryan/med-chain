import React, { Component } from "react";
import "./Medicine.css";
import { Grid, Card, Form, Message, Button, Table } from "semantic-ui-react";
import MedCycle from "../../abis/MedCycle.json";
import RawMaterial from "../../abis/RawMaterial.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import RawMaterialRow from "../../components/RawMaterialRow";

class RawPackages extends Component {
  state = {
    errorMessage: "",
    rawMaterialAdress: "",
    loading: false,
    rawMaterialsInfo: [],
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const MedCycleData = await MedCycle.networks[networkId];
    if (MedCycleData) {
      const medCycle = await new web3.eth.Contract(
        MedCycle.abi,
        MedCycleData.address
      );
      const packageCount = await medCycle.methods
        .getPackagesCountManufacturer(accounts[0])
        .call();
      const allRawPackages = await Promise.all(
        Array(parseInt(packageCount))
          .fill()
          .map((ele, index) =>
            medCycle.methods
              .getPackageIdByIndexManufacturer(index, accounts[0])
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
      toast.error("The MEDCycle Contract does not exist on this network!");
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = async (e) => {
    console.log(this.state.rawMaterialAdress);
    if (this.state.rawMaterialAdress === "") {
      this.setState({ errorMessage: "Raw material address cannot be NULL" });
      return;
    }
    e.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const web3 = window.web3;
    try {
      const networkId = await web3.eth.net.getId();
      const MedCycleData = await MedCycle.networks[networkId];
      if (MedCycleData) {
        const medCycle = await new web3.eth.Contract(
          MedCycle.abi,
          MedCycleData.address
        );
        await medCycle.methods
          .rawPackageReceived(this.state.rawMaterialAdress)
          .send({ from: this.props.eth_account });
        toast.success("Package received successfully!!");
        window.location.reload(false);
      } else {
        toast.error("The MedCycle Contract does not exist on this network!");
      }
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
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
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <h1>Received Raw Packages</h1>
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
            </Grid.Column>
            <Grid.Column width={4}>
              <Card centered style={{ minWidth: "360px" }}>
                <Card.Content>
                  <Card.Header centered>
                    <h2>Receive Raw Package</h2>
                  </Card.Header>
                  <hr></hr>
                  <br></br>
                  <Card.Description>
                    <Form
                      onSubmit={this.handleSubmit}
                      error={!!this.state.errorMessage}
                    >
                      <Form.Field>
                        <label htmlFor="rawMaterialAdress">
                          Raw Material Address
                        </label>
                        <input
                          id="rawMaterialAdress"
                          value={this.state.rawMaterialAdress}
                          onChange={this.handleChange}
                          placeholder="0x0"
                        />
                      </Form.Field>
                      <br></br>
                      <Message
                        error
                        header="Oops!!"
                        content={this.state.errorMessage}
                      />
                      <hr></hr>
                      <Button
                        color="teal"
                        floated="right"
                        type="submit"
                        loading={this.state.loading}
                      >
                        Receive Package
                      </Button>
                    </Form>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    eth_account: state.contracts.eth_account,
  };
};

export default withRouter(connect(mapStateToProps, {})(RawPackages));
