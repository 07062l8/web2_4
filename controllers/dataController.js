const Measurement = require('/models/Measurement');

exports.getMetrics = async (req, res) => {
  const { field, start_date, end_date } = req.query;

  try {
    const metrics = await Measurement.aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(start_date), $lte: new Date(end_date) }
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
    res.json(metrics[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};