import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Package2,
  MapPin,
  Phone,
  Calendar,
  Truck,
  Lightbulb,
  AlertTriangle,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  User,
  Mail,
  Home,
  AlertOctagon,
  Thermometer,
  Box,
  FileText,
  History,
} from 'lucide-react';
import L from 'leaflet';
import type { Order, OrderStatus } from '../types';
import 'leaflet/dist/leaflet.css';

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onStatusChange: (
    orderId: string,
    newStatus: OrderStatus,
    note?: string
  ) => void;
}

const API_KEY = '77JkMkCLVXYqkGQ1TKnYHtjMDX0gkz2p';

export function OrderDetails({
  order,
  onBack,
  onStatusChange,
}: OrderDetailsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [order.startLat, order.startLng],
        13
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
        mapInstanceRef.current
      );
    }

    const map = mapInstanceRef.current;

    // Create custom icon for vehicle if route details exist
    const vehicleIcon = order.routeDetails?.vehicleIcon
      ? L.icon({
          iconUrl: order.routeDetails.vehicleIcon,
          iconSize: [40, 40],
        })
      : L.icon({
          iconUrl: vehicleIcons.Van, // Default to van icon
          iconSize: [40, 40],
        });

    // Add markers for start and end points
    const startMarker = L.marker([order.startLat, order.startLng], {
      icon: L.divIcon({
        className: 'bg-green-500 w-4 h-4 rounded-full border-2 border-white',
        iconSize: [16, 16],
      }),
    }).addTo(map);

    const endMarker = L.marker([order.endLat, order.endLng], {
      icon: L.divIcon({
        className: 'bg-red-500 w-4 h-4 rounded-full border-2 border-white',
        iconSize: [16, 16],
      }),
    }).addTo(map);

    // Fetch and display route
    fetch(
      `https://api.tomtom.com/routing/1/calculateRoute/${order.startLat},${order.startLng}:${order.endLat},${order.endLng}/json?key=${API_KEY}&traffic=true`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0].legs[0].points;
          const routePath = route.map((point: any) => [
            point.latitude,
            point.longitude,
          ]);

          if (routeLayerRef.current) {
            routeLayerRef.current.remove();
          }

          routeLayerRef.current = L.polyline(routePath, {
            color: 'blue',
            weight: 5,
          }).addTo(map);

          if (vehicleMarkerRef.current) {
            vehicleMarkerRef.current.remove();
          }

          vehicleMarkerRef.current = L.marker(routePath[0], {
            icon: vehicleIcon,
          }).addTo(map);

          // Fit map to show the entire route
          map.fitBounds(routePath);

          // Simulate vehicle movement
          let currentPoint = 0;
          const moveVehicle = setInterval(() => {
            if (currentPoint < routePath.length - 1) {
              currentPoint++;
              vehicleMarkerRef.current?.setLatLng(routePath[currentPoint]);
            } else {
              clearInterval(moveVehicle);
            }
          }, 1000);
        }
      });

    return () => {
      startMarker.remove();
      endMarker.remove();
      if (vehicleMarkerRef.current) vehicleMarkerRef.current.remove();
      if (routeLayerRef.current) routeLayerRef.current.remove();
    };
  }, [order]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const canStartOrder = order.status === 'pending';
  const canCompleteOrder = order.status === 'in-progress';
  const canCancelOrder = ['pending', 'in-progress'].includes(order.status);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm p-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">Order #{order.id}</h2>
            <div className="flex gap-2">
              {canStartOrder && (
                <button
                  onClick={() =>
                    onStatusChange(order.id, 'in-progress', 'Order started')
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <PlayCircle className="w-4 h-4" />
                  Start Order
                </button>
              )}
              {canCompleteOrder && (
                <button
                  onClick={() =>
                    onStatusChange(order.id, 'completed', 'Order completed')
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete
                </button>
              )}
              {canCancelOrder && (
                <button
                  onClick={() =>
                    onStatusChange(order.id, 'cancelled', 'Order cancelled')
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Status Badge */}
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Customer Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{order.customerWhatsapp}</span>
                  </div>
                  {order.customerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{order.customerEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-500" />
                    <span>{order.customerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Package Specifications */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Package Specifications
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package2 className="w-4 h-4 text-gray-500" />
                    <span>Weight: {order.packageWeight} kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-gray-500" />
                    <span>
                      Dimensions: {order.specifications.dimensions.length}x
                      {order.specifications.dimensions.width}x
                      {order.specifications.dimensions.height} cm
                    </span>
                  </div>
                  {order.specifications.isFragile && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertOctagon className="w-4 h-4" />
                      <span>Fragile Package</span>
                    </div>
                  )}
                  {order.specifications.requiresRefrigeration && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Thermometer className="w-4 h-4" />
                      <span>Requires Refrigeration</span>
                    </div>
                  )}
                  {order.specifications.isHazardous && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Hazardous Material</span>
                    </div>
                  )}
                  {order.specifications.specialInstructions && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{order.specifications.specialInstructions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-500" />
                    <span>
                      Total Amount: ₹{order.payment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-500" />
                    <span>Paid: ₹{order.payment.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-500" />
                    <span>
                      Remaining: ₹{order.payment.remainingAmount.toFixed(2)}
                    </span>
                  </div>
                  <div
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                      order.payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.payment.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Payment {order.payment.status}
                  </div>
                  {order.payment.method && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Method:</span>
                      <span className="capitalize">{order.payment.method}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status History */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Status History</h3>
                <div className="space-y-3">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <History className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <div
                          className={`text-sm font-medium ${getStatusColor(
                            history.status
                          )} inline-block px-2 py-0.5 rounded-full`}
                        >
                          {history.status}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(history.timestamp), 'PPpp')}
                        </div>
                        {history.note && (
                          <div className="text-sm text-gray-600 mt-1">
                            {history.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Driver */}
              {order.assignedDriver && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    Assigned Driver
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{order.assignedDriver.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{order.assignedDriver.phone}</span>
                    </div>
                    {order.assignedDriver.vehicleNumber && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span>{order.assignedDriver.vehicleNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Route Details */}
              {order.routeDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Route Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Start Location</p>
                        <p>
                          {order.startLat.toFixed(6)},{' '}
                          {order.startLng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">End Location</p>
                        <p>
                          {order.endLat.toFixed(6)}, {order.endLng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <div>
                        <p>
                          Distance: {order.routeDetails.distance.toFixed(2)} km
                        </p>
                        <p>
                          ETA: {order.routeDetails.eta} min (Traffic Delay:{' '}
                          {order.routeDetails.trafficDelay} min)
                        </p>
                        <p>Vehicle: {order.routeDetails.vehicleType}</p>
                        <p>
                          CO₂ Emissions:{' '}
                          {order.routeDetails.co2Emissions.toFixed(2)} kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Tips */}
              {order.tips && order.tips.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">
                      AI-Generated Tips
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {order.tips.map((tip, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-blue-600">•</span>
                        <span className="text-blue-900">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="space-y-4">
              <div
                ref={mapRef}
                className="h-[600px] rounded-lg overflow-hidden shadow-md"
              />

              {/* Delivery Time Window */}
              {order.specifications.deliveryPreferences?.timeWindow && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold">Delivery Time Window</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Time</p>
                      <p>
                        {format(
                          new Date(
                            order.specifications.deliveryPreferences.timeWindow.start
                          ),
                          'pp'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Time</p>
                      <p>
                        {format(
                          new Date(
                            order.specifications.deliveryPreferences.timeWindow.end
                          ),
                          'pp'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const vehicleIcons = {
  Bike: 'https://img.icons8.com/emoji/48/motor-scooter.png',
  Van: 'https://img.icons8.com/fluency/48/van.png',
  Truck: 'https://img.icons8.com/fluency/48/truck.png',
} as const;
