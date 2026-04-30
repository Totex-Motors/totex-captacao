"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Clock, ClipboardCheck, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main
      className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white flex flex-col"
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      <div
        className="flex flex-col flex-1 px-6"
        style={{ paddingTop: "4vh", paddingBottom: "3vh", gap: "3vh", minHeight: 0 }}
      >

        {/* Logo */}
        <header
          className="flex justify-center items-center shrink-0"
          style={{ height: "10vh" }}
        >
          <img
            src="/imports/logo_totex.png"
            alt="Totex Motors"
            style={{ height: "100%", width: "auto", maxHeight: "80px", objectFit: "contain" }}
          />
        </header>

        {/* Hero — ocupa o espaço restante */}
        <section
          className="relative flex-1 flex flex-col justify-end"
          style={{ minHeight: 0 }}
        >
          <img
            src="/imports/fotocaratotex.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-0 select-none"
            style={{
              height: "84%",
              width: "auto",
              top: "46%",
              bottom: "auto",
              transform: "translateY(-50%)",
            }}
          />

          {/* Texto — deixa espaço para a foto à direita */}
          <div className="relative z-10" style={{ paddingRight: "42%", transform: "translateY(-3vh)" }}>
            <h1
              className="font-serif text-teal-400"
              style={{ fontSize: "clamp(2.2rem, 11vh, 5rem)", lineHeight: 0.88 }}
            >
              <span className="block">VENDA</span>
              <span className="block">SEU CARRO</span>
            </h1>

            <p
              className="text-slate-200 font-medium"
              style={{ fontSize: "clamp(0.95rem, 4.5vh, 2rem)", marginTop: "2.5vh" }}
            >
              Em até 30 minutos
            </p>
          </div>

          <div className="relative z-20 w-full" style={{ marginTop: "clamp(0.6rem, 2vh, 1.5rem)", transform: "translateY(-3vh)" }}>
            <button
              type="button"
              onClick={() => router.push("/formulario")}
              className="w-full rounded-full bg-teal-400 px-5 font-semibold text-slate-950 shadow-lg transition-colors hover:bg-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              style={{
                paddingTop: "clamp(0.8rem, 3.5vh, 1.6rem)",
                paddingBottom: "clamp(0.8rem, 3.5vh, 1.6rem)",
                fontSize: "clamp(0.85rem, 4vh, 1.5rem)",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                Vender meu carro agora
                <ArrowRight style={{ width: "clamp(1rem, 4vh, 1.6rem)", height: "clamp(1rem, 4vh, 1.6rem)" }} />
              </span>
            </button>
          </div>
        </section>

        {/* Stats */}
        <section
          className="relative z-10 grid grid-cols-3 gap-3 shrink-0"
          style={{ height: "18vh", minHeight: "90px" }}
        >
          {[
            { icon: Users, value: "+ 30 MIL", label: "Compradores" },
            { icon: Clock, value: "OFERTAS", label: "Em até 30 mins" },
            { icon: ClipboardCheck, value: "AVALIAÇÃO", label: "Justa e rápida" },
          ].map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-800 bg-slate-950/40 text-center backdrop-blur flex flex-col items-center justify-center"
              style={{ padding: "2vh 0.5rem" }}
            >
              <Icon style={{ width: "clamp(1.2rem, 5vh, 2rem)", height: "clamp(1.2rem, 5vh, 2rem)" }} className="text-teal-400" />
              <p
                className="font-semibold leading-none text-teal-400"
                style={{ fontSize: "clamp(0.7rem, 3.2vh, 1.1rem)", marginTop: "1vh" }}
              >
                {value}
              </p>
              <p
                className="text-slate-200"
                style={{ fontSize: "clamp(0.6rem, 2.5vh, 0.9rem)", marginTop: "0.5vh" }}
              >
                {label}
              </p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer
          className="relative z-10 text-center shrink-0 flex items-center justify-center"
          style={{ height: "4vh" }}
        >
          <p
            className="font-medium tracking-widest text-teal-400"
            style={{ fontSize: "clamp(0.7rem, 3vh, 1.1rem)" }}
          >
            www.totexmotors.com
          </p>
        </footer>

      </div>
    </main>
  );
}
