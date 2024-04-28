import { bookAdd, bookUpdate } from "@/api/book";
import { BookType, CategoryType } from "@/type";
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
import React, { useEffect, useState } from "react";
import Content from "../Content";
import styles from "./index.module.css";
import { getCategoryList } from "@/api/category";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Option = Select.Option;

export default function BookForm({title, editData}:{title:string,editData:BookType}) {
  const [preview, setPreview] = useState("");
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const router = useRouter();
  const [cover, setCover] = useState();

  // useEffect(() => {
  //   if(editData?._id){
  //     editData.publishAt = dayjs(editData.publishAt);
  //     editData.category = editData.category._id;
  //     form.setFieldsValue(editData);
  //   }
  // }, [editData]);

  useEffect(() => {
    if (editData) {
      const data = {
        ...editData,
        category: editData.category
          ? (editData.category as unknown as CategoryType)._id
          : undefined,
        publishAt: editData.publishAt ? dayjs(editData.publishAt) : undefined,
      };
      setCover(editData.cover);
      form.setFieldsValue(data);
    }
  }, [editData, form]);

  const handleFinish = async (values: BookType) => {
    if (values.publishAt) {
      values.publishAt = dayjs(values.publishAt).valueOf();
    }
    if (editData?._id) {
      await bookUpdate(editData?._id, values);
      message.success("Update success");
      router.push("/book");
      return;
    } else {
      await bookAdd(values);
      message.success("Create success");
    }
    router.push("/book");
  };

  useEffect(() => {
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
  }, []);

  const handlePreview = () => {
    setPreview(form.getFieldValue("cover"));
  };

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
          label="Author"
          name="author"
          rules={[
            {
              required: true,
              message: "Please input author",
            },
          ]}
        >
          <Input placeholder="Please input" />
        </Form.Item>
        <Form.Item
          label="Cateory"
          name="category"
          rules={[
            {
              required: true,
              message: "Choose category",
            },
          ]}
        >
          <Select
            placeholder="Please select"
            options={categoryList.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
            >
              {/* {categoryList.map((category) => (
                <Option value={category._id} key={category._id}>
                  {category.name}
                </Option>
              ))} */}
            </Select>
        </Form.Item>
        <Form.Item label="Cover" name="cover">
          <Input.Group compact>
            <Input
              placeholder="Please input"
              style={{ width: "calc(100% - 63px)" }}
              value={cover}
              onChange={(e) => {
                setCover(e.target.value);
                form.setFieldValue("cover", e.target.value);
              }}
            />
            <Button
              type="primary"
              onClick={handlePreview}
            >
              Preview
            </Button>
          </Input.Group>
        </Form.Item>
        {preview && (
          <Form.Item label=" " colon={false}>
            <Image src={preview} width={100} height={100} alt="preview cover" />
          </Form.Item>
        )}
        <Form.Item label="Publish At" name="publishAt">
          <DatePicker placeholder="Please Choose" />
        </Form.Item>
        <Form.Item label="Stock" name="stock">
          <InputNumber placeholder="Please input" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={4} placeholder="Please input" />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
          >
            {editData?._id ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
    </>
  );
}