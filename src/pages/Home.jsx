
import React, { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Rating,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { addProductToCart } from '../utils/cartStorage.js';

const PAGE_SIZE = 12;

const IMAGE_FALLBACK = 'https://placehold.co/500x400?text=Product';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopzone-favorites') || '[]');
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState('');

  // LOAD PRODUCTS
  const loadProducts = async (signal) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'https://dummyjson.com/products?limit=100',
        { signal }
      );

      if (!response.ok) {
        throw new Error('Unable to load products. Please try again.');
      }

      const data = await response.json();

      setProducts(data.products || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Something went wrong.');
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    loadProducts(controller.signal);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const pendingProduct = location.state?.openProduct;
    if (!pendingProduct) return;

    setSelected(pendingProduct);
    navigate('/', { replace: true, state: null });
  }, [location.state, navigate]);

  // CATEGORIES
  const categories = useMemo(() => {
    return [
      ...new Set(
        products.map(product => product.category).filter(Boolean)
      )
    ].sort();
  }, [products]);

  // FILTER AND SORT
  const filtered = useMemo(() => {
    let list = products.filter(product => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        [
          product.title,
          product.description,
          product.brand,
          product.category
        ].some(value =>
          String(value || '').toLowerCase().includes(term)
        );

      const matchesCategory =
        category === 'all' || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === 'low') {
      list = [...list].sort((a, b) => a.price - b.price);
    }

    if (sort === 'high') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    if (sort === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, search, category, sort]);

  // RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const visible = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function hasLoggedInUser() {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem('shopzone-current-user') || 'null'
      );
      return Boolean(currentUser?.email);
    } catch {
      return false;
    }
  }

  function requireLoginForProduct(product, action, notice) {
    if (hasLoggedInUser()) return true;

    navigate('/login', {
      state: {
        notice,
        returnTo: { action, product }
      }
    });
    return false;
  }

  // ADD TO CART
  function addToCart(product) {
    if (
      !requireLoginForProduct(
        product,
        'add-to-cart',
        'Please login before adding to cart.'
      )
    ) return;

    addProductToCart(product);

    setToast(`${product.title} added to your cart`);
  }

  function viewProduct(product) {
    if (!requireLoginForProduct(product, 'view-product')) return;

    setSelected(product);
  }

  // FAVORITES
  function toggleFavorite(product) {
    const exists = favorites.includes(product.id);

    const updated = exists
      ? favorites.filter(id => id !== product.id)
      : [...favorites, product.id];

    setFavorites(updated);

    localStorage.setItem(
      'shopzone-favorites',
      JSON.stringify(updated)
    );

    setToast(
      exists
        ? 'Removed from favorites'
        : 'Added to favorites'
    );
  }

  // SCROLL TO PRODUCTS
  function scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  return (
    <>
      {/* HERO SECTION */}

      <Box className="hero" id="top">
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">

            <Grid item xs={12} md={7} className="hero-copy-panel">

              <Chip
                label="THE GOOD-FIND EDIT"
                className="hero-chip"
              />

              <Typography variant="h2" className="hero-title">
                Good things are <span>closer</span> than you think.
              </Typography>

              <Typography className="hero-copy">
                A thoughtful mix of everyday essentials, little luxuries,
                and can’t-stop-thinking-about-it finds. Your next favourite
                is waiting.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={scrollToProducts}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ mt: 3 }}
              >
                Explore products
              </Button>

              <Box className="hero-points">
                <span><b>01</b> Curated discoveries</span>
                <span><b>02</b> Joy in every order</span>
              </Box>

            </Grid>

            <Grid item xs={12} md={5}>
              <Box className="hero-art">

                <Box className="hero-orb" />
                <Box className="hero-sparkle sparkle-one">✳</Box>
                <Box className="hero-sparkle sparkle-two">✦</Box>

                <Box className="hero-product-card">
                  <img
                    src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
                    alt="Mascara product"
                  />
                  <span className="hero-image-label">A little beauty boost</span>
                </Box>

                <Box className="hero-product-card second">
                  <img
                    src="https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/1.webp"
                    alt="Furniture product"
                  />
                </Box>

                <Box className="hero-caption">
                  <span className="caption-dot" />
                  <span><strong>Find your kind of lovely</strong><small>Little things, big joy.</small></span>
                </Box>

              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" className="benefit-strip">
        <Box className="benefit-item">
          <span className="benefit-icon">✳</span>
          <span><strong>Made for discovery</strong><small>Unexpected finds, every time</small></span>
        </Box>
        <Box className="benefit-item">
          <span className="benefit-icon">↗</span>
          <span><strong>Easy to explore</strong><small>Search, sort, and fall in love</small></span>
        </Box>
        <Box className="benefit-item">
          <span className="benefit-icon">♡</span>
          <span><strong>Keep what you love</strong><small>Save favourites for later</small></span>
        </Box>
      </Container>

      {/* PRODUCTS SECTION */}

      <Container
        maxWidth="xl"
        id="products"
        className="products-section"
      >

        <Box className="section-heading">

          <Box>
            <Typography className="eyebrow">
              SHOP THE COLLECTION
            </Typography>

            <Typography variant="h4">
              Explore our products
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Find something you'll love from our product collection.
            </Typography>
          </Box>

          <Chip
            label={`${products.length} products loaded`}
            color="primary"
            variant="outlined"
          />

        </Box>

        {/* SEARCH AND FILTER */}

        <Box className="filter-panel">

          <TextField
            fullWidth
            placeholder="Search products, brands or categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              )
            }}
          />

          <FormControl className="filter-select">
            <Select
              value={category}
              onChange={e => setCategory(e.target.value)}
              displayEmpty
            >
              <MenuItem value="all">
                All categories
              </MenuItem>

              {categories.map(item => (
                <MenuItem key={item} value={item}>
                  {item.replaceAll('-', ' ')}
                </MenuItem>
              ))}

            </Select>
          </FormControl>

          <FormControl className="filter-select sort-select">
            <Select
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <MenuItem value="default">
                Sort: Recommended
              </MenuItem>

              <MenuItem value="low">
                Price: Low to high
              </MenuItem>

              <MenuItem value="high">
                Price: High to low
              </MenuItem>

              <MenuItem value="rating">
                Top rated
              </MenuItem>

            </Select>
          </FormControl>

        </Box>

        {/* LOADING */}

        {loading && (
          <Box className="loading">
            <CircularProgress />
            <Typography color="text.secondary">
              Loading products from DummyJSON...
            </Typography>
          </Box>
        )}

        {/* ERROR */}

        {error && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                onClick={() => {
                  const controller = new AbortController();
                  loadProducts(controller.signal);
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* EMPTY RESULTS */}

        {!loading && !error && filtered.length === 0 && (
          <Alert severity="info">
            No products found. Try another search or category.
          </Alert>
        )}

        {/* PRODUCT CARDS */}

        {!loading && !error && (
          <Grid container spacing={2.5}>

            {visible.map(product => (

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={product.id}
              >

                <Card className="product-card">

                  <Box
                    className="product-image-wrap"
                    onClick={() => viewProduct(product)}
                    sx={{ cursor: 'pointer' }}
                  >

                    <CardMedia
                      component="img"
                      image={
                        product.thumbnail ||
                        product.images?.[0] ||
                        IMAGE_FALLBACK
                      }
                      alt={product.title}
                      className="product-image"
                      onError={e => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = IMAGE_FALLBACK;
                      }}
                    />

                    <Chip
                      size="small"
                      label={`${Math.round(product.discountPercentage || 0)}% OFF`}
                      className="discount-chip"
                    />

                    <IconButton
                      className="favorite-button"
                      aria-label="Toggle favorite"
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                    >
                      {favorites.includes(product.id) ? (
                        <FavoriteRoundedIcon color="error" />
                      ) : (
                        <FavoriteBorderRoundedIcon />
                      )}
                    </IconButton>

                  </Box>

                  <CardContent className="product-content">

                    <Typography className="product-category">
                      {String(product.category || '').replaceAll('-', ' ')}
                    </Typography>

                    <Typography
                      className="product-title"
                      onClick={() => viewProduct(product)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {product.title}
                    </Typography>

                    <Box
                      display="flex"
                      alignItems="center"
                      gap={0.7}
                      mt={0.7}
                    >
                      <Rating
                        value={Number(product.rating) || 0}
                        precision={0.1}
                        size="small"
                        readOnly
                      />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {product.rating}
                      </Typography>
                    </Box>

                    <Box className="price-row">

                      <Typography className="product-price">
                        ${Number(product.price).toFixed(2)}
                      </Typography>

                      <Typography className="old-price">
                        $
                        {(
                          product.price /
                          (1 - (product.discountPercentage || 0) / 100)
                        ).toFixed(2)}
                      </Typography>

                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCartOutlinedIcon />}
                      onClick={() => addToCart(product)}
                    >
                      Add to cart
                    </Button>

                  </CardContent>

                </Card>

              </Grid>

            ))}

          </Grid>
        )}

        {/* PAGINATION */}

        {!loading && !error && filtered.length > 0 && (

          <Box className="pagination">

            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => {
                setPage(p => p - 1);
                scrollToProducts();
              }}
            >
              Previous
            </Button>

            <Typography color="text.secondary">
              Page {page} of {pageCount} · {filtered.length} products
            </Typography>

            <Button
              variant="contained"
              disabled={page === pageCount}
              onClick={() => {
                setPage(p => p + 1);
                scrollToProducts();
              }}
            >
              Next
            </Button>

          </Box>

        )}

      </Container>

      {/* BOTTOM BANNER */}

      <Box className="bottom-banner" id="about">
        <Container maxWidth="lg">
          <span className="banner-kicker">A GOOD DAY STARTS HERE</span>
          <Typography variant="h4">
            Find a little more joy in the everyday.
          </Typography>

          <Typography mt={1}>
            Browse the collection. Your next great find is just around the corner.
          </Typography>
          <Button
            variant="contained"
            onClick={scrollToProducts}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ mt: 3 }}
          >
            Find your favourite
          </Button>

        </Container>
      </Box>

      {/* PRODUCT DETAILS DIALOG */}

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
      >

        {selected && (

          <>

            <DialogTitle className="dialog-title">

              {selected.title}

              <IconButton onClick={() => setSelected(null)}>
                <CloseRoundedIcon />
              </IconButton>

            </DialogTitle>

            <DialogContent>

              <Grid container spacing={3} alignItems="center">

                <Grid item xs={12} sm={5}>

                  <img
                    className="dialog-image"
                    src={
                      selected.images?.[0] ||
                      selected.thumbnail ||
                      IMAGE_FALLBACK
                    }
                    alt={selected.title}
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = IMAGE_FALLBACK;
                    }}
                  />

                </Grid>

                <Grid item xs={12} sm={7}>

                  <Chip
                    label={selected.category}
                    color="primary"
                    size="small"
                  />

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    mt={2}
                  >
                    {selected.title}
                  </Typography>

                  <Rating
                    value={Number(selected.rating) || 0}
                    precision={0.1}
                    readOnly
                  />

                  <Typography color="text.secondary" mt={2}>
                    {selected.description}
                  </Typography>

                  <Typography
                    variant="h4"
                    color="primary"
                    mt={2}
                  >
                    ${Number(selected.price).toFixed(2)}
                  </Typography>

                  <Typography color="text.secondary" mt={1}>
                    Brand: {selected.brand || 'Not specified'}
                    {' · '}
                    Stock: {selected.stock}
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={() => addToCart(selected)}
                  >
                    Add to cart
                  </Button>

                </Grid>

              </Grid>

            </DialogContent>

          </>

        )}

      </Dialog>

      {/* NOTIFICATION */}

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2500}
        onClose={() => setToast('')}
        message={toast}
      />

    </>
  );
}