import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, Segment, Image, Label, Icon } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import { Link } from "react-router-dom";

class Navbar extends Component {
  state = { activeItem: "home", role: 0 };

  componentDidMount = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const role = await admin?.methods?.getRole(this.props?.account).call();
      this.setState({ role });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    let roles = [
      "No Role",
      "Supplier",
      "Transporter",
      "Manufacturer",
      "Distributor",
      "Retailer",
      "Revoked",
    ];

    return (
      <Segment
        inverted
        style={{ borderRadius: "0", background: "rgba(0, 128, 128,0.8)" }}
      >
        <Menu
          style={{ marginLeft: "80px", border: "none" }}
          inverted
          pointing
          secondary
        >
          <Menu.Item style={{ marginRight: "30px" }}>
            <Image
              style={{
                position: "absolute",
                top: "-11px",
                width: "60px",
                borderRadius: "50%",
                marginRight: "25px",
              }}
              src="https://image.shutterstock.com/image-vector/medical-pharmacy-logo-design-template-260nw-287587964.jpg"
            />
          </Menu.Item>
          {this.props.isOwner && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="All Users"
                active={activeItem === "All Users"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/register-user"
                name="Create User"
                active={activeItem === "Create User"}
                onClick={this.handleItemClick}
              />
            </>
          )}
          {this.state.role === "1" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="All Raw Packages"
                active={activeItem === "All Raw Packages"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/new-raw-package"
                name="Create New"
                active={activeItem === "Create New"}
                onClick={this.handleItemClick}
              />
            </>
          )}

          {this.state.role === "2" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Pickup Package"
                active={activeItem === "Pickup Package"}
                onClick={this.handleItemClick}
              />
            </>
          )}

          {this.state.role === "3" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="All Medicines"
                active={activeItem === "All Medicines"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/raw-packages-atmanufacturer"
                name="Receive Raw Package"
                active={activeItem === "Receive Raw Package"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/create-medicine"
                name="Create New"
                active={activeItem === "Create New"}
                onClick={this.handleItemClick}
              />
            </>
          )}

          {this.state.role === "4" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Send To Retailer"
                active={activeItem === "Send To Retailer"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/receive-medicine"
                name="Receive Medicine"
                active={activeItem === "Receive Medicine"}
                onClick={this.handleItemClick}
              />
            </>
          )}

          {this.state.role === "5" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Medicine At Retailer"
                active={activeItem === "Medicine At Retailer"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/sale-status"
                name="Update Sale Status"
                active={activeItem === "Update Sale Status"}
                onClick={this.handleItemClick}
              />
            </>
          )}

          <Menu.Item position="right">
            <Label style={{ color: "black", background: "white" }}>
              {this.props.isOwner ? "Admin" : roles[this.state.role]}
            </Label>
            &nbsp;&nbsp;&nbsp;
            <div style={{ color: "lightgray" }}>
              <em>
                <small>{this.props.account}</small>
              </em>
            </div>
          </Menu.Item>
        </Menu>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    eth_account: state.contracts.eth_account,
  };
};

export default withRouter(connect(mapStateToProps, {})(Navbar));
