import { Card, CardContent, Typography, Avatar, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FC } from 'react';
import { ICurrencyRate } from '../types';

interface ICurrencyCardProps {
  currency: ICurrencyRate;
  onRemove: (currency: string) => void;
}

const classes = {
  currency: {
    marginLeft: '8px',
  },
  card: {
    height: '100%',
  },
};

const CurrencyCard: FC<ICurrencyCardProps> = (props) => {
  const { currency, onRemove } = props;

  const roundedPrice = currency.price.toFixed(4).replace('.', ',');

  return (
    <Card sx={classes.card} data-testid="card">
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar src={currency.logoURL} alt={currency.fromCurrency} />
          </Grid>
          <Grid item xs>
            <Typography variant="h5" component="div">
              {currency.fromCurrency} - {currency.description}
            </Typography>
            <Typography variant="h6" display="inline">
              {roundedPrice} ₽
            </Typography>
            <Typography display="inline" color={currency.dayGainPercent >= 0 ? 'green' : 'red'} sx={classes.currency}>
              {currency.dayGainPercent}%
            </Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={() => onRemove(currency.fromCurrency)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CurrencyCard;
