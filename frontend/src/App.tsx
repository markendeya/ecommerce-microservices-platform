import { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

type CartItem = {
  productId: number;
  quantity: number;
};

const USER_ID = 1; // demo user

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    axios.get<Product[]>("/api/products").then(res => setProducts(res.data));
    axios.get<CartItem[]>(`/api/cart/${USER_ID}`).then(res => setCart(res.data));
  }, []);

  const addToCart = async (productId: number) => {
    const res = await axios.post<CartItem[]>(`/api/cart/${USER_ID}/items`, {
      productId,
      quantity: 1
    });
    setCart(res.data);
  };

  const removeFromCart = async (productId: number) => {
    const res = await axios.delete<CartItem[]>(`/api/cart/${USER_ID}/items/${productId}`);
    setCart(res.data);
  };

  const cartQuantity = (productId: number) =>
    cart.find(c => c.productId === productId)?.quantity ?? 0;

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>E-commerce Microservices Demo</h1>

      <h2>Products</h2>
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))"
        }}
      >
        {products.map(p => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
            }}
          >
            <h3>{p.name}</h3>
            <p style={{ minHeight: 40 }}>{p.description}</p>
            <p>
              <strong>${p.price}</strong>
            </p>
            <p>Stock: {p.stock}</p>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
            {cartQuantity(p.id) > 0 && (
              <span style={{ marginLeft: 8 }}>In cart: {cartQuantity(p.id)}</span>
            )}
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 32 }}>Cart (User {USER_ID})</h2>
      {cart.length === 0 && <p>Your cart is empty.</p>}
      {cart.length > 0 && (
        <ul>
          {cart.map(item => (
            <li key={item.productId}>
              Product #{item.productId} — Qty: {item.quantity}{" "}
              <button onClick={() => removeFromCart(item.productId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
