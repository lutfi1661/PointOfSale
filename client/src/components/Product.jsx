import React from "react";
import { useDispatch } from "react-redux";
import CurrencyFormat from "react-currency-format";
import { BsFillCartPlusFill } from "react-icons/bs";
import { message } from "antd";
const Product = ({ product }) => {
  const dispatch = useDispatch();

  const handlerToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1 },
    });
    message.success("Produk Ditambahkan ke Keranjang");
  };

  console.log(product);

  return (
    <div class="bg-white shadow-md hover:scale-105 hover:shadow-xl duration-500 rounded-xl">
      <img
        src={product.image}
        alt={product.name}
        class="h-56 w-60 object-cover rounded-t-xl"
      />
      <div class="px-4 py-3 w-60">
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
          {product.status === "habis" ? (
            // Jika status produk habis maka tombol beli akan di disable dan muncul tulisan "Habis" di bawah tombol beli tersebut

            <div class="ml-auto text-lime-500 cursor-text hover:text-lime-600 align-text-bottom">
              <p className="text-red-500 font-semibold cursor-text text-base ">
                Habis
              </p>
            </div>
          ) : (
            // Jika status produk tidak habis maka tombol beli akan di enable dan tidak muncul tulisan "Habis" di bawah tombol beli tersebut
            <div
              class="ml-auto text-lime-500 cursor-pointer hover:text-lime-600"
              onClick={() => handlerToCart()}
            >
              <BsFillCartPlusFill size={25} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
