import React, { Component } from "react";
import { Card } from "semantic-ui-react";

export default class MedicineInfo extends Component {
  render() {
    const { medicineInfo } = this.props;
    const {
      medicineAddress,
      description,
      distributor,
      ownerAddress,
      quantity,
      transporter,
      rawmaterialAddress,
      rawmaterialDescription,
      rawmaterialLocation,
      rawmaterialOwnerName,
      rawmaterialQuantity,
      rawmaterialSupplier,
      rawmaterialTransporter,
    } = medicineInfo;
    console.log(medicineInfo);
    return (
      <div style={{ margin: "40px auto" }}>
        <Card style={{ width: "80%", margin: "auto" }}>
          <Card.Content>
            <Card.Header>Medicine Information</Card.Header>
            <hr></hr>
            <br></br>
            <Card.Description>
              <div>
                <p>
                  <b>Medicine Address</b>
                </p>
                <span>{medicineAddress}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Description</b>
                </p>
                <span>{description}</span>
              </div>
              <br></br>

              <div>
                <p>
                  <b>Quantity</b>
                </p>
                <span>{quantity}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Owner Address</b>
                </p>
                <span>{ownerAddress}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Distributor Address</b>
                </p>
                <span>{distributor}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Transporter Address</b>
                </p>
                <span>{transporter}</span>
              </div>
              <br></br>
              <br></br>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid gray",
                  width: "50%",
                  margin: "auto",
                }}
              ></hr>
              <h3>Raw Material Information</h3>
              <br></br>
              <div>
                <p>
                  <b>Raw-Material Address</b>
                </p>
                <span>{rawmaterialAddress}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Owner Name</b>
                </p>
                <span>{rawmaterialOwnerName}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Description</b>
                </p>
                <span>{rawmaterialDescription}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Location</b>
                </p>
                <span>{rawmaterialLocation}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Quantity</b>
                </p>
                <span>{rawmaterialQuantity}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Supplier</b>
                </p>
                <span>{rawmaterialSupplier}</span>
              </div>
              <br></br>
              <div>
                <p>
                  <b>Transporter</b>
                </p>
                <span>{rawmaterialTransporter}</span>
              </div>
              <br></br>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}
