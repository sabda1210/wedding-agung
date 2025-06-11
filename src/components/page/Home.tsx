import { useState } from "react";
import Content from "../fragments/Content";
import Hero from "../fragments/Hero";
import { useEffect } from "react";
import AOS from "aos";

const Home = () => {
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
};

export default Home;
