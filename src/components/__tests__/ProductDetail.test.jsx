import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProductDetail from '../ProductDetail';
import { renderWithRouter } from './test-utils';

// Sample data for testing
const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 10.99,
  available: true,
};

describe('ProductDetail', () => {
  // Set up mock data before each test
  beforeEach(() => {
    global.fetch.mockClear();
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );
  });

  // Test if product details are displayed correctly
  it('shows product details', async () => {
    renderWithRouter(<ProductDetail />, { route: '/products/1' });

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  // Test loading state
  it('shows loading message', () => {
    renderWithRouter(<ProductDetail />, { route: '/products/1' });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // Test error handling
  it('shows error message when API fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));
    renderWithRouter(<ProductDetail />, { route: '/products/1' });

    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });
}); 