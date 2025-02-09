import React from 'react';
import { format } from 'date-fns';
import { Package2, MapPin, Phone } from 'lucide-react';
import type { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
}

export function OrderList({ orders, onOrderSelect }: OrderListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onOrderSelect(order)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Order #{order.id}</h3>
              <div className="mt-2 space-y-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    From: {order.startLat.toFixed(4)},{' '}
                    {order.startLng.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    To: {order.endLat.toFixed(4)}, {order.endLng.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package2 className="w-4 h-4" />
                  <span>{order.packageWeight} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{order.customerWhatsapp}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <p className="mt-2 text-sm text-gray-500">
                Due: {format(new Date(order.deadline), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
