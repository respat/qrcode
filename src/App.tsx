import React, { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import QRCodeStyling from "qr-code-styling";
import CookieConsent from "react-cookie-consent";

const GA_MEASUREMENT_ID = "G-WECQ2QKPBJ"; // ← ide a te GA4 ID-d

// --- Globális típusok ---
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    kofiWidgetOverlay?: {
      draw: (id: string, options: Record<string, any>) => void;
    };
  }
}

// --- QR-kód inicializálása a komponensen kívül ---
const qrCode = new QRCodeStyling({
  width: 250,
  height: 250,
  type: "svg",
  data: "https://www.boostora.co",
  image: "",
  dotsOptions: { color: "#2563eb", type: "square" },
  backgroundOptions: { color: "transparent" },
  imageOptions: { crossOrigin: "anonymous", margin: 5 },
  cornersSquareOptions: { color: "#2563eb", type: "extra-rounded" },
  cornersDotOptions: { color: "#2563eb" },
});

const App: React.FC = () => {
  const [qrValue, setQrValue] = useState("https://www.boostora.co");
  const [fgColor, setFgColor] = useState("#2563eb");
  const [dotStyle, setDotStyle] = useState("square");
  const [logoUrl, setLogoUrl] = useState("");
  const [cookiesAccepted, setCookiesAccepted] = useState(() => {
    try {
      return document.cookie
        .split(";")
        .some((c) => c.trim().startsWith("qrGeneratorConsent="));
    } catch {
      return false;
    }
  });

  const ref = useRef<HTMLDivElement>(null);

  // === 1. QRCode DOM-hoz kapcsolása ===
  useEffect(() => {
    if (ref.current && ref.current.children.length === 0) {
      qrCode.append(ref.current);
    }
  }, []);

  // === 2. GA4 betöltése (csak ha cookie elfogadva) ===
  useEffect(() => {
    if (!cookiesAccepted) return;

    const gaSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

    if (document.querySelector(`script[src="${gaSrc}"]`)) return;

    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = gaSrc;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);

    script1.onload = () => {
      console.log("✅ GA4 script betöltődött és inicializálva");
    };
  }, [cookiesAccepted]);

  // === 2/b. Ko-fi widget betöltése ===
  useEffect(() => {
    const scriptSrc = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    if (document.querySelector(`script[src="${scriptSrc}"]`)) return;

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => {
      if (window.kofiWidgetOverlay) {
        window.kofiWidgetOverlay.draw("boostoraqr", {
          type: "floating-chat",
          "floating-chat.donateButton.text": "Support Us",
          "floating-chat.donateButton.background-color": "#5bc0de",
          "floating-chat.donateButton.text-color": "#323842",
        });
        console.log("💙 Ko-fi widget aktiválva");
      }
    };
    document.body.appendChild(script);
  }, []);

  // === 3. QR frissítés minden változásra ===
  useEffect(() => {
    qrCode.update({
      data: qrValue,
      dotsOptions: {
        color: fgColor,
        type: dotStyle as "square" | "dots" | "rounded",
      },
      cornersSquareOptions: { color: fgColor },
      cornersDotOptions: { color: fgColor },
      image: logoUrl,
    });
  }, [qrValue, fgColor, dotStyle, logoUrl]);

  // === 4. Logó feltöltés ===
  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setLogoUrl(URL.createObjectURL(file));
    else setLogoUrl("");
  };

  // === 5. QR letöltés + GA4 esemény ===
  const downloadQRCode = () => {
    qrCode.download({ extension: "png", name: "boostora-qr" });

    if (typeof window.gtag === "function") {
      window.gtag("event", "download_qr", {
        event_category: "QR Generator",
        event_label: qrValue,
        value: 1,
      });
      console.log("📊 GA4 esemény: download_qr elküldve");
    } else {
      console.log("⚠️ gtag nincs inicializálva, esemény nem lett elküldve");
    }
  };

  // === 6. Render ===
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 text-gray-900">
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-300/60 p-6 sm:p-10 w-full max-w-sm text-center space-y-6">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            QR CODE GENERATOR
          </h1>
          <p className="text-gray-500 text-sm">
            Create and download your own QR code for FREE.
          </p>
        </header>

        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-inner">
            <div ref={ref} className="w-[250px] h-[250px] mx-auto" />
          </div>
        </div>

        <div className="space-y-4 text-left border-t pt-6">
          <section>
            <label
              htmlFor="qr-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content (URL or Text)
            </label>
            <input
              id="qr-input"
              type="text"
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              placeholder="https://www.yourpage.com"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            />
          </section>

          <div className="flex flex-col sm:flex-row gap-4">
            <section className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
            </section>

            <section className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <select
                value={dotStyle}
                onChange={(e) => setDotStyle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500"
              >
                <option value="square">Square</option>
                <option value="dots">Dots</option>
                <option value="rounded">Rounded</option>
              </select>
            </section>
          </div>

          <section>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </section>
        </div>

        <button
          onClick={downloadQRCode}
          className="w-full mt-6 px-8 py-3 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-400/50 hover:bg-blue-700 transform hover:scale-[1.02] transition"
        >
          Download
        </button>
      </div>

      <div className="mt-8 w-full max-w-sm text-center p-4 border-2 border-dashed border-gray-300 bg-white rounded-xl shadow-md">
        <p className="text-sm text-gray-600">Support Boostora 💙</p>
      </div>

      <CookieConsent
        location="bottom"
        buttonText="Elfogadom"
        cookieName="qrGeneratorConsent"
        style={{ background: "#2B373B", fontSize: "14px" }}
        buttonStyle={{
          color: "#ffffff",
          fontSize: "13px",
          background: "#2563eb",
          borderRadius: "8px",
          padding: "8px 16px",
        }}
        expires={150}
        onAccept={() => setCookiesAccepted(true)}
      >
        This site uses cookies for analytics and preferences.{" "}
        <a
          href="/adatvedelem"
          style={{ color: "#2563eb", textDecoration: "underline" }}
        >
          Privacy Policy
        </a>
      </CookieConsent>
    </div>
  );
};

export default App;
