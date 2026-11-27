import React from 'react';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import { Box, Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container maxWidth="xl" className="footer-inner">
        <a href="#top" className="footer-brand" aria-label="ShopZone home">
          <Box className="footer-brand-icon">
            <ShoppingBagRoundedIcon />
          </Box>
          <Typography variant="h6">Shop<span>Zone</span></Typography>
        </a>

        <Typography className="footer-copy">
          Thoughtful finds for everyday life.
        </Typography>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#top">Home</a>
          <a href="#products">Shop</a>
          <a href="#about">About</a>
        </nav>
      </Container>
    </footer>
  );
}
