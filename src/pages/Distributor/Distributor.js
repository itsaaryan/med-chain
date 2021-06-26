import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Grid, Card, Form, Message, Button } from "semantic-ui-react";
import MedCycle from "../../abis/MedCycle.json";
import Medicine from "../../abis/Medicine.json";
import RawMaterial from "../../abis/RawMaterial.json";
import MedicineInfo from "../../components/MedicineInfo";
import Distributor from "../../abis/Distributor.json";

class DistributorPage extends Component {
  state = {
    batchId: "",
    shipper: "",
    retailer: "",
    errorMessage: "",
    loading: false,
    allManuMedicineInfo: [],
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networdId = await web3.eth.net.getId();
    const MedCycleData = MedCycle.networks[networdId];
    if (MedCycleData) {
      const medCycle = await new web3.eth.Contract(
        MedCycle.abi,
        MedCycleData.address
      );
      const packageCount = await medCycle.methods
        .getBatchesCountDistributorToRetailer(accounts[0])
        .call();
      const allPackages = await Promise.all(
        Array(parseInt(packageCount))
          .fill()
          .map((ele, index) => {
            return medCycle.methods
              .getBatchesIdByIndexDistributorToRetailer(index, accounts[0])
              .call();
          })
      );

      allPackages.forEach(async (distAddress) => {
        const distributor = await new web3.eth.Contract(
          Distributor.abi,
          distAddress
        );
        const batchId = await distributor.methods.batchId().call();
        const medicine = await new web3.eth.Contract(Medicine.abi, batchId);
        const info = await medicine.methods.getMediceInfo().call();
        const medicineStatus = await medicine.methods
          .getMedicineStatus()
          .call();

        const rawMaterial = await new window.web3.eth.Contract(
          RawMaterial.abi,
          info[2]
        );
        const rawinfo = await rawMaterial.methods
          .getSuppliedRawMatrials()
          .call();

        const newinfo = {
          ownerAddress: info[0],
          description: info[1],
          rawmaterialAddress: info[2],
          quantity: info[3],
          transporter: info[4],
          distributor: info[5],
          medicineAddress: batchId,
          rawmaterialOwnerName: rawinfo[1],
          rawmaterialDescription: rawinfo[0],
          rawmaterialLocation: rawinfo[2],
          rawmaterialQuantity: rawinfo[3],
          rawmaterialTransporter: rawinfo[4],
          rawmaterialManufacturer: rawinfo[5],
          rawmaterialSupplier: rawinfo[6],
          distAddress: distAddress,
          medicineStatus: medicineStatus,
        };
        this.setState({
          allManuMedicineInfo: [...this.state.allManuMedicineInfo, newinfo],
        });
      });
    } else {
      toast.error("MedCycle contract does not exist on this network");
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const networkId = await window.web3.eth.net.getId();
    const MedCycleData = await MedCycle.networks[networkId];
    if (MedCycleData) {
      try {
        const medCycle = await new window.web3.eth.Contract(
          MedCycle.abi,
          MedCycleData.address
        );
        await medCycle.methods
          .transferMedicineDistributorToRetailer(
            this.state.batchId,
            this.state.shipper,
            this.state.retailer
          )
          .send({ from: this.props.eth_account });
        toast.success("Sent Successfully!!!!");
        this.props.history.replace("/");
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    } else {
      toast.error("The MedCycle Contract does not exist on this network!");
    }
    this.setState({ loading: false });
  };

  renderRows = () => {
    return this.state.allManuMedicineInfo?.map((medicineInfo) => {
      return <MedicineInfo distributor={true} medicineInfo={medicineInfo} />;
    });
  };

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <h1 style={{ marginBottom: "-25px" }}>Sent Packages</h1>
              {this.renderRows()}
            </Grid.Column>
            <Grid.Column width={4}>
              <Card centered style={{ minWidth: "360px", marginTop: "51px" }}>
                <Card.Content>
                  <Card.Header centered>
                    <h2>Transfer to retailer</h2>
                  </Card.Header>
                  <hr></hr>
                  <br></br>
                  <Card.Description>
                    <Form
                      onSubmit={this.handleSubmit}
                      error={!!this.state.errorMessage}
                    >
                      <Form.Field>
                        <label htmlFor="batchId">Medicine Address</label>
                        <input
                          name="batchId"
                          value={this.state.batchId}
                          onChange={this.handleChange}
                          placeholder="0x0"
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Transporter Address</label>
                        <input
                          name="shipper"
                          value={this.state.shipper}
                          onChange={this.handleChange}
                          placeholder="0x0"
                        />
                      </Form.Field>
                      <Form.Field>
                        <label htmlFor="retailer">Retailer Address</label>
                        <input
                          name="retailer"
                          value={this.state.retailer}
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
                        Send Package
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

export default withRouter(connect(mapStateToProps, {})(DistributorPage));
