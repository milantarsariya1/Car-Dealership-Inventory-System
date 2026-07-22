export type Role = 'USER' | 'ADMIN';

export type Category = 'SEDAN' | 'SUV' | 'TRUCK' | 'COUPE' | 'EV' | 'HYBRID';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  category: Category;
  price: number;
  quantity: number;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  vehicleId: string;
  type: 'PURCHASE' | 'RESTOCK';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
