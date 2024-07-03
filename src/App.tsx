import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Button, Typography } from '@mui/material';
import CurrencyCard from './components/CurrencyCard';
import CurrencySelector from './components/CurrencySelector';
import { ICurrency, ICurrencyRate } from './types';

const classes = {
  clearButton: {
    margin: '20px 0',
  },
  title: {
    margin: '15px 0',
  },
};

const App = () => {
  const rawSelectedCurrencies = localStorage.getItem('selectedCurrencies');
  const initialSelectedCurrencies = rawSelectedCurrencies ? JSON.parse(rawSelectedCurrencies) : [];
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(initialSelectedCurrencies);

  const [currencyRates, setCurrencyRates] = useState<ICurrencyRate[]>([]);
  const [currencyLogos, setCurrencyLogos] = useState<{ [key: string]: string }>({});
  const [currencyDescriptions, setCurrencyDescriptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    localStorage.setItem('selectedCurrencies', JSON.stringify(selectedCurrencies));
  }, [selectedCurrencies]);

  const fetchCashList = async () => {
    return await axios.get<ICurrency[]>('https://snowball-income.com/extapi/api/cash-list');
  };

  useEffect(() => {
    fetchCashList().then((response) => {
      const initialLogosAcc: Record<string, string> = {};
      const initialDescriptionsAcc: Record<string, string> = {};

      const logos = response.data.reduce((acc, currency) => {
        acc[currency.ticker] = currency.logoURL;
        return acc;
      }, initialLogosAcc);
      const descriptions = response.data.reduce((acc, currency) => {
        acc[currency.ticker] = currency.description;
        return acc;
      }, initialDescriptionsAcc);
      setCurrencyLogos(logos);
      setCurrencyDescriptions(descriptions);
    });
  }, []);

  const fetchCurrencyRates = async () => {
    return await axios.get<ICurrencyRate[]>(
      'https://snowball-income.com/extapi/api/public/currency-rates?currency=RUB',
    );
  };

  useEffect(() => {
    if (selectedCurrencies.length > 0) {
      fetchCurrencyRates().then((response) => {
        const filteredRates = response.data.filter((rate) => selectedCurrencies.includes(rate.fromCurrency));
        setCurrencyRates(filteredRates);
      });
    } else {
      setCurrencyRates([]);
    }
  }, [selectedCurrencies]);

  const handleCurrencyRemove = (currency: string) => {
    setSelectedCurrencies(selectedCurrencies.filter((item) => item !== currency));
  };

  const handleClearAll = () => {
    setSelectedCurrencies([]);
  };

  return (
    <Container>
      <Typography variant="h4" sx={classes.title}>
        Курс валют на сегодня
      </Typography>
      <CurrencySelector selectedCurrencies={selectedCurrencies} setSelectedCurrencies={setSelectedCurrencies} />
      <Button variant="contained" color="secondary" onClick={handleClearAll} sx={classes.clearButton}>
        Очистить все валюты
      </Button>
      <Grid container spacing={2}>
        {currencyRates.map((currency) => (
          <Grid item xs={12} sm={6} md={4} key={currency.fromCurrency}>
            <CurrencyCard
              currency={{
                ...currency,
                logoURL: currencyLogos[currency.fromCurrency],
                description: currencyDescriptions[currency.fromCurrency],
              }}
              onRemove={handleCurrencyRemove}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
