import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from '../ProductForm';
import { renderWithRouter } from './test-utils';

// Sample data for testing
const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 10.99,
  available: true,
};

describe('ProductForm', () => {
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

  // Test if form fields are displayed correctly
  it('shows form fields', () => {
    renderWithRouter(<ProductForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  });

  // Test form submission
  it('submits form data', async () => {
    renderWithRouter(<ProductForm />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'New Product' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'New Description' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '15.99' },
    });

    // Submit the form
    const submitButton = screen.getByText(/save/i);
    fireEvent.click(submitButton);

    // Check if the API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // Test validation
  it('shows error messages for empty fields', async () => {
    renderWithRouter(<ProductForm />);
    
    // Try to submit empty form
    const submitButton = screen.getByText(/save/i);
    fireEvent.click(submitButton);

    // Check for error messages
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });
}); 