"use client";

import { useEffect } from "react";

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
};

type FullscreenHTMLElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

function isFullscreen(doc: FullscreenDocument): boolean {
  return Boolean(
    doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement,
  );
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

async function requestFullscreen(element: FullscreenHTMLElement): Promise<void> {
  const anyElement = element as FullscreenHTMLElement;

  const request:
    | ((options?: FullscreenOptions) => Promise<void>)
    | (() => Promise<void> | void)
    | undefined =
    element.requestFullscreen ||
    anyElement.webkitRequestFullscreen ||
    anyElement.mozRequestFullScreen ||
    anyElement.msRequestFullscreen;

  if (!request) return;

  try {
    const result = (request as (options?: FullscreenOptions) => Promise<void>)(
      {
        navigationUI: "hide",
      },
    );

    if (result && typeof (result as Promise<void>).then === "function") {
      await result;
    }

    return;
  } catch {
    // Alguns métodos prefixados não aceitam options; tenta de novo sem options.
  }

  const result = (request as () => Promise<void> | void)();
  if (result && typeof (result as Promise<void>).then === "function") {
    await result;
  }
}

export default function AutoFullscreen({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    const doc = document as FullscreenDocument;
    const root = document.documentElement as FullscreenHTMLElement;
    const android = isAndroid();

    // No Android, tenta fullscreen direto (Android permite sem gesto).
    const attempt = async () => {
      if (isFullscreen(doc)) return;
      try {
        await requestFullscreen(root);
      } catch {
        // Normal: browsers exigem gesto do usuário em desktop.
      }
    };

    // Tenta fullscreen imediatamente no Android.
    if (android) {
      void attempt();
    }

    // Listener para re-tentar ou forçar no primeiro gesto.
    const onUserGesture = () => {
      void attempt();
    };

    // Captura cedo pra funcionar em qualquer tela/rota.
    window.addEventListener("pointerdown", onUserGesture, true);
    window.addEventListener("touchstart", onUserGesture, true);
    window.addEventListener("keydown", onUserGesture, true);

    // No Android, também desabilita comportamentos do browser pra evitar barra de navegação.
    if (android) {
      // Impede scroll overflow que força barra de navegação do browser.
      const preventScroll = (e: TouchEvent) => {
        e.preventDefault();
      };
      document.addEventListener("touchmove", preventScroll, { passive: false });

      // Meta tag pra esconder UI do navegador (já deve estar no viewport).
      let viewportMeta = document.querySelector(
        'meta[name="viewport"]',
      ) as HTMLMetaElement | null;
      if (!viewportMeta) {
        viewportMeta = document.createElement("meta");
        viewportMeta.name = "viewport";
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.content =
        "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no";

      return () => {
        window.removeEventListener("pointerdown", onUserGesture, true);
        window.removeEventListener("touchstart", onUserGesture, true);
        window.removeEventListener("keydown", onUserGesture, true);
        document.removeEventListener("touchmove", preventScroll);
      };
    }

    return () => {
      window.removeEventListener("pointerdown", onUserGesture, true);
      window.removeEventListener("touchstart", onUserGesture, true);
      window.removeEventListener("keydown", onUserGesture, true);
    };
  }, [enabled]);

  return null;
}
