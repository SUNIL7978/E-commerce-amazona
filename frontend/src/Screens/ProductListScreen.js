import React, { useContext, useEffect, useReducer } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import axios from 'axios'
import MessageBox from '../Components/MessageBox'

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
        default:
            return state;
    }
}

const ProductListScreen = () => {

    const [{ loading, error, pages, products }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })
    const { search, pathname } = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;


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
    
    return (
        <div>
            <Helmet>
                <title>Manage Product</title>
            </Helmet>
            <h1>Product</h1>
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
