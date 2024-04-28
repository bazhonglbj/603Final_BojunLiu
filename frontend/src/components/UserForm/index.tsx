import { bookAdd } from "@/api/book";
import { getCategoryList } from "@/api/category";
import { userAdd, userUpdate } from "@/api/user";
import { USER_ROLE, USER_SEX, USER_STATUS } from "@/constant";
import { BookType, CategoryType, UserType } from "@/type";
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

export default function UserForm({
  title,
  editData = {
    sex: USER_SEX.MALE,
    role: USER_ROLE.USER,
    status: USER_STATUS.ON,
  },
}: {
  title: string;
  editData?: Partial<UserType>;
}) {
  const [preview, setPreview] = useState("");
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (editData._id) {
      form.setFieldsValue(editData);
    }
  }, [editData, form]);

  const handleFinish = async (values: UserType) => {
    if (editData?._id) {
      await userUpdate(editData._id, values);
      message.success("Updated Success");
    } else {
      await userAdd(values);
      message.success("Created Success");
    }
    router.push("/user");
  };

  useEffect(() => {
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
  }, []);

  return (
    <Content title={title}>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={editData}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input name",
            },
          ]}
        >
          <Input placeholder="Please Input" />
        </Form.Item>
        <Form.Item
          label="Nickname"
          name="nickName"
          rules={[
            {
              required: true,
              message: "Please input nickname",
            },
          ]}
        >
          <Input placeholder="Please input" />
        </Form.Item>
        <Form.Item
          label="Sex"
          name="sex"
          rules={[
            {
              required: true,
              message: "Please select sex",
            },
          ]}
        >
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password placeholder="Please input" />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Radio.Group>
            <Radio value="on">Active</Radio>
            <Radio value="off">Inactive</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Role" name="role">
          <Radio.Group>
            <Radio value="user">User</Radio>
            <Radio value="admin">Admin</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
          >
            {editData._id ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
}