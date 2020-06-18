const React = require('react');

class Products extends React.Component {
  render() {
    const { products, destroy } = this.props;
    return (
      <div>
        <h3> Products </h3>
        <ul className="list-group list-group-flush">
          {products.map((product) => (
            <div key={product.id} className="product">
              <li key={product.id} className="list-group-item">
                {`${product.name}, price is: $${product.price}`}
              </li>
              <button
                type="submit"
                className="btn btn-outline-primary"
                onClick={() => {
                  destroy(product);
                }}
              >
                Destroy
              </button>
            </div>
          ))}
        </ul>
      </div>
    );
  }
}

module.exports = Products;
