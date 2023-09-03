//jshint esversion:9
const axios = require("axios");
function fetchMovies(title) {
  return axios
    .get(`http://www.omdbapi.com/?apikey=f7196b6c&s=${title}`)
    .then((response) => response.data)
    .catch((err) => "error");
}
function fetchMovie(title) {
  return axios
    .get(`http://www.omdbapi.com/?apikey=f7196b6c&i=${title}`)
    .then((response) => response.data)
    .catch((err) => "error");
}
module.exports = { fetchMovie, fetchMovies };
module.exports.showMovies = async (req, res) => {
  const search = req.body.search;
  let movies = await fetchMovies(search);
  res.render("movies/search", { movies, search });
  //   res.send(movies);
};
module.exports.searchMovies = async (req, res) => {
  res.render("movies/index", {});
};
module.exports.showMovie = async (req, res) => {
  const title = req.params.title;
  let movie = await fetchMovie(title);
  res.render("movies/show", { movie });
};
