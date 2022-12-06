import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Store } from '../Store';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import { getError } from '../utils'
import MessageBox from '../Components/MessageBox'
import { toast } from 'react-toastify';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true }
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true }
        case 'PAY_FAIL':
            return { ...state, loadingPay: false }
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false }
        case 'DELIVER_REQUEST':
            return { ...state, loadingDeliver: true }
        case 'DELIVER_SUCCESS':
            return { ...state, loadingDeliver: false, successDeliver: true }
        case 'DELIVER_FAIL':
            return { ...state, loadingDeliver: false }
        case 'DELIVER_RESET':
            return { ...state, loadingDeliver: false, successDeliver: false }

        default:
            return state;
    }
}

const OrderScreen = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams()
    const { id: orderId } = params
    const navigate = useNavigate()

    const [{ loading, error, order, loadingPay, successPay, loadingDeliver, successDeliver }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        loadingPay: false,
        successPay: false
    });

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: { value: order.totalPrice }
                    }
                ]
            })
            .then((orderId) => {
                return orderId
            })
    }

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await axios.put(
                    `/api/orders/${order._id}/pay`,
                    details,
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                toast.success('Order is paid');
            } catch (err) {
                dispatch({ type: 'PAY_FAIL', payload: getError(err) });
                toast.error(getError(err));
            }
        });
    }
    function onError(err) {
        toast.error(getError(err));
    }
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };

        if (!userInfo) {
            return navigate('/login');
        }
        if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' })
            }
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' })
            }
        } else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD',
                    },
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            };
            loadPaypalScript();
        }
    }, [order, userInfo, orderId, navigate, paypalDispatch, successPay, successDeliver]);

    const deliverOrderHandler = async () => {
        try {
            dispatch({ type: 'DELIVER_REQUEST' });
            const { data } = await axios.put(`/api/orders/${order._id}/deliver`,
                {}, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'DELIVER_SUCCESS', payload: data })
            toast.success('Order is delivered');
        } catch (err) {
            dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
        }
    }
    return loading ? (
        <div><img src="https://m.media-amazon.com/images/G/31/amazonui/loading/loading-4x._CB485930736_.gif" alt="" /></div>
    ) : error ? (
        <MessageBox>{error}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Order {orderId}</title>
            </Helmet>
            <h1 className="my-3">Order <span style={{ color: "blue" }}>{orderId}</span></h1>
            <Row>
                <Col md={8}>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name : </strong> {order.shippingAddress.fullName}<br />
                                <strong>Address : </strong> {order.shippingAddress.address},
                                {order.shippingAddress.State}, {order.shippingAddress.country} ,{order.shippingAddress.landMark}<br />
                                <strong>Pincode : </strong>{order.shippingAddress.pinCode}<br />
                                <strong>MobileNumber : </strong>{order.shippingAddress.mobileNumber}
                            </Card.Text>
                            {order.isDelivered ? (
                                <MessageBox variant="success">
                                    Delivered at {order.deliveredAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Not Delivered</MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text> <strong>Method :</strong> {order.paymentMethod}</Card.Text>
                            {order.isPaid ? (
                                <MessageBox variant="success">
                                    Paid at {order.paidAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Not Paid</MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {order.orderItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded"
                                                    style={{ height: '100px' }}
                                                ></img>{' '}
                                                <Link to={`/product/${item.slug}`} style={{ textDecoration: 'none' }}><strong style={{ color: 'black' }}>{item.name}</strong></Link>
                                            </Col>
                                            <Col md={3}>
                                                <span><strong>{item.quantity}</strong></span>
                                            </Col>
                                            <Col md={3}><strong>${item.price}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${order.totalPrice.toFixed(2)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {isPending ? (
                                            <div><img src="https://m.media-amazon.com/images/G/31/amazonui/loading/loading-4x._CB485930736_.gif" alt="" /></div>
                                        ) : (
                                            <div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                            </div>
                                        )}
                                        {loadingPay && <div><img src="https://m.media-amazon.com/images/G/31/amazonui/loading/loading-4x._CB485930736_.gif" alt="" /></div>}
                                    </ListGroup.Item>
                                )}
                                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        {loadingDeliver && <div><img src="https://m.media-amazon.com/images/G/31/amazonui/loading/loading-4x._CB485930736_.gif" alt="" /></div>}
                                        <div className='d-grid'>
                                            <Button type="button" onClick={deliverOrderHandler}>
                                                Deliver Order
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )

}

export default OrderScreen
