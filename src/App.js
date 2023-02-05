import 'bootstrap/dist/css/bootstrap.min.css'

//components
import MyNavbar from './components/Navbar';


//pages
import Register from './pages/Register';
import Login from './pages/Login';
import List from './pages/List';
import Home from './pages/Home';
import BookDetails from './pages/Details';
import ViewOrder from './pages/ViewOrder';
import ViewOrderDetails from './pages/ViewOrderDetails'

//css
import { Route, Routes } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <div>
      <MyNavbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/book/list' element={<List />} />
        <Route path='/book/view/:bookId' element={<BookDetails />} />
        <Route path='/book/orders' element={<ViewOrder />} />
        <Route path='/books/orders/:bookId' element={<ViewOrderDetails />} />
      </Routes>
    </div>

  )
}

export default App;
