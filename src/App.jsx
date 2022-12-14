import { createContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Routes, Route, Link } from 'react-router-dom';
import Admin from './pages/Admin';
import User from './pages/User';

const sampleProducts = [
  {
    id: 1,
    name: 'Latte',
    price: '4000',
    category: 1,
  },
  {
    id: 2,
    name: 'Americano',
    price: '4500',
    category: 1,
  },
  {
    id: 3,
    name: 'Expresso',
    price: '3500',
    category: 1,
  },
  {
    id: 4,
    name: 'Pizza',
    price: '8500',
    category: 3,
  },
];

// imperative (how)
// declarative (what)

export const categories = [
  {
    id: 1,
    name: 'Drinks 🧃',
  },
  {
    id: 2,
    name: 'Cake 🍰',
  },
  {
    id: 3,
    name: 'Pizza 🍕',
  },
];

export const MenuContext = createContext();

const STORAGE_KEY = 'menuapp.products';

function App() {
  const [products, setProducts] = useState(sampleProducts);
  const [selectedProductId, setSelectedProductId] = useState();
  const [showError, setShowError] = useState(false);
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );

  useEffect(() => {
    // get from API
    const productsJSON = localStorage.getItem(STORAGE_KEY);
    if (productsJSON !== null) setProducts(JSON.parse(productsJSON));
  }, []);

  useEffect(() => {
    // save data to API
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const menuContextValue = {
    handleProductDelete,
    handleProductAdd,
    handleProductSelect,
    handleProductDataChange,
  };

  function handleProductAdd() {
    const newProduct = {
      id: uuid(),
      name: '',
      price: '',
      category: '',
    };
    setProducts([...products, newProduct]);
    setSelectedProductId(newProduct.id);
  }

  function handleProductDataChange(id, updatedData) {
    const newProducts = [...products];
    const productIndex = newProducts.findIndex((product) => product.id === id);
    newProducts[productIndex] = updatedData;
    setProducts(newProducts);
  }

  function handleProductDelete(id) {
    setProducts(products.filter((product) => product.id !== id));
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  }

  function handleProductSelect(id) {
    setSelectedProductId(id);
  }

  return (
    <MenuContext.Provider value={menuContextValue}>
      {/* <Admin /> */}
      <nav className='container py-2'>
        <ul className='flex justify-around text-blue-500'>
          <Link to='/'>User</Link>
          <Link to='admin'>Admin</Link>
        </ul>
      </nav>
      {/* where our component will render  */}
      <Routes>
        <Route path='/' element={<User products={products} />} />
        <Route
          path='/admin'
          element={
            <Admin
              selectedProduct={selectedProduct}
              products={products}
              showError={showError}
            />
          }
        />
      </Routes>
    </MenuContext.Provider>
  );
}

export default App;

function Home() {
  return <div>Home</div>;
}

function AboutUs() {
  return <div>About Us</div>;
}

function Courses() {
  return <div>Courses</div>;
}
