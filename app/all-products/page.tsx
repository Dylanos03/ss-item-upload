"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Product } from "../page";
import ProductItem from "../components/ProductItem";

function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const productsRef = collection(db, "products");
      const snapshot = await getDocs(productsRef);

      if (!snapshot) {
        console.log("No matching documents.");
        return;
      } else if (snapshot) {
        const dataArr: Product[] = [];
        snapshot.docs.map((doc) => {
          const data = doc.data() as Product;

          dataArr.push({ ...data, id: doc.id });
        });
        setProducts(dataArr);
        console.log(dataArr);
      }
    };

    fetchData();
  }, []);
  return (
    <main className="flex flex-col gap-2 p-4">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.name + "" + index}
            product={product}
            index={index}
          />
        );
      })}
    </main>
  );
}

export default AllProducts;
