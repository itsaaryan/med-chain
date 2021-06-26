import React, { Component } from "react";
import "./Home.css";
import { Card, Image } from "semantic-ui-react";

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <Card>
          <Card.Content>
            <Image
              centered
              src="https://image.shutterstock.com/image-vector/medical-pharmacy-logo-design-template-260nw-287587964.jpg"
            />
            <hr></hr>
            <br></br>
            <Card.Header>
              Hello,Welcome to <b>med chain</b>
            </Card.Header>
            <Card.Description>
              <p>
                Secure medicine transfer, and 0% chance to supply drugs
                illegally.
              </p>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}
