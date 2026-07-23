import { AuthResponse, ApiResponse, Vehicle, User } from '../types';

const API_BASE = '/api';

export class ApiService {
  /**
   * Safely parses an API response. If the server returns a non-JSON body
   * (e.g. an HTML error page from a crashed serverless function), we surface
   * a consistent { success: false, error } shape instead of throwing a
   * cryptic JSON parse error in the UI.
   */
  private static async parseResponse<T>(res: Response): Promise<T> {
    try {
      return (await res.json()) as T;
    } catch {
      return {
        success: false,
        error: `Request failed with status ${res.status} (${res.statusText || 'Unexpected server response'})`,
      } as T;
    }
  }

  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Auth API
  static async register(data: { name: string; email: string; password: string; role?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.parseResponse(res);
  }

  static async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.parseResponse(res);
  }

  static async getAllUsers(): Promise<ApiResponse<User[]>> {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: this.getHeaders(),
    });
    return this.parseResponse(res);
  }

  static async updateProfile(data: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  }): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.parseResponse(res);
  }

  static async updateUserByAdmin(
    userId: string,
    data: {
      name?: string;
      email?: string;
      role?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    }
  ): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.parseResponse(res);
  }

  // Vehicles API
  static async getAllVehicles(): Promise<ApiResponse<Vehicle[]>> {
    const res = await fetch(`${API_BASE}/vehicles`, {
      headers: this.getHeaders(),
    });
    return this.parseResponse(res);
  }

  static async searchVehicles(params: {
    make?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    query?: string;
  }): Promise<ApiResponse<Vehicle[]>> {
    const queryParams = new URLSearchParams();
    if (params.make) queryParams.append('make', params.make);
    if (params.category && params.category !== 'ALL') queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.query) queryParams.append('query', params.query);

    const res = await fetch(`${API_BASE}/vehicles/search?${queryParams.toString()}`, {
      headers: this.getHeaders(),
    });
    return this.parseResponse(res);
  }

  static async createVehicle(vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
    const res = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(vehicleData),
    });
    return this.parseResponse(res);
  }

  static async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(vehicleData),
    });
    return this.parseResponse(res);
  }

  static async deleteVehicle(id: string): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.parseResponse(res);
  }

  // Inventory API (Purchase & Restock)
  static async purchaseVehicle(id: string, quantity: number = 1): Promise<ApiResponse<{ vehicle: Vehicle; transaction: any }>> {
    const res = await fetch(`${API_BASE}/vehicles/${id}/purchase`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return this.parseResponse(res);
  }

  static async restockVehicle(id: string, quantity: number): Promise<ApiResponse<{ vehicle: Vehicle; transaction: any }>> {
    const res = await fetch(`${API_BASE}/vehicles/${id}/restock`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return this.parseResponse(res);
  }

  static async getMyOrders(): Promise<ApiResponse<any[]>> {
    const res = await fetch(`${API_BASE}/vehicles/my-orders/list`, {
      headers: this.getHeaders(),
    });
    return this.parseResponse(res);
  }

  static async getAllOrdersForAdmin(): Promise<ApiResponse<any[]>> {
    const res = await fetch(`${API_BASE}/vehicles/admin/orders`, {
      headers: this.getHeaders(),
    });
    return this.parseResponse(res);
  }
}

