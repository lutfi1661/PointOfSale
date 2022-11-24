import { Button, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import { EyeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import CurrencyFormat from "react-currency-format";
import { Number, Currency } from "react-intl-number-format";

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
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Nama Customer",
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
    },
    {
      title: "Pajak",
      dataIndex: "tax",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
    },
    {
      title: "Aksi",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold py-2 px-4 rounded-full mx-2"
            onClick={() => {
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
      <h2>Semua Faktur </h2>
      <Table dataSource={billsData} columns={columns} bordered />

      {popModal && (
        <Modal
          title="Detail Faktur"
          width={400}
          pagination={false}
          visible={popModal}
          onCancel={() => setPopModal(false)}
          footer={false}
        >
          <div className="card" ref={componentRef}>
            <div className="cardHeader">
              <h2 className="logo">Aplikasi Pos</h2>
            </div>
            <div className="cardBody">
              <div className="group">
                <span>Nama Pelanggan:</span>
                <span>
                  <b>{selectedBill.customerName}</b>
                </span>
              </div>
              <div className="group">
                <span>Nomor Telepon:</span>
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
                <span>Tanggal Pembelian:</span>
                <span>
                  <b>{selectedBill.createdAt.toString().substring(0, 10)}</b>
                </span>
              </div>
              <div className="group">
                <span>Total Pembelian:</span>
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
              <h4>Your Order</h4>
              {selectedBill.cartItems.map((product) => (
                <>
                  <div className="footerCard">
                    <div className="group">
                      <span>Item:</span>
                      <span>
                        <b>{product.name}</b>
                      </span>
                    </div>
                    <div className="group">
                      <span>Jumlah:</span>
                      <span>
                        <b>{product.quantity}</b>
                      </span>
                    </div>
                    <div className="group">
                      <span>Harga:</span>
                      <span>
                        <b>
                          <CurrencyFormat
                            value={product.price}
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
                </>
              ))}
              <div className="footerCardTotal">
                <div className="group">
                  <h3>Pajak:</h3>
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
                <div className="group">
                  <h3>Total:</h3>
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
                <span>Terima Kasih</span>
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
