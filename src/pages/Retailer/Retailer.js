import React, { Component } from "react";
import { Grid, Card, Form, Message, Button } from "semantic-ui-react";
import "./Retailer.css";
import MedCycle from "../../abis/MedCycle.json";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import MedicineInfo from "../../components/MedicineInfo";
import Medicine from "../../abis/Medicine.json";
import RawMaterial from "../../abis/RawMaterial.json";

class Retailer extends Component {
  state = {
    errorMessage: "",
    loading: false,
    batchId: "",
    distributor: "",
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
        .getBatchesCountRetailer(accounts[0])
        .call();
      const allPackages = await Promise.all(
        Array(parseInt(packageCount))
          .fill()
          .map((ele, index) => {
            return medCycle.methods
              .getBatchedIdByIndexRetailer(index, accounts[0])
              .call();
          })
      );

      allPackages.forEach(async (batchId) => {
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
    e.preventDefault();
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const web3 = window.web3;
    try {
      const networkId = await web3.eth.net.getId();
      const medCycleData = await MedCycle.networks[networkId];
      if (medCycleData) {
        const medCycle = await new web3.eth.Contract(
          MedCycle.abi,
          medCycleData.address
        );
        await medCycle.methods
          .medicineReceivedAtRetailer(
            this.state.batchId,
            this.state.distributor
          )
          .send({ from: this.props.eth_account });
        toast.success("Received Successfully!!!!");
        this.props.history.push("/");
      } else {
        toast.error("The distributor contract is not on this network!!");
      }
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  renderRows = () => {
    return this.state.allManuMedicineInfo?.map((medicineInfo) => {
      return <MedicineInfo fullWidth medicineInfo={medicineInfo} />;
    });
  };

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <h1 style={{ marginBottom: "-25px" }}>Medicine At Retailer</h1>
              {this.renderRows()}
            </Grid.Column>
            <Grid.Column width={4}>
              <Card centered style={{ minWidth: "360px", marginTop: "51px" }}>
                <Card.Content>
                  <Card.Header centered>
                    <h2>Receive Medicine</h2>
                  </Card.Header>
                  <hr></hr>
                  <br></br>
                  <Card.Description>
                    <Form
                      onSubmit={this.handleSubmit}
                      error={!!this.state.errorMessage}
                    >
                      <Form.Field>
                        <label htmlFor="description">Medicine Address</label>
                        <input
                          id="batchId"
                          value={this.state.description}
                          onChange={this.handleChange}
                          placeholder="0x0"
                        />
                      </Form.Field>
                      <Form.Field>
                        <label htmlFor="distributor">Receiving From</label>
                        <input
                          id="distributor"
                          value={this.state.distributor}
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
                        Receive
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

export default withRouter(connect(mapStateToProps, {})(Retailer));
