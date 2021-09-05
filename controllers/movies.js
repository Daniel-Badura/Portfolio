//jshint esversion:9
const axios = require('axios')
function fetchMovie(title){
   return axios
    //   .get(`http://www.omdbapi.com/?apikey=f7196b6c&t=${title}`)
      .get(`http://www.omdbapi.com/?apikey=f7196b6c&s=${title}`)
      .then((response) => response.data)
      .catch((err) => "error")};

module.exports.showMovies = async (req, res) => {
    const  search  = req.body.search;
  let movies = await fetchMovie(search);
  res.render("movies/search", {movies});
//   res.send(movies);
};
module.exports.searchMovies = async (req, res) => {res.render("movies/index", {});
};
