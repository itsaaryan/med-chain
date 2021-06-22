import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import AllUsersRow from "../../components/AllUsersRow";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";

export default class Adminpage extends Component {
  state = {
    allusers: [],
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const userCount = await admin.methods.getUsersCount().call();
      const allusers = await Promise.all(
        Array(parseInt(userCount))
          .fill()
          .map((ele, index) => admin.methods.getUserByIndex(index).call())
      );
      this.setState({ allusers });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  renderRows = () => {
    return this.state.allusers?.map((user, index) => {
      return <AllUsersRow key={index} user={user} index={index} />;
    });
  };
  render() {
    const { Header, Row, Body, HeaderCell } = Table;
    return (
      <div>
        <h1>All Users</h1>
        <Table>
          <Header>
            <Row>
              <HeaderCell>S. no.</HeaderCell>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Location</HeaderCell>
              <HeaderCell>Ethereum Address</HeaderCell>
              <HeaderCell>Role</HeaderCell>
              <HeaderCell>Reassign Role</HeaderCell>
              <HeaderCell>Revoke Role</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
      </div>
    );
  }
}
