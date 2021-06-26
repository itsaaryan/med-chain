import React, { Component } from "react";
import "./Admin.css";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Card, Form, Dropdown, Button, Message } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class Admin extends Component {
  state = {
    name: "",
    location: "",
    ethAddress: "",
    role: 0,
    errorMessage: "",
    loading: false,
  };

  roleOptions = [
    {
      key: "0",
      text: "No-role",
      value: "0",
    },
    {
      key: "1",
      text: "Supplier",
      value: "1",
    },
    {
      key: "2",
      text: "Transporter",
      value: "2",
    },
    {
      key: "3",
      text: "Manufacturer",
      value: "3",
    },
    {
      key: "4",
      text: "Distributor",
      value: "4",
    },
    {
      key: "5",
      text: "Retailer",
      value: "5",
    },
  ];

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleDropdownSelect = (e, data) => {
    this.setState({ role: data.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const admin = this.props.admin;
    const { ethAddress, name, location, role } = this.state;
    const owner = await admin.methods.owner().call();
    if (owner !== this.props.eth_account) {
      this.setState({
        errorMessage: "Sorry! You are not the Admin!!",
        loading: false,
      });
      return;
    }
    try {
      await admin.methods
        .registerUser(ethAddress, name, location, role)
        .send({ from: this.props.eth_account });
      toast.success("New user registered succressfully!!!!");
      this.props.history.push("/");
      this.setState({ name: "", location: "", ethAddress: "", role: 0 });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <div className="admin">
        <Card centered style={{ minWidth: "360px" }}>
          <Card.Content>
            <Card.Header centered>
              <h2>Register new user</h2>
            </Card.Header>
            <hr></hr>
            <br></br>
            <Card.Description>
              <Form
                onSubmit={this.handleSubmit}
                error={!!this.state.errorMessage}
              >
                <Form.Field>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    autoCorrect="off"
                    autoComplete="off"
                    value={this.state.name}
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
                  <label htmlFor="ethAddress">Ethereum Address</label>
                  <input
                    id="ethAddress"
                    value={this.state.ethAddress}
                    onChange={this.handleChange}
                    placeholder="0x0"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Select Role</label>
                  <Dropdown
                    placeholder="Select Role"
                    fluid
                    selection
                    options={this.roleOptions}
                    onChange={this.handleDropdownSelect}
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
                  Register
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

export default withRouter(connect(mapStateToProps, {})(Admin));
