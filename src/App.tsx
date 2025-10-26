import React, { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

// A QRCodeStyling objektum inicializálása a komponensen kívül
// Ez a könyvtár nem React komponens, hanem egy osztály!
const qrCode = new QRCodeStyling({
  width: 250,
  height: 250,
  type: "svg",
  data: "https://www.hello.hu",
  image: "",
  dotsOptions: {
    color: "#2563eb",
    type: "square", // Kezdeti forma: négyzetes
  },
  backgroundOptions: {
    color: "transparent", // Átlátszó háttér
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 5,
  },
  // ⭐️ ÚJ: Megjelenés a referenciaképhez hasonló stílusban
  cornersSquareOptions: {
    color: "#2563eb",
    type: "extra-rounded", // Extra kerekített sarkok a referenciaképhez
  },
  cornersDotOptions: {
    color: "#2563eb",
  },
});

function App() {
  const [qrValue, setQrValue] = useState("https://www.hello.hu");
  const [fgColor, setFgColor] = useState("#2563eb");
  const [dotStyle, setDotStyle] = useState("square"); // Kezdeti pont stílus
  const [logoUrl, setLogoUrl] = useState("");

  // A DOM elem (div) referenciája, ahova a kód rajzolódik
  const ref = useRef(null);

  // === 1. QRCode Inicializálása és DOM-hoz kapcsolása (Csak egyszer fut le) ===
  useEffect(() => {
    // A könyvtár a ref-re rajzolja a kódot
    qrCode.append(ref.current);
  }, []);

  // === 2. QRCode Adat Frissítése (Minden State változáskor fut) ===
  useEffect(() => {
    // Frissítjük a kód adatát
    qrCode.update({
      data: qrValue,
      dotsOptions: {
        color: fgColor,
        type: dotStyle, // Az egyedi forma beállítása
      },
      cornersSquareOptions: { color: fgColor },
      cornersDotOptions: { color: fgColor },
      image: logoUrl,
    });
  }, [qrValue, fgColor, dotStyle, logoUrl]);

  // Kép feltöltés, lokális URL generálásával
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    } else {
      setLogoUrl(""); // Törlés, ha nem választott ki fájlt
    }
  };

  // Letöltés funkció a beépített metódussal
  const downloadQRCode = () => {
    // Letöltés PNG formátumban
    qrCode.download({ extension: "png", name: "branded-qrcode" });
  };

  return (
    // Középre igazított, világos háttér (Kártya váz)
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 text-gray-900">
      {/* FŐ KÁRTYA KONTÉNER */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-300/60 p-6 sm:p-10 w-full max-w-sm text-center space-y-6">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            QR CODE GENERATOR
          </h1>
          <p className="text-gray-500 text-sm">
            Download your own QR CODE for FREE.
          </p>
        </header>

        {/* QR KÓD MEGJELENÍTÉSE (A ref ide mutat) */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-inner">
            {/* ⭐️ ÚJ: Ref hozzárendelése, a kód ide rajzolódik */}
            <div ref={ref} className="w-[250px] h-[250px] mx-auto" />
          </div>
        </div>

        {/* BEÁLLÍTÁSOK (INPUTOK) */}
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
              placeholder="Pl.: https://www.az-oldalad.hu"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-base"
            />
          </section>

          {/* SZÍN ÉS STÍLUS (Dot style) */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* SZÍN VÁLASZTÓ */}
            <section className="flex-1">
              <label
                htmlFor="color-picker"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="color-picker"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
              </div>
            </section>

            {/* PONT STÍLUS VÁLASZTÓ */}
            <section className="flex-1">
              <label
                htmlFor="dot-style"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Code style
              </label>
              <select
                id="dot-style"
                value={dotStyle}
                onChange={(e) => setDotStyle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 text-base"
              >
                <option value="square">Rectangle</option>
                <option value="dots">Dots</option>
                <option value="rounded">Rounded</option>
              </select>
            </section>
          </div>

          {/* LOGÓ FELTÖLTÉS */}
          <section>
            <label
              htmlFor="logo-upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Logo image
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full text-sm text-gray-500
                file:mr-2 file:py-2 file:px-3
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 transition duration-150"
            />
          </section>
        </div>

        {/* LETÖLTÉS GOMB */}
        <button
          onClick={downloadQRCode}
          className="w-full mt-6 px-8 py-3 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-400/50 
                     hover:bg-blue-700 transform hover:scale-[1.02] transition duration-200 flex items-center justify-center space-x-2"
        >
          <span>Download</span>
        </button>
      </div>

      {/* HIRDETÉSI ZÓNA */}
      <div className="mt-8 w-full max-w-sm text-center p-4 border-2 border-dashed border-gray-300 bg-white rounded-xl shadow-md">
        <p className="text-gray-700 font-semibold">
          Google AdSense Hirdetés Helye
        </p>
      </div>
    </div>
  );
}

export default App;
