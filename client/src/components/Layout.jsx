import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserSwitchOutlined,
  MoneyCollectOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "./layout.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { TbReport } from "react-icons/tb";
import { BiFoodMenu, BiLogOut, BiCartAlt } from "react-icons/bi";

const { Header, Sider, Content } = Layout;

const LayoutApp = ({ children }) => {
  const { cartItems, loading } = useSelector((state) => state.rootReducer);

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const menus = [
    { name: "Menu", link: "/", icon: MdOutlineDashboard },
    { name: "Faktur", link: "/bills", icon: RiBillLine },
    { name: "Produk", link: "/products", icon: BiFoodMenu },
    { name: "Karyawan", link: "/customers", icon: FiUsers },
    { name: "Laporan", link: "/reports", icon: TbReport },
    {
      name: "Log Out",
      link: "/logout",
      icon: BiLogOut,
      margin: true,
      logout: true,
    },
  ];

  const [open, setOpen] = useState(true);

  return (
    <section className="flex">
      <div
        className={`bg-amber-500 min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end"></div>
        <div className="mt-10 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={` ${menu?.margin && "mt-5"}
                  group text-white flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-amber-600 hover:text-white rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`text-white whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                onClick={
                  menu?.logout
                    ? '() => {localStorage.removeItem("auth"); navigate("/login");'
                    : ""
                }
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
      <Layout className="site-layout">
        <Header className="site-layout-background px-2">
          <HiOutlineMenuAlt2
            size={26}
            className="cursor-pointer inline"
            onClick={() => setOpen(!open)}
          />
          {/* <div className="cart-items" onClick={() => navigate("/cart")}>
            <BiCartAlt className="inline" style={{ width: 30, height: 30 }} />
            <span className="bg-yellow-300 font-bold text-white rounded-full p-2">
              {cartItems.length}
            </span>
          </div> */}
        </Header>
        {/* CONTENT */}
        <div
          className="bg-white rounded-lg"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </div>
      </Layout>
    </section>
  );
};

export default LayoutApp;
