import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from '../ProductForm';

describe('ProductForm', () => {
  const mockOnSubmit = jest.fn();
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 10.99,
    available: true,
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/available/i)).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);
    
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
    fireEvent.click(screen.getByLabelText(/available/i));
    
    // Submit the form
    fireEvent.click(screen.getByText(/save/i));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Product',
        description: 'New Description',
        price: '15.99',
        available: true,
      });
    });
  });

  it('shows validation errors for empty fields', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);
    
    fireEvent.click(screen.getByText(/save/i));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
    });
  });
}); 