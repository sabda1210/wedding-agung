import { useState } from "react";
import Content from "./components/fragments/Content";
import Hero from "./components/fragments/Hero";

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleIsOpen = () => {
    scrollTo(0, 0);
    setIsOpen(!isOpen);
  };
  return (
    <>
      {!isOpen && <Hero onClick={() => handleIsOpen()} />}
      {isOpen && <Content />}
    </>
  );
}

export default App;
