"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { UseFormRegister } from "react-hook-form";
import { Product } from "../page";

type Store = {
  id: string;
  name: string;
  postageCost: number;
  description?: string;
};

function StoreSelect({ register }: { register: UseFormRegister<Product> }) {
  const [stores, setStores] = useState<Store[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const storesRef = collection(db, "stores");
      const snapshot = await getDocs(storesRef);

      if (!snapshot) {
        console.log("No matching documents.");
        return;
      } else if (snapshot) {
        const dataArr: Store[] = [];
        snapshot.docs.map((doc) => {
          const data = doc.data() as Store;

          dataArr.push(data);
        });
        setStores(dataArr);
      }
    };

    fetchData();
  }, []);

  return (
    <select
      {...register("storeName", { required: true })}
      className=" w-full p-4 border-2 border-gray-300 text-black rounded-lg mb-4"
    >
      {stores.map((store, index) => {
        return <option key={index}>{store.name}</option>;
      })}
    </select>
  );
}

export default StoreSelect;
