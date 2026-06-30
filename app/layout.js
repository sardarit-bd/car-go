import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { AppProvider } from "@/app/context/AppContext";
import "./globals.css";
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
    icon: "/favicon-1.png",
  }
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-1.png" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-brand-red selection:text-white">
        <AppProvider>
          <Header />
          <main className="flex-grow pt-10 lg:pt-0  pb-0">
            {children}
          </main>
          <ProviderFooterWrapper />
        </AppProvider>
      </body>
    </html>
  );
}


function ProviderFooterWrapper() {
  return <Footer />;
}
