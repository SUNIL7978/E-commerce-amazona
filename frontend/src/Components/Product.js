import React from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';

const Product = ({product}) => {
    return (
         <Card>
                <Link to={`/product/${product.slug}`}>
                    <img src={product.image} className="card-img-top" alt={product.name} style={{width:"100%", height:"30vh"}} />
                </Link>
                <Card.Body className='product_info'>
                    <Link to={`/product/${product.slug}`} style={{ textDecoration: "none", color: "#000" }}>
                        <Card.Title className='product_name'>{product.name}</Card.Title>
                    </Link>
                    <Rating stars={product.rating} numReviews={product.numReviews}/>
                    <Card.Text>${product.price}</Card.Text>
                    <Button className='btn_primary'>Add to Cart</Button>
                </Card.Body>

            </Card>
    )
}

export default Product
