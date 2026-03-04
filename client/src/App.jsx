// import logo from './logo.svg';
// import './App.css';
import { useState } from "react";
import BuildSection from "./pages/build/BuildDefenseSection.jsx";
import HomeSection from "./pages/home/HomeSection.jsx";

function App() {
  const [sections, setSections] = useState("HOME");

  switch (sections) {
    case "BUILD-DEFENSE":
      return <BuildSection setAppSections={setSections} />;
    case "HOME":
      return <HomeSection setAppSections={setSections} />;
    default:
      return <HomeSection setAppSections={setSections} />;
  }
}

export default App;
