"use client";

import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { Product } from "../page";
import { deleteObject, ref } from "@firebase/storage";
import { useState } from "react";

const DeleteWarning = ({
  warningHandler,
}: {
  warningHandler: (num: number) => void;
}) => {
  console.log("DeleteWarning");
  return (
    <div className="bg-black bg-opacity-50 flex justify-center items-center h-screen w-screen absolute top-0 left-0">
      <div className="bg-white p-8 text-black flex flex-col gap-2">
        <h2 className="text-2xl font-bold">
          Are you sure you want to delete this?
        </h2>
        <div className="flex justify-between">
          <button className="font-bold p-2" onClick={() => warningHandler(1)}>
            Cancel
          </button>
          <button
            className="font-bold p-2 bg-red-600 text-white rounded-lg"
            onClick={() => warningHandler(0)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

function ProductItem({ product, index }: { product: Product; index: number }) {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const deleteProduct = async () => {
    try {
      for (const fileUrl of product.files) {
        // Create a reference to the file to delete
        const fileRef = ref(storage, fileUrl);

        // Delete the file
        await deleteObject(fileRef);
      }
      const docRef = doc(db, "products", product.id); // Get a reference to the document
      await deleteDoc(docRef); // Delete the document
      console.log("Document successfully deleted!");
      window.location.reload();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleWarning = (num: number) => {
    if (num === 1) {
      setShowDeleteWarning(false);
    } else {
      deleteProduct();
    }
  };
  return (
    <tr
      key={product.name + "" + index}
      className="p-2 border text-black bg-white"
    >
      {showDeleteWarning && (
        <DeleteWarning warningHandler={(num) => handleWarning(num)} />
      )}
      <td>{product.name}</td>
      <td>{product.desc}</td>
      <td>{product.price}</td>
      <td>{product.specs}</td>
      <td className="underline cursor-pointer">
        Images: {product.files.length}
      </td>
      <td>{product.storeName}</td>
      {/* <div className="flex gap-2">
        {product.files &&
          product.files.map((file, index) => {
            return (
              <img
                key={file + "" + index}
                src={file}
                alt={product.name}
                className="w-24 h-24"
              />
            );
          })}
      </div> */}
      {/* <button
        className="underline text-red-600 flex justify-end"
        onClick={() => setShowDeleteWarning(true)}
      >
        Delete
      </button> */}
    </tr>
  );
}

export default ProductItem;
