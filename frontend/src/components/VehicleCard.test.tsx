import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleCard } from './VehicleCard';
import { Vehicle, User } from '../types';

const baseVehicle: Vehicle = {
  id: 'veh-1',
  vin: 'TESTVIN1234567890',
  make: 'Porsche',
  model: '911 GT3 RS',
  category: 'COUPE',
  price: 22380000,
  quantity: 3,
  description: 'Track-focused coupe.',
};

const customer: User = {
  id: 'user-1',
  name: 'Test Customer',
  email: 'customer@test.com',
  role: 'USER',
};

const admin: User = {
  id: 'admin-1',
  name: 'Test Admin',
  email: 'admin@test.com',
  role: 'ADMIN',
};

describe('VehicleCard', () => {
  it('enables the Purchase button when the vehicle is in stock', () => {
    const onSelectPurchase = vi.fn();
    render(
      <VehicleCard vehicle={baseVehicle} user={customer} onSelectPurchase={onSelectPurchase} />
    );

    const button = screen.getByRole('button', { name: /purchase/i });
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(onSelectPurchase).toHaveBeenCalledWith(baseVehicle);
  });

  it('disables the Purchase button when quantity is zero (kata requirement)', () => {
    const onSelectPurchase = vi.fn();
    render(
      <VehicleCard
        vehicle={{ ...baseVehicle, quantity: 0 }}
        user={customer}
        onSelectPurchase={onSelectPurchase}
      />
    );

    const button = screen.getByRole('button', { name: /out of stock/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onSelectPurchase).not.toHaveBeenCalled();
  });

  it('shows an OUT OF STOCK badge when quantity is zero', () => {
    render(
      <VehicleCard
        vehicle={{ ...baseVehicle, quantity: 0 }}
        user={customer}
        onSelectPurchase={vi.fn()}
      />
    );

    expect(screen.getAllByText(/out of stock/i).length).toBeGreaterThan(0);
  });

  it('hides the Purchase button entirely for ADMIN users', () => {
    render(<VehicleCard vehicle={baseVehicle} user={admin} onSelectPurchase={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /purchase/i })).not.toBeInTheDocument();
    expect(screen.getByText(/dealer seller/i)).toBeInTheDocument();
  });
});
