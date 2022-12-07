import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalImage from "react-modal-image";
import { useDispatch } from "react-redux";
import LayoutApp from "../../components/Layout";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  message,
  Upload,
  Image,
  InputNumber,
} from "antd";
import FormItem from "antd/lib/form/FormItem";
import CurrencyFormat from "react-currency-format";
import { TbUpload } from "react-icons/tb";

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

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
      message.success("Produk Berhasil Dihapus");
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
        <ModalImage
          small={image}
          large={image}
          alt={record.name}
          className="w-[60px] h-[60px]"
          width={60}
          showRotate="true"
        />
      ),
    },
    {
      title: "Jenis",
      children: [
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
          title: "Sub Kategori",
          dataIndex: "subcategory",
          filters: [
            {
              text: "Makanan",
              children: [
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
              ],
            },
            {
              text: "Minuman",
              children: [
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
            },
          ],
          filterMode: "tree",
          filterSearch: true,
          onFilter: (value, record) => record.subcategory.includes(value),
        },
      ],
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
      width: "10%",
      render: (status) => (
        <span
          className={`p-2 border-2 ${
            status === "tersedia"
              ? "border-green-500 text-green-500 bg-green-100"
              : "border-red-500 text-red-500 bg-red-100"
          } rounded-lg`}
        >
          {status}
        </span>
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
    if (editProduct === false) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        console.log("Value", value);
        const res = await axios.post("/api/products/addproducts", value, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("RESPON", res);
        message.success("Produk Berhasil Ditambahkan");
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

        console.log("update", { ...value });
        await axios.put(
          "/api/products/updateproducts",
          {
            ...value,
            productId: editProduct._id,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Produk Berhasil Diubah");
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

  const onChange = (value) => {
    console.log("changed", value);
  };

  return (
    <LayoutApp>
      <h1 className="block font-semibold">Semua Produk</h1>
      <button
        className="relative mt-2 mb-2 p-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold border-none cursor-pointer w-30 rounded-lg right-0"
        onClick={() => {
          setPopModal(true);
          setEditProduct(false);
        }}
      >
        Tambah Produk
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
            editProduct !== false ? "Ubah Produk" : "Tambah Produk Baru"
          }`}
          visible={popModal}
          onCancel={() => {
            setEditProduct(false);
            setPopModal(false);
          }}
          footer={false}
          style={{ borderRadius: "100px" }}
        >
          <Form
            layout="vertical"
            initialValues={editProduct}
            onFinish={handlerSubmit}
          >
            <FormItem
              name="name"
              label="Nama"
              rules={[
                {
                  required: true,
                  message: "Nama produk wajib diisi!",
                },
              ]}
            >
              <Input />
            </FormItem>
            <Form.Item
              name="category"
              label="Kategori"
              rules={[
                {
                  required: true,
                  message: "Kategori produk wajib diisi!",
                },
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
                {
                  required: true,
                  message: "Sub kategori produk wajib diisi!",
                },
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
              rules={[
                {
                  required: true,
                  message: "Status produk wajib diisi!",
                },
              ]}
            >
              <Select>
                <Select.Option value="tersedia">Tersedia</Select.Option>
                <Select.Option value="habis">Habis</Select.Option>
              </Select>
            </Form.Item>
            <FormItem
              name="price"
              label="Harga"
              rules={[
                {
                  required: true,
                  message: "Harga produk wajib diisi!",
                },
              ]}
            >
              <InputNumber
                prefix="Rp"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                min={0}
                onChange={onChange}
              />
            </FormItem>

            {!editProduct && (
              <Form.Item
                name="image"
                label="Gambar"
                getValueFromEvent={normFile}
                valuePropName="fileList"
                extra="Format file .jpg, .jpeg, dan .png"
                status="done"
                rules={[
                  {
                    required: true,
                    message: "Gambar produk wajib diisi!",
                  },
                ]}
              >
                <Upload name="image" listType="picture">
                  <button className="p-2 bg-amber-500 font-semibold text-white rounded-lg hover:bg-amber-600">
                    <TbUpload size={20} className="inline mr-2 mb-1" />
                    Unggah File
                  </button>
                </Upload>
              </Form.Item>
            )}

            {editProduct && (
              <>
                <Form.Item
                  name="newImage"
                  label="Gambar"
                  getValueFromEvent={normFile}
                  valuePropName="fileList"
                  extra={editProduct.name}
                >
                  <Upload name="newImage" listType="picture">
                    <Button
                      type="primary"
                      className="p-2 bg-amber-500 font-semibold text-white rounded-lg hover:bg-amber-600"
                    >
                      <TbUpload size={20} className="inline mr-2 mb-1" />
                      Unggah File
                    </Button>
                  </Upload>
                  <img
                    src={editProduct.image}
                    alt={editProduct.name}
                    height={100}
                    width={100}
                    className="mt-2"
                  />
                </Form.Item>
              </>
            )}

            <div className="form-btn-add">
              <button
                htmlType="submit"
                className="p-2 font-semibold text-white bg-orange-500 hover:bg-green-700 rounded-lg"
              >
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
