import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as vi.Mocked<typeof axios>;

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Курс валют на сегодня/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('fetches and displays currency rates', async () => {
    const mockRates = [
      { fromCurrency: 'USD', toCurrency: 'RUB', rate: 75 },
      { fromCurrency: 'EUR', toCurrency: 'RUB', rate: 90 },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockRates });

    render(<App />);
    const currencySelector = screen.getByRole('combobox');
    fireEvent.change(currencySelector, { target: { value: 'USD' } });

    const currencyCard = await screen.findByText(/USD/i);
    expect(currencyCard).toBeInTheDocument();
  });

  it('clears all selected currencies', () => {
    render(<App />);
    const clearButton = screen.getByText(/Очистить все валюты/i);
    fireEvent.click(clearButton);

    const currencyCards = screen.queryAllByTestId('currency-card');
    expect(currencyCards.length).toBe(0);
  });
});
