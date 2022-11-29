import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LayoutApp from "../../components/Layout";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  message,
  Upload,
} from "antd";
import FormItem from "antd/lib/form/FormItem";

const Products = () => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
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
          className="rounded-full"
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
      )}
      <button
        className="block m-3 p-2 bg-green-400 hover:bg-green-600 text-white border-none cursor-pointer w-30 rounded-lg"
        onClick={() => setShowModal(true)}
      >
        Tambah Item
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-4x1 font-semibold">Modal Title</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="mb-3 pt-0">
                    <form
                      className="w-[500px]"
                      initialValues={editProduct}
                      onFinish={handlerSubmit}
                    >
                      <label
                        for="product"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nama Produk
                      </label>
                      <input
                        id="product"
                        name="product"
                        type="text"
                        className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                      />

                      <label
                        for="category"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        name="category"
                        className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                      >
                        <option value={"Makanan"}>Makanan</option>
                        <option value={"Minuman"}>Minuman</option>
                      </select>
                    </form>

                    <label
                      for="status"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Status
                    </label>
                    <input
                      id="status"
                      name="status"
                      type="text"
                      className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                    />
                    <label
                      for="price"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Harga
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="text"
                      className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                    />
                    <label
                      for="image"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      URL Gambar
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="text"
                      className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                    />
                    <button
                      htmlType="submit"
                      className="p-3 text-white font-semibold bg-green-500"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </LayoutApp>
  );
};

export default Products;
