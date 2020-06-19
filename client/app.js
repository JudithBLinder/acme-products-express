import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import Create from './Create';
import Products from './Products';

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

class Application extends Component {
  state = {
    products: [],
  };

  componentDidMount() {
    axios.get(`${API_URL}/products`).then(({ data }) => {
      this.setState({
        products: data.products,
      });
    });
  }

  destroy(product) {
    axios.delete(`${API_URL}/products/${product.id}`);
    this.setState({
      products: this.state.products.filter((pro) => pro.id !== product.id),
    });
  }

  post(product) {
    axios.post(`${API_URL}/products`, product).then(({ data }) =>
      this.setState({
        products: data.data,
      })
    );
  }

  render() {
    const { products } = this.state;
    const { destroy, post } = this;
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
              render={() => (
                <Products products={products} destroy={destroy.bind(this)} />
              )}
            />
            <Route
              path="/create"
              render={() => (
                <Create products={products} post={post.bind(this)} />
              )}
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
