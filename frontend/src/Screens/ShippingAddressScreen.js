import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Store } from '../Store'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../Components/CheckoutSteps'

const ShippingAddressScreen = () => {
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo, cart: { shippingAddress } } = state

    const [country, setCountry] = useState(shippingAddress.country || '')
    const [fullname, setFullName] = useState(shippingAddress.fullname || '')
    const [mobilenumber, setMobileNumber] = useState(shippingAddress.mobilenumber || '')
    const [pincode, setPinCode] = useState(shippingAddress.pincode || '')
    const [address, setAddress] = useState(shippingAddress.address || '')
    const [states, setState] = useState(shippingAddress.states || '')
    const [landmark, setLandmark] = useState(shippingAddress.landmark || '')

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/shipping');
        }
    }, [userInfo, navigate]);


    const submitHandler = () => {
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                country,
                fullname,
                mobilenumber,
                pincode,
                address,
                states,
                landmark
            }
        })
        localStorage.setItem('shippingAddress', JSON.stringify({
            country,
            fullname,
            mobilenumber,
            pincode,
            address,
            states,
            landmark
        }))
        navigate('/payment');
    }
    return (
        <div>
            <Helmet>
                <title>Shipping</title>
            </Helmet>
            <CheckoutSteps step1 step2/>
            <div className='container small-container mt-3'>
                <h1>Shipping Address</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='mb-3' controlId='country'>
                        <Form.Label>Country/Region</Form.Label>
                        <Form.Control type="text" value={country} required onChange={(e) => setCountry(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='fullname'>
                        <Form.Label>Full name</Form.Label>
                        <Form.Control type="text" value={fullname} required placeholder='Enter Full Name' onChange={(e) => setFullName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='mobilenumber'>
                        <Form.Label>Mobile number</Form.Label>
                        <Form.Control type="tel" value={mobilenumber} required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder='10 digit [0-9]{3}-[0-9]{3}-[0-9]{4} Mobile Number ' onChange={(e) => setMobileNumber(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='pincode'>
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control type="text" value={pincode} required placeholder='6 digit [0-9]PIN code' onChange={(e) => setPinCode(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='address'>
                        <Form.Label>Flat, House no., Building, Company, Apartment</Form.Label>
                        <Form.Control type="text" value={address} required onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='states'>
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text" value={states} required onChange={(e) => setState(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='landmark'>
                        <Form.Label>Landmark</Form.Label>
                        <Form.Control type="text" value={landmark} required placeholder='E.g.Near Apollo Hospital' onChange={(e) => setLandmark(e.target.value)} />
                    </Form.Group>
                    <div className="mb-3">
                        <Button variant="primary" type='submit'>
                            Continue
                        </Button>
                    </div>
                </Form>


            </div>
        </div>
    )
}

export default ShippingAddressScreen
