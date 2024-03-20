"use client";

import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { Product } from "../page";
import { deleteObject, ref } from "@firebase/storage";
import { useState } from "react";
import EditMenu from "./editmenu";

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
  const [showEditMenu, setShowEditMenu] = useState(false);
  const deleteProduct = async () => {
    try {
      for (const fileUrl of product.files) {
        // Create a reference to the file to delete
        const fileRef = ref(storage, fileUrl.toString()); // Convert fileUrl to a string

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
      {showEditMenu && (
        <EditMenu
          documentId={product.id}
          name={product.name}
          desc={product.desc}
          spec={product.specs}
          price={product.price}
          store={product.storeName}
          image={product.files}
          closeMenu={() => setShowEditMenu(false)}
        />
      )}

      <td className="border border-gray-300">{product.name}</td>
      <td className="border border-gray-300">{product.desc}</td>
      <td className="border border-gray-300">{product.price}</td>
      <td className="border border-gray-300">{product.specs}</td>
      <td className="underline cursor-pointer">
        Images: {product.files.length}
      </td>
      <td className="border border-gray-300">{product.storeName}</td>

      <td>
        <button
          className="underline text-blue-600 flex justify-end"
          onClick={() => setShowEditMenu(true)}
        >
          Edit
        </button>
        <button
          className="underline text-red-600 flex justify-end"
          onClick={() => setShowDeleteWarning(true)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ProductItem;
