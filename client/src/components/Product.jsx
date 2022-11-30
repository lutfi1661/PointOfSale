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

    // <div className="m-2">
    //   <div class="w-full max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
    //     <img
    //       class="p-8 rounded-t-lg h-40"
    //       alt={product.name}
    //       src={product.image}
    //     />
    //     <div class="px-5 pb-5">
    //       <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
    //         {product.name}
    //       </h5>
    //       <div class="flex items-center mt-2.5 mb-5">
    //         <p>Deskripsi ...</p>
    //       </div>
    //       <div class="flex items-center justify-between">
    //         <span class="text-lg font-bold text-gray-900 dark:text-white">
    //           <CurrencyFormat
    //             value={product.price}
    //             displayType={"text"}
    //             thousandSeparator={"."}
    //             decimalSeparator={","}
    //             prefix={"Rp"}
    //             renderText={(value) => <div>{value}</div>}
    //           />
    //         </span>
    //         <a
    //           onClick={() => handlerToCart()}
    //           href="#"
    //           class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //         >
    //           Tambahkan
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div class="bg-white shadow-md hover:scale-105 hover:shadow-xl duration-500 rounded-xl">
      <a href="#">
        <img
          src={product.image}
          alt="Product image"
          class="h-50 w-72 object-cover rounded-t-xl"
        />
      </a>
      <div class="px-4 py-3 w-72">
        <span class="text-gray-400 mr-3 uppercase text-xs">
          {product.subcategory}
        </span>
        <p class="text-lg font-bold text-black truncate block capitalize">
          {product.name}
        </p>
        <div class="flex items-center">
          <p class="text-lg font-semibold text-black cursor-auto my-3">
            <CurrencyFormat
              value={product.price}
              displayType={"text"}
              thousandSeparator={"."}
              decimalSeparator={","}
              prefix={"Rp"}
              renderText={(value) => <div>{value}</div>}
            />
          </p>
          <div class="ml-auto">
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-bag-plus"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                />
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
