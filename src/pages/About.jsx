
import React, { useEffect, useState } from 'react';

import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material';

import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

const descriptions = {
  beauty: 'Discover beauty and personal-care products, including makeup, skincare and everyday grooming essentials.',
  fragrances: 'Explore fragrances and scents for different styles, occasions and preferences.',
  furniture: 'Find furniture pieces and home accents designed to make your living spaces more comfortable.',
  groceries: 'Browse grocery essentials and everyday items for your home.',
  'home-decoration': 'Add personality to your spaces with decorative accessories and home styling products.',
  'kitchen-accessories': 'Explore practical kitchen tools and accessories for everyday cooking.',
  laptops: 'Discover laptops for study, work, entertainment and everyday computing.',
  'mens-shirts': 'Browse shirts and wardrobe essentials for different occasions and styles.',
  'mens-shoes': 'Explore footwear options designed for comfort and everyday use.',
  'mens-watches': 'Discover watches and accessories that complement your personal style.',
  'mobile-accessories': 'Find useful accessories for mobile devices, including charging and protection products.',
  motorcycle: 'Explore motorcycle-related products and accessories.',
  'skin-care': 'Browse skincare products made for everyday personal-care routines.',
  smartphones: 'Discover smartphones with different features, designs and capabilities.',
  'sports-accessories': 'Find accessories for sports, fitness and active lifestyles.',
  sunglasses: 'Explore sunglasses in different looks and styles.',
  tablets: 'Browse tablets for learning, creativity, productivity and entertainment.',
  tops: 'Discover versatile tops to add to your everyday wardrobe.',
  vehicle: 'Explore products and accessories related to vehicles.',
  'womens-bags': 'Browse bags that combine everyday utility with personal style.',
  'womens-dresses': 'Explore dresses for casual days, celebrations and special occasions.',
  'womens-jewellery': 'Discover jewellery pieces and accessories for different looks.',
  'womens-shoes': 'Browse footwear styles for different occasions and everyday comfort.',
  'womens-watches': 'Explore watches and accessories for a range of personal styles.'
};

const categoryIcon = (name) => {
  const key = name.toLowerCase();

  if (
    key.includes('beauty') ||
    key.includes('skin') ||
    key.includes('fragrance')
  ) {
    return <SpaOutlinedIcon />;
  }

  if (
    key.includes('furniture') ||
    key.includes('decoration') ||
    key.includes('kitchen')
  ) {
    return <ChairOutlinedIcon />;
  }

  if (
    key.includes('shirt') ||
    key.includes('dress') ||
    key.includes('tops') ||
    key.includes('shoes') ||
    key.includes('bag')
  ) {
    return <CheckroomOutlinedIcon />;
  }

  if (key.includes('grocery')) {
    return <LocalGroceryStoreOutlinedIcon />;
  }

  if (
    key.includes('laptop') ||
    key.includes('smartphone') ||
    key.includes('tablet') ||
    key.includes('mobile')
  ) {
    return <DevicesOutlinedIcon />;
  }

  return <CategoryOutlinedIcon />;
};

const formatCategory = (category) => {
  return category
    .replaceAll('-', ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

export default function About() {

  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://dummyjson.com/products?limit=100'
        );

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();

        setCount(data.total || data.products?.length || 0);

        const uniqueCategories = [
          ...new Set(
            (data.products || [])
              .map(product => product.category)
              .filter(Boolean)
          )
        ].sort();

        setCategories(uniqueCategories);

      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(true);
        setCategories([]);
        setCount(0);

      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

  }, []);

  return (
    <Container maxWidth="xl" className="about-wrap">

      {/* HERO SECTION */}

      <Box className="about-hero">

        <Chip
          label="GET TO KNOW SHOPZONE"
          color="secondary"
        />

        <Typography variant="h2" className="about-title">
          Shopping made simple.
          <br />
          <span>Choices made exciting.</span>
        </Typography>

        <Typography className="about-lead">
          Welcome to ShopZone, your online destination to explore
          products across multiple categories. We bring product
          discovery into one simple and enjoyable shopping experience.
        </Typography>

      </Box>

      {/* STATISTICS SECTION */}

      <Grid container spacing={2.5} className="about-stats">

        <Grid item xs={12} sm={4}>
          <Paper className="stat-card">

            <ShoppingBagOutlinedIcon />

            <Typography variant="h4">
              {loading ? '...' : count}
            </Typography>

            <Typography color="text.secondary">
              Products available through the API
            </Typography>

          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper className="stat-card">

            <CategoryOutlinedIcon />

            <Typography variant="h4">
              {loading ? '...' : categories.length}
            </Typography>

            <Typography color="text.secondary">
              Product categories discovered
            </Typography>

          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper className="stat-card">

            <DevicesOutlinedIcon />

            <Typography variant="h4">
              One
            </Typography>

            <Typography color="text.secondary">
              Place to explore products
            </Typography>

          </Paper>
        </Grid>

      </Grid>

      {/* CATEGORY SECTION */}

      <Box mt={7} mb={3}>

        <Typography className="eyebrow">
          WHAT YOU CAN EXPLORE
        </Typography>

        <Typography variant="h4" mt={1}>
          Shop by product category
        </Typography>

        <Typography color="text.secondary" mt={1}>
          These categories are created dynamically from the products
          returned by DummyJSON.
        </Typography>

      </Box>

      {/* LOADING */}

      {loading ? (

        <Box className="loading">
          <CircularProgress />
          <Typography mt={2}>
            Loading product categories...
          </Typography>
        </Box>

      ) : error ? (

        <Typography color="error">
          Unable to load categories. Please check your internet
          connection and refresh the page.
        </Typography>

      ) : categories.length > 0 ? (

        <Grid container spacing={2.5}>

          {categories.map(category => (

            <Grid item xs={12} sm={6} md={4} key={category}>

              <Paper className="category-card">

                <Box className="category-icon">
                  {categoryIcon(category)}
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={800}
                  mt={2}
                >
                  {formatCategory(category)}
                </Typography>

                <Typography color="text.secondary" mt={1}>
                  {descriptions[category] ||
                    `Explore ${formatCategory(category)} products selected from our online product collection.`}
                </Typography>

              </Paper>

            </Grid>

          ))}

        </Grid>

      ) : (

        <Typography color="text.secondary">
          No product categories are currently available.
        </Typography>

      )}

      {/* MISSION SECTION */}

      <Paper className="mission-card">

        <Typography className="eyebrow">
          OUR PURPOSE
        </Typography>

        <Typography variant="h4" mt={1}>
          A smoother way to discover what you need.
        </Typography>

        <Typography color="text.secondary" mt={2}>
          ShopZone is a student-built e-commerce frontend project
          created with React and Material UI. Product information,
          prices, ratings and images are fetched dynamically from
          the DummyJSON sample products API.

          This project demonstrates API integration, reusable
          components, routing, search, filtering and responsive
          user interface design.
        </Typography>

      </Paper>

    </Container>
  );
}
