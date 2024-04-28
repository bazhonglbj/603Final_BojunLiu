import { bookAdd, borrowAdd, borrowUpdate, getBookList,getUserList } from "@/api";
import { BookType, BorrowOptionType, BorrowType, CategoryType, UserType } from "@/type";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Radio,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Content from "../Content";
import styles from "./index.module.css";

export default function BorrowForm({
  title,
  editData ,
}: {
  title: string;
  editData?: Partial<BorrowType>;
}) {
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const router = useRouter();
  const [userList, setUserList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [bookStock, setBookStock] = useState(0);

  useEffect(() => {
    getUserList().then((res) => {
      setUserList(res.data);
    });
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue(editData);
  }, [editData, form]);

const handleFinish = async (values: BorrowType) => {
    await borrowAdd(values);
    message.success("Create Success");
    router.push("/borrow");
  } 

  const handleBookChange = (
    value: string,
    option: BorrowOptionType | BorrowOptionType[]
  ) => {
    setBookStock((option as BorrowOptionType).stock);
  };

  return (
    <Content title={title}>
      <Form
        className={styles.form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Book Name"
          name="book"
          rules={[
            {
              required: true,
              message: "Please Input",
            },
          ]}
        >
          <Select
            placeholder="Please Select"
            showSearch
            optionFilterProp="label"
            onChange={handleBookChange}
            options={bookList.map((item: BookType) => ({
              label: item.name,
              value: item._id as string,
              stock: item.stock,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Borrow User"
          name="user"
          rules={[
            {
              required: true,
              message: "Please Input",
            },
          ]}
        >
          <Select
            placeholder="Please Select"
            showSearch
            optionFilterProp="label"
            options={userList.map((item: UserType) => ({
              label: item.name,
              value: item._id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Stock"
          rules={[
            {
              required: true,
              message: "Please Input",
            },
          ]}
        >
          {bookStock}
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={styles.btn}
            disabled={bookStock <= 0 && !editData?._id}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
}
