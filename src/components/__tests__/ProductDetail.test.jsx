import { render, screen, waitFor } from '@testing-library/react';
import ProductDetail from '../ProductDetail';

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 10.99,
  available: true,
};

describe('ProductDetail', () => {
  beforeEach(() => {
    global.fetch.mockClear();
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProduct),
      })
    );
  });

  it('renders product details correctly', async () => {
    render(<ProductDetail productId={1} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('$10.99')).toBeInTheDocument();
      expect(screen.getByText('Available')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<ProductDetail productId={1} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));
    
    render(<ProductDetail productId={1} />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading product')).toBeInTheDocument();
    });
  });

  it('shows not available status for unavailable products', async () => {
    const unavailableProduct = { ...mockProduct, available: false };
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(unavailableProduct),
      })
    );
    
    render(<ProductDetail productId={1} />);
    
    await waitFor(() => {
      expect(screen.getByText('Not Available')).toBeInTheDocument();
    });
  });
}); 