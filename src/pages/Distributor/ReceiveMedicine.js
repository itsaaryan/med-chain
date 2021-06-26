import React, { Component } from "react";
import { Card, Form, Message, Button } from "semantic-ui-react";
import "./Distributor.css";
import Medicine from "../../abis/Medicine.json";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class ReceiveMedicine extends Component {
  state = {
    batchId: "",
    retailer: "",
    errorMessage: "",
    laoding: "",
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const medicine = await new window.web3.eth.Contract(
        Medicine.abi,
        this.state.batchId
      );
      await medicine.methods
        .receivePackageDistributor(this.state.retailer)
        .send({ from: this.props.eth_account });
      toast.success("Received Package Successfully!!!!");
      this.props.history.push("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    return (
      <div class="receive-medicine">
        <Card centered style={{ minWidth: "360px" }}>
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
                  <label htmlFor="batchId">Medicine Address</label>
                  <input
                    id="batchId"
                    value={this.state.batchId}
                    onChange={this.handleChange}
                    placeholder="0x0"
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="retailer">Retailer Address</label>
                  <input
                    id="retailer"
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
                  Receive
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

export default withRouter(connect(mapStateToProps, {})(ReceiveMedicine));
