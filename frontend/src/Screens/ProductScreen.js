import React from 'react'
import { useParams } from 'react-router-dom'

const ProductScreen = () => {
    const param = useParams(); //The useParams hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the <Route path>. Child routes inherit all params from their parent routes.
    const { slug } = param;
    return (
        <div>
            <h2>{slug}</h2>
        </div>
    )
}

export default ProductScreen
