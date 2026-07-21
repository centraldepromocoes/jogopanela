document.addEventListener("DOMContentLoaded", () => {
  // Troque o link abaixo pelo checkout real.
  const CHECKOUT_URL = "https://pagamento.centraldepagamentos.org/checkout?product=60dca249-8559-11f1-a1eb-46da4690ad53";

  document.querySelectorAll(".checkout-link").forEach((link) => {
    link.href = CHECKOUT_URL;
  });

  // Contagem regressiva por sessão. Reinicia quando uma nova sessão é aberta.
  const STORAGE_KEY = "oferta_panelas_expira_em";
  const DURATION = 15 * 60 * 1000;
  let expiresAt = Number(sessionStorage.getItem(STORAGE_KEY));

  if (!expiresAt || expiresAt <= Date.now()) {
    expiresAt = Date.now() + DURATION;
    sessionStorage.setItem(STORAGE_KEY, String(expiresAt));
  }

  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateTimer() {
    let remaining = Math.max(0, expiresAt - Date.now());

    if (remaining === 0) {
      expiresAt = Date.now() + DURATION;
      sessionStorage.setItem(STORAGE_KEY, String(expiresAt));
      remaining = DURATION;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  // Animações leves de entrada.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  // Eventos prontos para Google Ads / TikTok Pixel.
  document.querySelectorAll(".checkout-link").forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "begin_checkout", {
          currency: "BRL",
          value: 19.90,
          items: [{ item_name: "Jogo de Panelas Completo", price: 19.90 }]
        });
      }

      if (window.ttq && typeof window.ttq.track === "function") {
        window.ttq.track("InitiateCheckout", {
          content_name: "Reserva Jogo de Panelas - Frete",
          value: 19.90,
          currency: "BRL"
        });
      }
    });
  });
});
