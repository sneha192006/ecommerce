
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

import { Link, useNavigate } from 'react-router-dom';

import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

export default function Register() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // UPDATE FORM
  function update(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    setMessage('');
  }

  // REGISTER SUBMIT
  function submit(e) {
    e.preventDefault();

    setMessage('');
    setSuccess(false);

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // NAME VALIDATION
    if (name.length < 2) {
      setMessage('Please enter your full name.');
      return;
    }

    // EMAIL VALIDATION
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // PASSWORD VALIDATION
    if (password.length < 8) {
      setMessage('Password must contain at least 8 characters.');
      return;
    }

    // CONFIRM PASSWORD
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {

      // GET EXISTING USERS
      const users = JSON.parse(
        localStorage.getItem('shopzone-users') || '[]'
      );

      if (!Array.isArray(users)) {
        throw new Error('Invalid user data');
      }

      // CHECK DUPLICATE EMAIL
      const existingUser = users.some(
        user =>
          String(user.email || '').trim().toLowerCase() === email
      );

      if (existingUser) {
        setMessage(
          'This email is already registered. Please login.'
        );
        return;
      }

      // CREATE NEW USER
      const newUser = {
        name: name,
        email: email,
        password: password
      };

      users.push(newUser);

      // SAVE USER DATA
      localStorage.setItem(
        'shopzone-users',
        JSON.stringify(users)
      );

      // SUCCESS MESSAGE
      setSuccess(true);
      setLoading(true);

      setMessage(
        'Registration successful! You can now login.'
      );

      // REDIRECT TO LOGIN
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error) {

      setSuccess(false);

      setMessage(
        'Unable to register. Please try again.'
      );

    }
  }

  return (

    <Container
      maxWidth="sm"
      className="auth-wrap"
    >

      <Paper
        className="auth-card"
        elevation={0}
      >

        {/* REGISTER ICON */}

        <Box className="auth-symbol">
          <PersonAddAltRoundedIcon />
        </Box>

        {/* HEADING */}

        <Typography className="eyebrow">
          JOIN OUR COMMUNITY
        </Typography>

        <Typography variant="h4" mt={1}>
          Create your account
        </Typography>

        <Typography
          color="text.secondary"
          mt={1}
          mb={3}
        >
          Register with ShopZone and start discovering products.
        </Typography>

        {/* ALERT MESSAGE */}

        {message && (

          <Alert
            severity={success ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>

        )}

        {/* REGISTRATION FORM */}

        <Box
          component="form"
          onSubmit={submit}
          display="grid"
          gap={2}
        >

          <TextField
            label="Full name"
            name="name"
            value={form.name}
            onChange={update}
            required
            fullWidth
            inputProps={{
              minLength: 2,
              maxLength: 60
            }}
            autoComplete="name"
          />

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
            label="Password (minimum 8 characters)"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            required
            fullWidth
            inputProps={{
              minLength: 8
            }}
            autoComplete="new-password"
          />

          <TextField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={update}
            required
            fullWidth
            autoComplete="new-password"
          />

          {/* REGISTER BUTTON */}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>

        </Box>

        {/* LOGIN LINK */}

        <Typography
          textAlign="center"
          mt={3}
          color="text.secondary"
        >
          Already registered?{' '}

          <Link
            to="/login"
            className="text-link"
          >
            Login
          </Link>

        </Typography>

      </Paper>

    </Container>

  );
}
