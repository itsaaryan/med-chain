import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Grid, Card, Form, Message, Button } from "semantic-ui-react";
import MedCycle from "../../abis/MedCycle.json";
import Medicine from "../../abis/Medicine.json";
import RawMaterial from "../../abis/RawMaterial.json";
import MedicineInfo from "../../components/MedicineInfo";

class Distributor extends Component {
  state = {
    batchId: "",
    shipper: "",
    retailer: "",
    errorMessage: "",
    loading: false,
    allManuMedicineInfo: [],
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
        this.props.history.replace("/distributor");
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    } else {
      toast.error("The MedCycle Contract does not exist on this network!");
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <div className="receive-medicine">
        <Card centered style={{ minWidth: "360px" }}>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    eth_account: state.contracts.eth_account,
  };
};

export default withRouter(connect(mapStateToProps, {})(Distributor));