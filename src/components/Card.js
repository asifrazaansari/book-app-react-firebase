import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';


const BookCard = (props) => {
    const firebase = useFirebase()
    const navigate = useNavigate()

    const [url, setURL] = useState(null)

    useEffect(() => {
        firebase.getImageURL(props.imageURL)
            .then(url => setURL(url))
    }, [firebase, props.imageURL])

    return (
        <Card style={{ width: '18rem', margin: "20px" }}>
            <Card.Img variant="top" src={url} />
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>
                    This book has title {props.name} and this book is sold by {props.displayName} and this book cost Rs.{props.price}
                </Card.Text>
                <Button onClick={e => navigate(props.link)} variant="primary">View</Button>
            </Card.Body>
        </Card>
    )
}

export default BookCard
