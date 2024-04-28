import { Button, Col, Image, Form, Modal, Input, Row, Select, Space, Table, TablePaginationConfig, Tooltip, message, Tag } from "antd";
import { useRouter } from "next/router";
import styles from './index.module.css'
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { CategoryQueryType } from "@/type";
import Content  from "@/components/Content";
import { categoryDelete, getCategoryList } from "@/api/category";

const LEVEL = {
  ONE: 1,
  TWO: 2,
};

export const LEVEL_OPTIONS = [
  { label: "level1", value: LEVEL.ONE },
  { label: "level2", value: LEVEL.TWO },
];

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width:120,
  },
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    width:120,
    render: (text: number) => {
      return <Tag color={text === 1 ? "green" : "cyan"}>{`Level${text}`}</Tag>;
    }
  },
  {
    title: 'Parent Category',
    dataIndex: 'parent',
    key: 'parent',
    width:80,
    render: (text: { name: string }) => {
      return text?.name ?? "-";
    },
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width:200,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
];
export default function Category() {
  const [form] = Form.useForm()
  const router = useRouter()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0
  })

  async function fetchData(values?: any) {
    const res = await getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values,
    });
    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  const handleSearchFinish = async (values:CategoryQueryType) => {
    const res = await getCategoryList({ 
      ...values, 
      current: 1, 
      pageSize: pagination.pageSize })
    setData(res.data)
    setPagination({ ...pagination, current: 1, total: res.total })
  }

  const handleSearchReset = () => {
    console.log(form);
    form.resetFields();
  }

  const handleCategoryEdit = (id:string) => {
    router.push(`/category/edit/${id}`)
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setPagination(pagination)
    const query = form.getFieldsValue()
    getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
  }

  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Confirm?",
      okText: "Yes",
      cancelText: "No",
      async onOk() {
        await categoryDelete(id);
        message.success("Delete Success!");
        fetchData(form.getFieldsValue());
      },
    });
  };
  
  const columns = [...COLUMNS,
      {
        title: 'Action', key: "action", render: (_: any, row: any) => {
          return <Space>
            <Button type="link" onClick={()=>handleCategoryEdit(row._id)}> Edit</Button>
            <Button type="link" danger onClick={()=>handleCategoryDelete(row._id)}>Delete</Button>
          </Space>
        }
      }
    ]

  return <> 
  <Content 
  title="Category List"
  operation={
    <Button
    type="primary"
  onClick={() =>{
    router.push('/category/add');
  }}
  >
  Add
  </Button>}
  >
  
  <Form
    name="search"
    form={form}
    onFinish={handleSearchFinish}
  >
    <Row gutter={24}>
      <Col span={5}>
        <Form.Item name="name" label="Name">
          <Input placeholder="Please Input" allowClear />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item name="level" label="Level" >
          <Select
            allowClear
            showSearch
            placeholder="Please Select"
            options={LEVEL_OPTIONS} />
        </Form.Item>
      </Col>
      <Col span={9}>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button htmlType="submit" onClick={handleSearchReset}>
              Reset
            </Button> 
          </Space>
        </Form.Item>
      </Col>
    </Row>
  </Form>
  <div className={styles.tableWrap}>
    <Table 
    columns={columns} 
    dataSource={data} 
    scroll={{ x: 1000 }}
    onChange={handleTableChange}
    pagination={{...pagination,showTotal:()=>`total ${pagination.total}`}}/>
  </div>
  </Content>
  </>;
}