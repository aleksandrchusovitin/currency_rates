import { useState, useEffect, FC, useMemo } from 'react';
import axios from 'axios';
import { FormControl, Autocomplete, TextField } from '@mui/material';
import { ICurrency } from '../types';

interface ICurrencySelectorProps {
  selectedCurrencies: string[];
  setSelectedCurrencies: (currencies: string[]) => void;
}

const classes = {
  root: {
    width: '400px',
    display: 'flex',
  },
};

const CurrencySelector: FC<ICurrencySelectorProps> = (props) => {
  const { selectedCurrencies, setSelectedCurrencies } = props;

  const [currencies, setCurrencies] = useState<ICurrency[]>([]);

  const fetchCurrencies = async () => {
    return await axios.get<ICurrency[]>('https://snowball-income.com/extapi/api/cash-list');
  };

  useEffect(() => {
    fetchCurrencies().then((response) => {
      setCurrencies(response.data);
    });
  }, [selectedCurrencies]);

  const handleSelectedCurrenciesChange = (_: React.SyntheticEvent<Element, Event>, value: { label: string }[]) => {
    const selectedValues = value.map((item) => item.label.split(' - ')[0]);
    setSelectedCurrencies(selectedValues);
  };
  const prepared = useMemo(() => {
    return currencies.map((currency) => ({ label: `${currency.ticker} - ${currency.description}` }));
  }, [currencies]);

  const selectedOptions = useMemo(() => {
    return prepared.filter((option) => selectedCurrencies.includes(option.label.split(' - ')[0]));
  }, [prepared, selectedCurrencies]);


  return (
    <FormControl sx={classes.root}>
      <Autocomplete
        data-testid="select"
        onChange={handleSelectedCurrenciesChange}
        multiple
        disablePortal
        options={prepared}
        value={selectedOptions}
        renderInput={(params) => <TextField {...params} label="Выберите валюту" />}
      />
    </FormControl>
  );
};

export default CurrencySelector;
