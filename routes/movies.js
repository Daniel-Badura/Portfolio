const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

// Movies

  router.get(
    "/movies",
    catchAsync( (req, res) => {
      res.render("movies/index", {});
    })
  );
module.exports = router;
