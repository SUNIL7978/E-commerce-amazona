import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import MessageBox from '../Components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, users: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

const UserListScreen = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, users }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' })
                const { data } = await axios.get(`/api/users`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                })
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }
        fetchData()

    }, [userInfo])

    return (
        <div>
            <Helmet>
                <title>User</title>
            </Helmet>
            <h2 className='my-3'>Users</h2>
            {loading ? (
                <div><img src="https://m.media-amazon.com/images/G/31/amazonui/loading/loading-4x._CB485930736_.gif" alt="" /></div>
            ) : error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>IS ADMIN</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) =>(
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default UserListScreen
