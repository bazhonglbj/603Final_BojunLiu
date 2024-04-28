import { CategoryType } from "@/type";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import Content from "../Content";

import styles from "./index.module.css";
import { LEVEL_OPTIONS } from "@/pages/category";
import { categoryUpdate, categoryAdd, getCategoryList } from "@/api/category";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function CategoryForm({title, data}:{title:string,data:CategoryType}) {
  const [form] = Form.useForm();
  const [level, setLevel] = useState(1);
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
  const router = useRouter();

  const handleFinish = async (values: CategoryType) => {
    if(data?._id){
      await categoryUpdate(data?._id, values);
      message.success("Update Success");
    }else{
      await categoryAdd(values);
      message.success("Create Success");
    }
    router.push("/category");
};

  useEffect(() => {
    if (data?._id) {
      form.setFieldsValue({...data});
    }
  }, [data,form]);

  useEffect(() => {
    async function fetchData() {
      const res = await getCategoryList({ all: true, level: 1 });
      setLevelOneList(res.data);
    }
    fetchData();
  }, []);

  const levelOneOptions = useMemo(() => {
    return levelOneList.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  }, [levelOneList]);

  return (
    <>
    <Content title={title}>
      <Form
        form={form}
        className={styles.form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
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
          <Input placeholder="Please input" />
        </Form.Item>
        <Form.Item 
        label="Level" 
        name="level"
        rules={[
          {
            required: true,
            message: "Please select level"
          }
        ]}>
        <Select
            onChange={(value) => {
              setLevel(value);
            }}
            placeholder="Please Select"
            disabled={!!data?._id}
            options={LEVEL_OPTIONS}
          ></Select> 
        </Form.Item>
        {(level === 2 || data?.level ===2) && (
          <Form.Item
            label="Parent level"
            name="parent"
            rules={[
              {
                required: true,
                message: "Please select",
              },
            ]}
          >
            <Select placeholder="Please Select" options={levelOneOptions}></Select>
          </Form.Item>
        )}
        <Form.Item label=" " colon={false}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
          >
            {data?._id ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
    </>
  );
}