const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

const listingSchema = new mongoose.Schema({
  name: String,
  address: String,
  price: String,
  Size: String
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;