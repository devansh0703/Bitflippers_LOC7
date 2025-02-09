import React, { useState } from 'react';
import {
  MapPin,
  Package2,
  Phone,
  Calendar,
  User,
  Mail,
  Home,
  AlertTriangle,
  Thermometer,
  Box,
  FileText,
  IndianRupee,
  Truck,
} from 'lucide-react';
import type { PaymentMethod, PaymentStatus } from '../types';

interface OrderFormProps {
  onSubmit: (orderData: {
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
  }) => void;
  onCancel: () => void;
}

export function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState({
    // Location Details
    startLat: '',
    startLng: '',
    endLat: '',
    endLng: '',
    deadline: '',

    // Customer Details
    customerName: '',
    customerEmail: '',
    customerWhatsapp: '',
    customerAddress: '',

    // Package Details
    packageWeight: '',
    isFragile: false,
    requiresRefrigeration: false,
    isHazardous: false,
    dimensionLength: '',
    dimensionWidth: '',
    dimensionHeight: '',
    specialInstructions: '',

    // Delivery Preferences
    contactlessDelivery: false,
    deliveryWindowStart: '',
    deliveryWindowEnd: '',

    // Payment Details
    amount: '',
    paymentStatus: 'pending' as PaymentStatus,
    paymentMethod: 'cash' as PaymentMethod,
    paidAmount: '',

    // Driver Details
    driverName: '',
    driverPhone: '',
    vehicleNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const remainingAmount = Number(formData.amount) - Number(formData.paidAmount);

    onSubmit({
      startLat: parseFloat(formData.startLat),
      startLng: parseFloat(formData.startLng),
      endLat: parseFloat(formData.endLat),
      endLng: parseFloat(formData.endLng),
      customerWhatsapp: formData.customerWhatsapp,
      deadline: formData.deadline,
      packageWeight: parseFloat(formData.packageWeight),
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerAddress: formData.customerAddress,
      specifications: {
        isFragile: formData.isFragile,
        requiresRefrigeration: formData.requiresRefrigeration,
        isHazardous: formData.isHazardous,
        dimensions: {
          length: parseFloat(formData.dimensionLength),
          width: parseFloat(formData.dimensionWidth),
          height: parseFloat(formData.dimensionHeight),
        },
        specialInstructions: formData.specialInstructions,
        deliveryPreferences: {
          contactless: formData.contactlessDelivery,
          timeWindow: {
            start: formData.deliveryWindowStart,
            end: formData.deliveryWindowEnd,
          },
        },
      },
      payment: {
        amount: parseFloat(formData.amount),
        status: formData.paymentStatus,
        method: formData.paymentMethod,
        paidAmount: parseFloat(formData.paidAmount),
      },
      assignedDriver: {
        name: formData.driverName,
        phone: formData.driverPhone,
        vehicleNumber: formData.vehicleNumber,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4" />
                Start Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={formData.startLat}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startLat: e.target.value }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={formData.startLng}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startLng: e.target.value }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4" />
                End Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={formData.endLat}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endLat: e.target.value }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={formData.endLng}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endLng: e.target.value }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4" />
                Deadline
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4" />
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerName: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.customerWhatsapp}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerWhatsapp: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerEmail: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Home className="w-4 h-4" />
                Address
              </label>
              <input
                type="text"
                value={formData.customerAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerAddress: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Package Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Package2 className="w-4 h-4" />
                Package Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.packageWeight}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    packageWeight: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Box className="w-4 h-4" />
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Length"
                  value={formData.dimensionLength}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dimensionLength: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Width"
                  value={formData.dimensionWidth}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dimensionWidth: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={formData.dimensionHeight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dimensionHeight: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Package Properties
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFragile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isFragile: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Fragile
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requiresRefrigeration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        requiresRefrigeration: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Thermometer className="w-4 h-4 text-blue-500" />
                  Requires Refrigeration
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isHazardous}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isHazardous: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Hazardous Material
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4" />
                Special Instructions
              </label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specialInstructions: e.target.value,
                  }))
                }
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Delivery Preferences */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Delivery Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.contactlessDelivery}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactlessDelivery: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Contactless Delivery
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4" />
                  Delivery Window Start
                </label>
                <input
                  type="datetime-local"
                  value={formData.deliveryWindowStart}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryWindowStart: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4" />
                  Delivery Window End
                </label>
                <input
                  type="datetime-local"
                  value={formData.deliveryWindowEnd}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryWindowEnd: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <IndianRupee className="w-4 h-4" />
                Total Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <IndianRupee className="w-4 h-4" />
                Paid Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.paidAmount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paidAmount: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentStatus: e.target.value as PaymentStatus,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: e.target.value as PaymentMethod,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="net-banking">Net Banking</option>
              </select>
            </div>
          </div>
        </div>

        {/* Driver Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Driver Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4" />
                Driver Name
              </label>
              <input
                type="text"
                value={formData.driverName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    driverName: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4" />
                Driver Phone
              </label>
              <input
                type="text"
                value={formData.driverPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    driverPhone: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Truck className="w-4 h-4" />
                Vehicle Number
              </label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    vehicleNumber: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
}