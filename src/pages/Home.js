import React, { useEffect, useState } from 'react'
import BookCard from '../components/Card'
import { useFirebase } from '../context/Firebase'
import CardGroup from 'react-bootstrap/CardGroup';


const Home = () => {
    const firebase = useFirebase()

    const [books, setBooks] = useState([])

    useEffect(() => {
        firebase.listAllBooks().then(books => {
            setBooks(books.docs)
        })
    }, [firebase])

    return (
        <div className='container mt-5'>
            <CardGroup>
                {books.map((book) => (
                    <BookCard
                        link={`/book/view/${book.id}`}
                        key={book.id}
                        id={book.id}
                        {...book.data()
                        } />
                ))}
            </CardGroup>
        </div>
    )
}

export default Home
