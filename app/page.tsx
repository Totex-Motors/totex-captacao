"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Users, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);

  const partnerSlides = [
    {
      src: "/imports/image-20.png",
      alt: "Quest Multimarcas",
      imageClassName: "max-h-20 md:max-h-24 max-w-[70%]",
    },
    {
      src: "/imports/image-21.png",
      alt: "Firstline",
      imageClassName: "max-h-10 md:max-h-12 max-w-[70%]",
    },
    {
      src: "/imports/image-7.png",
      alt: "Parceiro Image 7",
      imageClassName: "max-h-12 md:max-h-14 max-w-[84%]",
    },
    {
      src: "/imports/image-9.png",
      alt: "Parceiro Image 9",
      imageClassName: "max-h-12 md:max-h-14 max-w-[84%]",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPartnerIndex((prevIndex) => (prevIndex + 1) % partnerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [partnerSlides.length]);

  const features = [
    {
      icon: Users,
      title: "Mais de 30 mil",
      subtitle: "possíveis compradores",
    },
    {
      icon: Clock,
      title: "Ofertas em até",
      subtitle: "30 minutos",
    },
    {
      icon: CheckCircle,
      title: "Avaliação justa",
      subtitle: "do seu veículo",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-3xl shadow-2xl px-8 py-6">
            <img 
              src="/imports/image-3.png" 
              alt="TOTEX Motors" 
              className="h-20 mx-auto object-contain brightness-0 invert" 
            />
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Representative holding the sign */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative -mx-6"
            >
              <motion.img 
                src="/imports/fotodomarcelo.png" 
                alt="Vendemos seu carro em até 30 minutos - TOTEX Motors" 
                className="w-[90%] h-auto object-cover relative z-10 mx-auto"
              />
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              onClick={() => router.push("/formulario")}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#16a34a] to-[#15803d] hover:from-[#15803d] hover:to-[#166534] text-white font-black py-7 px-10 rounded-2xl transition-all shadow-2xl hover:shadow-3xl flex items-center justify-center gap-4 text-2xl"
            >
              VENDER MEU CARRO AGORA
              <ArrowRight className="w-7 h-7" />
            </motion.button>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-lg text-center"
                >
                  <feature.icon className="w-8 h-8 text-[#0b6c65] mx-auto mb-2" />
                  <p className="font-bold text-[#0b6c65] text-sm leading-tight">
                    {feature.title}
                  </p>
                  <p className="text-xs text-slate-600 leading-tight mt-1">
                    {feature.subtitle}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Partners Carousel */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center text-lg font-bold text-slate-700 mb-4"
              >
                Parceiros Oficiais
              </motion.h2>
              
              <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-xl">
                {partnerSlides.map((slide, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: currentPartnerIndex === index ? 1 : 0,
                      scale: currentPartnerIndex === index ? 1 : 1.1,
                    }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center p-6"
                    style={{ pointerEvents: currentPartnerIndex === index ? "auto" : "none" }}
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className={`w-auto h-auto object-contain ${slide.imageClassName}`}
                    />
                  </motion.div>
                ))}
                {/* Placeholder for first render */}
                <div className="w-full h-48"></div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center text-sm text-gray-600 font-medium"
            >
              👆 Toque na tela para iniciar sua avaliação
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
