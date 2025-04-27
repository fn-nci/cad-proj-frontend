import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProductList from '../ProductList';
import { renderWithRouter } from './test-utils';

// Sample data for testing
const mockProducts = [
  {
    id: 1,
    name: 'Test Product 1',
    description: 'Test Description 1',
    price: 10.99,
    available: true,
  },
  {
    id: 2,
    name: 'Test Product 2',
    description: 'Test Description 2',
    price: 20.99,
    available: false,
  }
];

describe('ProductList', () => {
  // Set up mock data before each test
  beforeEach(() => {
    global.fetch.mockClear();
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    );
  });

  // Test if products are displayed correctly
  it('shows list of products', async () => {
    renderWithRouter(<ProductList />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });

  // Test loading state
  it('shows loading message', () => {
    renderWithRouter(<ProductList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // Test error handling
  it('shows error message when API fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));
    renderWithRouter(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });
}); 