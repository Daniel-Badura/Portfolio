//jshint esversion:9
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const { showMovies, searchMovies } = require("../controllers/movies");
// Movies

// router.post("/show", catchAsync(showMovies));
router.get("/show", catchAsync(showMovies));
router.post("/show", catchAsync(showMovies));
router.get("/", catchAsync(searchMovies));

module.exports = router;
