import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Axios from 'axios'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { getError } from '../utils';

const SignInScreen = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          const { data } = await Axios.post('/api/users/signin', {
            email,
            password,
          });
          ctxDispatch({ type: 'USER_SIGNIN', payload: data });
          localStorage.setItem('userInfo', JSON.stringify(data));
          navigate(redirect || '/');
        } catch (err) {
          toast.error(getError(err));
        }
      };

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const showPassword = () =>{
        let x = document.getElementById('password')
        if(x.type === "password"){
            x.type = 'text'
        } else {
            x.type = 'password'
        }
    }

    return (
        <Container className='small-container'>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h2 className='my-3'>Sign in</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" id='password' required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <input type='checkbox' onClick={showPassword} className="mb-3"/> Show Password
                <div className='mb-3'>
                    <Button type="submit">Sign in</Button>
                </div>
                <div className="mb-3">
                    New customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </Container>
    )
}

export default SignInScreen
