import "./globals.css";
import { AppProvider } from "@/app/context/AppContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import fs from "fs";
import path from "path";

// Dynamic asset copying from Downloads (simulated asset sync)
try {
  const downloadsDir = "C:\\Users\\Win 11\\Downloads";
  const publicDir = path.join(process.cwd(), "public");
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Copy logo
  const logoSrc = path.join(downloadsDir, "logo (1).png");
  const logoDest = path.join(publicDir, "logo.png");
  if (fs.existsSync(logoSrc)) {
    fs.copyFileSync(logoSrc, logoDest);
    console.log("CAR-GO Setup: Successfully copied logo (1).png to public/logo.png");
  }

  // Copy footer logo
  const footerLogoSrc = "C:\\Users\\Win 11\\.gemini\\antigravity-ide\\brain\\5056c575-d657-4dad-8107-487393674fa0\\media__1781428251836.png";
  const footerLogoDest = path.join(publicDir, "logo-footer.png");
  if (fs.existsSync(footerLogoSrc)) {
    fs.copyFileSync(footerLogoSrc, footerLogoDest);
    console.log("CAR-GO Setup: Successfully copied media__1781428251836.png to public/logo-footer.png");
  }

  // Copy fleet car image (Fiat 500)
  const carImgSrc = "C:\\Users\\Win 11\\.gemini\\antigravity-ide\\brain\\5056c575-d657-4dad-8107-487393674fa0\\media__1781429391184.png";
  const carImgDest = path.join(publicDir, "fiat500.png");
  if (fs.existsSync(carImgSrc)) {
    fs.copyFileSync(carImgSrc, carImgDest);
    console.log("CAR-GO Setup: Successfully copied media__1781429391184.png to public/fiat500.png");
  }

  // Copy Skoda Fabia image
  const skodaImgSrc = "C:\\Users\\Win 11\\.gemini\\antigravity-ide\\brain\\5056c575-d657-4dad-8107-487393674fa0\\skoda_fabia_1781429575119.png";
  const skodaImgDest = path.join(publicDir, "skoda-fabia.png");
  if (fs.existsSync(skodaImgSrc)) {
    fs.copyFileSync(skodaImgSrc, skodaImgDest);
    console.log("CAR-GO Setup: Successfully copied skoda_fabia_1781429575119.png to public/skoda-fabia.png");
  }

  // Copy Toyota Corolla image
  const toyotaImgSrc = "C:\\Users\\Win 11\\.gemini\\antigravity-ide\\brain\\5056c575-d657-4dad-8107-487393674fa0\\toyota_corolla_1781429590120.png";
  const toyotaImgDest = path.join(publicDir, "toyota-corolla.png");
  if (fs.existsSync(toyotaImgSrc)) {
    fs.copyFileSync(toyotaImgSrc, toyotaImgDest);
    console.log("CAR-GO Setup: Successfully copied toyota_corolla_1781429590120.png to public/toyota-corolla.png");
  }

  // Copy Hyundai Tucson image
  const hyundaiImgSrc = "C:\\Users\\Win 11\\.gemini\\antigravity-ide\\brain\\5056c575-d657-4dad-8107-487393674fa0\\hyundai_tucson_1781429604004.png";
  const hyundaiImgDest = path.join(publicDir, "hyundai-tucson.png");
  if (fs.existsSync(hyundaiImgSrc)) {
    fs.copyFileSync(hyundaiImgSrc, hyundaiImgDest);
    console.log("CAR-GO Setup: Successfully copied hyundai_tucson_1781429604004.png to public/hyundai-tucson.png");
  }

  // Copy BMW 3 Series image
  const bmwImgSrc = "C:\\Users\\Win 11\\.gemini\\antigravity-ide\\brain\\5056c575-d657-4dad-8107-487393674fa0\\bmw_3_series_1781429631737.png";
  const bmwImgDest = path.join(publicDir, "bmw-3.png");
  if (fs.existsSync(bmwImgSrc)) {
    fs.copyFileSync(bmwImgSrc, bmwImgDest);
    console.log("CAR-GO Setup: Successfully copied bmw_3_series_1781429631737.png to public/bmw-3.png");
  }

  // Copy favicon
  const favSrc = path.join(downloadsDir, "favicon.png");
  const favDest = path.join(publicDir, "favicon.png");
  if (fs.existsSync(favSrc)) {
    fs.copyFileSync(favSrc, favDest);
    console.log("CAR-GO Setup: Successfully copied favicon.png to public/favicon.png");
  }
} catch (e) {
  console.log("CAR-GO Asset copy skipped or failed:", e.message);
}

export const metadata = {
  title: "CAR-GO.PL | Premium Car Rental & Delivery Services",
  description: "Bilingual car rental service based in Skarbimierz-Osiedle, Oława, Grodków, and Brzeg. Fast booking, transparent pricing, custom delivery address, and premium customer service.",
  metadataBase: new URL("https://car-go.pl"),
  openGraph: {
    title: "CAR-GO.PL | Premium Car Rental",
    description: "Rent premium vehicles with unlimited mileage, no hidden costs, and options for direct home delivery. Easy booking in Polish & English.",
    url: "https://car-go.pl",
    siteName: "CAR-GO.PL",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-brand-red selection:text-white">
        <AppProvider>
          <Header />
          <main className="flex-grow pt-36 pb-12">
            {children}
          </main>
          <ProviderFooterWrapper />
        </AppProvider>
      </body>
    </html>
  );
}

// Separate component to wrap Footer in order to avoid React client/server context hydration warnings
function ProviderFooterWrapper() {
  return <Footer />;
}
