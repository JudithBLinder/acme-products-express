const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const whiteListedUrl = process.env.WHITELISTED_URL || '*';

// Helper functions
const readFileP = (path) => {
  return new Promise((res, rej) => {
    fs.readFile(path, (err, data) => {
      if (err) rej(err);
      else res(JSON.parse(data.toString()));
    });
  });
};

const app = express();

const PORT = process.env.PORT || 3000;

const DB_PATH = path.join(__dirname, './products.json');

//Logging middleware
app.use((req, res, next) => {
  console.log(chalk.cyan(`Request made to: ${req.path}`));

  next();
});

app.use(express.static(path.join(__dirname, '../dist')));

//JSON middleware
app.use(express.json());

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', whiteListedUrl);
  res.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.set('Vary', 'Origin');

  next();
});

// Data Layer Middleware
app.use((req, res, next) => {
  readFileP(DB_PATH).then((data) => {
    req.products = data;
    next();
  });
});

app.get('/api/products', (req, res) => {
  res.send({
    products: req.products,
  });
});

// Not Found Middleware (not working for some reason)
app.use((req, res, next) => {
  res.send({
    message: `Webpage not found at ${req.path}`,
  });
});

// Error Middleware
app.use((err, req, res, next) => {
  console.log('Error in Middleware');
  res.send({
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(chalk.green(`Server is now listening on PORT: ${PORT}`));
});
