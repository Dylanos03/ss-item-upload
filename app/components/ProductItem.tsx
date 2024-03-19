import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { Product } from "../page";
import { deleteObject, ref } from "@firebase/storage";

function ProductItem({ product, index }: { product: Product; index: number }) {
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
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };
  return (
    <div
      key={product.name + "" + index}
      className="bg-white text-black p-4 flex flex-col w-full rounded-lg"
    >
      <h1>Name: {product.name}</h1>
      <p>Description: {product.desc}</p>
      <p>Price: {product.price}</p>
      <p>Specs: {product.specs}</p>
      <p>Images:</p>
      <div className="flex gap-2">
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
      </div>
      <button onClick={deleteProduct}>Delete</button>
    </div>
  );
}

export default ProductItem;
