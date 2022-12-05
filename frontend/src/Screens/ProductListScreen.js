import React, { useContext, useEffect, useReducer } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import MessageBox from '../Components/MessageBox'
import { toast } from 'react-toastify'
import { getError } from '../utils'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false
            }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true }
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false }
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false }
        default:
            return state;
    }
}

const ProductListScreen = () => {

    const [{ loading, error, pages, products, loadingCreate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;

    const navigate = useNavigate()
    const { state } = useContext(Store)
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/products/admin?page=${page} `, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
            } catch (error) {

            }
        }
        fetchData();
    }, [page, userInfo])

    const createHandler = async () => {
        if (window.confirm('Are You Sure to create?')) {
            try {
                dispatch({ type: 'CREATE_REQUEST' });
                const { data } = await axios.post(
                    '/api/products',
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                toast.success('product created successfully');
                dispatch({ type: 'CREATE_SUCCESS' });
                navigate(`/admin/product/${data.product._id}`);
            } catch (err) {
                toast.error(getError(error));
                dispatch({
                    type: 'CREATE_FAIL',
                });
            }
        }
    }

    return (
        <div>
            <Helmet>
                <title>Manage Product</title>
            </Helmet>
            <Row>
                <Col><h1>Product</h1></Col>
                <Col className="col text-end">
                    <Button
                        type='button' onClick={createHandler}
                    > Create Product</Button>
                </Col>
            </Row>
            {
                loadingCreate && <div><img src='https://m.media-amazon.com/images/G/31/amazonui/loading/loading-1x._CB485947013_.gif' alt='' /></div>
            }

            {loading ? (
                <div><img src="https://m.media-amazon.com/images/G/31/amazonui/loading/loading-4x._CB485930736_.gif" alt="" /></div>
            ) : error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
                <>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => navigate(`/admin/product/${product._id}`)}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {[...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                key={x + 1}
                                to={`/admin/products?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                    </div>
                </>
            )}

        </div>
    )
}

export default ProductListScreen
