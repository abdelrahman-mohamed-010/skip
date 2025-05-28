import Navbar from "./components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default Layout;
