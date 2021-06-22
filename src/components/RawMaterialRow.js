import React, { Component } from "react";
import { Table } from "semantic-ui-react";

export default class RawMaterialRow extends Component {
  render() {
    const { Row, Cell } = Table;
    const { index, rawPackage } = this.props;
    return (
      <Row>
        <Cell>{index + 1}</Cell>
        <Cell>{rawPackage.ownerName}</Cell>
        <Cell>{rawPackage.location}</Cell>
        <Cell>{rawPackage.description}</Cell>
        <Cell>{rawPackage.quantity}</Cell>
        <Cell style={{ wordBreak: "break-all" }}>{rawPackage.transporter}</Cell>
        <Cell style={{ wordBreak: "break-all" }}>
          {rawPackage.manufacturer}
        </Cell>
        <Cell style={{ wordBreak: "break-all" }}>
          {rawPackage.rawPackageAddress}
        </Cell>
      </Row>
    );
  }
}
