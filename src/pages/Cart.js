import React, { Component } from "react";
import {
  Button,
  Card,
  Container,
  Image,
  Row,
  Col,
  FormControl,
} from "react-bootstrap";
import { BounceLoader } from "react-spinners";

const styles = {
  column: {
    width: "100%",
  },
  background: {
    textAlign: "center",
  },
  wrapper: {
    padding: "20px",
    background: "rgb(0,0,0,0)",
    borderWidth: "0",
  },
  cardWrapper: {
    width: "100%",
    borderRadius: "20px",
    alignContent: "center",
    background: "#ffffff",
    boxShadow: "-20px 20px 40px #e0e0e0, 20px -20px 40px #ffffff",
  },
  image: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    objectPosition: "center",
  },
  copyWrapper: {
    padding: "20px",
  },
  name: {
    fontSize: "23px",
    fontWeight: "bold",
    textAlign: "left",
    height: "32px",
    lineHeight: "23px",
    margin: "0px",
    padding: "0px",
  },
  price: {
    fontSize: "15px",
    textAlign: "left",
    lineHeight: "15px",
    margin: "0px",
    padding: "0px",
  },
  description: {
    fontSize: "15px",
    textAlign: "left",
    height: "22px",
    lineHeight: "15px",
    margin: "0px",
    padding: "0px",
  },
  shippingAddress: {
    fontSize: "13px",
    textAlign: "left",
    height: "18px",
    lineHeight: "11px",
    margin: "0px",
    padding: "0px",
  },
  modalShippingAddress: {
    fontSize: "13px",
    textAlign: "left",
    height: "21px",
    lineHeight: "13px",
    marginTop: "10px",
    marginBottom: "10px",
    marginLeft: "0px",
    marginRight: "0px",
    padding: "0px",
  },
  remove: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
    color: "#0094ff",
    paddingLeft: "0px",
  },
  soldBy: {
    fontSize: "17px",
    fontWeight: "bold",
    textAlign: "left",
    height: "20px",
    lineHeight: "17px",
    marginTop: "10px",
    marginBottom: "5px",
    marginLeft: "0px",
    marginRight: "0px",
    padding: "0px",
  },
  addToCart: {
    width: "100%",
    marginTop: "20px",
    marginBottom: "30px",
  },
  modalPrice: {
    fontSize: "37px",
    fontWeight: "bold",
    textAlign: "left",
    height: "45px",
    lineHeight: "37px",
    margin: "0px",
    padding: "0px",
  },
  cartBoxLeftCol: {
    textAlign: "left",
    fontSize: "15px",
  },
  cartBoxRightCol: {
    textAlign: "right",
    fontSize: "15px",
  },
  cartBoxButton: {
    width: "100%",
    fontSize: "15px",
  },
};

class CartItems extends Component {
  removeFromCart = async (_removeButton) => {
    const cartItem = this.props.post;
    const postId = cartItem.postId;
    console.log(cartItem);
    console.log(postId);
    await this.props.shoppingCart.deletePost(postId);
    this.props.getShoppingCartThread();
    console.log(this.props.cartItems);
  };

  render() {
    return (
      <>
        <Row style={{ paddingBottom: "5px" }}>
          <Col sm={4}>
            <Image
              alt="Listing"
              src={
                this.props.item.message.listingImage
                  ? this.props.item.message.listingImage
                  : "https://via.placeholder.com/200"
              }
              onError={(ev) =>
                (ev.target.src =
                  "https://stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png")
              }
              style={styles.image}
              thumbnail
              fluid
            />
          </Col>
          <Col sm={6} style={{ paddingTop: "5px" }}>
            <Row>
              <p style={styles.name}>
                {this.props.item.message.name
                  ? this.props.item.message.name
                  : "Unnamed"}
              </p>
            </Row>
            <Row style={{ paddingTop: "10px" }}>
              <Col sm={2} style={{ paddingLeft: "0px", paddingRight: "20px" }}>
                <FormControl
                  aria-label="amount"
                  aria-describedby="basic-addon1"
                  placeholder="1"
                  style={{ textAlign: "center" }}
                />
              </Col>
              <Col sm={4}></Col>
            </Row>
            <Row style={{ paddingTop: "20px" }}>
              <Button
                style={styles.remove}
                onClick={this.removeFromCart}
                size="sm">
                Remove
              </Button>
            </Row>
          </Col>
          <Col sm={2} style={{ paddingTop: "5px" }}>
            <p style={styles.price}>
              {this.props.item.message.price
                ? this.props.item.message.price
                : "$0"}
              <br />
              USD
            </p>
          </Col>
        </Row>
      </>
    );
  }
}

export default class Home extends Component {
  render() {
    return (
      <div className="container" style={styles.background}>
        <h1 className="brand-font" style={{ fontSize: "4rem" }}>
          Shopping cart
        </h1>
        <Container style={{ marginTop: "50px" }}>
          {!this.props.cartItems && (
            <div style={{ width: "60px", margin: "auto" }}>
              <BounceLoader color={"blue"} />
            </div>
          )}
          {this.props.cartItems && (
            <Row>
              <Col sm={9}>
                {this.props.cartItems.length >= 1 &&
                  this.props.cartItems.map((post, i) => {
                    return (
                      <CartItems
                        post={post}
                        item={post.message}
                        key={i}
                        threeBox={this.props.threeBox}
                        space={this.props.space}
                        box={this.props.box}
                        usersAddress={this.props.usersAddress}
                        cartItems={this.props.cartItems}
                        shoppingCart={this.props.shoppingCart}
                        getShoppingCartThread={this.props.getShoppingCartThread}
                        i={i}
                      />
                    );
                  })}
                {this.props.cartItems.length === 0 && (
                  <p style={{ textAlign: "left" }}>
                    There is nothing in your cart!
                  </p>
                )}
              </Col>
              <Col sm={3}>
                <Card>
                  <Card.Header as="h5">Cart</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <Row>
                        <Col sm={8} style={styles.cartBoxLeftCol}>
                          Item total
                        </Col>
                        <Col sm={4} style={styles.cartBoxRightCol}>
                          $0
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={8} style={styles.cartBoxLeftCol}>
                          Shipping
                        </Col>
                        <Col sm={4} style={styles.cartBoxRightCol}>
                          $0
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={8} style={styles.cartBoxLeftCol}>
                          <span style={{ fontWeight: "bold" }}>
                            Order total
                          </span>
                        </Col>
                        <Col sm={4} style={styles.cartBoxRightCol}>
                          <span style={{ fontWeight: "bold" }}>$0</span>
                        </Col>
                      </Row>
                    </Card.Text>
                    <Button variant="success" style={styles.cartBoxButton}>
                      Checkout
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}