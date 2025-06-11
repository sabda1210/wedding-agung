import "../styles/Hero.css";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
const Hero: React.FC<{ onClick: () => void }> = (props) => {
  const [nameParam, setNameParam] = useState<string | null>(null);

  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  // Remove the first item which was the card
  const pictures = [
    { src: "/image-2.jpg", scale: scale5 },
    { src: "/image-3.jpg", scale: scale6 },
    { src: "/image-4.jpg", scale: scale5 },
    { src: "/image-5.jpg", scale: scale6 },
    { src: "/image-6.jpg", scale: scale8 },
    { src: "/image-7.jpg", scale: scale9 },
  ];

  const imageStyles = [
    { top: "-32vh", left: "10vw", width: "35vw", height: "35vh" },
    { top: "-10vh", left: "-33vw", width: "33vw", height: "45vh" },
    { left: "27.5vw", width: "25vw", height: "25vh" },
    { top: "27.5vh", left: "5vw", width: "20vw", height: "25vh" },
    { top: "27.5vh", left: "-22.5vw", width: "30vw", height: "25vh" },
    { top: "22.5vh", left: "25vw", width: "15vw", height: "15vh" },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setNameParam(searchParams.get("to"));
  }, []);

  return (
    <div
      ref={container}
      className="style-container bg-[url('/joglo.png')] bg-no-repeat bg-cover bg-center h-screen w-screen"
    >
      <div className="style-sticky">
        {/* Fixed card that doesn't scale */}
        <div className=" fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <div onClick={props.onClick} className="main-content-test p-4">
            <section className="bg-gradient-to-b from-[#f8f4e9] to-[#f5f0e5] border-2 border-[#d4b88b] rounded-lg p-6 mb-4 shadow-md w-full max-w-md mx-auto text-center relative overflow-hidden">
              {/* Card content as before */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4b88b] to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4b88b] to-transparent"></div>

              <div className="flex justify-center mb-3">
                <img
                  src="/flower.svg"
                  alt="Wedding Rings"
                  className="w-12 h-12 opacity-80"
                />
              </div>

              <h2 className="font-script text-[#9c7c3c] text-xl mb-3">
                Kepada Yth.
              </h2>
              <p className="text-[#5a4a2f] font-garamond text-base mb-2">
                Bpk/Ibu/Saudara/i
              </p>
              <p className="font-playwrite text-[#8a6d3b] text-lg font-semibold py-2 px-4 border-t border-b border-[#d4b88b] mx-auto inline-block">
                {nameParam ? `"${nameParam}"` : ""}
              </p>

              <div className="mt-4 text-[#9c7c3c] text-sm font-garamond italic">
                Kami mengundang Anda untuk berbagi kebahagiaan
              </div>

              <button
                className="mt-6 px-6 py-2 bg-gradient-to-r from-[#d4b88b] to-[#c4a87b] text-white font-garamond rounded-md border border-[#b9a07a] shadow-sm hover:from-[#c4a87b] hover:to-[#d4b88b] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#9c7c3c] focus:ring-opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onClick();
                }}
              >
                Buka Undangan
              </button>

              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4b88b]"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d4b88b]"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#d4b88b]"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4b88b]"></div>
            </section>
          </div>
        </div>

        {/* Parallax images */}
        {pictures.map((picture, index) => (
          <motion.div
            style={{ scale: picture.scale }}
            key={index}
            className="style-el"
          >
            <div
              className="style-imageContainer"
              style={{
                top: imageStyles[index]?.top || "0",
                left: imageStyles[index]?.left || "0",
                width: imageStyles[index]?.width || "25vw",
                height: imageStyles[index]?.height || "25vh",
              }}
            >
              <img
                src={picture.src}
                alt={`Image ${index + 2}`}
                className="style-image rounded-xl"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </motion.div>
        ))}

        {/* The flower decorations */}
        <motion.div style={{ scale: scale4 }} className="style-el">
          <div
            className="style-imageContainer"
            style={{
              position: "fixed",
              top: "-10vh",
              left: "-10vw",
              width: "25vw",
              height: "25vh",
            }}
          >
            <img
              src={"/flowerFigur.png"}
              alt="Image 1"
              className="style-image rotate-[140deg]"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </motion.div>
        <motion.div style={{ scale: scale4 }} className="style-el">
          <div
            className="style-imageContainer"
            style={{
              position: "fixed",
              bottom: "-10vh",
              left: "-10vw",
              width: "25vw",
              height: "25vh",
            }}
          >
            <img
              src={"/flowerFigur.png"}
              alt="Image 1"
              className="style-image rotate-[30deg]"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
