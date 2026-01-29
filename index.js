const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/analytics', {})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api', apiRoutes);
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
