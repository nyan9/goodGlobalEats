import { FunctionComponent, ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";

interface IProps {
  main: ReactNode;
}

const Layout: FunctionComponent<IProps> = ({ main }) => {
  const { logout, authenticated } = useAuth();

  return (
    <div className="bg-gray-900 w-screen mx-auto text-white">
      <nav className="bg-gray-800" style={{ height: "64px" }}>
        <div className="px-6 flex items-center justify-between h-16">
          <Link href="/">
            <a>
              <img src="/sushi.svg" alt="home ramen" className="inline w-6" />
            </a>
          </Link>

          {authenticated ? (
            <>
              <Link href="/spots/putOn">
                <button className="bg-green-400 hover:bg-green-700 font-semibold py-1 px-2 rounded">
                  Put On a Spot{" "}
                  <img className="w-6 inline" src="/gge-color.png" />
                </button>
              </Link>
              <button
                className="bg-red-400 hover:bg-red-700 font-semibold py-1 px-2 rounded"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth">
              <button className="bg-blue-400 hover:bg-blue-700 font-semibold py-1 px-2 rounded">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
      <main style={{ minHeight: "calc(100vh - 64px)" }}>{main}</main>
    </div>
  );
};

export default Layout;
