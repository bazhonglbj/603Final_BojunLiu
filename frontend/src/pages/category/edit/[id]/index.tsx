import { getCategoryDetail } from "@/api/category";
import CategoryForm from "@/components/CategoryForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CategoryEdit() {
  const [data, setData] = useState();
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      const {query = {}} = router;
      const { id } = query;
      if (id) {
        const res = await getCategoryDetail(id as string);
        setData(res.data);
      }
    };
    fetch();
  },[router]);
  return <CategoryForm title="Category Edit" data={data} />;
}