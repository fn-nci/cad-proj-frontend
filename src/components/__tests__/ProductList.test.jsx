import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductList from '../ProductList';

// Mock the fetch response
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
  },
  {
    id: 3,
    name: 'Test Product 3',
    description: 'Test Description 3',
    price: 30.99,
    available: true,
  },
];

describe('ProductList', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch.mockClear();
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProducts),
      })
    );
  });

  it('renders product list correctly', async () => {
    render(<ProductList />);

    // Wait for products to be loaded
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('Test Product 3')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<ProductList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Error loading products')).toBeInTheDocument();
    });
  });

  it('filters products by availability', async () => {
    render(<ProductList />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Filter for available products
    fireEvent.click(screen.getByLabelText(/show available only/i));

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 3')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
    });

    // Filter for unavailable products
    fireEvent.click(screen.getByLabelText(/show unavailable only/i));

    await waitFor(() => {
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Product 3')).not.toBeInTheDocument();
    });
  });

  it('sorts products by price', async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Sort by price ascending
    fireEvent.click(screen.getByText(/sort by price/i));

    const prices = screen.getAllByText(/\$\d+\.\d{2}/);
    const priceValues = prices.map(p => parseFloat(p.textContent.replace('$', '')));

    expect(priceValues).toEqual([10.99, 20.99, 30.99]);

    // Sort by price descending
    fireEvent.click(screen.getByText(/sort by price/i));

    const descendingPrices = screen.getAllByText(/\$\d+\.\d{2}/);
    const descendingPriceValues = descendingPrices.map(p => parseFloat(p.textContent.replace('$', '')));

    expect(descendingPriceValues).toEqual([30.99, 20.99, 10.99]);
  });
}); 