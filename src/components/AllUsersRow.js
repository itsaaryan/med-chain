import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { toast } from "react-toastify";
import { Table, Label, Button, Dropdown } from "semantic-ui-react";

class AllUsersRow extends Component {
  state = {
    loadingrevoke: false,
    loadingreassign: false,
    reassignRoleValue: 0,
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

  handleRevoke = async (e) => {
    e.preventDefault();
    this.setState({ loadingrevoke: true });
    try {
      const admin = this.props.admin;
      await admin.methods
        .revokeRole(this.props.user[2])
        .send({ from: this.props.eth_account });
      await window.location.reload(false);
      toast("role revoked!!");
    } catch (err) {
      toast.error(err.message);
    }
    this.setState({ loadingrevoke: false });
  };

  handleReassign = async (e) => {
    e.preventDefault();
    this.setState({ loadingreassign: true });
    try {
      const admin = this.props.admin;
      await admin.methods
        .reassignRole(this.props.user[2], this.state.reassignRoleValue)
        .send({ from: this.props.eth_account });
      await window.location.reload(false);
      toast(`role reassigned to ${this.state.reassignRoleValue} !!`);
    } catch (err) {
      toast.error(err.message);
    }
    this.setState({ loadingreassign: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { index, user } = this.props;
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
      <Row>
        <Cell>{index + 1}</Cell>
        <Cell>{user[0]}</Cell>
        <Cell>{user[1]}</Cell>
        <Cell>
          <em>{user[2]}</em>
        </Cell>
        <Cell>
          <Label
            color={
              user[3] === "6" ? "red" : user[3] === "0" ? "yellow" : "teal"
            }
          >
            {roles[user[3]]}
          </Label>
        </Cell>
        <Cell>
          <Button.Group color="teal">
            <Button
              loading={this.state.loadingreassign}
              basic
              color="teal"
              onClick={this.handleReassign}
            >
              Reassign
            </Button>
            <Dropdown
              className="button icon"
              floating
              options={this.roleOptions}
              trigger={<></>}
              onChange={(e, data) =>
                this.setState({ reassignRoleValue: data.value })
              }
            />
          </Button.Group>
        </Cell>
        <Cell>
          <Button
            loading={this.state.loadingrevoke}
            basic
            color="red"
            onClick={this.handleRevoke}
          >
            Revoke
          </Button>
        </Cell>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    admin: state.contracts.admin,
    eth_account: state.contracts.eth_account,
  };
};

export default withRouter(connect(mapStateToProps, {})(AllUsersRow));
