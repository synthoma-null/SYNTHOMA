import FirstVisitRedirectClient from "./components/FirstVisitRedirectClient";
import SynthomaHome from "../src/components/home/SynthomaHome";
import "../src/styles/synthoma-os/home.css";

export default function HomePage() {
  return (
    <>
      <FirstVisitRedirectClient />
      <SynthomaHome />
    </>
  );
}
