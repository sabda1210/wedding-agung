import { useState } from "react";
import Content from "./components/fragments/Content";
import Hero from "./components/fragments/Hero";
import { useEffect } from "react";
import AOS from "aos";
function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleIsOpen = () => {
    scrollTo(0, 0);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, // durasi animasi dalam ms
    });
  }, []);
  return (
    <>
      {!isOpen && <Hero onClick={() => handleIsOpen()} />}
      {isOpen && <Content />}
    </>
  );
}

export default App;
