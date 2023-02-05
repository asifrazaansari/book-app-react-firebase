import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth"
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

const FirebaseContext = createContext(null)

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMIAN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESG_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};


export const useFirebase = () => useContext(FirebaseContext)

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

const googleProvider = new GoogleAuthProvider()

export const FirebaseProvider = (props) => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) setUser(user)
            else setUser(null)
        })
    }, [])

    const signupUserWithEmailAndPassword = (email, password) => createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
    )


    const signinUserWithEmailAndPass = (email, password) => signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
    )

    const signinWithGoogle = () => signInWithPopup(
        firebaseAuth,
        googleProvider
    )

    const handleCreateNewListing = async (name, isbn, price, cover) => {
        const imageRef = ref(storage, `uploads/images/${Date.now()}-${cover.name}`)
        const uploadResult = await uploadBytes(imageRef, cover)
        return await addDoc(collection(firestore, "books"), {
            name,
            isbn,
            price,
            imageURL: uploadResult.ref.fullPath,
            userId: user.uid,
            userEmail: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        })
    }

    const listAllBooks = () => {
        return getDocs(collection(firestore, "books"))
    }

    const getBookById = async (id) => {
        const docRef = doc(firestore, 'books', id)
        const result = await getDoc(docRef)
        return result
    }

    const getImageURL = (path) => {
        return getDownloadURL(ref(storage, path))
    }

    const placeOrder = async (bookId, qty) => {
        const collectionRef = collection(firestore, 'books', bookId, "orders")
        const result = await addDoc(collectionRef, {
            userId: user.uid,
            userEmail: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            qty: Number(qty)
        })
        return result
    }

    const fetchMyBooks = async (userId) => {
        const collectionRef = collection(firestore, "books")
        const q = query(collectionRef, where("userId", "==", userId))

        const result = await getDocs(q)
        return result
    }

    const getOrders = async(bookId) => {
        const collectionRef = collection(firestore, "books", bookId, "orders")
        const result = await getDocs(collectionRef)
        return result
    }

    const isLoggedIn = user ? true : false

    return (
        <FirebaseContext.Provider value={{
            signupUserWithEmailAndPassword,
            signinUserWithEmailAndPass,
            signinWithGoogle,
            isLoggedIn,
            handleCreateNewListing,
            listAllBooks,
            getImageURL,
            getBookById,
            placeOrder,
            fetchMyBooks,
            user,
            getOrders
        }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}