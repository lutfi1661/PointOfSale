import React, { useEffect, useState } from "react";
import { Layout, Badge, Avatar } from "antd";
import "./layout.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { BiFoodMenu, BiLogOut, BiCartAlt } from "react-icons/bi";
import { AiOutlineBarChart } from "react-icons/ai";

const { Header } = Layout;

const LayoutApp = ({ children }) => {
  const { cartItems } = useSelector((state) => state.rootReducer);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const menus = [
    { name: "Menu", link: "/", icon: MdOutlineDashboard },
    { name: "Transaksi", link: "/bills", icon: RiBillLine },
    { name: "Produk", link: "/products", icon: BiFoodMenu },
    // { name: "Karyawan", link: "/employee", icon: FiUsers },
    { name: "Laporan", link: "/report", icon: AiOutlineBarChart },
  ];

  const [open, setOpen] = useState(true);

  return (
    <section className="flex">
      <div
        className={`bg-amber-500 min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="mt-4 flex flex-col gap-8 relative">
          <div className="p-2 flex justify-center justify-items-center">
            <span className="font-bold">NAEL{`\n`}</span>
            <span>POS</span>
          </div>
          <div className="space-y-32">
            <div>
              {menus?.map((menu, i) => (
                <Link
                  to={menu?.link}
                  className="group text-white flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-amber-600 hover:text-white rounded-md my-5"
                >
                  <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                  <h2
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
                        ? `() => {${localStorage.removeItem(
                            "auth"
                          )}; ${navigate("/login")};}`
                        : undefined
                    }
                  >
                    {menu?.name}
                  </h2>
                </Link>
              ))}
            </div>
            {/* LOGOUT */}
            <div>
              <Link
                to={"/login"}
                onClick={() => {
                  localStorage.removeItem("auth");
                  navigate("/login");
                }}
                className="group text-white flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-amber-600 hover:text-white rounded-md"
              >
                <div>
                  <BiLogOut size={20} />
                </div>
                <h2
                  className={`text-white whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  Log Out
                </h2>
                <h2
                  className={`${
                    open && "hidden"
                  } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                >
                  Log Out
                </h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 10 }}>
          <HiOutlineMenuAlt2
            size={26}
            className="cursor-pointer inline"
            onClick={() => setOpen(!open)}
          />
          <div
            className="relative mr-4 cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            {/* <BiCartAlt className="inline" style={{ width: 30, height: 30 }} />
            <span className="bg-green-400 font-bold text-white rounded-full p-2">
              {cartItems.length}
            </span> */}
            <Badge
              status="success"
              count={`${cartItems.length}`}
              offset={[0, 2]}
              className="p-2"
            >
              <Avatar
                size="large"
                style={{
                  backgroundColor: "white",
                  verticalAlign: "middle",
                  color: "grey",
                }}
              >
                <BiCartAlt size={30} style={{ marginTop: "5px" }} />
              </Avatar>
            </Badge>
          </div>
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
        {/* <div className="bottom-10 right-10 fixed cursor-pointer drop-shadow-xl">
          <Badge
            status="success"
            count={`${cartItems.length}`}
            offset={[0, 2]}
            className="p-2"
          >
            <Avatar
              size="large"
              style={{
                backgroundColor: "white",
                verticalAlign: "middle",
                color: "grey",
                width: "50px",
                height: "50px",
              }}
            >
              <BiCartAlt size={30} style={{ marginTop: "10px" }} />
            </Avatar>
          </Badge>
        </div> */}
      </Layout>
    </section>
  );
};

export default LayoutApp;
