const mongoose = require("mongoose");
// require("dotenv").config({ path: "./config/config.env" });
const dotenv = require("dotenv");
dotenv.config();

const { fetchMovie, fetchMovies } = require("./controllers/movies");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {});
mongoose.connection.on("error", () => {
  throw new Error("unable to connect to database");
});

test('Fetch "http://www.omdbapi.com/?apikey=f7196b6c&i=tt0096895" returns the Batman Movie object', () => {
  expect.assertions(1);
  return fetchMovie("tt0096895").then((data) => {
    expect(data.Title).toEqual("Batman");
  });
});
test('Fetch "http://www.omdbapi.com/?apikey=f7196b6c&s=Batman" returns a response', () => {
  expect.assertions(1);
  return fetchMovies("Batman").then((data) => {
    expect(data.Response).toEqual("True");
  });
});
