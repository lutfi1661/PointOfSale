import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LayoutApp from "../../components/Layout";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import FormItem from "antd/lib/form/FormItem";

const Products = () => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [editProduct, setEditProduct] = useState(false);

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
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handlerDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post("/api/products/deleteproducts", {
        productId: record._id,
      });
      message.success("Product Deleted Successfully!");
      getAllProducts();
      setPopModal(false);
      dispatch({
        type: "HIDE_LOADING",
      });
    } catch (error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      message.error("Error!");
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
    },
    {
      title: "Gambar",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height={60} width={60} />
      ),
    },
    {
      title: "Kategori",
      dataIndex: "category",
    },
    {
      title: "Subkategori",
      dataIndex: "subcategory",
    },
    {
      title: "Harga",
      dataIndex: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Aksi",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full mx-2"
            onClick={() => {
              setEditProduct(record);
              setPopModal(true);
            }}
          >
            Ubah
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full mx-2"
            onClick={() => handlerDelete(record)}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  const handlerSubmit = async (value) => {
    //console.log(value);
    if (editProduct === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const res = await axios.post("/api/products/addproducts", value);
        message.success("Product Added Successfully!");
        getAllProducts();
        setPopModal(false);
        dispatch({
          type: "HIDE_LOADING",
        });
      } catch (error) {
        dispatch({
          type: "HIDE_LOADING",
        });
        message.error("Error!");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        await axios.put("/api/products/updateproducts", {
          ...value,
          productId: editProduct._id,
        });
        message.success("Product Updated Successfully!");
        getAllProducts();
        setPopModal(false);
        dispatch({
          type: "HIDE_LOADING",
        });
      } catch (error) {
        dispatch({
          type: "HIDE_LOADING",
        });
        message.error("Error!");
        console.log(error);
      }
    }
  };

  return (
    <LayoutApp>
      <h2>Semua Produk</h2>
      <button
        className="block m-3 p-2 bg-green-400 hover:bg-green-600 text-white border-none cursor-pointer w-30 rounded-lg"
        onClick={() => setPopModal(true)}
      >
        Tambah Item
      </button>
      <Table
        dataSource={productData}
        columns={columns}
        bordered
        className="capitalize"
      />

      {popModal && (
        <Modal
          title={`${
            editProduct !== null ? "Ubah Produk" : "Tambah Produk Baru"
          }`}
          visible={popModal}
          onCancel={() => {
            setEditProduct(null);
            setPopModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editProduct}
            onFinish={handlerSubmit}
          >
            <FormItem name="name" label="Name">
              <Input />
            </FormItem>
            <Form.Item name="category" label="Category">
              <Select>
                <Select.Option value="makanan">Makanan</Select.Option>
                <Select.Option value="minuman">Minuman</Select.Option>
              </Select>
            </Form.Item>
            <FormItem name="subcategory" label="Sub Category">
              <Input />
            </FormItem>
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="tersedia">Tersedia</Select.Option>
                <Select.Option value="habis">Habis</Select.Option>
              </Select>
            </Form.Item>
            <FormItem name="price" label="Price">
              <Input />
            </FormItem>
            <FormItem name="image" label="Image URL">
              <Input />
            </FormItem>

            <div className="form-btn-add">
              <Button htmlType="submit" className="add-new">
                Add
              </Button>
            </div>
          </Form>
        </Modal>

        // <>
        //   <div
        //     className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        //     visible={popModal}
        //     onCancel={() => {
        //       setEditProduct(null);
        //       setPopModal(false);
        //     }}
        //     footer={false}
        //   >
        //     <div className="relative w-auto my-6 mx-auto max-w-3xl">
        //       {/*content*/}
        //       <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        //         {/*header*/}
        //         <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
        //           <h3 className="text-3 font-semibold">{`${
        //             editProduct !== null ? "Ubah Produk" : "Tambah Produk Baru"
        //           }`}</h3>
        //           <button
        //             className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
        //             onClick={() => setPopModal(false)}
        //           >
        //             <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
        //               ×
        //             </span>
        //           </button>
        //         </div>
        //         {/*body*/}
        //         <div className="p-6">
        //           <Form
        //             layout="vertical"
        //             initialValues={editProduct}
        //             onFinish={handlerSubmit}
        //             className="w-[500px]"
        //           >
        //             {/* <div className="mb-6">
        //               <label
        //                 for="name"
        //                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        //               >
        //                 Nama Produk
        //               </label>
        //               <input
        //                 type="text"
        //                 name="name"
        //                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //                 placeholder="Nasi Goreng"
        //                 required
        //               />
        //             </div> */}
        //             <FormItem name="name" label="Nama Produk">
        //               <Input
        //                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //                 placeholder="Nasi Goreng"
        //               />
        //             </FormItem>
        //             <Form.Item name="category" label="Kategori">
        //               <Select>
        //                 <Select.Option value="makanan">Makanan</Select.Option>
        //                 <Select.Option value="minuman">Minuman</Select.Option>
        //               </Select>
        //             </Form.Item>
        //             <FormItem name="subkategori" label="Sub Kategori">
        //               <Input placeholder="Ayam" />
        //             </FormItem>
        //             <Form.Item name="status" label="Status">
        //               <Select>
        //                 <Select.Option value="tersedia">Tersedia</Select.Option>
        //                 <Select.Option value="habis">Habis</Select.Option>
        //               </Select>
        //             </Form.Item>
        //             <FormItem name="price" label="Harga">
        //               <Input placeholder="Rp200.000" />
        //             </FormItem>
        //             <FormItem name="image" label="Image URL">
        //               <Input />
        //             </FormItem>
        //             <button
        //               htmlType="submit"
        //               className="bg-green-500 rounded-lg text-white background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        //             >
        //               Tambah
        //             </button>
        //           </Form>
        //         </div>
        //         {/*footer*/}
        //         <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
        //           <button
        //             className="bg-black text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        //             type="button"
        //             onClick={() => {
        //               setEditProduct(null);
        //               setPopModal(false);
        //             }}
        //           >
        //             Tutup
        //           </button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        //   <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        // </>
      )}
    </LayoutApp>
  );
};

export default Products;
