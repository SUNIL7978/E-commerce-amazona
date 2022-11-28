import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
// import data from '../data'

const HomeScreen = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const FetchData = async () => {
            const result = await axios.get('/api/products')
            setProducts(result.data)
        }
        FetchData()
    }, [])
    return (
        <div>
            <h1>Featured Product</h1>
            <div className="products">
                {products.map((product) => (
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
                ))}
            </div>
        </div>
    )
}

export default HomeScreen
