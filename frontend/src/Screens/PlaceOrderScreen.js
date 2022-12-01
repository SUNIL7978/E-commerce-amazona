import React, { useContext, useEffect } from 'react'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../Components/CheckoutSteps';
import { Store } from '../Store';
import { Link, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const PlaceOrderScreen = () => {
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    cart.taxPrice = round2(0.18 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const placeOrderHandler = async () => {

    }

    useEffect(() => {
        if (!cart.paymentMethod) {
          navigate('/payment');
        }
      }, [cart, navigate]);
    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <h1 className='my-3'>Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name : </strong> {cart.shippingAddress.fullname}<br />
                                <strong>Address : </strong> {cart.shippingAddress.address},
                                {cart.shippingAddress.states}, {cart.shippingAddress.country} ,{cart.shippingAddress.landmark}<br />
                                <strong>Pincode : </strong>{cart.shippingAddress.pincode}<br />
                                <strong>MobileNumber : </strong>{cart.shippingAddress.mobilenumber}
                            </Card.Text>
                            <Link to='/shipping'>
                                Edit
                            </Link>
                        </Card.Body>
                    </Card>

                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method : </strong>{cart.paymentMethod}
                            </Card.Text>
                            <Link to='/payment'>
                                Edit
                            </Link>
                        </Card.Body>
                    </Card>

                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Item</Card.Title>
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className='align-items-center'>
                                            <Col md={5}>
                                                <img src={item.image} alt={item.name} className='img-fluid rounded' style={{ height: '100px' }} />
                                                <Link to={`/product/${item.slug}`} style={{ textDecoration: 'none' }}><strong style={{ color: 'black' }}>{item.name}</strong></Link>
                                            </Col>
                                            <Col md={3}>
                                                <strong>{item.quantity}</strong>
                                            </Col>
                                            <Col md={3}><strong>${(item.price).toFixed(2)}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Link to='/cart'>Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col><strong>${(cart.itemsPrice).toFixed(2)}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col><strong>${(cart.shippingPrice).toFixed(2)}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col><strong>${(cart.taxPrice).toFixed(2)}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${(cart.totalPrice).toFixed(2)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0}
                                        >
                                            Place Order
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen
