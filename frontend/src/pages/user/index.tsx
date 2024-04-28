import { getUserList, userDelete, userUpdate } from "../../api/user";
import Content from "@/components/Content";
import { CategoryQueryType, UserType } from "@/type";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "./index.module.css";

enum STATUS  {
  ON = "on",
  OFF = "off",
};

export const STATUS_OPTIONS = [
  { label: "Active", value: STATUS.ON },
  { label: "Inactive", value: STATUS.OFF },
];

const COLUMNS = [
  {
    title: "Account",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Username",
    dataIndex: "nickName",
    key: "nickName",
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (text: string) => {
      return text === STATUS.ON ? (
        <Tag color="green">Active</Tag>
      ) : (
        <Tag color="red">Inactive</Tag>
      );
    },
  },
  {
    title: "Create Time",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];

export default function User() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0,
  });

  async function fetchData(values?: any) {
    const res = await getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values,
    });
    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchFinish = async (values: CategoryQueryType) => {
    const res = await getUserList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  const handleSearchReset = () => {
    form.resetFields();
  };

  const handleUserEdit = (id: string) => {
    router.push(`/user/edit/${id}`);
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    const query = form.getFieldsValue();
    getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
  };

  const handleUserDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Comfirm?",
      okText: "Yes",
      cancelText: "No",
      async onOk() {
        await userDelete(id);
        message.success("Delete Success!");
        fetchData(form.getFieldsValue());
      },
    });
  };

  const handleStatusChange = async (row:UserType) => {
    const status = row.status === STATUS.ON ? STATUS.OFF : STATUS.ON;

    await userUpdate(row._id!,{
      ...row,
      status:status as STATUS,
    });
    fetchData(form.getFieldsValue());
  };

  const columns = [
    ...COLUMNS,
    {
      title: "Action",
      key: "action",
      render: (_: any, row: any) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                handleUserEdit(row._id);
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger={row.status === STATUS.ON ? true : false}
              onClick={() => {
                handleStatusChange(row);
              }}
            >
              {row.status === STATUS.ON ? "Inactive" : "Active"}
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                handleUserDelete(row._id);
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Content
      title="User List"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/user/add");
          }}
        >
          Add
        </Button>
      }
    >
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: "",
          status: "",
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="Name">
              <Input placeholder="Please Input" allowClear />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="status" label="Status">
              <Select
                allowClear
                showSearch
                placeholder="Please Select"
                options={STATUS_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button htmlType="submit" onClick={handleSearchReset}>
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles.tableWrap}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 1000 }}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            showTotal: () => `Total ${pagination.total}`,
          }}
        />
      </div>
    </Content>
  );
}