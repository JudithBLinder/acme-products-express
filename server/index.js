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

const writeFileP = (path, data) => {
  return new Promise((res, rej) => {
    fs.writeFile(path, JSON.stringify(data), (err) => {
      if (err) rej(err);
      else res();
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
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id * 1;

  if (req.products.filter((pro) => pro.id === id).length === 0) {
    res.status(400).send({
      message: `Product ${id} does not exist`,
    });
  } else {
    req.products = req.products.filter((product) => product.id !== id);

    writeFileP(DB_PATH, req.products).then(() => {
      res.send({
        message: `Product ${id} removed from list`,
      });
    });
  }
});

app.post('/api/products', (req, res) => {
  const id = req.params.id * 1;
  const { name, price } = req.body;

  console.log(req.products.filter((pro) => pro.name === name).length);
  if (req.products.filter((pro) => pro.name === name).length === 1) {
    res.status(400).send({
      message: `Product ${name} already exists.`,
    });
  } else if (typeof name !== 'string' || typeof price !== 'number') {
    res.status(400).send({
      message:
        'Body of request must contain a "price" of type "number" and a "name" of type "string"',
    });
  } else {
    let maxId = 0;
    req.products.forEach((pro) => (pro.id > maxId ? (maxId = pro.id) : maxId));
    const newProducts = [
      ...req.products,
      {
        name,
        id: maxId + 1,
        price,
      },
    ];

    writeFileP(DB_PATH, newProducts).then(() => {
      res.send({
        message: `Product ${name} added!`,
      });
    });
  }
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
