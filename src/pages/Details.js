import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useFirebase } from '../context/Firebase'

const BookDetails = () => {
    const params = useParams()
    const firebase = useFirebase()

    const [qty, setQty] = useState(1)

    const [data, setData] = useState(null)
    const [url, setURL] = useState()

    useEffect(() => {
        firebase.getBookById(params.bookId)
            .then(value => setData(value.data()))
    }, [firebase, params.bookId])

    useEffect(() => {
        if (data) {
            const imageURL = data.imageURL
            firebase.getImageURL(imageURL)
                .then(url => setURL(url))
        }
    }, [firebase, data])

    const placeOrder = async () => {
        const result = await firebase.placeOrder(params.bookId, qty)
        console.log('Order placed', result)
    }

    if (data === null) {
        return <h1>loading...</h1>
    }
    console.log(data)
    return (
        <div className='container mt-5'>
            <h1>{data.name}</h1>
            <img src={url} width="50%" style={{ borderRadius: "10px" }} />
            <h1>Details</h1>
            <p>Price Rs.{data.price}</p>
            <p>ISBN Number: {data.isbn}</p>
            <h3>Author</h3>
            <img src={data.photoURL} />
            <p>Name: {data.displayName}</p>
            <p>Email: {data.userEmail}</p>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                    onChange={e => setQty(e.target.value)}
                    value={qty}
                    type="number"
                    placeholder="Enter Quantity"
                />
            </Form.Group>

            <Button onClick={placeOrder} variant='success'>By Now</Button>
        </div>
    )
}

export default BookDetails
