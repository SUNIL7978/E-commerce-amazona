import React, { useEffect, useReducer } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import logger from 'use-reducer-logger';
import Product from '../Components/Product';
import MessageBox from '../Components/MessageBox'
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

const HomeScreen = () => {
    const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
        products: [],
        loading: true,
        error: ''
    })
    // const [products, setProducts] = useState([])

    useEffect(() => {
        const FetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' })
            try {
                const result = await axios.get('/api/products') //Axios is a promise-based HTTP Client for node.js and the browser. It is isomorphic (= it can run in the browser and nodejs with the same codebase). On the server-side it uses the native node.js http module, while on the client (browser) it uses XMLHttpRequests.
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }

            // setProducts(result.data)
        }
        FetchData();
    }, [])
    return (
        <div>
            <Helmet>
                <title>Amazona</title>
            </Helmet>
           <h2>Fetured Product</h2>
            <div className="products">
                {loading ? (
                    <div><img src="https://m.media-amazon.com/images/G/31/amazonui/loading/loading-4x._CB485930736_.gif" alt="" /></div>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <Row>
                        {products.map((product) => (
                            <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                )}

            </div>
        </div>
    )
}

export default HomeScreen
