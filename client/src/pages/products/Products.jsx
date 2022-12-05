import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LayoutApp from "../../components/Layout";
import { Form, Input, Modal, Select, Table, message } from "antd";
import FormItem from "antd/lib/form/FormItem";
import CurrencyFormat from "react-currency-format";

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
      message.success("Produk berhasil dihapus");
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
      defaultSortOrder: "descend",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "30%",
    },
    {
      title: "Gambar",
      dataIndex: "image",
      render: (image, record) => (
        <img width={100} src={image} alt={record.name} />
      ),
      width: "20%",
    },
    {
      title: "Kategori",
      dataIndex: "category",
      filters: [
        {
          text: "Makanan",
          value: "makanan",
        },
        {
          text: "Minuman",
          value: "minuman",
        },
      ],
      onFilter: (value, record) => record.category.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Sub Kategory",
      dataIndex: "subcategory",
      filters: [
        {
          text: "Ayam",
          value: "ayam",
        },
        {
          text: "Daging",
          value: "daging",
        },
        {
          text: "Seafood",
          value: "seafood",
        },
        {
          text: "Nasi",
          value: "Nasi",
        },
        {
          text: "Cemilan",
          value: "cemilan",
        },
        {
          text: "Makanan Lain",
          value: "makanan lain",
        },
        {
          text: "Teh",
          value: "teh",
        },
        {
          text: "Kopi",
          value: "kopi",
        },
        {
          text: "Susu",
          value: "susu",
        },
        {
          text: "Jus",
          value: "jus",
        },
        {
          text: "Minuman lain",
          value: "minuman lain",
        },
      ],
      onFilter: (value, record) => record.category.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Harga",
      dataIndex: "price",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <CurrencyFormat
          value={price}
          displayType={"text"}
          thousandSeparator={"."}
          decimalSeparator={","}
          prefix={"Rp"}
          renderText={(value) => <div>{value}</div>}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        {
          text: "Tersedia",
          value: "tersedia",
        },
        {
          text: "Habis",
          value: "habis",
        },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
      filterSearch: true,
      render: (status) => (
        <div
          className={`p-1 border-2 text-center ${
            status === "tersedia"
              ? "border-green-500 bg-green-100 text-green-600"
              : "border-red-500 bg-red-100 text-red-600"
          } rounded-lg`}
        >
          {status}
        </div>
      ),
    },
    {
      title: "Aksi",
      dataIndex: "_id",
      width: "10%",
      render: (id, record) => (
        <div className="space-y-1">
          <button
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded-lg"
            onClick={() => {
              setEditProduct(record);
              setPopModal(true);
            }}
          >
            Ubah
          </button>
          <button
            className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-lg"
            onClick={() => handlerDelete(record)}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  const handlerSubmit = async (value) => {
    if (editProduct === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const res = await axios.post("/api/products/addproducts", value);
        message.success("Produk berhasil ditambahkan");
        getAllProducts();
        setPopModal(false);
        setEditProduct(null);
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
        message.success("Produk berhasil diubah!");
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
      <div className="">
        <h1 className="block font-bold center w-full">Semua Produk</h1>
      </div>
      <button
        className="block my-2 p-2 bg-green-500 hover:bg-green-600 text-white font-bold border-none cursor-pointer w-30 rounded-lg right-0"
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
            <FormItem
              name="name"
              label="Nama"
              rules={[{ required: true, message: "Nama produk wajib diisi" }]}
            >
              <Input />
            </FormItem>
            <Form.Item
              name="category"
              label="Kategori"
              rules={[
                { required: true, message: "Kategori produk wajib diisi" },
              ]}
            >
              <Select>
                <Select.Option value="makanan">Makanan</Select.Option>
                <Select.Option value="minuman">Minuman</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="subcategory"
              label="Sub Kategori"
              rules={[
                { required: true, message: "Sub kategori produk wajib diisi" },
              ]}
            >
              <Select>
                <Select.OptGroup label="Makanan">
                  <Select.Option value="ayam">Ayam</Select.Option>
                  <Select.Option value="daging">Daging</Select.Option>
                  <Select.Option value="seafood">Seafood</Select.Option>
                  <Select.Option value="nasi">Nasi</Select.Option>
                  <Select.Option value="cemilan">Cemilan</Select.Option>
                  <Select.Option value="makanan lain">
                    Makanan Lain
                  </Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label="Minuman">
                  <Select.Option value="susu">Susu</Select.Option>
                  <Select.Option value="teh">Teh</Select.Option>
                  <Select.Option value="kopi">Kopi</Select.Option>
                  <Select.Option value="jus">Jus</Select.Option>
                  <Select.Option value="minuman lain">
                    Minuman Lain
                  </Select.Option>
                </Select.OptGroup>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Status produk wajib diisi" }]}
            >
              <Select>
                <Select.Option value="tersedia">Tersedia</Select.Option>
                <Select.Option value="habis">Habis</Select.Option>
              </Select>
            </Form.Item>
            <FormItem
              name="price"
              label="Harga"
              rules={[{ required: true, message: "Harga produk wajib diisi" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              name="image"
              label="Gambar"
              rules={[{ required: true, message: "Gambar produk wajib diisi" }]}
            >
              <Input />
            </FormItem>

            <div className="form-btn-add">
              <button htmlType="submit" className="p-2 text-white bg-green-500">
                Simpan
              </button>
            </div>
          </Form>
        </Modal>
      )}
    </LayoutApp>
  );
};

export default Products;
