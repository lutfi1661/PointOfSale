import { Button, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import CurrencyFormat from "react-currency-format";
import Moment from "react-moment";

const Bills = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/api/bills/getbills");
      setBillsData(data);
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
    getAllBills();
  }, []);

  const columns = [
    {
      title: "ID Transaksi",
      dataIndex: "_id",
    },
    {
      title: "Nama Pelanggan",
      dataIndex: "customerName",
    },
    {
      title: "Nomor Telepon",
      dataIndex: "customerPhone",
    },
    {
      title: "Alamat",
      dataIndex: "customerAddress",
    },
    {
      title: "Subtotal",
      dataIndex: "subTotal",
      render: (subtotal) => (
        <CurrencyFormat
          value={subtotal}
          displayType={"text"}
          thousandSeparator={"."}
          decimalSeparator={","}
          prefix={"Rp"}
          renderText={(value) => <div>{value}</div>}
        />
      ),
    },
    {
      title: "Pajak",
      dataIndex: "tax",
      render: (tax) => (
        <CurrencyFormat
          value={tax}
          displayType={"text"}
          thousandSeparator={"."}
          decimalSeparator={","}
          prefix={"Rp"}
          renderText={(value) => <div>{value}</div>}
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      render: (totalAmount) => (
        <CurrencyFormat
          value={totalAmount}
          displayType={"text"}
          thousandSeparator={"."}
          decimalSeparator={","}
          prefix={"Rp"}
          renderText={(value) => <div>{value}</div>}
        />
      ),
    },
    {
      title: "Aksi",
      dataIndex: "_id",
      width: "10%",
      render: (id, record) => (
        <div>
          <button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold py-2 px-4 rounded-lg"
            onClick={() => {
              // console.log(record);
              setSelectedBill(record);
              setPopModal(true);
            }}
          >
            Lihat
          </button>
        </div>
      ),
    },
  ];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Layout>
      <h2>Semua Transaksi </h2>
      <Table dataSource={billsData} columns={columns} bordered />

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
                <span>Nama Pelanggan :</span>
                <span>
                  <b>{selectedBill.customerName}</b>
                </span>
              </div>
              <div className="group">
                <span>Nomor Telepon :</span>
                <span>
                  <b>{selectedBill.customerPhone}</b>
                </span>
              </div>
              <div className="group">
                <span>Alamat:</span>
                <span>
                  <b>{selectedBill.customerAddress}</b>
                </span>
              </div>
              <div className="group">
                <span>Tanggal Pembelian :</span>
                <span>
                  <b>
                    <Moment format="DD-MM-YYYY HH:mm">
                      {/* {selectedBill.createdAt.toString().substring(0, 10)} */}
                      {selectedBill.createdAt.toString()}
                    </Moment>
                  </b>
                </span>
              </div>
              <div className="group">
                <span>Total Pembelian :</span>
                <span>
                  <b>
                    <CurrencyFormat
                      value={selectedBill.totalAmount}
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
                    {selectedBill.cartItems.map((product) => (
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
                      value={selectedBill.subTotal}
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
                      value={selectedBill.tax}
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
                        value={selectedBill.totalAmount}
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

export default Bills;
