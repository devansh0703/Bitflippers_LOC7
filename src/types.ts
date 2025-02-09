export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type VehicleType = 'Bike' | 'Van' | 'Truck';
export type PaymentStatus = 'pending' | 'partial' | 'completed';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'net-banking';

export interface OrderSpecifications {
  isFragile: boolean;
  requiresRefrigeration: boolean;
  isHazardous: boolean;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  specialInstructions?: string;
  deliveryPreferences?: {
    contactless: boolean;
    timeWindow?: {
      start: string;
      end: string;
    };
  };
}

export interface PaymentDetails {
  amount: number;
  status: PaymentStatus;
  method?: PaymentMethod;
  transactionId?: string;
  paidAmount: number;
  remainingAmount: number;
  lastUpdated: string;
}

export interface Order {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  customerWhatsapp: string;
  deadline: string;
  packageWeight: number;
  status: OrderStatus;
  specifications: OrderSpecifications;
  payment: PaymentDetails;
  createdAt: string;
  updatedAt: string;
  assignedDriver?: {
    name: string;
    phone: string;
    vehicleNumber?: string;
  };
  customerName: string;
  customerEmail?: string;
  customerAddress: string;
  routeDetails?: {
    distance: number;
    eta: number;
    trafficDelay: number;
    vehicleType: VehicleType;
    co2Emissions: number;
    urgencyScore: number;
    price: number;
    allowedVehicle: boolean;
    trafficAlert?: string;
    vehicleIcon?: string;
  };
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  tips?: string[];
}
