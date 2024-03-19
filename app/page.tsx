"use client";

import StoreSelect from "./components/StoreSelect";
import { useForm, Controller } from "react-hook-form";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

export type Product = {
  id: string;
  name: string;
  price: number;
  desc: string;
  specs: string;
  storeId: string;
  storeName: string;
  files: File[];
};

type File = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  Blob: Blob;
};

export default function Home() {
  const { register, handleSubmit, control } = useForm<Product>();
  const submitHandler = async (data: Product) => {
    try {
      // Get a reference to the storage service
      const storage = getStorage();

      // Array to hold the upload promises
      const uploadPromises = [];

      // Upload each file
      for (let i = 0; i < data.files.length; i++) {
        // Create a storage reference from our storage service
        const storageRef = ref(
          storage,
          "images/product-images/" + data.files[i].name
        );

        // Create a new promise for the upload
        const uploadPromise = new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = async (e) => {
            if (e.target === null) {
              reject("FileReader error");
              return;
            }

            try {
              if (e.target.result === null) {
                reject("FileReader error");
                return;
              }
              // Upload the file to the path 'images/{imageName}'
              const snapshot = await uploadString(
                storageRef,
                e.target.result.toString(),
                "data_url"
              );

              // Get download URL
              const url = await getDownloadURL(snapshot.ref);

              // Resolve the promise with the download URL
              resolve(url);
            } catch (e) {
              reject(e);
            }
          };

          reader.onerror = () => {
            reject("FileReader error");
          };

          // Start reading the file as a data URL
          reader.readAsDataURL(data.files[i]);
        });

        // Add the upload promise to the array
        uploadPromises.push(uploadPromise);
      }

      // Wait for all uploads to finish
      const urls = await Promise.all(uploadPromises);

      // Add a new document with generated id to Firestore
      const docRef = await addDoc(collection(db, "products"), {
        ...data,
        files: urls, // Store download URLs in Firestore
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center text-black justify-between p-24">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col items-center justify-center w-full"
      >
        <h1 className="text-4xl font-bold mb-8 text-white">Add a product</h1>
        <StoreSelect register={register} />
        <input
          className=" w-full p-4 border-2 border-gray-300 text-black rounded-lg mb-4"
          type="text"
          placeholder="Product name"
          {...register("name", { required: true })}
        />
        <input
          className=" w-full p-4 border-2 border-gray-300 text-black rounded-lg mb-4"
          type="number"
          placeholder="Price"
          {...register("price", { required: true })}
        />
        <textarea
          className=" w-full p-4 border-2 border-gray-300 text-black rounded-lg mb-4"
          placeholder="Description"
          rows={6}
          {...register("desc", { required: true })}
        />
        <textarea
          className=" w-full p-4 border-2 border-gray-300 text-black rounded-lg mb-4"
          rows={6}
          placeholder="Specs"
          {...register("specs", { required: true })}
        />
        <Controller
          name="files"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <input
              type="file"
              multiple
              className=" w-full p-4 border-2 border-gray-300 rounded-lg mb-4"
              onChange={(e) => field.onChange(e.target.files)}
            />
          )}
        />
        <button
          className=" bg-white w-full p-3 font-bold text-xl"
          type="submit"
        >
          submit
        </button>
      </form>
    </main>
  );
}
