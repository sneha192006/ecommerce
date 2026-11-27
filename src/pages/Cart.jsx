import React, { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Divider,
  IconButton,
  Typography
} from '@mui/material';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Link as RouterLink } from 'react-router-dom';
import { readCart, saveCart } from '../utils/cartStorage.js';

const IMAGE_FALLBACK = 'https://placehold.co/500x400?text=Product';

export default function Cart() {
  const [items, setItems] = useState(() => readCart());

  const total = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  function removeItem(productId) {
    const updated = items.filter(item => item.id !== productId);
    saveCart(updated);
    setItems(updated);
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography className="eyebrow">YOUR SHOPPING BAG</Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Your cart
      </Typography>

      {items.length === 0 ? (
        <Alert
          severity="info"
          action={
            <Button component={RouterLink} to="/" color="inherit">
              Browse products
            </Button>
          }
        >
          Your cart is empty.
        </Alert>
      ) : (
        <Box display="grid" gap={2}>
          {items.map(item => (
            <Card
              key={item.id}
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: { xs: 1.5, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <CardMedia
                component="img"
                image={item.thumbnail || item.images?.[0] || IMAGE_FALLBACK}
                alt={item.title}
                onError={event => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = IMAGE_FALLBACK;
                }}
                sx={{
                  width: { xs: '100%', sm: 140 },
                  height: 130,
                  objectFit: 'cover',
                  borderRadius: 2
                }}
              />

              <Box flex={1} width="100%">
                <Typography color="text.secondary" variant="caption">
                  {String(item.category || '').replaceAll('-', ' ')}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary" sx={{ my: 0.5 }}>
                  {item.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.brand ? `Brand: ${item.brand} · ` : ''}
                  Quantity: {item.quantity}
                </Typography>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                width={{ xs: '100%', sm: 'auto' }}
                justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
              >
                <Typography variant="h6" fontWeight={800}>
                  ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </Typography>
                <IconButton
                  aria-label={`Remove ${item.title} from cart`}
                  onClick={() => removeItem(item.id)}
                >
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Box>
            </Card>
          ))}

          <Divider />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h5" color="primary" fontWeight={800}>
              ${total.toFixed(2)}
            </Typography>
          </Box>
          <Button component={RouterLink} to="/" variant="outlined" sx={{ justifySelf: 'start' }}>
            Continue shopping
          </Button>
        </Box>
      )}
    </Container>
  );
}
