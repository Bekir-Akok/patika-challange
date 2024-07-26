import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function MainLayout({ children }) {
  return (
    <div className="w-full h-full flex">
      <Navbar />
      <div className="w-full min-h-full flex flex-col justify-between">
        <main className="w-full h-full overflow-y-scroll">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
