"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Clock, ClipboardCheck, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white flex flex-col">
      <div className="flex flex-col flex-1 w-full px-6 pt-10 pb-8">

        {/* Logo */}
        <header className="flex justify-center mb-8">
          <img
            src="/imports/logo_totex.png"
            alt="Totex Motors"
            style={{ height: "clamp(56px, 14vw, 96px)", width: "auto" }}
          />
        </header>

        {/* Hero */}
        <section className="relative flex-1 flex flex-col justify-center">
          <img
            src="/imports/fotocaratotex.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none"
            style={{ width: "clamp(280px, 65vw, 500px)" }}
          />

          <div
            className="relative z-10"
          >
            <h1
              className="font-serif text-teal-400 leading-[0.88]"
              style={{ fontSize: "clamp(2.8rem, 14vw, 5.5rem)" }}
            >
              <span className="block">VENDA</span>
              <span className="block">SEU CARRO</span>
            </h1>

            <p
              className="mt-5 text-slate-200 font-medium"
              style={{ fontSize: "clamp(1.1rem, 5.5vw, 2rem)" }}
            >
              Em até 30 minutos
            </p>

            <button
              type="button"
              onClick={() => router.push("/formulario")}
              className="mt-7 w-full rounded-full bg-teal-400 px-6 font-semibold text-slate-950 shadow-lg transition-colors hover:bg-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              style={{
                paddingTop: "clamp(1rem, 4.5vw, 1.8rem)",
                paddingBottom: "clamp(1rem, 4.5vw, 1.8rem)",
                fontSize: "clamp(1rem, 4.8vw, 1.6rem)",
              }}
            >
              <span className="flex items-center justify-center gap-3">
                Vender meu carro agora
                <ArrowRight
                  style={{
                    width: "clamp(1.1rem, 5vw, 1.8rem)",
                    height: "clamp(1.1rem, 5vw, 1.8rem)",
                  }}
                />
              </span>
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="relative z-10 mt-8 grid grid-cols-3 gap-3">
          {[
            {
              icon: <Users style={{ width: "clamp(1.5rem, 7vw, 2.5rem)", height: "clamp(1.5rem, 7vw, 2.5rem)" }} className="text-teal-400" />,
              value: "+ 30 MIL",
              label: "Compradores",
            },
            {
              icon: <Clock style={{ width: "clamp(1.5rem, 7vw, 2.5rem)", height: "clamp(1.5rem, 7vw, 2.5rem)" }} className="text-teal-400" />,
              value: "OFERTAS",
              label: "Em até 30 mins",
            },
            {
              icon: <ClipboardCheck style={{ width: "clamp(1.5rem, 7vw, 2.5rem)", height: "clamp(1.5rem, 7vw, 2.5rem)" }} className="text-teal-400" />,
              value: "AVALIAÇÃO",
              label: "Justa e rápida",
            },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-center backdrop-blur flex flex-col items-center"
            >
              {icon}
              <p
                className="mt-3 font-semibold leading-none text-teal-400"
                style={{ fontSize: "clamp(0.85rem, 3.8vw, 1.3rem)" }}
              >
                {value}
              </p>
              <p
                className="mt-1 text-slate-200"
                style={{ fontSize: "clamp(0.7rem, 3vw, 1rem)" }}
              >
                {label}
              </p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="relative z-10 mt-6 text-center">
          <p
            className="font-medium tracking-widest text-teal-400"
            style={{ fontSize: "clamp(0.8rem, 3.5vw, 1.2rem)" }}
          >
            www.totexmotors.com
          </p>
        </footer>

      </div>
    </main>
  );
}
