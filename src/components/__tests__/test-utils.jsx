import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Simple function to render components with Router
export function renderWithRouter(ui, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
}

export async function waitForFetch() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
} 