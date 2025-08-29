import axios from "axios";
import { useEffect, useState } from "react";

export default function UserOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem('token');
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
        }
    }, [loading]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
            <h1 className="text-3xl font-bold mb-8 text-center text-accent">My Orders</h1>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : orders.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">No orders found.</p>
            ) : (
                <div className="grid gap-6 max-w-5xl mx-auto">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700">Order ID: {order.orderId}</h2>
                                    <p className="text-sm text-gray-500">Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    order.status === "Approved" ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'
                                }`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="grid gap-4 mb-4">
                                {order.orderedItems.map(item => (
                                    <div key={item._id} className="flex items-center gap-4 border p-3 rounded-xl">
                                        <img src={item.product.image} alt={item.product.name}
                                             className="w-16 h-16 rounded-xl object-contain" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-600 font-semibold">Rs. {item.product.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
                                <p><strong>Rental Period:</strong> {new Date(order.startingDate).toLocaleDateString()} ➡️ {new Date(order.endingDate).toLocaleDateString()}</p>
                                <p className="font-semibold text-accent text-lg">Total: Rs. {order.totalAmount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
