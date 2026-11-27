
import React, { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import { addProductToCart } from '../utils/cartStorage.js';

export default function Login() {

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // UPDATE FORM
  function update(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    setMessage('');
  }

  // LOGIN SUBMIT
  function submit(e) {
    e.preventDefault();

    setMessage('');

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setMessage('Please enter your email and password.');
      return;
    }

    try {
      const users = JSON.parse(
        localStorage.getItem('shopzone-users') || '[]'
      );

      if (!Array.isArray(users)) {
        throw new Error('Invalid user data');
      }

      const user = users.find(
        u =>
          String(u.email || '').trim().toLowerCase() === email &&
          u.password === password
      );

      if (!user) {
        setMessage(
          'Account not found or password is incorrect. Please register first.'
        );
        return;
      }

      // SAVE CURRENT USER
      localStorage.setItem(
        'shopzone-current-user',
        JSON.stringify({
          name: user.name,
          email: user.email
        })
      );

      const returnTo = location.state?.returnTo;
      if (returnTo?.action === 'add-to-cart' && returnTo.product) {
        addProductToCart(returnTo.product);
        navigate('/cart', { replace: true });
        return;
      }

      const pendingProduct = returnTo?.product;
      navigate('/', {
        replace: true,
        state: pendingProduct ? { openProduct: pendingProduct } : null
      });

    } catch (error) {
      setMessage(
        'Unable to login. Please check your account data and try again.'
      );
    }
  }

  return (

    <Container maxWidth="sm" className="auth-wrap">

      <Paper
        className="auth-card"
        elevation={0}
      >

        {/* LOGIN ICON */}

        <Box className="auth-symbol">
          <LockOpenRoundedIcon />
        </Box>

        {/* HEADING */}

        <Typography className="eyebrow">
          WELCOME BACK
        </Typography>

        <Typography variant="h4" mt={1}>
          Login to ShopZone
        </Typography>

        <Typography
          color="text.secondary"
          mt={1}
          mb={3}
        >
          Sign in to continue exploring your favourite products.
        </Typography>

        {/* ALERT MESSAGE */}

        {location.state?.notice && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {location.state.notice}
          </Alert>
        )}

        {message && (

          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>

        )}

        {/* LOGIN FORM */}

        <Box
          component="form"
          onSubmit={submit}
          display="grid"
          gap={2}
        >

          <TextField
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            required
            fullWidth
            autoComplete="email"
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            required
            fullWidth
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            Login
          </Button>

        </Box>

        {/* REGISTER LINK */}

        <Typography
          textAlign="center"
          mt={3}
          color="text.secondary"
        >
          New to ShopZone?{' '}

          <Link
            to="/register"
            className="text-link"
          >
            Create an account
          </Link>

        </Typography>

      </Paper>

    </Container>

  );
}