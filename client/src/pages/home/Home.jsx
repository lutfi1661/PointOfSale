import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutApp from "../../components/Layout";
import { Row, Col } from "antd";
import Product from "../../components/Product";
import { useDispatch } from "react-redux";
import { BiDrink } from "react-icons/bi";
import { CiBurger } from "react-icons/ci";

const Home = () => {
  const dispatch = useDispatch();

  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("makanan");
  const categories = [
    {
      name: "makanan",
      icon: BiDrink,
    },
    {
      name: "minuman",
      icon: CiBurger,
    },
  ];

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get("/api/products/getproducts");
        setProductData(data);
        dispatch({
          type: "HIDE_LOADING",
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllProducts();
  }, [dispatch]);

  return (
    <LayoutApp>
      <div className="flex justify-center justify-items-center mb-10">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {categories.map((category) => (
            // <div
            //   key={category.name}
            //   className={`categoryFlex ${
            //     selectedCategory === category.name && "category-active"
            //   }`}
            //   onClick={() => setSelectedCategory(category.name)}
            // >
            //   <img
            //     src={category.imageUrl}
            //     alt={category.name}
            //     height={40}
            //     width={40}
            //   />
            //   <h3 className="categoryName">{category.name}</h3>
            // </div>
            <li
              class={`mr-2 inline-flex p-4 rounded-t-lg cursor-pointer ${
                selectedCategory === category.name &&
                "text-amber-500 border-b-2 border-amber-500"
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="mx-2">
                {React.createElement(category.icon, { size: "20" })}
              </div>
              <span className="capitalize">{category.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <Row>
        {productData
          .filter((i) => i.category === selectedCategory)
          .map((product) => (
            <Col xs={24} sm={6} md={12} lg={6}>
              <Product key={product.id} product={product} />
            </Col>
          ))}
      </Row>
    </LayoutApp>
  );
};

export default Home;
