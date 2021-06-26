import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, Form, Message, Button, Dropdown } from "semantic-ui-react";
import MedCycle from "../../abis/MedCycle.json";

class SaleStatus extends Component {
  state = {
    loading: false,
    errorMessage: "",
    batchId: "",
    status: 0,
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
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const MedCycleData = await MedCycle.networks[networkId];
      if (MedCycleData) {
        const medCycle = await new web3.eth.Contract(
          MedCycle.abi,
          MedCycleData.address
        );
        await medCycle.methods
          .updateSaleStatus(this.state.batchId, this.state.status)
          .send({ from: accounts[0] });
        toast.success("Status Updated Successfully!!!!!");
        this.props.history.push("/");
      } else {
        toast.error("MedCycle contract does not exist on this network!!!");
      }
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  handleDropdownSelect = (e, data) => {
    this.setState({ status: data.value });
  };

  statusOptions = [
    {
      key: "0",
      text: "Not Found",
      value: "0",
    },
    {
      key: "1",
      text: "At Retailer",
      value: "1",
    },
    {
      key: "2",
      text: "Sold",
      value: "2",
    },
    {
      key: "3",
      text: "Expired",
      value: "3",
    },
    {
      key: "4",
      text: "Damaged",
      value: "4",
    },
  ];

  render() {
    return (
      <div className="receive-medicine">
        <Card centered style={{ minWidth: "360px" }}>
          <Card.Content>
            <Card.Header centered>
              <h2>Update Medicine Status</h2>
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
                    id="batchId"
                    value={this.state.batchId}
                    onChange={this.handleChange}
                    placeholder="0x0"
                  />
                </Form.Field>
                <Dropdown
                  placeholder="Update Status"
                  fluid
                  selection
                  options={this.statusOptions}
                  onChange={this.handleDropdownSelect}
                />
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
                  Update
                </Button>
              </Form>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default withRouter(SaleStatus);
