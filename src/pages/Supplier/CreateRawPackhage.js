import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, Form, Button, Message } from "semantic-ui-react";
import Supplier from "../../abis/Supplier.json";
import "./Supplier.css";

class CreateRawPackhage extends Component {
  state = {
    description: "",
    ownerName: "",
    location: "",
    quantity: "",
    shipper: "",
    manufacturer: "",
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
    const admin = this.props.admin;
    const {} = this.state;
    const role = await admin.methods.getRole(this.props.eth_account).call();
    if (Number(role) !== 1) {
      this.setState({
        errorMessage: "Sorry! You are not a supplier!!",
        loading: false,
      });
      return;
    }
    try {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const SupplierData = await Supplier.networks[networkId];
      if (SupplierData) {
        const supplier = await new web3.eth.Contract(
          Supplier.abi,
          SupplierData.address
        );
        const {
          description,
          ownerName,
          location,
          quantity,
          shipper,
          manufacturer,
        } = this.state;
        await supplier.methods
          .createRawPackage(
            description,
            ownerName,
            location,
            quantity,
            shipper,
            manufacturer
          )
          .send({ from: this.props.eth_account });
        toast.success("Successfully created a new package!!");
        this.props.history.push("/");
      } else {
        toast.error("The Supplier Contract does not exist on this network!");
      }
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <Card centered style={{ minWidth: "360px" }}>
          <Card.Content>
            <Card.Header centered>
              <h2>Create Raw Package</h2>
            </Card.Header>
            <hr></hr>

            <Card.Description>
              <Form
                onSubmit={this.handleSubmit}
                error={!!this.state.errorMessage}
              >
                <Form.Field>
                  <label htmlFor="ownerName">Name</label>
                  <input
                    id="ownerName"
                    autoCorrect="off"
                    autoComplete="off"
                    value={this.state.ownerName}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    value={this.state.location}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="description">Description</label>
                  <input
                    id="description"
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
                  <label htmlFor="manufacturer">Manufacturer</label>
                  <input
                    id="manufacturer"
                    value={this.state.manufacturer}
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

                {this.state.errorMessage && (
                  <Message
                    negative
                    header="Oops!!"
                    content={this.state.errorMessage}
                  />
                )}
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

const mapStateToProps = (state) => {
  return {
    admin: state.contracts.admin,
    eth_account: state.contracts.eth_account,
  };
};

export default withRouter(connect(mapStateToProps, {})(CreateRawPackhage));
