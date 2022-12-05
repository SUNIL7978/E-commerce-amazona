import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import { Store } from '../Store';
import axios from 'axios';

const Product = ({ product }) => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    const addToCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    };
    return (
        <Card style={{padding: '1rem'}}>
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} className="card-img-top" alt={product.name} style={{ width: "100%", height: "30vh" }} />
            </Link>
            <Card.Body className='product_info'>
                <Link to={`/product/${product.slug}`} style={{ textDecoration: "none", color: "#000" }}>
                    <Card.Title className='product_name'>{product.name}</Card.Title>
                </Link>
                <Rating stars={product.rating} numReviews={product.numReviews} />
                <Card.Text>${product.price}</Card.Text>
                {product.countInStock === 0 ? (
                    <Button variant="light" disabled>
                        Out of stock
                    </Button>
                ) : (
                    <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
                )}
            </Card.Body>

        </Card>
    )
}

export default Product
