/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useRef } from "react";
import "../../App.css";

import "aos/dist/aos.css";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { LuCalendarClock } from "react-icons/lu";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { IoMdTime } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import Flowers from "../Icons/Flowers";
import {
  IoCard,
  IoHome,
  IoCalendar,
  IoChatbubbleEllipsesSharp,
} from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import Iframe from "react-iframe";
import { IoCopy } from "react-icons/io5";
import { addMessage, getMessages } from "../../model/messageModal";

const menus = [
  { id: "home", icon: IoHome, label: "Home" },
  { id: "profile", icon: CgProfile, label: "Profile" },
  { id: "event", icon: IoCalendar, label: "Event" },
  { id: "wishes", icon: IoChatbubbleEllipsesSharp, label: "Wishes" },
];

interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
}

function Content() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isLoadingWishes, setIsLoadingWishes] = useState(false);
  const [isActiveSound, setIsActiveSound] = useState(true);
  const isAutoScrollingRef = useRef(false); // supaya handleScroll tau apakah auto-scroll lagi aktif
  const isUserInteractingRef = useRef(false); // apakah user lagi interaksi manual
  const lastScrollTimeRef = useRef<number>(0); // buat simpan waktu terakhir interaksi user

  const itemsPerPage = 3;

  const totalPages = useMemo(() => {
    return Math.ceil(wishes.length / itemsPerPage);
  }, [wishes, itemsPerPage]);

  const currentWishes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return wishes.slice(startIndex, endIndex);
  }, [wishes, currentPage, itemsPerPage]);

  const fetchAllWishes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      const data = await getMessages();
      const response = data
        .map((wish: any) => ({
          id: wish.id,
          name: wish.name || "Anonymous",
          message: wish.message || "",
          date: wish.timestamp || new Date().toISOString(),
        }))
        .sort((a, b) => {
          // Sort from newest to oldest
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      setWishes(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching wishes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all wishes on component mount
  useEffect(() => {
    fetchAllWishes();
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the wishes section when changing page
    document
      .querySelector(".wishlist-container")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Add a scroll event listener to detect which section is currently in view
  // useEffect(() => {
  //   const handleScroll = () => {
  //     // Get all section elements with their corresponding menu IDs
  //     const sections = ["home", "profile", "event", "wishes"]
  //       .map((id) => document.getElementById(id))
  //       .filter(Boolean);

  //     // Find which section is currently most visible in the viewport
  //     let currentSectionId = activeMenu;
  //     let maxVisibility = 0;

  //     sections.forEach((section) => {
  //       if (!section) return;

  //       const rect = section.getBoundingClientRect();
  //       // Calculate how much of the section is visible
  //       const visibleHeight =
  //         Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
  //       const visiblePercentage =
  //         visibleHeight > 0
  //           ? visibleHeight / Math.min(section.offsetHeight, window.innerHeight)
  //           : 0;

  //       if (visiblePercentage > maxVisibility) {
  //         maxVisibility = visiblePercentage;
  //         currentSectionId = section.id;
  //       }
  //     });

  //     // Update active menu if needed
  //     if (currentSectionId !== activeMenu) {
  //       setActiveMenu(currentSectionId);
  //     }
  //   };

  //   // Add scroll event listener with throttling to improve performance
  //   let ticking = false;
  //   const scrollListener = () => {
  //     if (!ticking) {
  //       window.requestAnimationFrame(() => {
  //         handleScroll();
  //         ticking = false;
  //       });
  //       ticking = true;
  //     }
  //   };

  //   window.addEventListener("scroll", scrollListener);

  //   // Initial check in case the page is already scrolled
  //   handleScroll();

  //   // Cleanup
  //   return () => {
  //     window.removeEventListener("scroll", scrollListener);
  //   };
  // }, [activeMenu]); // Depend on activeMenu to avoid unnecessary updates

  // Make sure page starts from the top on mount

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isAutoScrolling) {
      isAutoScrollingRef.current = true; // kasih tau kita lagi auto-scroll

      interval = setInterval(() => {
        if (window.innerHeight + window.scrollY < document.body.scrollHeight) {
          window.scrollBy(0, 1);
        } else {
          window.scrollTo(0, 0); // reset ke atas
        }
      }, 16);
    }

    return () => {
      isAutoScrollingRef.current = false; // kasih tau auto-scroll stop
      if (interval) clearInterval(interval);
    };
  }, [isAutoScrolling]);

  useEffect(() => {
    const handleScroll = () => {
      lastScrollTimeRef.current = Date.now();

      // Jangan pause auto-scroll kalau ini dari auto-scroll
      if (
        !isAutoScrollingRef.current &&
        isAutoScrolling &&
        !isUserInteractingRef.current
      ) {
        setIsAutoScrolling(false);

        setTimeout(() => {
          setIsAutoScrolling(true);
        }, 5000);
      }

      // === Update activeMenu ===
      const sections = ["home", "profile", "event", "wishes"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      let currentSectionId = activeMenu;
      let maxVisibility = 0;
      console.log("section");
      sections.forEach((section) => {
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const visibleHeight =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visiblePercentage =
          visibleHeight > 0
            ? visibleHeight / Math.min(section.offsetHeight, window.innerHeight)
            : 0;

        if (visiblePercentage > maxVisibility) {
          maxVisibility = visiblePercentage;
          currentSectionId = section.id;
        }
      });

      if (currentSectionId !== activeMenu) {
        setActiveMenu(currentSectionId);
      }
    };

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [activeMenu, isAutoScrolling]);

  useEffect(() => {
    const handleUserInteract = () => {
      isUserInteractingRef.current = true;
      lastScrollTimeRef.current = Date.now();

      if (isAutoScrolling) {
        setIsAutoScrolling(false);

        setTimeout(() => {
          isUserInteractingRef.current = false;
          setIsAutoScrolling(true);
        }, 5000);
      }
    };

    window.addEventListener("wheel", handleUserInteract, { passive: true });
    window.addEventListener("touchstart", handleUserInteract, {
      passive: true,
    });
    window.addEventListener("touchmove", handleUserInteract, { passive: true });
    window.addEventListener("keydown", handleUserInteract);

    return () => {
      window.removeEventListener("wheel", handleUserInteract);
      window.removeEventListener("touchstart", handleUserInteract);
      window.removeEventListener("touchmove", handleUserInteract);
      window.removeEventListener("keydown", handleUserInteract);
    };
  }, [isAutoScrolling]);

  const handleSubmitWish = async () => {
    setIsLoadingWishes(true);
    try {
      if (!name || !message) return;
      const res = await addMessage({
        name: name,
        message: message,
        timestamp: new Date().toISOString(),
      });
      console.log("Wish submitted successfully:", res);
      if (res) {
        setName("");
        setMessage("");
        fetchAllWishes();
      }
    } catch (error) {
      console.log("Error submitting wish:", error);
    } finally {
      setIsLoadingWishes(false);
    }
  };

  return (
    <div className=" bg-black    w-screen">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99998] overflow-hidden">
        {Array.from({ length: 15 }).map((_, index) => {
          // Random parameters for each flower
          const startPositionX = Math.random() * 100;
          const animationDuration = 8 + Math.random() * 12;
          const size = 15 + Math.random() * 20;
          const delay = Math.random() * 15;
          const swaySpeed = 2 + Math.random() * 4;

          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `${startPositionX}%`,
                top: "-50px",
                animation: `falling ${animationDuration}s linear ${delay}s infinite`,
              }}
            >
              <img
                src="/flower.svg"
                alt="falling flower"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `sway ${swaySpeed}s ease-in-out infinite`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="    max-w-[380px] mx-auto max-h-[9000px] relative overflow-hidden w-full   ">
        <div className="fixed z-[999999] grid grid-cols-4 bottom-3 w-[350px] ml-[15px] bg-[#333446] h-[60px] shadow-xl/30 rounded-xl">
          {menus.map(({ id, icon: Icon, label }) => {
            const isActive = activeMenu === id;

            return (
              <div
                key={id}
                onClick={(e) => {
                  e.stopPropagation();

                  isUserInteractingRef.current = true;
                  setIsAutoScrolling(false);
                  setActiveMenu(id);

                  const targetElement = document.getElementById(id);
                  if (targetElement) {
                    setTimeout(() => {
                      targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 10);

                    // Setelah 5 detik resume auto-scroll
                    setTimeout(() => {
                      isUserInteractingRef.current = false;
                      setIsAutoScrolling(true);
                    }, 5000);
                  }
                }}
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <div
                  className={`text-[24px] text-text-primary transition-all duration-300
                ${isActive ? "icon-animate icon-selected" : ""}`}
                  style={{
                    height: "30px",
                    width: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon />
                </div>
                <p className="text-[12px] text-text-primary font-garamond font-medium mt-1">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
        <div className="fixed z-[999999] right-0  h-max w-max  top-0">
          <section
            onClick={() => {
              setIsActiveSound(!isActiveSound);
            }}
            className=" p-2 rounded-full opacity-60 border border-text-primary cursor-pointer bg-[#333446] w-max h-max "
          >
            {isActiveSound ? (
              <HiMiniSpeakerWave className="text-text-primary text-[30px]" />
            ) : (
              <HiMiniSpeakerXMark className="text-text-primary text-[30px]" />
            )}
          </section>
        </div>

        {/* <img src="/Image.png" alt="image semua" /> */}
        <section className="z-10  container-wedding relative box-border pt-[170px] min-h-[600px]">
          <div className=" w-full h-[6px] absolute top-0 bg-text-primary" />
          <img
            src="/firstLayout.png"
            alt="gambar header"
            className="absolute top-0 left-0 right-0 h-full w-full"
          />
          <div className="flex flex-col items-center justify-center">
            {/* Add auto-scroll restart button */}
          </div>
        </section>
        <section
          id="home"
          className="z-10  container-wedding relative box-border pt-[170px] min-h-[720px]"
        >
          <div className=" w-full h-[6px] absolute top-0 bg-text-primary" />
          <img
            src="/layoutOne.png"
            alt="gambar header"
            className="absolute top-0 left-0 right-0  h-full w-full "
          />
          <div className=" flex flex-col items-center justify-center ">
            <h1
              data-aos="fade-up"
              className=" font-playwrite italic text-text-primary font-g flex font-medium text-[50px]"
            >
              M <span className="inline-block mt-[30px] ml-[20px]">&</span>{" "}
              <span className="inline-block mt-[60px] ml-[20px] italic">A</span>
            </h1>
            <section
              data-aos="fade-up"
              className="date mt-[20px] flex flex-col items-center justify-center"
            >
              <p className="text-text-primary text-[20px] font-garamond  tracking-[0.3em]">
                Minggu
              </p>
              <p className="text-text-primary text-[20px] font-garamond ">
                {`06 July 2025`}
              </p>
              <img src="footerDate.svg" alt="footer" className="mt-2" />
            </section>
            <div className=" desc mt-[25px] text-center">
              <p
                data-aos="zoom-in"
                className=" text-text-primary text-[15px] italic font-garamond font-normal"
              >
                “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
                untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung
                dan merasa tentram kepadanya, dan dijadikan-Nya di antaramu rasa
                kasih dan sayang. Sesungguhnya pada yang demikian itu
                benar-benar terdapat tanda-tanda bagi kaum yang berpikir.”
              </p>
            </div>
          </div>
        </section>
        <section
          id="profile"
          className=" container-wedding h-full relative   box-border  min-h-[977px]"
        >
          <div className=" w-full h-full  bg-white/20 absolute top-0 bottom-0 left-0 right-0 p-[30px]">
            <div className="border-4 relative border-text-primary">
              <img
                src="/layoutSecond.svg"
                alt="gambar header"
                className=" relative h-full   w-full "
              />
              <div className="absolute top-22 w-full flex px-[10px] items-center flex-col justify-center     ">
                <img
                  data-aos="zoom-in-up"
                  alt="bismillah"
                  src="/bismillah.svg"
                />
                <h3
                  data-aos="zoom-in-up"
                  className=" text-text-primary italic font-semibold font-garamond text-center mt-4 text-[16px]"
                >
                  Assalamu'alaikum Warahmatullaahi Wabarakaatuh
                </h3>
                <p
                  data-aos="zoom-in-up"
                  className=" text-center text-text-primary text-[15px] mt-3 font-normal font-garamond"
                >
                  Maha Suci Allah yang telah menciptakan makhluk- Nya
                  berpasang-pasangan. Ya Allah semoga ridho- Mu tercurah
                  mengiringi pernikahan kami.
                </p>
                <section
                  data-aos="zoom-in-down"
                  className="man mt-9 w-full text-center"
                >
                  <h4 className=" text-text-primary font-semibold text-[25px] font-playwrite ">
                    Mila
                  </h4>
                  <p className=" text-text-primary font-medium font-garamond text-[28px]">
                    Dolly Sharmila Ghozali
                  </p>
                  <section className=" text-text-primary font-garamond text-[15px] mt-2">
                    <p>Anak kedua dari</p>
                    <p>Bapak Ridwan</p>
                    <p>dan Ibu Sri Esa Elona</p>
                  </section>
                </section>

                <section className=" max-w-[200px] w-full items-center gap-x-2 grid grid-cols-[1fr_50px_1fr]">
                  <div className=" w-full h-[3px] bg-text-primary"></div>
                  <p className=" text-[35px] text-text-primary font-playwrite   text-center">
                    &
                  </p>
                  <div className=" w-full h-[3px] bg-text-primary"></div>
                </section>
                <section
                  data-aos="zoom-in-down"
                  className="man mt-9 w-full text-center"
                >
                  <h4 className=" text-text-primary font-semibold text-[25px] font-playwrite ">
                    Agung
                  </h4>
                  <p className=" text-text-primary font-medium font-garamond text-[28px]">
                    Agung Dedi Saputra
                  </p>
                  <section className=" text-text-primary font-garamond text-[15px] mt-2">
                    <p>Anak ketiga dari</p>
                    <p>Bapak Yonizar</p>
                    <p>dan Ibu Mumi Yuheni</p>
                  </section>
                </section>
              </div>
            </div>
          </div>
          {/* Animasi buka amplop nya letak di sini dong */}
        </section>
        <section className="z-10  container-wedding relative box-border pt-[120px] min-h-[740px]">
          <div className=" w-full h-[6px] absolute top-0 bg-text-primary" />
          <img
            src="/layoutThrid.svg"
            alt="gambar header"
            className="absolute top-0 "
          />
          <div className=" flex flex-col items-center justify-center ">
            <div className="relative size-[200px] flex items-center justify-center">
              {/* Circular border */}
              <div className="absolute w-full h-full rounded-full"></div>

              {/* Center image */}
              <img
                alt="hourglass"
                src="/hourglass2.png"
                className="z-10 object-contain animate-[spin_6s_linear_infinite]"
              />

              {/* Circular text */}
              <div className="absolute w-full h-full animate-[spin_6s_linear_infinite] [animation-direction:reverse]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="textCircle"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="transparent"
                  />
                  <text fill="#D4AF37" className="text-xs">
                    <textPath xlinkHref="#textCircle" className="font-garamond">
                      Counting the Days - Counting the Days - Counting the Days
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
            <FlipClockCountdown
              to={new Date("2025-07-06").getTime()}
              className="flip-clock"
              showSeparators={true}
            />
            <div className="flex items-center gap-x-2 py-[8px] cursor-pointer mt-9 border-t border-b border-text-primary">
              <LuCalendarClock className="text-text-primary text-[30px] " />
              <p className=" text-text-primary text-[16px] font-garamond font-medium">
                Save the Date
              </p>
            </div>
          </div>
          <div className="absolute  origin-center -bottom-38 left-0 right-0 animate-[spin_6s_linear_infinite]  z-50">
            <Flowers />
          </div>
        </section>
        <section
          id="event"
          className="  bg-[#333446]/70 pt-48 px-11  items-center justify-center h-full min-h-[1120px] overflow-hidden relative   box-border  "
        >
          {/* Animasi buka amplop nya letak di sini dong */}
          <div className="image-wdding rounded-4xl z-0">
            <img src="/prewedding.png" alt="prewedding" />
            <img src="/bismillah.svg" alt="prewedding" />
          </div>
          <div
            data-aos="flip-left"
            data-aos-easing="ease-out-cubic"
            data-aos-duration="2000"
            className=" w-full min-h-[395px] relative z-50 grid grid-cols-[70px_1fr] overflow-hidden rounded-tr-[4rem] rounded-bl-[4rem] border-t-4 border-b-4 border-text-primary container-wedding"
          >
            <section className=" w-full bg-[#333446] flex flex-col gap-y-17 items-center justify-center h-full ">
              <p className=" -rotate-90 text-[34px] font-garamond text-text-primary font-semibold">
                NIKAH
              </p>
              <p className=" -rotate-90 text-[34px] font-garamond text-text-primary font-semibold">
                AKAD
              </p>
            </section>
            <section className=" w-full h-full px-3">
              <div className="tittle w-full border-b gap-x-7 border-text-primary pb-2 flex items-center justify-center">
                <p className=" text-text-primary text-[62px] font-garamond font-semibold">
                  03
                </p>
                <section className=" text-text-primary text-[18px] font-garamond font-medium">
                  <p>Selasa</p>
                  <p>Juni</p>
                  <p>2025</p>
                </section>
              </div>
              <div className="content-time w-full">
                <div className="flex flex-col   mt-9">
                  <div className="flex items-center gap-x-2">
                    <IoMdTime className="text-text-primary text-[30px]" />
                    <p className=" text-text-primary text-[16px] font-garamond font-medium">
                      09.00 - 10.00 WIB
                    </p>
                  </div>
                  <div className=" w-full mt-3">
                    <p className=" text-[23px] text-text-primary font-garamond font-medium">
                      Lokasi Acara:{" "}
                    </p>
                    <p className="text-[13px] text-text-primary font-garamond font-normal">
                      Jl.Sepakat, Perumahan Mutiara Kulim Permai, Jl.Meranti
                      No.02
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div
            data-aos="flip-right"
            data-aos-easing="ease-out-cubic"
            data-aos-duration="2000"
            className=" w-full relative z-50 min-h-[395px] mt-8 grid grid-cols-[1fr_70px] overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] border-t-4 border-b-4 border-text-primary container-wedding"
          >
            <section className=" w-full h-full px-3">
              <div className="tittle w-full border-b gap-x-7 border-text-primary pb-2 flex items-center justify-center">
                <p className=" text-text-primary text-[62px] font-garamond font-semibold">
                  06
                </p>
                <section className=" text-text-primary text-[18px] font-garamond font-medium">
                  <p>Minggu</p>
                  <p>July</p>
                  <p>2025</p>
                </section>
              </div>
              <div className="content-time w-full">
                <div className="flex flex-col   mt-9">
                  <div className="flex items-center gap-x-2">
                    <IoMdTime className="text-text-primary text-[30px]" />
                    <p className=" text-text-primary text-[16px] font-garamond font-medium">
                      09.00 - 10.00 WIB
                    </p>
                  </div>
                  <div className=" w-full mt-3">
                    <p className=" text-[23px] text-text-primary font-garamond font-medium">
                      Lokasi Acara:{" "}
                    </p>
                    <p className="text-[13px] text-text-primary font-garamond font-normal">
                      Jl.Sepakat, Perumahan Mutiara Kulim Permai, Jl.Meranti
                      No.02
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className=" w-full bg-[#333446] flex flex-col gap-y-17 items-center justify-center h-full ">
              <p className=" -rotate-90 text-[34px] font-garamond text-text-primary font-semibold">
                RESEPSI
              </p>
            </section>
          </div>
        </section>
        <section className="z-10  container-wedding relative box-border pt-[80px] min-h-[720px]">
          <img
            src="/layoutFourth.svg"
            alt="gambar header"
            className="absolute top-0 left-0 right-0  h-full w-full "
          />
          <div className=" flex flex-col items-center justify-center ">
            <section
              data-aos="fade-up"
              className="date mt-[10px] flex flex-col items-center justify-center"
            >
              <h1
                data-aos="fade-up"
                className="  text-text-primary font-playwrite flex font-medium text-[20px]"
              >
                Event
                <span className="inline-block font-playwrite italic mt-[30px] ml-[10px]">
                  Location
                </span>
              </h1>
            </section>
            <div className=" w-[2px] h-[50px] mt-1 bg-text-primary" />
            <div className=" desc mt-[15px] text-center">
              <p
                data-aos="zoom-in"
                className=" text-text-primary text-[15px] w-[80%] text-center mx-auto  font-garamond font-normal"
              >
                Gedung guru Riau, Jl. Jendral Sudirman No. 10, Pekanbaru,
              </p>
            </div>
            <Iframe
              url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29590.116851831142!2d101.41305178062453!3d0.47937236901882496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5a8d43b130f43%3A0x7ec9543669eb38f3!2sGedung%20Guru!5e1!3m2!1sen!2sid!4v1748314560424!5m2!1sen!2sid"
              width="80%"
              height="250px"
              id=""
              className=" border border-text-primary rounded-lg mt-2"
              display="block"
              position="relative"
            />
            <div className="flex items-center cursor-pointer gap-x-2 py-[8px] cursor-pointer mt-4 border-t border-b border-text-primary">
              <CiLocationOn className="text-text-primary text-[30px] " />
              <p className=" text-text-primary text-[16px] font-garamond font-medium">
                Lihat Lokasi Acara
              </p>
            </div>
          </div>
        </section>
        <section className="z-10  container-wedding relative box-border pt-[70px] min-h-[640px]">
          <div className=" w-full h-[6px] absolute top-0 bg-text-primary" />
          <img
            src="/layoutThrid.svg"
            alt="gambar header"
            className="absolute top-0 "
          />
          <div className=" flex flex-col items-center justify-center ">
            <section
              data-aos="fade-up"
              className="w-[78%] h-[360px] rounded-xl border border-text-primary p-0.5"
            >
              <section className=" w-full h-full border border-text-primary rounded-2xl p-3">
                <div className="header w-full items-center grid grid-cols-[5%_90%_5%]">
                  <section className="w-full h-0.5 bg-text-primary" />
                  <h4 className=" text-[30px]  text-center font-garamond italic font-normal text-text-primary">
                    Doa Pengantin
                  </h4>
                  <section className="w-full h-0.5 bg-text-primary" />
                </div>
                <div className="content-doa mt-3">
                  <p className=" text-text-primary text-[24px] text-center font-garamond font-normal">
                    َارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَع َيْنَكُمَا فِى
                    خَيْر
                  </p>
                  <p className=" text-text-primary text-[16px] text-center font-garamond font-normal mt-4 italic">
                    "Semoga Allah memberkahimu di waktu bahagia dan memberkahimu
                    di waktu susah dan semoga Allah menyatukan kalian berdua
                    dalam kebaikan."
                  </p>
                  <p className=" text-text-primary text-[16px] text-center font-garamond font-normal mt-4 ">
                    (HR. Abu Dawud no 2130)
                  </p>
                </div>
              </section>
            </section>
          </div>
          <div className="absolute  origin-center -bottom-38 left-0 right-0 animate-[spin_6s_linear_infinite]  z-[90]">
            <Flowers />
          </div>
        </section>
        <section className="z-[5]  container-wedding relative box-border pt-[170px] min-h-[1120px]">
          <div className=" w-full absolute top-0 h-[20vh] bg-linear-to-b from-white/10 to-white/0 backdrop-blur-[1px]" />

          <div className=" flex flex-col items-center justify-center ">
            <div className="  size-[124px] bg-[#333446] rounded-full border-2 border-text-primary flex items-center justify-center">
              <img src="/donation.png" alt="gambar icon" />
            </div>
            <div className="header w-[80%] items-center grid grid-cols-[15%_70%_15%]">
              <section className="w-full h-0.5 bg-text-primary" />
              <h4 className=" text-[30px]  text-center font-garamond  font-normal text-text-primary">
                Wedding Gift
              </h4>
              <section className="w-full h-0.5 bg-text-primary" />
            </div>
            <p className=" w-[80%] text-text-primary text-[16px] text-center font-garamond font-normal mt-4 ">
              Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.
              Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat
              memberi kado secara cashless.
            </p>
            <section className="w-[78%] h-[550px] mt-4 rounded-xl border border-text-primary p-0.5">
              <section className=" w-full h-full border p-2  overflow-hidden border-text-primary rounded-2xl ">
                <div className="w-full h-full  bg-white rounded-2xl grid grid-rows-[1fr_50px_1fr]">
                  <section className="p-4">
                    <img
                      src="/bankBCA.png"
                      alt="Bank BCA"
                      className="w-[100px] h-[30px] bg-cover"
                    />
                    <div className=" grid grid-cols-[1fr_40%] py-6">
                      <section className=" text-[#333446] font-garamond font-medium text-[16px]">
                        <p>8135638630</p>
                        <p>a/n Agung Dedi Saputra</p>
                      </section>
                      <IoCard className="text-[#333446] text-[60px] " />
                    </div>
                    <div
                      className="flex items-center bg-[#333446] rounded-2xl p-2 text-center w-max px-5 mx-auto gap-x-2 cursor-pointer
                        border-2 border-text-primary shadow-[0_6px_0_0_#D4AF37] hover:shadow-[0_3px_0_0_#D4AF37] 
                        hover:translate-y-1 active:translate-y-2 active:shadow-[0_0px_0_0_#D4AF37] 
                        transition-all duration-150 transform"
                      onClick={() =>
                        navigator.clipboard.writeText("8135638630")
                      }
                    >
                      <IoCopy className="text-text-primary text-[15px]" />
                      <p className="text-text-primary text-[12px] font-garamond font-medium">
                        Salin Nomor Rekening
                      </p>
                    </div>
                  </section>
                  <section className=" w-[80%] mx-auto grid grid-cols-[1fr_80px_1fr] items-center">
                    <section className="w-full h-0.5  bg-gray-200" />
                    <h4 className=" text-[16px]  text-center font-garamond italic font-normal text-gray-200">
                      Atau
                    </h4>
                    <section className="w-full h-0.5 bg-gray-200" />
                  </section>
                  <section className="p-4">
                    <img
                      src="/bankBCA.png"
                      alt="Bank BCA"
                      className="w-[100px] h-[30px] bg-cover"
                    />
                    <div className=" grid grid-cols-[1fr_40%] py-6">
                      <section className=" text-[#333446] font-garamond font-medium text-[16px]">
                        <p>8230507211</p>
                        <p>a/n Dolly Sharmila Ghozali </p>
                      </section>
                      <IoCard className="text-[#333446] text-[60px] " />
                    </div>
                    <div
                      className="flex items-center bg-[#333446] rounded-2xl p-2 text-center w-max px-5 mx-auto gap-x-2 cursor-pointer
                        border-2 border-text-primary shadow-[0_6px_0_0_#D4AF37] hover:shadow-[0_3px_0_0_#D4AF37] 
                        hover:translate-y-1 active:translate-y-2 active:shadow-[0_0px_0_0_#D4AF37] 
                        transition-all duration-150 transform"
                      onClick={() =>
                        navigator.clipboard.writeText("8230507211")
                      }
                    >
                      <IoCopy className="text-text-primary text-[15px]" />
                      <p className="text-text-primary text-[12px] font-garamond font-medium">
                        Salin Nomor Rekening
                      </p>
                    </div>
                  </section>
                </div>
              </section>
            </section>
          </div>
        </section>
        <section
          id="wishes"
          className="z-10  container-wedding relative box-border pt-[170px] min-h-[1187px]"
        >
          <div className=" w-full h-[6px] absolute top-0 bg-text-primary" />
          <img
            src="/layoutEight.svg"
            alt="gambar header"
            className="absolute top-0 left-0 right-0  h-full w-full "
          />
          <div className=" flex flex-col items-center justify-center ">
            <img src="/barrierEight.svg" alt="barrier" />
            <section>
              <h4 className=" text-[24px] italic font-bold font-garamond text-text-primary ">
                BEST WISHES
              </h4>
            </section>
            <section className="form relative z-50 w-[80%] flex flex-col gap-y-3 mt-4">
              <div className="flex flex-col gap-y-2">
                <label
                  className=" text-text-primary font-garamond font-medium text-[16px]"
                  htmlFor="name"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukan Nama anda"
                  className="border p-2 px-4 rounded-xl border-text-primary bg-transparent text-text-primary font-garamond font-normal"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  className=" text-text-primary font-garamond font-medium text-[16px]"
                  htmlFor="name"
                >
                  Harapan dan Doa
                </label>
                <textarea
                  id="message"
                  placeholder="Masukan Harapan dan Doa anda"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border min-h-[100px] p-2 px-4 rounded-xl border-text-primary bg-transparent text-text-primary font-garamond font-normal"
                />
              </div>
            </section>

            <div data-aos="fade-up" className="wishlist-container w-[80%] mt-8">
              <button
                onClick={handleSubmitWish}
                disabled={isLoadingWishes}
                className="flex items-center justify-center w-full bg-[#333446] rounded-2xl p-3 text-center gap-x-2 cursor-pointer
                    border-2 border-text-primary shadow-[0_6px_0_0_#D4AF37] hover:shadow-[0_3px_0_0_#D4AF37] 
                    hover:translate-y-1 active:translate-y-2 active:shadow-[0_0px_0_0_#D4AF37] 
                    transition-all duration-150 transform"
              >
                <p className="text-text-primary text-[16px] font-garamond font-medium">
                  Kirim Ucapan
                </p>
              </button>

              <div
                className="mt-8 max-h-[400px] overflow-y-auto"
                ref={(el) => {
                  // Auto scroll to bottom when content changes
                  if (el && !isLoading && currentWishes.length > 0) {
                    el.scrollTop = el.scrollHeight;
                  }
                }}
              >
                {isLoading ? (
                  <div className="text-center py-4">
                    <p className="text-text-primary">Loading...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-4">
                    <p className="text-red-400">{error}</p>
                    <button
                      onClick={fetchAllWishes}
                      className="text-text-primary underline mt-2"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentWishes.length > 0 ? (
                      currentWishes.map((wish, index) => (
                        <div
                          key={wish.id || index}
                          //   data-aos="fade-up"
                          data-aos-delay={index * 100}
                          className="bg-[#333446]/40 backdrop-blur-sm p-4 rounded-xl border border-text-primary"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-text-primary font-garamond font-semibold">
                              {wish.name}
                            </h4>
                            <span className="text-text-primary/70 text-xs font-garamond">
                              {new Date(wish.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-text-primary text-sm font-garamond italic">
                            {wish.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-text-primary">
                          No wishes yet. Be the first to send your wishes!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <div
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`size-8 rounded-full border border-text-primary flex items-center justify-center cursor-pointer
                                    ${
                                      page === currentPage
                                        ? "bg-[#333446]"
                                        : "bg-transparent hover:bg-[#333446]/50"
                                    }`}
                        >
                          <span className="text-text-primary font-garamond">
                            {page}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              {/* <section className="w-full flex flex-col items-center justify-center mt-4 relative">
                <img
                  src="/mailIcon.svg"
                  alt="barrier"
                  className=" absolute top-0"
                />
                <section className=" w-full mt-[50px] items-center gap-x-2 grid grid-cols-[1fr_100px_1fr]">
                  <div className=" w-full h-[2px] bg-text-primary"></div>
                  <p className=" text-[35px] text-text-primary font-garamond    text-center">
                    RSVP
                  </p>
                  <div className=" w-full h-[2px] bg-text-primary"></div>
                </section>
                <p className=" text-text-primary font-playwrite italic">
                  Konfirmasi Kehadiran
                </p>
                <button
                  className="flex mt-2 items-center justify-center w-full bg-[#333446] rounded-2xl p-3 text-center gap-x-2 cursor-pointer
                    border-2 border-text-primary shadow-[0_6px_0_0_#D4AF37] hover:shadow-[0_3px_0_0_#D4AF37] 
                    hover:translate-y-1 active:translate-y-2 active:shadow-[0_0px_0_0_#D4AF37] 
                    transition-all duration-150 transform"
                >
                  <p className="text-text-primary text-[16px] font-garamond font-medium">
                    Mulai Isi Sekarang
                  </p>
                </button>
              </section> */}
            </div>
          </div>
        </section>
        <section className="z-10  container-wedding relative box-border pt-[170px] min-h-[600px]">
          <div className=" w-full h-[6px] absolute top-0 bg-text-primary" />
          <img
            src="/lastContent.png"
            alt="gambar header"
            className="absolute top-0 left-0 right-0 h-full w-full"
          />
          <div className="flex flex-col items-center justify-center">
            {/* Add auto-scroll restart button */}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Content;
