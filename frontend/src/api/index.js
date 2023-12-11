import axios from "axios";

export const baseURL =
  import.meta.env.VITE_BASE_URL;

export const getUserCount = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/users/count`);
    return res.data.count;
  } catch (err) {
    return null;
  }
};

export const getUserList = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/users/list`);
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const addNewProduct = async (productData) => {
  try {
    const res = await axios.post(`${baseURL}/api/products/create`, productData);
    return res.data.productId;
  } catch (err) {
    return null;
  }
}

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/products/all`);
    console.log(res.data.data);
    return res.data.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};



