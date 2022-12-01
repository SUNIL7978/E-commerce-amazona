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
    const [fullName, setFullName] = useState(shippingAddress.fullName || '')
    const [mobileNumber, setMobileNumber] = useState(shippingAddress.mobileNumber || '')
    const [pinCode, setPinCode] = useState(shippingAddress.pinCode || '')
    const [address, setAddress] = useState(shippingAddress.address || '')
    const [State, setState] = useState(shippingAddress.State || '')
    const [landMark, setLandmark] = useState(shippingAddress.landMark || '')

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
                fullName,
                mobileNumber,
                pinCode,
                address,
                State,
                landMark
            }
        })
        localStorage.setItem('shippingAddress', JSON.stringify({
            country,
            fullName,
            mobileNumber,
            pinCode,
            address,
            State,
            landMark
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
                    <Form.Group className='mb-3' controlId='fullName'>
                        <Form.Label>Full name</Form.Label>
                        <Form.Control type="text" value={fullName} required placeholder='Enter Full Name' onChange={(e) => setFullName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='mobileNumber'>
                        <Form.Label>Mobile number</Form.Label>
                        <Form.Control type="tel" value={mobileNumber} required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder='10 digit [0-9]{3}-[0-9]{3}-[0-9]{4} Mobile Number ' onChange={(e) => setMobileNumber(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='pincode'>
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control type="text" value={pinCode} required placeholder='6 digit [0-9]PIN code' onChange={(e) => setPinCode(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='address'>
                        <Form.Label>Flat, House no., Building, Company, Apartment</Form.Label>
                        <Form.Control type="text" value={address} required onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='State'>
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text" value={State} required onChange={(e) => setState(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='landMark'>
                        <Form.Label>Landmark</Form.Label>
                        <Form.Control type="text" value={landMark} required placeholder='E.g.Near Apollo Hospital' onChange={(e) => setLandmark(e.target.value)} />
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
