import { getUserList} from "../../api/user";
import Content from "@/components/Content";
import { BookType, BorrowQueryType, BorrowType, CategoryQueryType, CategoryType, UserType } from "@/type";
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
import { useCallback, useEffect, useState } from "react";
import styles from "./index.module.css";
import { BORROW_STATUS } from "@/constant";
import { borrowBack, borrowDelete, getBookList, getBorrowList, getCategoryList } from "@/api";

const Option = Select.Option;

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
    title: "Book Name",
    dataIndex: "bookName",
    key: "bookName",
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (text: string) => {
      return text === STATUS.ON ? (
        <Tag color="green">Borrowed</Tag>
      ) : (
        <Tag color="red">Returned</Tag>
      );
    },
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
    ellipsis: true,
    width: 150,
  },
  {
    title: "Borrow User",
    dataIndex: "borrowUser",
    key: "borrowUser",
    ellipsis: true,
    width: 150,
  },
  {
    title: "Borrow Time",
    dataIndex: "borrowAt",
    key: "borrowAt",
    width: 200,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
  {
    title: "Return Time",
    dataIndex: "backAt",
    key: "backAt",
    width: 200,
    render: (text: string) => (text ? dayjs(text).format("YYYY-MM-DD") : "-"),
  },
];

export default function Borrow() {
  const [form] = Form.useForm();
  const [list, setList] = useState<BorrowType[]>([]);
  const [userList, setUserList] = useState<UserType[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [bookList, setBookList] = useState<BookType[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
  });
  const router = useRouter();

  const fetchData = useCallback(
    (search?: BorrowQueryType) => {
      const { book, user, author, status } = search || {};
      getBorrowList({
        current: pagination.current as number,
        pageSize: pagination.pageSize as number,
        book,
        author,
        user,
        status,
      }).then((res) => {
        const data = res.data.map((item: BorrowType) => ({
          ...item,
          bookName: item.book.name,
          author: item.book.author,
          borrowUser: item.user.nickName,
        }));
        setList(data);
        setTotal(res.total);
      });
    },
    [pagination]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  useEffect(() => {
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    });
    getUserList({ all: true }).then((res) => {
      setUserList(res.data);
    });
  }, []);

  const handleDeleteModal = (id: string) => {
    Modal.confirm({
      title: "Confirm Delete?",
      okText: "Yes",
      cancelText: "No",
      async onOk() {
        await borrowDelete(id);
        fetchData(form.getFieldsValue());
        message.success("Delete Success");
      },
    });
  };

  const handleBorrowBack = (id: string) => {
    Modal.confirm({
      title: "Confirm Return?",
      okText: "Yes",
      cancelText: "No",
      async onOk() {
        await borrowBack(id);
        message.success("Return Success");
        fetchData(form.getFieldsValue());
      },
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleSearchFinish = (values: BorrowQueryType) => {
    fetchData(values);
  };

  const columns = [
    ...COLUMNS,
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_: any, row: BorrowType) => (
        <Space>
          {row.status === BORROW_STATUS.ON ? (
            <Button
              type="link"
              block
              onClick={() => {
                handleBorrowBack(row._id as string);
              }}
            >
              Return
            </Button>
          ) : null}
            <Button
              type="link"
              block
              danger
              onClick={() => {
                handleDeleteModal(row._id as string);
              }}
            >
              Delete
            </Button>
        </Space>
      ),
    },
  ];

  return (
    <Content title="Borrow Book">
      <Form
        form={form}
        name="search"
        className={styles.form}
        onFinish={handleSearchFinish}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="book" label="Book Name">
              <Select
                showSearch
                placeholder="Please Select"
                optionFilterProp="label"
                allowClear
                options={bookList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status" label="Status">
              <Select
                showSearch
                placeholder="Please Select"
                optionFilterProp="label"
                allowClear
                options={[
                  { label: "Borrow", value: BORROW_STATUS.ON },
                  { label: "Return", value: BORROW_STATUS.OFF },
                ]}
              />
            </Form.Item>
          </Col>
            <Col span={5}>
              <Form.Item name="user" label="User List">
                <Select placeholder="Please Select" allowClear>
                  {userList.map((user) => (
                    <Option key={user._id} value={user._id}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          <Col span={9} style={{ textAlign: "left" }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button
              style={{ margin: "0 8px" }}
              onClick={() => {
                form.resetFields();
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Form>
      <div className={styles.tableWrap}>
        <Table
          rowKey="_id"
          dataSource={list}
          columns={columns}
          onChange={handleTableChange}
          scroll={{ x: 1300 }}
          pagination={{
            ...pagination,
            total: total,
            showTotal: () => `Total ${total}`,
          }}
        />
      </div>
    </Content>
  );
}