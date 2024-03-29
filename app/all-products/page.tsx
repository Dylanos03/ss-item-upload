"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Product } from "../page";
import ProductItem from "../components/ProductItem";

function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeName, setStoreName] = useState<string[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      const productsRef = collection(db, "products");
      const snapshot = await getDocs(productsRef);

      if (!snapshot) {
        console.log("No matching documents.");
        return;
      } else if (snapshot) {
        const dataArr: Product[] = [];
        const storeArr: string[] = [];
        snapshot.docs.map((doc) => {
          const data = doc.data() as Product;
          if (!storeArr.includes(data.storeName)) {
            storeArr.push(data.storeName);
          }
          dataArr.push({ ...data, id: doc.id });
        });
        setProducts(dataArr);
        setStoreName(storeArr);
        console.log(dataArr);
      }
    };

    fetchData();
  }, []);
  return (
    <main className="flex flex-col gap-2 p-4">
      <div className="w-full flex justify-between">
        <div className="gap-1 flex">
          <span>Store</span>
          <select
            name=""
            id=""
            className="text-black"
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="">All</option>
            {storeName.map((store, index) => {
              return (
                <option key={store + "" + index} value={store}>
                  {store}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <table className=" border-collapse text-left p-4">
        <thead className="sticky top-0 bg-black">
          <tr>
            <th className="border border-gray-300">Name</th>
            <th className="border border-gray-300">Description</th>
            <th className="border border-gray-300">Price</th>
            <th className="border border-gray-300">Specs</th>
            <th className="border border-gray-300">Images</th>
            <th className="border border-gray-300">Store</th>
            <th className="border border-gray-300">Options</th>
          </tr>
        </thead>
        <tbody>
          {products
            .filter((product) => product.storeName.includes(selectedStore))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product, index) => {
              return (
                <ProductItem
                  key={product.name + "" + index}
                  product={product}
                  index={index}
                />
              );
            })}
        </tbody>
      </table>
    </main>
  );
}

export default AllProducts;
