import React, { useEffect, useReducer} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import logger from 'use-reducer-logger';

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
                dispatch({ type: 'FETCH_FAIL', payload: err.message })
            }

            // setProducts(result.data)
        }
        FetchData();
    }, [])
    return (
        <div>
            <h1>Featured Product</h1>
            <div className="products">
                {loading ? (
                    <div><img src="https://m.media-amazon.com/images/G/31/amazonui/loading/loading-4x._CB485930736_.gif" alt="" /></div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    products.map((product) => (
                        <div className="product" key={product.id}>
                            <Link to={`/product/:${product.slug}`}>
                                <img src={product.image} alt={product.name} />
                            </Link>
                            <div className="product_info">
                                <Link to={`/product/:${product.slug}`} style={{ textDecoration: "none", color: "#000" }}>
                                    <p>{product.name}</p>
                                </Link>
                                <p>
                                    <strong>${product.price}</strong>
                                </p>
                                <button>Add to cart</button>
                            </div>

                        </div>
                    ))
                )}

            </div>
        </div>
    )
}

export default HomeScreen
