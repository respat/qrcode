import React, { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react"; // ⭐️ JAVÍTVA: ChangeEvent típust type-only importként beilleszteni

import QRCodeStyling from "qr-code-styling";
import CookieConsent from "react-cookie-consent";

// A 'qr-code-styling' inicializálása a komponensen kívül
const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
    type: "svg",
    data: "https://www.hello.hu",
    image: "",
    dotsOptions: {
        color: "#2563eb",
        type: "square",
    },
    backgroundOptions: {
        color: "transparent",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
    },
    cornersSquareOptions: {
        color: "#2563eb",
        type: "extra-rounded",
    },
    cornersDotOptions: {
        color: "#2563eb",
    },
});

const App: React.FC = () => {
    const [qrValue, setQrValue] = useState<string>("https://www.hello.hu");
    const [fgColor, setFgColor] = useState<string>("#2563eb");
    const [dotStyle, setDotStyle] = useState<string>("square");
    const [logoUrl, setLogoUrl] = useState<string>("");

    // A DOM elem (div) referenciájának tipizálása: HTMLDivElement | null
    const ref = useRef<HTMLDivElement>(null);

    // === 1. QRCode Inicializálása és DOM-hoz kapcsolása ===
    useEffect(() => {
        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, []);

    // === 2. QRCode Adat Frissítése ===
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

    // === 3. Hirdetési Szkript Betöltése (ÚJ) ===
    useEffect(() => {
        // Ellenőrizzük, hogy a környezetben elérhető-e a 'window'/'document' (kliens oldalon vagyunk-e)
        if (typeof document === 'undefined') {
            return;
        }

        const script = document.createElement("script");

        // Beállítjuk az attribútumokat
        script.async = true;
        script.setAttribute("data-cfasync", "false"); 
        script.src = "//pl27967415.effectivegatecpm.com/224a237a7ea5ffd150d9b7f259f23d91/invoke.js";
        
        // Hozzáadjuk a <body>-hoz
        document.body.appendChild(script);

        // Cleanup funkció: Töröljük a szkriptet a komponens eltávolításakor
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []); 

    // Kép feltöltés, lokális URL generálásával (Esemény tipizálása)
    const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            setLogoUrl(URL.createObjectURL(file));
        } else {
            setLogoUrl("");
        }
    };

    // Letöltés funkció
    const downloadQRCode = () => {
        qrCode.download({ extension: "png", name: "branded-qrcode" });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 text-gray-900">
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
                        <div ref={ref} className="w-[250px] h-[250px] mx-auto" />
                    </div>
                </div>

                {/* BEÁLLÍTÁSOK (INPUTOK) */}
                <div className="space-y-4 text-left border-t pt-6">
                    {/* ... (Content input) */}
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setQrValue(e.target.value)
                            }
                            placeholder="Pl.: https://www.az-oldalad.hu"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-base"
                        />
                    </section>

                    {/* SZÍN ÉS STÍLUS (Dot style) */}
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setFgColor(e.target.value)
                                    }
                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                                />
                            </div>
                        </section>

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
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setDotStyle(e.target.value)
                                }
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
            
            {/* ⬅️ ITT VAN A MÓDOSÍTOTT RÉSZ ⬇️ */}
            <div className="mt-8 w-full max-w-sm text-center p-4 border-2 border-dashed border-gray-300 bg-white rounded-xl shadow-md">
                {/* A hirdetési konténer ID-vel */}
                <div id="container-224a237a7ea5ffd150d9b7f259f23d91"></div>
            </div>
            {/* ⬅️ MÓDOSÍTOTT RÉSZ VÉGE ⬆️ */}

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
                expires={150} // 150 napig tárolja a beleegyezést
            >
                Ez az oldal cookie-kat használ a felhasználói élmény javítására és
                hirdetések megjelenítésére (AdSense, Analytics).{" "}
                <a
                    href="/adatvedelem"
                    style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                    Adatvédelmi tájékoztató
                </a>
            </CookieConsent>
        </div>
    );
};

export default App;
