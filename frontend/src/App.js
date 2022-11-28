import data from "./data";

function App() {
  return (
    <div>
      <header>
        <a href="/">Amazona</a>
      </header>
      <main>
        <h1>Featured Product</h1>
        <div className="products">
          {data.product.map((product) => (
            <div className="product" key={product.id}>
              <img src={product.image} alt={product.name} />

              <div className="product_info">
                <p>{product.name}</p>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Add to cart</button>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
