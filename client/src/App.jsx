// import logo from './logo.svg';
// import './App.css';
import { useState } from "react";
import BuildSection from "./pages/build/BuildDefenseSection.jsx";
import HomeSection from "./pages/home/HomeSection.jsx";
import { GlobalInfoModalProvider } from "./components/GlobalInfoModal/GlobalInfoModalContext.jsx";

function App() {
  const [sections, setSections] = useState(
    () => localStorage.getItem("currentSection") || "HOME"
  );

  const changeSection = (section) => {
    localStorage.setItem("currentSection", section);
    setSections(section);
  };

  let content;
  switch (sections) {
    case "BUILD-DEFENSE":
      content = <BuildSection setAppSections={changeSection} />;
      break;
    case "HOME":
      content = <HomeSection setAppSections={changeSection} />;
      break;
    default:
      content = <HomeSection setAppSections={changeSection} />;
  }

  return <GlobalInfoModalProvider>{content}</GlobalInfoModalProvider>;
}

export default App;
