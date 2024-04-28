import request from "../utils/requests";
import qs from "qs";

import { CategoryQueryType, CategoryType } from "../type/category";

export async function getCategoryList(params?: CategoryQueryType) {
  return request.get(`/api/categories?${qs.stringify(params)}`);
}

export async function categoryAdd(params: CategoryType) {
  return request.post("/api/categories", params);
}

export async function getCategoryDetail(id: string) {
  return request.get(`/api/categories/${id}`);
}

export async function categoryUpdate(id: string, params: CategoryType) {
  return request.put(`/api/categories/${id}`, params);
}

export async function categoryDelete(id: string) {
  return request.delete(`/api/categories/${id}`);
}