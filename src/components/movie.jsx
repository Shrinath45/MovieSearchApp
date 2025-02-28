import React, { useState, useEffect } from "react";
import { Container, TextField, Grid, Card, CardMedia, CardContent, Typography, Dialog, DialogTitle, DialogContent, IconButton, Box, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";

const API_KEY = "2bd5dd84f434c87665fda7674e2b11ac";
const API_URL = "https://api.themoviedb.org/3/search/movie";

const MovieSearchApp = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      fetchMovies();
    } else {
      setMovies([]);
    }
  }, [query]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          query: query,
        },
      });
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", mt: 2 }}>
        🎬 Movie Search App
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for movies..."
          sx={{ maxWidth: 500, backgroundColor: "white", borderRadius: 2 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ marginRight: 1, color: "gray" }} />,
          }}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card onClick={() => setSelectedMovie(movie)} sx={{ cursor: "pointer", transition: "0.3s", '&:hover': { transform: "scale(1.05)" } }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{movie.title}</Typography>
                  <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                    <StarIcon sx={{ color: "gold", fontSize: 18, marginRight: 0.5 }} />
                    {movie.vote_average}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={!!selectedMovie} onClose={() => setSelectedMovie(null)}>
        {selectedMovie && (
          <>
            <DialogTitle>
              {selectedMovie.title}
              <IconButton
                aria-label="close"
                onClick={() => setSelectedMovie(null)}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                width="100%"
                style={{ borderRadius: 8 }}
              />
              <Typography variant="body1" gutterBottom mt={2}>
                {selectedMovie.overview}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">Release Date: {selectedMovie.release_date}</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MovieSearchApp;