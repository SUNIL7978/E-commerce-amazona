import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import {Helmet} from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import Rating from '../Components/Rating';
import Button from 'react-bootstrap/esm/Button';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

const ProductScreen = () => {
    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: ''
    })
    const param = useParams(); //The useParams hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the <Route path>. Child routes inherit all params from their parent routes.
    const { slug } = param;

    useEffect(() => {
        const FetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' })
            try {
                const result = await axios.get(`/api/products/slug/${slug}`)
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message })
            }
        }
        FetchData();
    }, [slug])
    return (
        loading ? (
            <div><img src="https://m.media-amazon.com/images/G/31/amazonui/loading/loading-4x._CB485930736_.gif" alt="" /></div>
        ) : error ? (
            <div>{error}</div>
        ) : (
            <div>
                <Row>
                    <Col md={6}>
                        <img src={product.image} alt={product.name} style={{ width: "100%" }} />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <Helmet>
                                <title>{product.name}</title>
                            </Helmet>
                            <ListGroup.Item>
                                <h5>{product.name}</h5>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating stars={product.rating} numReviews={product.numReviews} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong> Price : </strong>  ${product.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Description : </strong> <p>{product.description}</p>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Price:</strong></Col>
                                            <Col>${product.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Status:</strong></Col>
                                            <Col>
                                                {product.countInStock > 0 ? (
                                                    <Badge bg="success">In Stock</Badge>
                                                ) : (
                                                    <Badge bg="danger">Unavailable</Badge>
                                                )}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <div className='d-grid mt-3'>
                                                <Button>Procced to Buy</Button>
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
    )
}

export default ProductScreen
