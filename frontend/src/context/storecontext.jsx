import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // Initialize cart from localStorage so cart survives refresh
  const [cartitems, setcartitems] = useState(() => {
    try {
      const stored = localStorage.getItem("cartitems");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]); // renamed

  const addToCart = async (ItemId) => {
    // Update local cart state
    setcartitems((prev) => ({ ...prev, [ItemId]: (prev[ItemId] || 0) + 1 }));
    // Sync with backend if logged in, but don't overwrite local state
    if (token) { 
      try {
        await axios.post(
          url + "/api/cart/add",
          { ItemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) { 
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (ItemId) => {
    // Update local cart state
    setcartitems((prev) => {
      if (!prev[ItemId]) return prev;

      const updated = { ...prev };
      if (updated[ItemId] === 1) {
        delete updated[ItemId];
      } else {
        updated[ItemId] -= 1;
      }
      return updated;
    });

    // Sync with backend if logged in, but don't overwrite local state
    if (token) {
      try {  
        await axios.post(
          url + "/api/cart/remove",
          { ItemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {  
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const i in cartitems) {
      if (cartitems[i] > 0) {
        const item = foodList.find((product) => product._id === i);
        if (item) total += cartitems[i] * item.price;
      }
    }
    return total;
  };  

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

const loadCartData = async (userToken) => {
  try {  
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      // FIXED: Changed 'token' to 'Authorization' with 'Bearer' prefix
      { headers: { Authorization: `Bearer ${userToken}` } } 
    );
    if (response.data.success) {
      setcartitems(response.data.cartdata);
    }
  } catch (error) {
    console.error("Error loading cart:", error);
  }
};

  // Keep cart in localStorage in sync with React state
  useEffect(() => {
    try {
      localStorage.setItem("cartitems", JSON.stringify(cartitems));
    } catch {
      // ignore storage errors
    } 
  }, [cartitems]);

  useEffect(() => {
    async function loadData() {
      try {
        await fetchFoodList();
        const tokenFromStorage = localStorage.getItem("token"); 
        if (tokenFromStorage) {
          setToken(tokenFromStorage);
          await loadCartData(tokenFromStorage);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []);

  // Handle token expiration / invalid token globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("token");
          setToken("");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const contextValue = {
    food_list: foodList,
    cartitems,
    setcartitems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;