import React, { useState } from 'react';
import { OrderList } from './components/OrderList';
import { OrderDetails } from './components/OrderDetails';
import { OrderForm } from './components/OrderForm';
import { LandingPage } from './components/LandingPage';
import { Plus } from 'lucide-react';
import { calculateRouteDetails } from './utils/routeOptimizer';
import { generateOrderTips } from './utils/aiTips';
import type { Order, OrderStatus } from './types';
import Chatbot from './components/Chatbot';

// Initial sample data
const initialOrders: Order[] = [
  {
    id: '1',
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 19.1136,
    endLng: 72.8697,
    customerWhatsapp: '+91 9876543210',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerAddress: '123 Main St, Mumbai, Maharashtra',
    deadline: '2024-03-20T14:00:00',
    packageWeight: 5.5,
    status: 'pending',
    createdAt: '2024-03-19T10:00:00',
    updatedAt: '2024-03-19T10:00:00',
    specifications: {
      isFragile: true,
      requiresRefrigeration: false,
      isHazardous: false,
      dimensions: {
        length: 30,
        width: 20,
        height: 15,
      },
      specialInstructions: 'Please handle with care',
      deliveryPreferences: {
        contactless: true,
        timeWindow: {
          start: '2024-03-20T12:00:00',
          end: '2024-03-20T14:00:00',
        },
      },
    },
    payment: {
      amount: 150.5,
      status: 'pending',
      method: 'upi',
      paidAmount: 0,
      remainingAmount: 150.5,
      lastUpdated: '2024-03-19T10:00:00',
    },
    assignedDriver: {
      name: 'Raj Kumar',
      phone: '+91 9876543211',
      vehicleNumber: 'MH 01 AB 1234',
    },
    routeDetails: {
      distance: 8.5,
      eta: 25,
      trafficDelay: 5,
      vehicleType: 'Van',
      co2Emissions: 1.7,
      urgencyScore: 85,
      price: 150.5,
      allowedVehicle: true,
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2024-03-19T10:00:00',
        note: 'Order created',
      },
    ],
  },
];

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showDashboard) {
    return <LandingPage onEnterDashboard={() => setShowDashboard(true)} />;
  }

  const handleOrderSelect = async (order: Order) => {
    try {
      if (!order.tips) {
        const tips = await generateOrderTips(order);
        const updatedOrder = { ...order, tips };
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? updatedOrder : o))
        );
        setSelectedOrder(updatedOrder);
      } else {
        setSelectedOrder(order);
      }
    } catch (error) {
      console.error('Error generating tips:', error);
      setSelectedOrder(order);
    }
  };

  const handleStatusChange = (
    orderId: string,
    newStatus: OrderStatus,
    note?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const now = new Date().toISOString();
          return {
            ...order,
            status: newStatus,
            updatedAt: now,
            statusHistory: [
              ...order.statusHistory,
              {
                status: newStatus,
                timestamp: now,
                note,
              },
            ],
          };
        }
        return order;
      })
    );

    if (selectedOrder?.id === orderId) {
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  const handleCreateOrder = async (orderData: {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    customerWhatsapp: string;
    deadline: string;
    packageWeight: number;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    specifications: {
      isFragile: boolean;
      requiresRefrigeration: boolean;
      isHazardous: boolean;
      dimensions: {
        length: number;
        width: number;
        height: number;
      };
      specialInstructions: string;
      deliveryPreferences: {
        contactless: boolean;
        timeWindow: {
          start: string;
          end: string;
        };
      };
    };
    payment: {
      amount: number;
      status: PaymentStatus;
      method: PaymentMethod;
      paidAmount: number;
    };
    assignedDriver: {
      name: string;
      phone: string;
      vehicleNumber: string;
    };
  }) => {
    setError(null);
    try {
      const routeDetails = await calculateRouteDetails(
        orderData.startLat,
        orderData.startLng,
        orderData.endLat,
        orderData.endLng,
        orderData.packageWeight,
        orderData.deadline
      );

      const now = new Date().toISOString();
      const newOrder: Order = {
        id: (orders.length + 1).toString(),
        ...orderData,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        specifications: {
          ...orderData.specifications,
        },
        payment: {
          ...orderData.payment,
          remainingAmount:
            orderData.payment.amount - orderData.payment.paidAmount,
          lastUpdated: now,
        },
        routeDetails,
        statusHistory: [
          {
            status: 'pending',
            timestamp: now,
            note: 'Order created',
          },
        ],
      };

      const tips = await generateOrderTips(newOrder);
      newOrder.tips = tips;

      setOrders((prev) => [...prev, newOrder]);
      setShowForm(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create order';
      setError(errorMessage);
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="bg-neutral-900 border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-red-500">
              SwiftShip Dashboard
            </h1>
            <span className="px-2 py-1 text-xs bg-red-500/10 text-red-500 rounded-full">
              Pro
            </span>
          </div>
          {!selectedOrder && !showForm && (
            <button
              onClick={() => {
                setError(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Order
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-800 rounded-md">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        {showForm ? (
          <OrderForm
            onSubmit={handleCreateOrder}
            onCancel={() => {
              setError(null);
              setShowForm(false);
            }}
          />
        ) : selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            onBack={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <OrderList orders={orders} onOrderSelect={handleOrderSelect} />
        )}
        <Chatbot orders={orders} />
      </main>
    </div>
  );
}

export default App;