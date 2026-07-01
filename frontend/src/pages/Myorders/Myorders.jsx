import React, { useState, useEffect, useContext } from 'react';
import './Myorders.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const Myorders = () => {
    const { url, token } = useContext(StoreContext);   
    const [data, setData] = useState([]);  

    const fetchOrders = async () => { 
        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data.data || []); 
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    }; 

    useEffect(() => { 
        if (token) fetchOrders();
    }, [token]);

    return (
        <div className='my-orders'> 
            <h2> My Orders </h2>
            <div className="container"> 
                {data.length === 0 && <p>No orders yet.</p>}
                {data.map((order, index) => ( 
                    <div key={index} className="my-orders-order">  
                        <img src={assets.parcel_icon} alt="Parcel Icon" /> 
                        <p> <span>&#x25cf;</span>
                            {(order.items || []).map((item, idx) => 
                                idx === (order.items?.length - 1)
                                    ? `${item.name}  x   ${item.quantity}`
                                    : `${item.name} x ${item.quantity}, `
                            )}
                        </p> 
                        <p> <span>&#x25cf;</span> ${order.amount}.00 </p> 
                        <p> <span>&#x25cf;</span> Items: {order.items?.length || 0} </p> 
                        <p> <span>&#9733;</span> Order Status <b> - {order.status || 'Payment Pending'}</b> </p>  
                        <button onClick={fetchOrders}> Track Order </button>
                    </div> 
                ))}
            </div>
        </div>
    );
};

export default Myorders;
