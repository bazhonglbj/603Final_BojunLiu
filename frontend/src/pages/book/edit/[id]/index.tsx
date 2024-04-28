import { getBookDetail } from "@/api/book";
import  BookForm  from "@/components/BookForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BookEdit() {
  const [data, setData] = useState();
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      const {query = {}} = router;
      const { id } = query;
      if (id) {
        const res = await getBookDetail(id as string);
        setData(res.data);
      }
    };
    fetch();
  },[router]);
  return <BookForm title="Book Edit" editData={data} />;
}