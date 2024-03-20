import Link from "next/link";

function Nav() {
  return (
    <div className="fixed bottom-2 right-2 flex gap-3 drop-shadow-lg bg-white p-6 rounded-lg text-black underline">
      <Link href={"/all-products"}>All Products</Link>
      <Link href={"/"}>Add Product</Link>
      <Link href={"/add-store"}>Add Store</Link>
    </div>
  );
}

export default Nav;
