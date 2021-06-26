import React, { Component } from "react";
import "./Transporter.css";
import { Card, Form, Dropdown, Message, Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import Transporter from "../../abis/Transporter.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class TransporterPage extends Component {
  state = {
    loading: false,
    errorMessage: "",
    batchId: "",
    distributorId: "",
    destination: 0,
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    try {
      let web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const TransporterData = await Transporter.networks[networkId];
      if (TransporterData) {
        const transporter = await new web3.eth.Contract(
          Transporter.abi,
          TransporterData.address
        );
        let { batchId, distributorId, destination } = this.state;
        if (!distributorId) distributorId = batchId;
        await transporter.methods
          .loadConsignment(batchId, destination, distributorId)
          .send({ from: this.props.eth_account });
        toast.success("Package picked successfully!!");
      } else {
        toast.error("The Transporter Contract does not exist on this network!");
      }
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  destinationOptions = [
    {
      key: "0",
      text: "Raw Material",
      value: "1",
    },
    {
      key: "1",
      text: "Medicine",
      value: "2",
    },
    {
      key: "2",
      text: "Distributor",
      value: "3",
    },
  ];

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleDropdownSelect = (e, data) => {
    this.setState({ destination: data.value });
  };
  render() {
    return (
      <div className="transporter">
        <Card centered style={{ minWidth: "360px" }}>
          <Card.Content>
            <Card.Header centered>
              <h2>Pick package from a user</h2>
            </Card.Header>
            <hr></hr>
            <br></br>
            <Card.Description>
              <Form
                onSubmit={this.handleSubmit}
                error={!!this.state.errorMessage}
              >
                <Form.Field>
                  <label>Pick-Up Point</label>
                  <Dropdown
                    placeholder="Select pick-up"
                    fluid
                    selection
                    options={this.destinationOptions}
                    onChange={this.handleDropdownSelect}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="batchId">Package Id</label>
                  <input
                    id="batchId"
                    autoCorrect="off"
                    autoComplete="off"
                    value={this.state.batchId}
                    onChange={this.handleChange}
                    placeholder="0x0"
                  />
                </Form.Field>
                {Number(this.state.destination) === 3 && (
                  <Form.Field>
                    <label htmlFor="distributorId">Distributor Id</label>
                    <input
                      id="distributorId"
                      value={this.state.distributorId}
                      onChange={this.handleChange}
                      placeholder="0x0"
                    />
                  </Form.Field>
                )}
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
                  Pick Package
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
export default withRouter(connect(mapStateToProps, {})(TransporterPage));
