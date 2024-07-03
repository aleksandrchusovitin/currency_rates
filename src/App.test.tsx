import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import App from './App';
import axios from 'axios';

const mock = new MockAdapter(axios);

describe('App Component', () => {
  beforeEach(async () => {
    mock.reset();
    localStorage.clear();
    const mockCurrencies = [
      { ticker: 'USD', logoURL: 'url-to-usd-logo', description: 'US Dollar' },
      { ticker: 'EUR', logoURL: 'url-to-eur-logo', description: 'Euro' },
    ];

    const mockRates = [
      { fromCurrency: 'USD', toCurrency: 'RUB', price: 100 },
    ];

    await act(async () => {
      mock.onGet('https://snowball-income.com/extapi/api/cash-list').reply(200, mockCurrencies);
      mock.onGet('https://snowball-income.com/extapi/api/public/currency-rates?currency=RUB').reply(200, mockRates);
      render(<App />);
    });
  });

  it('renders title', () => {
    const titleElement = screen.getByText(/Курс валют на сегодня/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('clears all selected currencies', async () => {
    const clearButton = screen.getByText(/Очистить все валюты/i);
    await act(async () => {
      fireEvent.click(clearButton); 
    });

    const currencyCards = screen.queryAllByTestId('currency-card');
    expect(currencyCards.length).toBe(0);
  });

  it('должен отображать заголовок', () => {
    expect(screen.getByText('Курс валют на сегодня')).toBeInTheDocument();
  });

  it('должен загружать и отображать валюты', async () => {
    const openButton = screen.getByTestId('ArrowDropDownIcon');

    await act(async () => {
      fireEvent.click(openButton); 
    });
  
    const userOptionsListbox = await screen.findByRole('presentation');
    expect(userOptionsListbox).toBeInTheDocument();

    const usdOption = await screen.findByRole('option', { name: /USD - US Dollar/ });
    expect(usdOption).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(usdOption); 
    });

    const cardElement = await screen.findByTestId('card'); 
    expect(cardElement).toBeInTheDocument();


    const priceElement = await screen.findByText(/100,0000 ₽/);

    expect(priceElement).toBeInTheDocument();
  });
});
