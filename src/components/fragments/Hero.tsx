import "../styles/Hero.css";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
const Hero: React.FC<{ onClick: () => void }> = (props) => {
  console.log(props.onClick, "sabda");
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

  const pictures = [
    { src: "/image-1.jpg", scale: scale4 },
    { src: "/image-2.jpg", scale: scale5 },
    { src: "/image-3.jpg", scale: scale6 },
    { src: "/image-4.jpg", scale: scale5 },
    { src: "/image-5.jpg", scale: scale6 },
    { src: "/image-6.jpg", scale: scale8 },
    { src: "/image-7.jpg", scale: scale9 },
  ];

  const imageStyles = [
    { top: "0", left: "0", width: "25vw", height: "25vh" },
    { top: "-32vh", left: "5vw", width: "35vw", height: "35vh" },
    { top: "-10vh", left: "-33vw", width: "33vw", height: "45vh" },
    { left: "27.5vw", width: "25vw", height: "25vh" },
    { top: "27.5vh", left: "5vw", width: "20vw", height: "25vh" },
    { top: "27.5vh", left: "-22.5vw", width: "30vw", height: "25vh" },
    { top: "22.5vh", left: "25vw", width: "15vw", height: "15vh" },
    // ...tambahkan sesuai jumlah gambar
  ];
  return (
    <div
      ref={container}
      className="style-container bg-[url('/joglo.png')] bg-no-repeat bg-cover bg-center h-screen w-screen"
    >
      <div className="style-sticky" onClick={props.onClick}>
        {pictures.map((picture, index) => {
          if (index === 0) {
            return (
              <motion.div
                style={{ scale: picture.scale }}
                key={index}
                onClick={() => {
                  props.onClick();
                  console.log("clicked");
                }}
                className="style-el "
              >
                <div
                  onClick={props.onClick}
                  className="main-content-test relative z-50 p-4"
                >
                  <h4
                    onClick={() => {
                      props.onClick();
                      console.log("clicked");
                    }}
                    className=" text-text-primary font-medium lg:text-[24px] md:text-[12px] text-[11px] font-garamond italic shadow-2xl bg-[#333446] border-2 border-text-primary rounded-3xl p-4"
                  >
                    Buka Undangan
                  </h4>
                </div>
              </motion.div>
            );
          }
          return (
            <motion.div
              style={{ scale: picture.scale }}
              key={index}
              className="style-el"
            >
              <div
                className="style-imageContainer"
                style={{
                  // position: "absolute",
                  top: imageStyles[index]?.top || "0",
                  left: imageStyles[index]?.left || "0",
                  width: imageStyles[index]?.width || "25vw",
                  height: imageStyles[index]?.height || "25vh",
                }}
              >
                <img
                  src={picture.src}
                  alt="Image 1"
                  className="style-image rounded-xl"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </motion.div>
          );
        })}
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
