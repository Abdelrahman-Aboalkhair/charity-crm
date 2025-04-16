import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <Navbar />
      <div className="w-[82%] mx-auto "> {children}</div>
      <Footer />
    </main>
  );
}
