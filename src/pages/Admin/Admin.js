import React, { Component } from "react";
import "./Admin.css";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Segment, Card, Form } from "semantic-ui-react";

class Admin extends Component {
  render() {
    return (
      <div className="admin">
        <Card centered>
          <Card.Content>
            <Card.Header>Create User</Card.Header>
            <Card.Description>
              <Form>
                <Form.Field>
                  <input />
                </Form.Field>
                <Form.Field>
                  <input />
                </Form.Field>
                <Form.Field>
                  <input />
                </Form.Field>
                <Form.Field>
                  <input />
                </Form.Field>
                <Form.Field>
                  <input />
                </Form.Field>
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

export default connect(mapStateToProps, {})(Admin);
