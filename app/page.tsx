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
import { useState } from "react";
import AddedPopUp from "./components/AddedPopUp";

export type Product = {
  id: string;
  name: string;
  price: number;
  desc: string;
  specs: string;
  storeId: string;
  storeName: string;
  files: Blob[];
};

type File = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  Blob: Blob[];
};

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const { register, handleSubmit, control, reset, watch } = useForm<Product>();
  const filecount = watch("files");
  const submitHandler = async (data: Product) => {
    setSubmitting(true);
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
          "images/product-images/" + data.storeName + "/" + data.name + i
        );

        // Create a new promise for the upload
        const uploadPromise = new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = async (e) => {
            if (e.target === null) {
              reject("FileReader error");
              setSubmitting(false);
              return;
            }

            try {
              if (e.target.result === null) {
                reject("FileReader error");
                setSubmitting(false);
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
      setSubmitting(false);
      setPopUp(true);
      reset();
      setTimeout(() => {
        setPopUp(false);
      }, 5000);
    } catch (e) {
      console.error("Error adding document: ", e);
      setSubmitting(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center text-black justify-between p-2">
      {popUp && <AddedPopUp />}
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col items-center justify-center w-full"
      >
        <h1 className="text-4xl font-bold mb-8 text-white">Add a product</h1>
        <StoreSelect register={register} defaultStore="" />
        <input
          required
          className=" w-full p-2 border-2 border-gray-300 text-black rounded-lg mb-4"
          type="text"
          placeholder="Product name"
          {...register("name", { required: true })}
        />
        <input
          required
          className=" w-full p-2 border-2 border-gray-300 text-black rounded-lg mb-4"
          type="number"
          placeholder="Price"
          step={0.01}
          {...register("price", { required: true })}
        />
        <textarea
          required
          className=" w-full p-2 border-2 border-gray-300 text-black rounded-lg mb-4"
          placeholder="Description"
          rows={4}
          {...register("desc", { required: true })}
        />
        <textarea
          required
          className=" w-full p-2 border-2 border-gray-300 text-black rounded-lg mb-4"
          rows={4}
          placeholder="Specs"
          {...register("specs", { required: true })}
        />
        <div className=" w-full p-2 border-2 border-gray-300 rounded-lg mb-4 flex gap-2 items-center">
          <Controller
            name="files"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <input
                required
                type="file"
                multiple
                onChange={(e) => field.onChange(e.target.files)}
              />
            )}
          />
          <span className="text-white">
            {filecount && filecount.length + " files uploaded"}
          </span>
        </div>

        <button
          className=" bg-white w-full p-3 font-bold text-xl"
          type="submit"
          disabled={submitting}
        >
          submit
        </button>
      </form>
    </main>
  );
}
