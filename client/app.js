import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

const app = document.querySelector('#app');

const API_URL = 'http://localhost:3000/api';

const Nav = ({ path, products }) => {
  return (
    <nav className="navbar">
      <Link to="/home" className={path === '/home' ? 'selected' : ''}>
        Home
      </Link>
      <Link to="/products" className={path === '/products' ? 'selected' : ''}>
        {`Products(${products.length})`}
      </Link>
      <Link to="/create" className={path === '/create' ? 'selected' : ''}>
        Create a Product
      </Link>
    </nav>
  );
};

const Products = ({ products }) => {
  console.log('in products', products.length);
  return (
    <ul className="list-group list-group-flush">
      {products.map((product) => (
        <div key={product.id} className="product">
          <li key={product.id} className="list-group-item">
            {`${product.name}, price is: $${product.price}`}
          </li>
          <button type="button" className="btn btn-outline-primary">
            Destroy
          </button>
        </div>
      ))}
    </ul>
  );
};

class Application extends Component {
  state = {
    products: [],
  };

  componentDidMount() {
    axios.get(`${API_URL}/products`).then(({ data }) => {
      console.log('axios', data.products);
      this.setState({
        products: data.products,
      });
    });
  }

  async destroy() {}

  render() {
    const { products } = this.state;
    console.log(this.state);
    return (
      <Fragment>
        <h1> Acme Products </h1>
        <HashRouter>
          <Route
            render={({ location }) => (
              <Nav path={location.pathname} products={products} />
            )}
          />
          <Switch>
            <Route exact path="/home" render={() => <h1>HOME</h1>} />
            <Route
              path="/products"
              render={() => <Products products={products} />}
            />
          </Switch>
        </HashRouter>
      </Fragment>
    );
  }
}

ReactDOM.render(<Application />, app, () => {
  console.log('ReactDOM rendered');
});
