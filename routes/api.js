const express = require('express');
const router = express.Router();
const Measurement = require('../models/measurement');

const allowedFields = ['close', 'volume', 'rsi', 'volatility'];

router.get('/metrics', async (req, res) => {
    try {
        const { field, start_date, end_date, ticker } = req.query;

        if (!allowedFields.includes(field)) {
            return res.status(400).json({ error: `Invalid field: ${field}. Available fields: ${allowedFields.join(', ')}` });
        }

        if (!start_date || !end_date) {
            return res.status(400).json({ error: "The start_date and end_date parameters are required." });
        }
        
        const start = new Date(start_date);
        const end = new Date(end_date);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ error: "Incorrect date format. Use YYYY-MM-DD." });
        }

        const stats = await Measurement.aggregate([
            {
                $match: {
                    timestamp: { $gte: start, $lte: end },
                    ticker: ticker
                }
            },
            {
                $group: {
                    _id: null,
                    average: { $avg: `$${field}` },
                    min: { $min: `$${field}` },
                    max: { $max: `$${field}` },
                    stdDev: { $stdDevPop: `$${field}` }
                }
            }
        ]);

        if (!stats.length) {
            return res.status(404).json({ error: "No data found for this period." });
        }

        res.json(stats[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error calculating metrics" });
    }
});

router.get('/measurements', async (req, res) => {
    try {
        const { start_date, end_date, ticker } = req.query;
    
        const query = {
            timestamp: { 
                $gte: new Date(start_date), 
                $lte: new Date(end_date) 
            },
            ticker: ticker
        };

        const data = await Measurement.find(query).sort({ timestamp: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;