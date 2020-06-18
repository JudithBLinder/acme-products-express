const React = require('react');

class Create extends React.Component {
  state = {
    name: 'Product Name',
    price: 'Product Price',
  };

  render() {
    const { post } = this.props;
    return (
      <div>
        <h3> Create a Product </h3>
        <div className="inputContainer">
          <input
            type="text"
            value={this.state.name}
            onChange={(ev) => {
              this.setState({
                name: ev.target.value,
              });
            }}
          />
          <input
            type="text"
            value={this.state.price}
            onChange={(ev) => {
              this.setState({
                price: ev.target.value * 1,
              });
            }}
          />
          <button
            type="submit"
            value="submit"
            onClick={() => {
              let product = this.state;
              post(product);
              this.setState({
                name: 'Product Name',
                price: 'Product Price',
              });
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

module.exports = Create;
