
import React, { useEffect, useState } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton
} from '@mui/material';

import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { getCartCount } from '../utils/cartStorage.js';

export default function TopBar() {

  const [cartCount, setCartCount] = useState(() =>
    getCartCount()
  );

  useEffect(() => {
    const refreshCart = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener('shopzone-cart-updated', refreshCart);
    window.addEventListener('storage', refreshCart);

    return () => {
      window.removeEventListener('shopzone-cart-updated', refreshCart);
      window.removeEventListener('storage', refreshCart);
    };
  }, []);

  const nav = [                                                   
    ['Home', '#top'],
    ['Shop', '#products'],
    ['About', '#about']
  ];

  const scrollToSection = (event, id) => {
    event.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (

    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      className="topbar"
    >

      <Toolbar className="toolbar">

        {/* Website Logo */}

        <Box
          component="a"
          href="#top"
          className="brand"
        >

          <Box className="brand-icon">
            <ShoppingBagRoundedIcon />
          </Box>

          <Typography variant="h5" fontWeight={900}>
            Shop<span>Zone</span>
          </Typography>

        </Box>


        {/* Navigation Links */}

        <Box className="navlinks">

          {nav.map(([label, path]) => (

            <Button
              key={path}
              component="a"
              href={path}
              color="inherit"
              className={path === '#top' ? 'active-nav' : ''}
              onClick={(event) => scrollToSection(event, path)}
            >
              {label}
            </Button>

          ))}

        </Box>


        {/* Login, Register and Cart */}

        <Box className="navactions">

          <Button
            component={RouterLink}
            to="/login"
            color="inherit"
          >
            Login
          </Button>

          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
          >
            Register
          </Button>

          <IconButton
            component={RouterLink}
            to="/cart"
            aria-label="View cart"
          >
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartOutlinedIcon color="action" />
            </Badge>
          </IconButton>


        </Box>

      </Toolbar>

    </AppBar>

  );

}
