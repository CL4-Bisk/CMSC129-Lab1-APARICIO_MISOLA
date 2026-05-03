// import logo from './logo.svg';
// import './App.css';
import { useState } from "react";
import BuildSection from "./pages/build/BuildDefenseSection.jsx";
import HomeSection from "./pages/home/HomeSection.jsx";

function App() {
  const [sections, setSections] = useState(
    () => localStorage.getItem("currentSection") || "HOME"
  );

  const changeSection = (section) => {
    localStorage.setItem("currentSection", section);
    setSections(section);
  };

  switch (sections) {
    case "BUILD-DEFENSE":
      return <BuildSection setAppSections={changeSection} />;
    case "HOME":
      return <HomeSection setAppSections={changeSection} />;
    default:
      return <HomeSection setAppSections={changeSection} />;
  }
}

export default App;
