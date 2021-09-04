// jshint esversion: 9

const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const WidoczekSchema = new Schema({
  name: String,
  image: String,
  // price: Number,
  description: String,
  location: String,
  author: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

WidoczekSchema.post('findOneAndDelete', async function(document){
    if(document){
        await Review.deleteMany({
            _id: {
                $in: document.reviews
            }
        });
    }
});


module.exports = mongoose.model("Widoczek", WidoczekSchema);
