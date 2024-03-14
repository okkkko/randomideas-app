const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

connectDB();

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RandomIdeas API' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ideaRouter = require('./routes/ideas');
app.use('/api/ideas', ideaRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
