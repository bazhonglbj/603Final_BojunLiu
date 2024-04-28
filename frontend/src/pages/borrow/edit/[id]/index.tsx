import { getBorrowDetail } from "@/api";
import { getUserDetail, getUserList } from "@/api/user";
import { BorrowForm } from "@/components";  
import UserForm from "@/components/UserForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BorrowBook() {
  const router = useRouter();
  const id = router.query.id;
  const [data, setData] = useState();
  useEffect(() => {
    if (id) {
      getBorrowDetail(id as string).then((res) => {
        setData(res.data);
      });
    }
  }, [id]);
  return <BorrowForm title="Borrow Edit" editData={data} />;
}