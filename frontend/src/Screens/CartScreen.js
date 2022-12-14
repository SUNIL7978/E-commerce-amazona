import React, { useContext } from 'react'
import { Store } from '../Store'
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MessageBox from '../Components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from 'react-icons/hi'
import { MdDeleteOutline } from 'react-icons/md'
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const CartScreen = () => {
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart: { cartItems } } = state;

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    }

    const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    }

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
      };

    return (
        <div>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h2>Shopping Cart</h2>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to="/">Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className='align-items-center'>
                                        <Col md={5}>
                                            <Link to={`/product/${item.slug}`} style={{textDecoration:'none'}}>
                                                <img src={item.image} alt={item.name} className="img-fluid rounded" style={{ height: "100px" }} />
                                                <span className='cart_slug'>{item.name}</span></Link>
                                        </Col>
                                        <Col md={2} className="m-4">
                                            <button disabled={item.quantity === 1} onClick={() => updateCartHandler(item, item.quantity - 1)}>
                                                <HiOutlineMinusCircle />
                                            </button>
                                            <span className='m-2'>{item.quantity}</span>
                                            <button disabled={item.quantity === item.countInStock} onClick={() => updateCartHandler(item, item.quantity + 1)}>
                                                <HiOutlinePlusCircle />
                                            </button>
                                        </Col>
                                        <Col md={2}><strong>${item.price}</strong></Col>
                                        <Col md={2}>
                                            <button style={{ fontSize: "large" }} onClick={() => removeItemHandler(item)}>
                                                <MdDeleteOutline />
                                            </button>
                                        </Col>

                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) : $
                                        {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            className='btn_primary mt-3'
                                            onClick={checkoutHandler}
                                            disabled={cartItems.length === 0}
                                        >
                                            Proceed to Checkout
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

export default CartScreen
