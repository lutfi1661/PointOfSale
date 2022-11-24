import React from "react";
import { Button, Card } from "antd";
import { useDispatch } from "react-redux";
import CurrencyFormat from "react-currency-format";

const Product = ({ product }) => {
  const dispatch = useDispatch();

  const handlerToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1 },
    });
  };

  const { Meta } = Card;

  return (
    // <Card
    //   hoverable
    //   style={{ width: 240, marginBottom: 30 }}
    //   cover={
    //     <img alt={product.name} src={product.image} style={{ height: 200 }} />
    //   }
    // >
    //   <Meta title={product.name} description={`Rp${product.price}`} />
    //   <div className="product-btn">
    //     <Button onClick={() => handlerToCart()}>Add To Cart</Button>
    //   </div>
    // </Card>

    <div class="w-full max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <img
        class="p-8 rounded-t-lg h-80"
        alt={product.name}
        src={product.image}
      />
      <div class="px-5 pb-5">
        <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {product.name}
        </h5>
        <div class="flex items-center mt-2.5 mb-5">
          <p>Deskripsi ...</p>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-gray-900 dark:text-white">
            <CurrencyFormat
              value={product.price}
              displayType={"text"}
              thousandSeparator={"."}
              decimalSeparator={","}
              prefix={"Rp"}
              renderText={(value) => <div>{value}</div>}
            />
          </span>
          <a
            onClick={() => handlerToCart()}
            href="#"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Tambahkan
          </a>
        </div>
      </div>
    </div>
  );
};

export default Product;
