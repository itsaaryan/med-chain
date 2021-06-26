import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, Form, Button, Message } from "semantic-ui-react";
import MedCycle from "../../abis/MedCycle.json";

class CreateMedicine extends Component {
  state = {
    description: "",
    rawmaterialaddress: "",
    quantity: "",
    shipper: "",
    distributor: "",
    errorMessage: "",
    loading: false,
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const MedCycleData = await MedCycle.networks[networkId];
    if (MedCycleData) {
      const medCycle = await new web3.eth.Contract(
        MedCycle.abi,
        MedCycleData.address
      );
      try {
        const {
          description,
          rawmaterialaddress,
          quantity,
          shipper,
          distributor,
        } = this.state;
        await medCycle.methods
          .manufactureMedicine(
            description,
            rawmaterialaddress,
            quantity,
            shipper,
            distributor
          )
          .send({ from: accounts[0] });
        toast.success("Congrats!! New Medicine Created!!");
        this.props.history.push("/");
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    } else {
      toast.error("The Supplier Contract does not exist on this network!");
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <Card centered style={{ minWidth: "360px" }}>
          <Card.Content>
            <Card.Header centered>
              <h2>Create Medicine</h2>
            </Card.Header>
            <hr></hr>
            <br></br>
            <Card.Description>
              <Form
                onSubmit={this.handleSubmit}
                error={!!this.state.errorMessage}
              >
                <Form.Field>
                  <label htmlFor="description">Description</label>
                  <input
                    id="description"
                    autoCorrect="off"
                    autoComplete="off"
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    value={this.state.quantity}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="rawmaterialaddress">
                    Raw Material Address
                  </label>
                  <input
                    id="rawmaterialaddress"
                    value={this.state.rawmaterialaddress}
                    onChange={this.handleChange}
                    placeholder="0x0"
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="shipper">Transporter</label>
                  <input
                    id="shipper"
                    value={this.state.shipper}
                    onChange={this.handleChange}
                    placeholder="0x0"
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="distributor">Distributor</label>
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
                  Create
                </Button>
              </Form>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default withRouter(CreateMedicine);
