import { Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

const Customers = () => {
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);

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
      title: "Customer Name",
      dataIndex: "customerName",
    },
    {
      title: "Contact Number",
      dataIndex: "customerPhone",
    },
    {
      title: "Customer Address",
      dataIndex: "customerAddress",
    },
  ];

  return (
    <Layout>
      <h2>Semua Laporan </h2>
      <div className="site-statistic-demo-card">
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Active"
                value={11.28}
                precision={2}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Idle"
                value={9.3}
                precision={2}
                valueStyle={{
                  color: "#cf1322",
                }}
                prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Customers;
