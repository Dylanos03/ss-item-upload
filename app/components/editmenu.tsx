"use client";

import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Product } from "../page";
import { useForm } from "react-hook-form";
import StoreSelect from "./StoreSelect";

function EditMenu({
  documentId,
  name,
  desc,
  spec,
  price,
  store,
  image,
  closeMenu,
}: {
  documentId: string;
  name: string;
  desc: string;
  spec: string;
  price: number;
  store: string;
  image: Blob[];
  closeMenu: () => void;
}) {
  const { register, handleSubmit } = useForm<Product>();
  const updateDocument = (data: Product) => {
    try {
      const docRef = doc(db, "products", documentId);
      updateDoc(docRef, {
        name: data.name,
        desc: data.desc,
        specs: data.specs,
        price: data.price,
        storeName: store,
      });
      closeMenu();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };
  return (
    <div className="w-screen h-screen z-40 bg-black absolute top-0 bg-opacity-50 left-0 flex justify-center items-center">
      <form onSubmit={handleSubmit(updateDocument)}>
        <div className="p-8 bg-white text-black rounded-lg">
          <div>
            <label>Product Name</label>
            <input
              type="text"
              className="border-2 border-gray-300 rounded-lg p-2 w-full"
              defaultValue={name}
              {...register("name")}
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              className="border-2 border-gray-300 rounded-lg p-2 w-full"
              defaultValue={price}
              {...register("price")}
            />
          </div>

          <div>
            <label>Product Description</label>
            <textarea
              className="border-2 border-gray-300 rounded-lg p-2 w-full"
              defaultValue={desc}
              rows={6}
              {...register("desc")}
            />
          </div>
          <div>
            <label>Product Specs</label>
            <textarea
              className="border-2 border-gray-300 rounded-lg p-2 w-full"
              defaultValue={spec}
              rows={6}
              {...register("specs")}
            />
          </div>
          <div className="flex justify-between">
            <button
              className="border-black border-2 p-2  h-12 rounded-lg"
              type="button"
              onClick={closeMenu}
            >
              Cancel
            </button>
            <button
              className="bg-black p-2 rounded-lg h-12 text-white "
              type="submit"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditMenu;
