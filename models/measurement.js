const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  timestamp: Date,
  ticker: String,
  close: Number,
  volume: Number,
  rsi: Number,
  volatility: Number
});

module.exports = mongoose.model('Measurement', measurementSchema);