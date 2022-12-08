import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { TbCirclePlus, TbCircleMinus } from "react-icons/tb";
import { render } from "react-dom";
import { useReactToPrint } from "react-to-print";

const Cart = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopUp, setBillPopUp] = useState(false);
  const [popModal, setPopModal] = useState(false);
  const [newObject, setNewObject] = useState({});
  const componentRef = useRef();
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.rootReducer);

  const handlerIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handlerDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const handlerDelete = (record) => {
    dispatch({
      type: "DELETE_FROM_CART",
      payload: record,
    });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columns = [
    {
      title: "Nama Item",
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
      title: "Harga",
      dataIndex: "price",
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
      title: "Jumlah Item",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="space-x-2">
          <TbCircleMinus
            className="inline text-gray-700 cursor-pointer"
            size={25}
            onClick={() => handlerDecrement(record)}
          />
          <strong className="inline font-bold text-sm">
            {record.quantity}
          </strong>
          <TbCirclePlus
            className="inline text-gray-700 cursor-pointer"
            size={25}
            onClick={() => handlerIncrement(record)}
          />
        </div>
      ),
      width: "10%",
    },
    {
      title: "Aksi",
      dataIndex: "_id",
      render: (id, record) => (
        <button
          className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-lg btn-hapus"
          onClick={() => handlerDelete(record)}
        >
          Hapus
        </button>
      ),
      width: "10%",
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach(
      (product) => (temp = temp + product.price * product.quantity)
    );
    setSubTotal(temp);
  }, [cartItems]);

  const handlerSubmit = async (value) => {
    //console.log(value);
    try {
      const newObjectInsert = {
        ...value,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          (
            Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
          ).toFixed(2)
        ),
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };
      await axios.post("/api/bills/addbills", newObjectInsert);

      setNewObject(newObjectInsert);

      // click btn-hapus
      document.querySelectorAll(".btn-hapus").forEach((btn) => {
        btn.click();
      });

      // send message
      message.success("Transaksi Berhasil Dibuat!");

      setBillPopUp(false);
      setPopModal(true);

      console.log(newObject);

      // navigate("/bills");
    } catch (error) {
      message.error("Error!");
      console.log(error);
    }
  };

  return (
    <Layout>
      <h2>Keranjang</h2>
      <Table dataSource={cartItems} columns={columns} bordered />
      <div className="subTotal">
        <h2>
          Subtotal:{" "}
          <CurrencyFormat
            value={subTotal}
            displayType={"text"}
            thousandSeparator={"."}
            decimalSeparator={","}
            prefix={"Rp"}
            renderText={(value) => (
              <span className="inline">{" " + value}</span>
            )}
          />
        </h2>
        <button
          onClick={() => setBillPopUp(true)}
          className="bg-emerald-500 text-white font-semibold px-3 py-2 rounded-lg hover:bg-emerald-600"
        >
          Buat Transaksi
        </button>
      </div>
      <Modal
        title="Buat Transaksi"
        visible={billPopUp}
        onCancel={() => setBillPopUp(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handlerSubmit}>
          <FormItem
            name="customerName"
            label="Nama Pelanggan"
            rules={[
              {
                required: true,
                message: "Nama pelanggan wajib diisi!",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem name="customerPhone" label="Nomor Telepon">
            <Input />
          </FormItem>
          <FormItem name="customerAddress" label="Alamat">
            <Input />
          </FormItem>
          <Form.Item
            name="paymentMethod"
            label="Metode Pembayaran"
            rules={[
              {
                required: true,
                message: "Metode pembayaran wajib diisi!",
              },
            ]}
          >
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="paypal">Debit</Select.Option>
            </Select>
          </Form.Item>
          <div className="total">
            <span>
              Subtotal :
              <CurrencyFormat
                value={subTotal}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                prefix={"Rp"}
                renderText={(value) => (
                  <div className="inline">{" " + value}</div>
                )}
              />
            </span>
            <br />
            <span>
              Pajak :
              <CurrencyFormat
                value={(subTotal / 100) * 10}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                prefix={"Rp"}
                renderText={(value) => (
                  <div className="inline">{" " + value}</div>
                )}
              />
            </span>
            <h3>
              Total :
              <CurrencyFormat
                value={Number(subTotal) + Number((subTotal / 100) * 10)}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                prefix={"Rp"}
                renderText={(value) => (
                  <div className="inline">{" " + value}</div>
                )}
              />
            </h3>
          </div>
          <button
            htmlType="submit"
            className="bg-emerald-500 text-white font-semibold px-3 py-2 rounded-lg hover:bg-emerald-600"
          >
            Buat Transaksi
          </button>
        </Form>
      </Modal>
      {popModal && (
        <Modal
          title="Detail Faktur"
          width={800}
          pagination={false}
          visible={popModal}
          onCancel={() => setPopModal(false)}
          footer={false}
        >
          <div className="card p-10" ref={componentRef}>
            <div className="cardHeader">
              <h2 className="logo">NAEL POS</h2>
            </div>
            <div className="cardBody">
              <div className="group">
                <span>Nama Pelanggan:</span>
                <span>
                  <b>{newObject.customerName}</b>
                </span>
              </div>
              <div className="group">
                <span>Nomor Telepon:</span>
                <span>
                  <b>{newObject.customerPhone}</b>
                </span>
              </div>
              <div className="group">
                <span>Alamat:</span>
                <span>
                  <b>{newObject.customerAddress}</b>
                </span>
              </div>
              <div className="group">
                <span>Tanggal Pembelian:</span>
                <span>
                  <b>{date}</b>
                </span>
              </div>
              <div className="group">
                <span>Total Pembelian:</span>
                <span>
                  <b>
                    <CurrencyFormat
                      value={newObject.totalAmount}
                      displayType={"text"}
                      thousandSeparator={"."}
                      decimalSeparator={","}
                      prefix={"Rp"}
                      renderText={(value) => <div>{value}</div>}
                    />
                  </b>
                </span>
              </div>
            </div>
            <div className="cardFooter">
              <h4>Pembelianmu</h4>
              <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="py-3 px-6">
                        Item
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Jumlah
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Harga
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {newObject.cartItems.map((product) => (
                      <>
                        <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                          <th
                            scope="row"
                            class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {product.name}
                          </th>
                          <td class="py-4 px-6">{product.quantity}</td>
                          <td class="py-4 px-6">
                            <CurrencyFormat
                              value={product.price}
                              displayType={"text"}
                              thousandSeparator={"."}
                              decimalSeparator={","}
                              prefix={"Rp"}
                              renderText={(value) => <div>{value}</div>}
                            />
                          </td>
                          <td class="py-4 px-6">
                            <CurrencyFormat
                              value={product.price * product.quantity}
                              displayType={"text"}
                              thousandSeparator={"."}
                              decimalSeparator={","}
                              prefix={"Rp"}
                              renderText={(value) => <div>{value}</div>}
                            />
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="footerCardTotal">
                <div className="group">
                  <h3 className="uppercase">Subtotal</h3>
                  <h3>
                    <CurrencyFormat
                      value={newObject.subTotal}
                      displayType={"text"}
                      thousandSeparator={"."}
                      decimalSeparator={","}
                      prefix={"Rp"}
                      renderText={(value) => <div>{value}</div>}
                    />
                  </h3>
                </div>
                <div className="group">
                  <h3 className="uppercase">Pajak (10%)</h3>
                  <h3>
                    <CurrencyFormat
                      value={newObject.tax}
                      displayType={"text"}
                      thousandSeparator={"."}
                      decimalSeparator={","}
                      prefix={"Rp"}
                      renderText={(value) => <div>{value}</div>}
                    />
                  </h3>
                </div>
                <div className="group">
                  <h3 className="uppercase font-bold">Total</h3>
                  <h3>
                    <b>
                      <CurrencyFormat
                        value={newObject.totalAmount}
                        displayType={"text"}
                        thousandSeparator={"."}
                        decimalSeparator={","}
                        prefix={"Rp"}
                        renderText={(value) => <div>{value}</div>}
                      />
                    </b>
                  </h3>
                </div>
              </div>
              <div className="footerThanks">
                <span className="uppercase">
                  Terima Kasih Telah Memesan Produk Kami
                </span>
              </div>
            </div>
          </div>
          <div className="bills-btn-add">
            <Button onClick={handlePrint} htmlType="submit" className="add-new">
              Cetak Faktur
            </Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Cart;
