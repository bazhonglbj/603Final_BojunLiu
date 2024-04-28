import { Button, Col, Image, Form, message, Input, Row, Select, Space, Table, TablePaginationConfig, Tooltip } from "antd";
import { useRouter } from "next/router";
import styles from './index.module.css'
import { useEffect, useState } from "react";
import { bookDelete, getBookList } from "@/api/book";
import { getCategoryList } from "@/api/category";
import dayjs from "dayjs";
import { BookQueryType, CategoryType } from "@/type";
import Content  from "@/components/Content";

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width:120,
  },
  {
    title: 'Cover',
    dataIndex: 'cover',
    key: 'cover',
    width:80,
    render: (text: string) => {
      return <Image
        width={50}
        src={text}
        alt=""
      />
    }
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
    width:80,
    render: (text: string) => {
      return <Tooltip title={text} placement="topLeft">
        {text}
      </Tooltip>
    }
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width:120,
    render:(text:string) => {
      return text?.name;
    }
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    width:150,
    render: (text: string) => {
      return <Tooltip title={text} placement="topLeft">
        {text}
      </Tooltip>
    }
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    width:80,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width:100,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
];
export default function Home() {
  const [form] = Form.useForm()
  const router = useRouter()
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0
  })

  async function fetchData(search?: BookQueryType) {
    const res = await getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...search,
    });
    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  }

  useEffect(() => {
    fetchData();
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
  }, []);
  
  const handleSearchFinish = async (values:BookQueryType) => {
    const res = await getBookList({ ...values, current: 1, pageSize: pagination.pageSize })
    setData(res.data)
    setPagination({ ...pagination, current: 1, total: res.total })
  }

  const handleSearchReset = () => {
    console.log(form);
    form.resetFields();
  }

  const handleBookEdit = (id:string) => {
    router.push(`/book/edit/${id}`)
  }

  const handleTableChange = async (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setPagination(pagination)
    const query = form.getFieldsValue()
    const res = await getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
    setData(res.data)
  }

  const handleBookDelete = async (id: string) => {
    await bookDelete(id);
    message.success("Delete Success!");
    fetchData(form.getFieldsValue());
  };
  
  const columns = [...COLUMNS,
      {
        title: 'Action', key: "action", render: (_: any, row: any) => {
          return <Space>
            <Button 
            type="link" 
            onClick={() => {
              handleBookEdit(row._id);
            }}> Edit</Button>
            <Button 
            type="link" 
            danger 
            onClick={() => {
                handleBookDelete(row._id);
              }}>Delete</Button>
          </Space>
        }
      }
    ]

  return <> 
  <Content 
  title="Book List"
  operation={
    <Button
    type="primary"
  onClick={() =>{
    router.push('/book/add');
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
        <Form.Item name="name" label="book_name">
          <Input placeholder="Please Input" allowClear />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item name="author" label="author" >
          <Input placeholder="Please Input" allowClear />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item name="category" label="category" >
          <Select
            allowClear
            showSearch
            placeholder="Please Select"
            options={categoryList?.map(item => ({label: item.name, value: item._id}))} />
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