"use client";

import { useApp } from "@/app/context/AppContext";
import { ArrowLeft, Calendar, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { blogPosts } from "../page";

export default function BlogPost() {
  const router = useRouter();
  const { id } = useParams();
  const { lang, t } = useApp();

  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Wpis nie został znaleziony / Article Not Found</h2>
        <Link href="/blog" className="inline-flex items-center space-x-1 text-brand-red hover:underline font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Powrót do bloga / Return to blog</span>
        </Link>
      </div>
    );
  }

  const title = lang === "pl" ? post.titlePl : post.titleEn;
  const readTime = lang === "pl" ? post.readTimePl : post.readTimeEn;

  // Render post contents dynamically depending on ID and Language
  const renderContent = () => {
    if (id === "stress-free-rental-tips") {
      return lang === "pl" ? (
        <div className="space-y-6 text-sm text-slate-650 leading-relaxed font-medium">
          <p className="text-base text-slate-800 font-bold">Wynajem samochodu powinien być prosty i przyjemny. Niestety, brak uwagi przy podpisywaniu umowy lub odbiorze pojazdu może skutkować nieprzewidzianymi kosztami. Oto 5 najważniejszych porad, które pomogą Ci uniknąć problemów:</p>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">1. Wybierz odpowiedni pakiet ochrony (Ubezpieczenie)</h3>
            <p>Podstawowe ubezpieczenie zazwyczaj zawiera udział własny w szkodzie (np. do 5000 PLN). Jeśli chcesz uniknąć stresu związanego z ewentualnymi zarysowaniami na parkingu, wybierz pakiet Gold lub Platinum. W pakiecie Platinum Twój udział własny wynosi 0 PLN, a kaucja jest całkowicie zniesiona.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">2. Dokładnie sprawdź auto przy odbiorze</h3>
            <p>Przed odjechaniem z punktu odbioru, obejdź samochód z pracownikiem wypożyczalni. Upewnij się, że wszystkie istniejące rysy, wgniecenia czy odpryski na szybach są zaznaczone w protokole zdawczo-odbiorczym. Dobrym nawykiem jest zrobienie kilku zdjęć lub krótkiego filmu smartfonem.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">3. Zapoznaj się z polityką paliwową</h3>
            <p>W CAR-GO.PL stosujemy najprostszą i najbardziej uczciwą zasadę: odbierasz auto z pełnym bakiem i zwracasz je również zatankowane do pełna. Oddanie auta z niepełnym zbiornikiem wiąże się z dodatkową opłatą za tankowanie według cennika.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">4. Przestrzegaj limitów i terytorium</h3>
            <p>Niektóre wypożyczalnie narzucają dobowe limity kilometrów. W naszej firmie oferujemy nielimitowany przebieg na obszarze Polski. Jeśli planujesz wyjazd za granicę, koniecznie zgłoś to wcześniej w celu uzyskania pisemnej zgody.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">5. Zwróć samochód na czas</h3>
            <p>Spóźnienia mogą skutkować naliczeniem kary za kolejną dobę wynajmu. Jeśli wiesz, że spóźnisz się z powodu korków lub nieprzewidzianych okoliczności, skontaktuj się z naszą infolinią supportu odpowiednio wcześniej.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-sm text-slate-650 leading-relaxed font-medium">
          <p className="text-base text-slate-800 font-bold">Renting a car should be simple and pleasant. However, lack of attention when signing the contract or collecting the vehicle can result in unexpected fees. Here are the top 5 tips to help you avoid common pitfalls:</p>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">1. Choose the Right Protection Package (Insurance)</h3>
            <p>Basic insurance usually includes a deductible in case of damage (e.g. up to 5000 PLN). If you want to avoid stress associated with parking lot scratches, choose the Gold or Platinum package. In the Platinum package, your deductible is 0 PLN, and the security deposit is waived.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">2. Inspect the Car Thoroughly Upon Collection</h3>
            <p>Before leaving the station, walk around the vehicle with the rental employee. Ensure all existing scratches, dents, or windshield chips are marked in the handover protocol. Taking a few photos or a short video with your smartphone is a great habit.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">3. Understand the Fuel Policy</h3>
            <p>At CAR-GO.PL we practice the most transparent and fair rule: full-to-full. You collect the car with a full tank and return it fully refueled. Returning the car with less than a full tank will incur an additional refueling fee.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">4. Observe Mileage Limits and Territorial Restrictions</h3>
            <p>Some rental companies impose daily mileage limits. We offer unlimited mileage in Poland. If you plan to drive abroad, please notify us in advance to obtain written consent.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">5. Return the Vehicle On Time</h3>
            <p>Delays may result in fees for an additional day of rental. If you know you will be late due to traffic or unexpected events, contact our support hotline in advance.</p>
          </div>
        </div>
      );
    }

    if (id === "long-term-vs-short-term") {
      return lang === "pl" ? (
        <div className="space-y-6 text-sm text-slate-650 leading-relaxed font-medium">
          <p className="text-base text-slate-800 font-bold">Rozwój mobilności przyniósł alternatywne sposoby pozyskiwania pojazdów. Dziś firmy i osoby prywatne coraz częściej rezygnują z tradycyjnego zakupu lub leasingu na rzecz elastycznego wynajmu. Porównajmy wynajem długoterminowy z krótkoterminowym:</p>

          <div className="space-y-2.5">
            <h3 className="text-base font-extrabold text-slate-800">Wynajem Krótkoterminowy (1 - 30 dni)</h3>
            <p>Idealne rozwiązanie na weekendowe wyjazdy, podróże służbowe lub jako auto zastępcze. Główną zaletą jest szybkość rezerwacji i brak zobowiązań. Możesz wynająć auto na 1 dobę, załatwić sprawy w Oławie czy Brzegu i oddać pojazd bez żadnych dalszych kosztów.</p>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-base font-extrabold text-slate-800">Wynajem Długoterminowy (Powyżej 1 miesiąca)</h3>
            <p>To znakomita alternatywa dla leasingu. Płacisz stałą ratę miesięczną, która pokrywa pełną obsługę eksploatacyjną: ubezpieczenie OC/AC, wymianę opon, okresowe serwisy i przeglądy. Nie obciążasz zdolności kredytowej firmy, a ratę możesz w całości wliczyć w koszty uzyskania przychodu.</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 mt-4">
            <h4 className="font-bold text-slate-800">Główne różnice w pigułce:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Formalności:</strong> W wynajmie długoterminowym umowa jest uproszczona w porównaniu do procedury leasingowej.</li>
              <li><strong>Cena za dobę:</strong> Stawka dobowa w wynajmie długoterminowym jest znacznie niższa niż przy wynajmie na kilka dni.</li>
              <li><strong>Elastyczność:</strong> Możliwość wymiany pojazdu na inny model w trakcie trwania umowy w zależności od potrzeb biznesowych.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-sm text-slate-650 leading-relaxed font-medium">
          <p className="text-base text-slate-800 font-bold">The evolution of mobility has introduced alternative ways to acquire vehicles. Today, businesses and individuals increasingly choose flexible rentals over traditional purchases or leasing. Let's compare long-term and short-term options:</p>

          <div className="space-y-2.5">
            <h3 className="text-base font-extrabold text-slate-800">Short-Term Rental (1 - 30 days)</h3>
            <p>Perfect for weekend road trips, business travel, or temporary replacement cars. The main advantage is the immediate booking process and no commitments. You can rent a car for 1 day, complete your tasks in Oława or Brzeg, and return it with no ongoing costs.</p>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-base font-extrabold text-slate-800">Long-Term Rental (More than 1 month)</h3>
            <p>An excellent alternative to leasing. You pay a fixed monthly rate that covers all operational costs: insurance, tire replacement, periodic services, and inspections. It does not affect your company's credit capability, and the invoice is fully tax-deductible.</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 mt-4">
            <h4 className="font-bold text-slate-800">Key Differences Summary:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Formalities:</strong> In long-term rental, the contract is simplified compared to banking lease checks.</li>
              <li><strong>Daily Rate:</strong> The effective daily rate in long-term configurations is substantially lower than short rentals.</li>
              <li><strong>Flexibility:</strong> The ability to swap the vehicle for another class depending on business seasonal changes.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (id === "discover-lower-silesia-by-car") {
      return lang === "pl" ? (
        <div className="space-y-6 text-sm text-slate-650 leading-relaxed font-medium">
          <p className="text-base text-slate-800 font-bold">Region leżący na granicy Dolnego Śląska i Opolszczyzny to doskonałe miejsce na weekendowe wycieczki samochodowe. Dzięki bliskości autostrady A4 i dobrze skomunikowanym drogom lokalnym, możesz w krótkim czasie odwiedzić wiele wspaniałych miejsc. Oto nasza propozycja trasy:</p>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">Stop 1: Brzeg - Zamek Piastów Śląskich</h3>
            <p>Zaczynamy w Brzegu. Zamek Piastów Śląskich, nazywany ze względu na swój renesansowy dziedziniec „Śląskim Wawelem”, to absolutny hit. Bogato rzeźbiony portal bramy wjazdowej zapiera dech w piersiach. Na miejscu znajduje się ciekawe muzeum historyczne.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">Stop 2: Oława - Ratusz i Pałac Księżnej Ludwiki</h3>
            <p>Jedziemy na północ do Oławy. Rynek miejski zachwyca klasycystycznym ratuszem z charakterystyczną wieżą. Warto również zobaczyć pozostałości zamku piastowskiego (Pałac Księżnej Ludwiki). Okolice rzeki Odry oferują wspaniałe trasy spacerowe i rowerowe.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">Stop 3: Grodków - Mury obronne i Józef Elsner</h3>
            <p>Kierując się na południe przez Skarbimierz-Osiedle, docieramy do Grodkowa. To urokliwe miasteczko słynie z zachowanych średniowiecznych murów obronnych oraz baszt (Bramy Lewińskiej i Ziębickiej). To tutaj urodził się Józef Elsner - wybitny kompozytor i nauczyciel Fryderyka Chopina.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-sm text-slate-650 leading-relaxed font-medium">
          <p className="text-base text-slate-800 font-bold">The border area of Lower Silesia and Opole province is an ideal destination for weekend road trips. Thanks to the proximity of the A4 highway and good local roads, you can visit many stunning spots in a short time. Here is our recommended itinerary:</p>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">Stop 1: Brzeg - Castle of the Silesian Piasts</h3>
            <p>We begin in Brzeg. The Castle, often called the "Silesian Wawel" due to its magnificent Renaissance courtyard, is a must-see. The richly carved entrance gate portal is breathtaking. Inside, you will find an interesting historical museum.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">Stop 2: Oława - Town Hall & Duchess Ludwika Palace</h3>
            <p>Drive north to Oława. The town square features a classicist town hall with a unique tower. You should also visit the remains of the Piast castle (Duchess Ludwika Palace). The banks of the Oder River provide lovely walking paths.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">Stop 3: Grodków - Defense Walls & Józef Elsner heritage</h3>
            <p>Driving south through Skarbimierz-Osiedle, we reach Grodków. This charming town is famous for its preserved medieval town walls and gates (Lewin and Ziębice towers). It is the birthplace of Józef Elsner - a prominent composer and teacher of Frédéric Chopin.</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">
      {/* Back button */}
      <Link href="/blog" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-505 hover:text-slate-800 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === "pl" ? "POWRÓT DO LISTY WPISÓW" : "BACK TO BLOG"}</span>
      </Link>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Main Article Content */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          {/* Cover */}
          <div className="h-64 sm:h-80 overflow-hidden bg-slate-100 rounded-xl relative">
            <img
              src={post.image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-4 left-4 px-2.5 py-1 bg-brand-red/90 text-[10px] text-white rounded font-black uppercase tracking-wider">
              {post.tag}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-xs text-slate-400 font-bold border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-350" />
              <span>{t("publishedOn")}: {post.date}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-350" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {title}
          </h1>

          {/* Main content body */}
          <div className="pt-2">
            {renderContent()}
          </div>

          {/* Contact Box Callout */}
          <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-xl mt-8 space-y-3">
            <p className="text-xs font-black text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-red" />
              <span>{lang === "pl" ? "Potrzebujesz wynająć auto?" : "Need a car rental solution?"}</span>
            </p>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {lang === "pl"
                ? "CAR-GO.PL oferuje nowoczesne i bezpieczne samochody z nielimitowanym przebiegiem. Sprawdź naszą ofertę lub skontaktuj się z nami w celu wyceny indywidualnej dostawy."
                : "CAR-GO.PL offers modern and safe cars with unlimited mileage. Explore our active fleet or contact us for custom address delivery rates."}
            </p>
            <div className="flex space-x-3 pt-1">
              <Link
                href="/vehicles"
                className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-[10px] font-black tracking-wider uppercase rounded transition"
              >
                {t("navVehicles").toUpperCase()}
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-black tracking-wider uppercase rounded transition"
              >
                {t("navContact").toUpperCase()}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
