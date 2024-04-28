import { login } from "@/api/user";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/router";
import styles from "./index.module.css";

export default function Login() {
  const router = useRouter();
  const handleFinish = async (values: { name: string; password: string }) => {
    console.log(values);
    const res = await login(values);
    console.log(res);
    // {data:{id:xx,name:xxx}}
    if (res.success) {
      message.success("Login Success");

      // Save user info to local storage
      localStorage.setItem(
        "user", 
        JSON.stringify({info:res.data,token:res.token})
      );
      router.push("/book");
     } else {
      message.error("Login Failed");
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Book Management</h2>
      <Form onFinish={handleFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input name" }]}
        >
          <Input placeholder="Please input name" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input password" }]}
        >
          <Input.Password placeholder="Please input password" autoComplete="off" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={styles.btn}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}