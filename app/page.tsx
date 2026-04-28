"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Clock, ClipboardCheck, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="mx-auto max-w-md px-6 pt-10 pb-12">
        <header className="flex justify-center">
          <img
            src="/imports/logo_totex.png"
            alt="Totex Motors"
            className="h-14 w-auto sm:h-16"
          />
        </header>

        <section className="relative mt-10">
          <img
            src="/imports/fotocaratotex.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-[-1rem] w-52 select-none sm:w-60 md:w-72"
          />

          <div className="relative z-10 pr-28 sm:pr-36 md:pr-44">
            <h1 className="font-serif text-5xl leading-[0.9] text-teal-400 sm:text-6xl">
              <span className="block">VENDA</span>
              <span className="block">SEU CARRO</span>
            </h1>

            <p className="mt-5 text-xl text-slate-200 sm:text-2xl">
              Em até 30 minutos
            </p>

            <button
              type="button"
              onClick={() => router.push("/formulario")}
              className="mt-7 w-full rounded-full bg-teal-400 px-6 py-4 text-lg font-semibold text-slate-950 shadow-lg transition-colors hover:bg-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:text-xl"
            >
              <span className="flex items-center justify-center gap-3">
                Vender meu carro agora
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
            </button>
          </div>
        </section>

        <section className="relative z-10 mt-10 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-center backdrop-blur">
            <Users className="mx-auto h-8 w-8 text-teal-400" />
            <p className="mt-3 text-base font-semibold leading-none text-teal-400 sm:text-lg">
              + 30 MIL
            </p>
            <p className="mt-1 text-xs text-slate-200 sm:text-sm">Compradores</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-center backdrop-blur">
            <Clock className="mx-auto h-8 w-8 text-teal-400" />
            <p className="mt-3 text-base font-semibold leading-none text-teal-400 sm:text-lg">
              OFERTAS
            </p>
            <p className="mt-1 text-xs text-slate-200 sm:text-sm">Em até 30 mins</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-center backdrop-blur">
            <ClipboardCheck className="mx-auto h-8 w-8 text-teal-400" />
            <p className="mt-3 text-base font-semibold leading-none text-teal-400 sm:text-lg">
              AVALIAÇÃO
            </p>
            <p className="mt-1 text-xs text-slate-200 sm:text-sm">Justa e rápida</p>
          </div>
        </section>

        <footer className="relative z-10 mt-12 text-center">
          <p className="text-sm font-medium tracking-widest text-teal-400 sm:text-base">
            www.totexmotors.com
          </p>
        </footer>
      </div>
    </main>
  );
}
