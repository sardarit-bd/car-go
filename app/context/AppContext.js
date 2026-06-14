"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

// Default CMS translations
const initialTranslations = {
  pl: {
    brandName: "CAR-GO",
    tagline: "Szybko, Wygodnie, Bezpiecznie",
    phoneHours: "Pon-Sob: 8:00 - 20:00",
    navHome: "Główna",
    navVehicles: "Pojazdy",
    navFAQ: "FAQ",
    navReviews: "Opinie",
    navTerms: "Regulamin",
    navContact: "Kontakt",
    navMyAccount: "Moje Konto",
    navLogin: "Zaloguj",
    navLogout: "Wyloguj",
    searchTitle: "Wynajmij Samochód Już Dziś",
    pickupLocation: "Miejsce odbioru",
    returnLocation: "Miejsce zwrotu",
    pickupDate: "Data odbioru",
    returnDate: "Data zwrotu",
    pickupTime: "Godzina odbioru",
    returnTime: "Godzina zwrotu",
    searchBtn: "SZUKAJ POJAZDU",
    minDaysWarning: "Dla tej lokalizacji minimalny okres wynajmu to {days} dni!",
    requiredFields: "Proszę uzupełnić wszystkie pola wyszukiwania.",
    aboutTitle: "O Naszej Firmie",
    aboutText: "CAR-GO to nowoczesna wypożyczalnia samochodów z siedzibą w Skarbimierzu-Osiedlu. Oferujemy wynajem krótko- i długoterminowy w miastach Oława, Grodków i Brzeg, a także dostawę pod wskazany adres. Nasza flota składa się z nowoczesnych, bezpiecznych i w pełni wyposażonych aut. Stawiamy na przejrzyste warunki, brak ukrytych kosztów oraz pełen profesjonalizm.",
    motto1: "Nielimitowany przebieg",
    motto2: "Dostawa pod dom",
    motto3: "Brak ukrytych opłat",
    motto4: "Szybki proces online",
    fleetTitle: "Nasza Flota Pojazdów",
    fleetSubtitle: "Wybierz idealny samochód dostosowany do Twoich potrzeb. Każdy pojazd jest regularnie serwisowany.",
    priceFrom: "Cena od",
    dayUnit: "/doba",
    fuelPetrol: "Benzyna",
    fuelDiesel: "Diesel",
    gearAuto: "Automatyczna",
    gearManual: "Manualna",
    seatsUnit: "miejsca",
    luggageUnit: "walizki",
    reviewsTitle: "Opinie Naszych Klientów",
    addReview: "Dodaj Opinię",
    ratingLabel: "Ocena",
    reviewTextLabel: "Treść opinii",
    submitBtn: "Wyślij",
    checkoutStep1: "Wybór Pojazdu",
    checkoutStep2: "Pakiety i Dodatki",
    checkoutStep3: "Dane i Płatność",
    checkoutStep4: "Potwierdzenie",
    reserveBtn: "REZERWUJĘ",
    includedLabel: "W cenie rezerwacji",
    vatLabel: "Podatek VAT 23%",
    mileageLabel: "Nielimitowany przebieg",
    cancellationLabel: "Darmowe odwołanie",
    summaryTitle: "Podsumowanie",
    packageTitle: "Wybierz Pakiet Ochrony",
    addonsTitle: "Wybierz Dodatki",
    totalPrice: "RAZEM BRUTTO",
    firstName: "Imię",
    lastName: "Nazwisko",
    phone: "Telefon",
    email: "Adres E-mail",
    notes: "Uwagi do rezerwacji",
    paymentTitle: "Wybierz Metodę Płatności",
    payOnline: "Płatność Online (BLIK, Przelewy24, Autopay)",
    payPickup: "Płatność przy odbiorze (Gotówka)",
    invoiceCheck: "Chcę otrzymać fakturę VAT",
    companyName: "Pełna nazwa firmy",
    companyAddress: "Adres firmy",
    nip: "Numer NIP",
    consentsTitle: "Wymagane zgody",
    consentPrivacy: "Akceptuję Politykę Prywatności",
    consentTerms: "Akceptuję Regulamin Wypożyczalni",
    consentData: "Wyrażam zgodę na przetwarzanie danych osobowych w celu rezerwacji",
    consentMarketing: "Wyrażam zgodę na przetwarzanie danych w celach marketingowych (opcjonalnie)",
    confirmTitle: "Dziękujemy za dokonanie rezerwacji!",
    confirmNum: "Przypisany numer rezerwacji",
    confirmPickupText: "Ważne! Rezerwacja online musi zostać potwierdzona przez administratora. Maksymalny czas oczekiwania wynosi 24 godziny.",
    confirmPayBtn: "OPŁAĆ REZERWACJĘ",
    confirmOnlineText: "Wybrałeś płatność online. Proszę kliknąć przycisk poniżej aby dokonać transakcji.",
    lookupTitle: "Szybkie Sprawdzenie Rezerwacji",
    lookupPlaceholder: "Wpisz numer rezerwacji...",
    lookupBtn: "SPRAWDŹ",
    lookupNotFound: "Nie znaleziono rezerwacji o podanym numerze.",
    lookupMaskedAlert: "Dane osobowe zostały częściowo ukryte w celu zachowania bezpieczeństwa.",
    statusAwaiting: "Oczekuje na potwierdzenie",
    statusConfirmed: "Potwierdzona",
    statusCancelled: "Anulowana",
    payStatusPaid: "Opłacona online",
    payStatusPickup: "Płatność przy odbiorze",
    payStatusAwaiting: "Oczekuje na płatność",
    depositLabel: "Kaucja zabezpieczająca",
    docRequired: "Dokumenty wymagane przy odbiorze pojazdu:",
    docId: "Dowód osobisty / Paszport",
    docLicense: "Ważne prawo jazdy",
    docCard: "Karta płatnicza",
    individualPriceAlert: "Cena Indywidualna - skontaktujemy się telefonicznie w celu ustalenia kosztów transportu.",
    contactTitle: "Skontaktuj się z nami",
    contactFormTitle: "Napisz do nas",
    contactName: "Twoje Imię",
    contactEmail: "Twój E-mail",
    contactMessage: "Treść wiadomości",
    contactSubmit: "Wyślij Wiadomość",
    contactSuccess: "Wiadomość została wysłana! Odpowiemy najszybciej jak to możliwe.",
    faqTitle: "Często Zadawane Pytania (FAQ)"
  },
  en: {
    brandName: "CAR-GO",
    tagline: "Fast, Convenient, Safe",
    phoneHours: "Mon-Sat: 8:00 AM - 8:00 PM",
    navHome: "Home",
    navVehicles: "Vehicles",
    navFAQ: "FAQ",
    navReviews: "Reviews",
    navTerms: "Terms",
    navContact: "Contact",
    navMyAccount: "My Account",
    navLogin: "Login",
    navLogout: "Logout",
    searchTitle: "Rent a Car Today",
    pickupLocation: "Pickup location",
    returnLocation: "Return location",
    pickupDate: "Pickup date",
    returnDate: "Return date",
    pickupTime: "Pickup time",
    returnTime: "Return time",
    searchBtn: "SEARCH VEHICLE",
    minDaysWarning: "For this location, the minimum rental period is {days} days!",
    requiredFields: "Please fill in all search fields.",
    aboutTitle: "About Our Company",
    aboutText: "CAR-GO is a modern car rental agency based in Skarbimierz-Osiedle. We offer short- and long-term rental in Oława, Grodków, and Brzeg, as well as direct delivery to your specified address. Our fleet consists of modern, safe, and fully equipped cars. We focus on transparent terms, no hidden costs, and absolute professionalism.",
    motto1: "Unlimited mileage",
    motto2: "Delivery to home",
    motto3: "No hidden fees",
    motto4: "Quick online process",
    fleetTitle: "Our Vehicle Fleet",
    fleetSubtitle: "Select the ideal car tailored to your needs. Every vehicle is serviced regularly.",
    priceFrom: "Price from",
    dayUnit: "/day",
    fuelPetrol: "Petrol",
    fuelDiesel: "Diesel",
    gearAuto: "Automatic",
    gearManual: "Manual",
    seatsUnit: "seats",
    luggageUnit: "suitcases",
    reviewsTitle: "Our Customer Reviews",
    addReview: "Add Review",
    ratingLabel: "Rating",
    reviewTextLabel: "Review description",
    submitBtn: "Submit",
    checkoutStep1: "Vehicle Selection",
    checkoutStep2: "Packages & Extras",
    checkoutStep3: "Details & Payment",
    checkoutStep4: "Confirmation",
    reserveBtn: "RESERVE",
    includedLabel: "Included in booking",
    vatLabel: "23% VAT tax",
    mileageLabel: "Unlimited mileage",
    cancellationLabel: "Free cancellation",
    summaryTitle: "Summary",
    packageTitle: "Select Protection Package",
    addonsTitle: "Select Add-ons",
    totalPrice: "TOTAL GROSS",
    firstName: "First name",
    lastName: "Last name",
    phone: "Phone",
    email: "Email address",
    notes: "Booking comments",
    paymentTitle: "Select Payment Method",
    payOnline: "Online Payment (BLIK, Przelewy24, Autopay)",
    payPickup: "Payment upon pickup (Cash)",
    invoiceCheck: "I want to receive a VAT Invoice",
    companyName: "Full company name",
    companyAddress: "Company address",
    nip: "VAT Identification Number (NIP)",
    consentsTitle: "Required consents",
    consentPrivacy: "I accept the Privacy Policy",
    consentTerms: "I accept the Rental Terms and Conditions",
    consentData: "I consent to the processing of my personal data for the reservation",
    consentMarketing: "I consent to the processing of my data for marketing purposes (optional)",
    confirmTitle: "Thank you for your booking!",
    confirmNum: "Assigned reservation number",
    confirmPickupText: "Important! The online reservation must be confirmed by the administrator. The maximum waiting time is 24 hours.",
    confirmPayBtn: "PAY ONLINE NOW",
    confirmOnlineText: "You selected online payment. Please click the button below to complete the transaction.",
    lookupTitle: "Quick Reservation Check",
    lookupPlaceholder: "Enter reservation number...",
    lookupBtn: "CHECK",
    lookupNotFound: "Reservation with this number was not found.",
    lookupMaskedAlert: "Personal details have been partially hidden for security reasons.",
    statusAwaiting: "Awaiting confirmation",
    statusConfirmed: "Confirmed",
    statusCancelled: "Cancelled",
    payStatusPaid: "Paid online",
    payStatusPickup: "Payment upon pickup",
    payStatusAwaiting: "Awaiting payment",
    depositLabel: "Security deposit",
    docRequired: "Documents required when collecting the vehicle:",
    docId: "National ID Card / Passport",
    docLicense: "Valid driving licence",
    docCard: "Payment card",
    individualPriceAlert: "Individual Price – we will contact you by phone to determine transportation costs.",
    contactTitle: "Contact Us",
    contactFormTitle: "Write to Us",
    contactName: "Your Name",
    contactEmail: "Your Email",
    contactMessage: "Message content",
    contactSubmit: "Send Message",
    contactSuccess: "Message has been sent! We will reply as soon as possible.",
    faqTitle: "Frequently Asked Questions (FAQ)"
  }
};

// Initial default vehicles
const initialVehicles = [
  {
    id: "fiat-500",
    brand: "Fiat",
    model: "500",
    class: "A (Economy)",
    fuel: "Petrol",
    seats: 4,
    luggage: 1,
    transmission: "Manual",
    price: 99,
    deposit: 1000,
    image: "/fiat500.png",
    description: "Idealny, kompaktowy i ekonomiczny samochód miejski, łatwy w parkowaniu i prowadzeniu. Doskonale sprawdza się w zatłoczonych centrach miast.",
    descriptionEn: "Perfect, compact and economic city car, easy to park and drive. Performs brilliantly in crowded city centers.",
    specs: {
      engine: "1.0 Hybrid 70 HP",
      consumption: "4.6 l/100km",
      aircon: "Yes",
      year: "2023"
    }
  },
  {
    id: "skoda-fabia",
    brand: "Skoda",
    model: "Fabia",
    class: "B (Compact)",
    fuel: "Petrol",
    seats: 5,
    luggage: 2,
    transmission: "Manual",
    price: 129,
    deposit: 1200,
    image: "/skoda-fabia.png",
    description: "Przestronny i niezawodny hatchback, oferujący optymalny komfort dla kierowcy i pasażerów oraz pojemny bagażnik w swojej klasie.",
    descriptionEn: "Spacious and reliable hatchback offering optimal comfort for driver and passengers and a competitive trunk capacity.",
    specs: {
      engine: "1.0 TSI 95 HP",
      consumption: "5.1 l/100km",
      aircon: "Yes",
      year: "2023"
    }
  },
  {
    id: "toyota-corolla",
    brand: "Toyota",
    model: "Corolla",
    class: "C (Medium/Sedan)",
    fuel: "Petrol", // Petrol Hybrid
    seats: 5,
    luggage: 3,
    transmission: "Automatic",
    price: 169,
    deposit: 1500,
    image: "/toyota-corolla.png",
    description: "Nowoczesny sedan z napędem hybrydowym, charakteryzujący się wyjątkowo niskim spalaniem, płynną automatyczną skrzynią biegów i bogatym wyposażeniem bezpieczeństwa.",
    descriptionEn: "Modern hybrid sedan featuring exceptionally low fuel consumption, smooth automatic gearbox, and loaded with safety equipment.",
    specs: {
      engine: "1.8 Hybrid 140 HP",
      consumption: "4.2 l/100km",
      aircon: "Yes (Dual-zone)",
      year: "2022"
    }
  },
  {
    id: "hyundai-tucson",
    brand: "Hyundai",
    model: "Tucson",
    class: "D (SUV)",
    fuel: "Petrol",
    seats: 5,
    luggage: 4,
    transmission: "Automatic",
    price: 219,
    deposit: 2000,
    image: "/hyundai-tucson.png",
    description: "Mocny i stylowy SUV z podwyższonym zawieszeniem. Zapewnia doskonałą widoczność na drodze, ogromny bagażnik i komfort na długie trasy krajowe.",
    descriptionEn: "Powerful and stylish SUV with high ground clearance. Ensures excellent road visibility, massive trunk, and superb comfort for long road trips.",
    specs: {
      engine: "1.6 T-GDI 150 HP",
      consumption: "6.8 l/100km",
      aircon: "Yes (Climatronic)",
      year: "2023"
    }
  },
  {
    id: "bmw-3",
    brand: "BMW",
    model: "3 Series",
    class: "E (Premium)",
    fuel: "Diesel",
    seats: 5,
    luggage: 3,
    transmission: "Automatic",
    price: 299,
    deposit: 2500,
    image: "/bmw-3.png",
    description: "Luksusowy sedan sportowy z dynamicznym silnikiem diesla. Łączy prestiż, doskonałe właściwości jezdne i maksymalny komfort klasy premium.",
    descriptionEn: "Luxury sport sedan powered by a dynamic diesel engine. Combines prestige, outstanding handling, and premium-class maximum comfort.",
    specs: {
      engine: "2.0d 190 HP",
      consumption: "5.3 l/100km",
      aircon: "Yes (Automatic 3-zone)",
      year: "2022"
    }
  }
];

// Initial default locations with minimum rental period
const initialLocations = [
  { id: "skarbimierz", name: "Skarbimierz-Osiedle", minDays: 1 },
  { id: "brzeg", name: "Brzeg", minDays: 1 },
  { id: "olawa", name: "Oława", minDays: 5 },
  { id: "grodkow", name: "Grodków", minDays: 5 },
  { id: "delivery", name: "Dostawa pod wskazany adres / Custom Address Delivery", minDays: 1, isCustomAddress: true }
];

// Initial protection packages
const initialPackages = [
  {
    id: "basic",
    name: "Podstawowy / Basic",
    pricePerDay: 0,
    featuresPl: ["Udział własny w szkodzie do 5000 PLN", "Standardowy depozyt (kaucja)", "Pomoc drogowa Assistance (tylko w PL)"],
    featuresEn: ["Deductible in case of damage up to 5000 PLN", "Standard security deposit", "Roadside Assistance (Poland only)"]
  },
  {
    id: "gold",
    name: "Złoty / Gold Protect",
    pricePerDay: 30,
    featuresPl: ["Obniżony udział w szkodzie do 1500 PLN", "Obniżony depozyt o 50%", "Ochrona szyb i opon", "Pełne Assistance PL"],
    featuresEn: ["Reduced deductible up to 1500 PLN", "Security deposit reduced by 50%", "Glass and tire coverage", "Full Roadside Assistance PL"]
  },
  {
    id: "platinum",
    name: "Platynowy / Platinum Protect",
    pricePerDay: 60,
    featuresPl: ["Zniesienie udziału własnego (0 PLN)", "Zniesienie kaucji (0 PLN)", "Pełna ochrona szyb, opon i karoserii", "Pełne Assistance Europa"],
    featuresEn: ["Zero deductible (0 PLN)", "No security deposit (0 PLN)", "Full coverage for glass, tires & bodywork", "Full Roadside Assistance Europe"]
  }
];

// Initial add-ons
const initialAddons = [
  { id: "child-seat", name: "Fotelik dla dziecka / Child Seat", price: 15, isPerDay: true, descriptionPl: "Bezpieczny fotelik dla dzieci 9-36 kg", descriptionEn: "Safe child seat for weights 9-36 kg" },
  { id: "booster", name: "Podkładka dla dziecka / Booster Seat", price: 8, isPerDay: true, descriptionPl: "Podwyższenie dla starszych dzieci", descriptionEn: "Booster support for older kids" },
  { id: "gps", name: "Nawigacja GPS / GPS Navigation", price: 10, isPerDay: true, descriptionPl: "Zaktualizowane mapy całej Europy", descriptionEn: "Updated maps of entire Europe" },
  { id: "extra-driver", name: "Dodatkowy kierowca / Additional Driver", price: 50, isPerDay: false, descriptionPl: "Możliwość prowadzenia pojazdu przez drugą osobę", descriptionEn: "Allows a second person to drive the car" }
];

// Initial FAQ
const initialFAQ = [
  {
    id: 1,
    questionPl: "Jakie dokumenty są wymagane przy odbiorze auta?",
    questionEn: "What documents are required when collecting the car?",
    answerPl: "Do wynajmu niezbędne są: ważny dowód osobisty lub paszport, ważne prawo jazdy (akceptowane od co najmniej 1 roku) oraz karta płatnicza na nazwisko głównego kierowcy.",
    answerEn: "To rent a car you will need: a valid national ID card or passport, a valid driving licence (held for at least 1 year), and a credit/debit card under the main driver's name."
  },
  {
    id: 2,
    questionPl: "Czy pobierana jest kaucja (depozyt)?",
    questionEn: "Is a security deposit required?",
    answerPl: "Tak, przy odbiorze auta blokowana jest kaucja zabezpieczająca na karcie płatniczej. Wysokość kaucji zależy od wybranego pojazdu i pakietu ochrony. W pakiecie Platynowym kaucja wynosi 0 PLN.",
    answerEn: "Yes, a security deposit is pre-authorized on your card upon car pickup. The amount depends on the selected vehicle and protection package. In the Platinum package, the deposit is 0 PLN."
  },
  {
    id: 3,
    questionPl: "Czy mogę wyjechać wynajętym samochodem za granicę?",
    questionEn: "Can I drive the rental vehicle abroad?",
    answerPl: "Wyjazd za granicę jest dozwolony wyłącznie do krajów Unii Europejskiej po uzyskaniu uprzedniej pisemnej zgody i opłaceniu odpowiedniej opłaty dodatkowej. Szczegóły można ustalić telefonicznie.",
    answerEn: "Driving abroad is allowed only to European Union countries, subject to prior written consent and payment of the corresponding additional fee. Details can be arranged by phone."
  },
  {
    id: 4,
    questionPl: "Co zrobić w przypadku kolizji lub awarii pojazdu?",
    questionEn: "What should I do in case of an accident or breakdown?",
    answerPl: "W przypadku jakiegokolizyjnego zdarzenia lub awarii należy natychmiast skontaktować się z naszą infolinią Assistance dostępną pod numerem telefonu podanym na umowie wynajmu.",
    answerEn: "In case of any traffic incident, collision, or technical breakdown, please immediately contact our Assistance hotline available at the phone number listed on your rental contract."
  }
];

// Initial reviews
const initialReviews = [
  {
    id: 1,
    name: "Tomasz",
    rating: 5,
    car: "Toyota Corolla",
    text: "Bardzo dobry kontakt z wypożyczalnią, auto czyste i pachnące. Dostawa pod dom w Oławie przebiegła punktualnie. Zdecydowanie polecam pakiet Platynowy - zero stresu!",
    date: "2026-06-05",
    approved: true
  },
  {
    id: 2,
    name: "Anna",
    rating: 5,
    car: "Fiat 500",
    text: "Urocze małe auto, idealne na weekendowy wyjazd do Wrocławia. Obsługa bardzo miła, formalności ograniczone do minimum. Na pewno wrócę!",
    date: "2026-06-10",
    approved: true
  },
  {
    id: 3,
    name: "John",
    rating: 4,
    car: "BMW 3 Series",
    text: "Car was clean and in perfect technical condition. Pickup at Brzeg railway station went smooth. Recommended.",
    date: "2026-06-12",
    approved: true
  }
];

// Initial content texts (Polish/English keys that can be updated in CMS)
const initialContentTexts = {
  homeHeader: { pl: "WYNAJEM SAMOCHODÓW CAR-GO", en: "CAR-GO CAR RENTAL" },
  homeSubheader: { pl: "Zawsze na czas, zawsze pod Twój adres.", en: "Always on time, delivered straight to your address." },
  whyChooseUs: { pl: "Dlaczego my?", en: "Why Choose Us?" },
  reviewsHeader: { pl: "Oceny klientów mówią same za siebie", en: "Customer reviews speak for themselves" }
};

export function AppProvider({ children }) {
  const [lang, setLang] = useState("pl"); // pl or en
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [locations, setLocations] = useState(initialLocations);
  const [packages, setPackages] = useState(initialPackages);
  const [addons, setAddons] = useState(initialAddons);
  const [faqs, setFaqs] = useState(initialFAQ);
  const [reviews, setReviews] = useState(initialReviews);
  const [bookings, setBookings] = useState([]);
  const [emails, setEmails] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // simulated active user account
  const [adminUser, setAdminUser] = useState(null); // simulated logged in admin
  const [cmsTranslations, setCmsTranslations] = useState(initialTranslations);
  const [cmsTexts, setCmsTexts] = useState(initialContentTexts);
  const [searchParams, setSearchParams] = useState(null); // stores active vehicle search params

  // Load state from localStorage on mount
  useEffect(() => {
    const localVehicles = localStorage.getItem("cargo_vehicles");
    const localLocations = localStorage.getItem("cargo_locations");
    const localPackages = localStorage.getItem("cargo_packages");
    const localAddons = localStorage.getItem("cargo_addons");
    const localFaqs = localStorage.getItem("cargo_faqs");
    const localReviews = localStorage.getItem("cargo_reviews");
    const localBookings = localStorage.getItem("cargo_bookings");
    const localEmails = localStorage.getItem("cargo_emails");
    const localLang = localStorage.getItem("cargo_lang");
    const localUser = localStorage.getItem("cargo_user");
    const localAdmin = localStorage.getItem("cargo_admin");
    const localTranslations = localStorage.getItem("cargo_translations");
    const localCmsTexts = localStorage.getItem("cargo_cmstexts");

    if (localVehicles) {
      try {
        const parsed = JSON.parse(localVehicles);
        const enriched = parsed.map((v) => {
          const match = initialVehicles.find((iv) => iv.id === v.id);
          if (match) {
            return { ...v, image: match.image || v.image };
          }
          return v;
        });
        setVehicles(enriched);
      } catch (e) {
        setVehicles(initialVehicles);
      }
    }
    if (localLocations) setLocations(JSON.parse(localLocations));
    if (localPackages) setPackages(JSON.parse(localPackages));
    if (localAddons) setAddons(JSON.parse(localAddons));
    if (localFaqs) setFaqs(JSON.parse(localFaqs));
    if (localReviews) setReviews(JSON.parse(localReviews));
    if (localBookings) setBookings(JSON.parse(localBookings));
    if (localEmails) setEmails(JSON.parse(localEmails));
    if (localLang) setLang(localLang);
    if (localUser) setCurrentUser(JSON.parse(localUser));
    if (localAdmin) setAdminUser(JSON.parse(localAdmin));
    if (localTranslations) setCmsTranslations(JSON.parse(localTranslations));
    if (localCmsTexts) setCmsTexts(JSON.parse(localCmsTexts));
  }, []);

  // Sync state to localStorage helpers
  const saveState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const updateLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("cargo_lang", newLang);
  };

  const addBooking = (newBooking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    saveState("cargo_bookings", updated);

    // Push simulated email log (First Email)
    const emailText = `
Witaj/Hello ${newBooking.customer.firstName} ${newBooking.customer.lastName},

Dziękujemy za dokonanie rezerwacji pojazdu w wypożyczalni CAR-GO.PL!
Thank you for booking a vehicle with CAR-GO.PL!

Numer rezerwacji / Booking reference: ${newBooking.id}
Pojazd / Vehicle: ${newBooking.car.brand} ${newBooking.car.model}
Okres wynajmu / Rental period: ${newBooking.dates.pickupDate} ${newBooking.dates.pickupTime} - ${newBooking.dates.returnDate} ${newBooking.dates.returnTime}
Miejsce odbioru / Pickup: ${newBooking.dates.pickupLocation}
Miejsce zwrotu / Return: ${newBooking.dates.returnLocation}

Koszt całkowity / Total price: ${
      newBooking.pricing.total === "Individual Price"
        ? "Cena Indywidualna (Oczekuje na wycenę / Awaiting custom quote)"
        : `PLN ${newBooking.pricing.total.toFixed(2)}`
    }
Kaucja / Deposit: PLN ${newBooking.car.deposit}

Ważne / Important:
${
  newBooking.pricing.total === "Individual Price"
    ? "Oczekuj na kontakt telefoniczny lub e-mail z wyceną dostawy pod wskazany adres."
    : "Rezerwacja musi zostać zatwierdzona przez administratora w ciągu 24 godzin."
}
We will confirm your booking within 24 hours.

Pozdrawiamy / Best regards,
Zespół CAR-GO.PL
    `;

    logEmail({
      id: "email_" + Math.random().toString(36).substr(2, 9),
      to: newBooking.customer.email,
      subject: `[CAR-GO.PL] Rezerwacja/Booking ${newBooking.id} - Oczekuje na potwierdzenie`,
      body: emailText,
      date: new Date().toLocaleString()
    });
  };

  const updateBookingStatus = (bookingId, newStatus, newPrice = null) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        let pricing = { ...b.pricing };
        if (newPrice !== null) {
          pricing.total = parseFloat(newPrice);
          pricing.deliveryFee = parseFloat(newPrice) - (b.pricing.days * b.car.price + b.pricing.packageCost + b.pricing.addonsCost);
        }
        return { ...b, status: newStatus, pricing };
      }
      return b;
    });
    setBookings(updated);
    saveState("cargo_bookings", updated);

    const booking = updated.find((b) => b.id === bookingId);
    if (!booking) return;

    // Trigger email templates based on status
    if (newStatus === "confirmed") {
      const emailText = `
Witaj/Hello ${booking.customer.firstName} ${booking.customer.lastName},

Twoja rezerwacja ${booking.id} została POTWIERDZONA przez administratora!
Your booking ${booking.id} has been CONFIRMED by the administrator!

Pojazd / Vehicle: ${booking.car.brand} ${booking.car.model}
Okres wynajmu / Rental period: ${booking.dates.pickupDate} ${booking.dates.pickupTime} - ${booking.dates.returnDate} ${booking.dates.returnTime}
Miejsce odbioru / Pickup: ${booking.dates.pickupLocation}

Koszt wynajmu / Rental Cost: PLN ${booking.pricing.total.toFixed(2)}
Kaucja zabezpieczająca / Security deposit: PLN ${booking.car.deposit}

Aby zarządzać rezerwacjami, pobrać potwierdzenie PDF oraz oceniać pojazdy, aktywuj swoje konto klienta klikając poniższy link:
To manage bookings, download confirmation PDFs, and submit reviews, please activate your account using the link below:

[AKTYWUJ KONTO / ACTIVATE ACCOUNT]: https://car-go.pl/account/activate?email=${encodeURIComponent(
        booking.customer.email
      )}

Płatność online / Online Payment Link (Autopay/Przelewy24):
https://car-go.pl/checkout/pay?id=${booking.id}

Wymagane dokumenty przy odbiorze: dowód osobisty, prawo jazdy, karta płatnicza.
Required documents upon pickup: ID card, valid driver's license, credit card.

Pozdrawiamy / Best regards,
Zespół CAR-GO.PL
      `;
      logEmail({
        id: "email_" + Math.random().toString(36).substr(2, 9),
        to: booking.customer.email,
        subject: `[CAR-GO.PL] Rezerwacja ${booking.id} Została Potwierdzona!`,
        body: emailText,
        date: new Date().toLocaleString()
      });
    } else if (newStatus === "cancelled") {
      const emailText = `
Witaj/Hello ${booking.customer.firstName} ${booking.customer.lastName},

Niestety, Twoja rezerwacja ${booking.id} została anulowana.
Unfortunately, your booking ${booking.id} has been cancelled.

W razie pytań zapraszamy do kontaktu telefonicznego.
If you have any questions, please contact us.

Pozdrawiamy / Best regards,
Zespół CAR-GO.PL
      `;
      logEmail({
        id: "email_" + Math.random().toString(36).substr(2, 9),
        to: booking.customer.email,
        subject: `[CAR-GO.PL] Rezerwacja ${booking.id} Została Anulowana`,
        body: emailText,
        date: new Date().toLocaleString()
      });
    }
  };

  const logEmail = (emailLog) => {
    const updated = [emailLog, ...emails];
    setEmails(updated);
    saveState("cargo_emails", updated);
  };

  const addReview = (newReview) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveState("cargo_reviews", updated);
  };

  const updateReview = (reviewId, approved, text = null) => {
    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return { ...r, approved, text: text !== null ? text : r.text };
      }
      return r;
    });
    setReviews(updated);
    saveState("cargo_reviews", updated);
  };

  const deleteReview = (reviewId) => {
    const updated = reviews.filter((r) => r.id !== reviewId);
    setReviews(updated);
    saveState("cargo_reviews", updated);
  };

  // CMS Content / Translations Updates
  const updateCmsTranslation = (language, key, text) => {
    const updated = {
      ...cmsTranslations,
      [language]: {
        ...cmsTranslations[language],
        [key]: text
      }
    };
    setCmsTranslations(updated);
    saveState("cargo_translations", updated);
  };

  const updateCmsText = (key, textPl, textEn) => {
    const updated = {
      ...cmsTexts,
      [key]: { pl: textPl, en: textEn }
    };
    setCmsTexts(updated);
    saveState("cargo_cmstexts", updated);
  };

  // Manage System settings (Vehicles, Locations, Packages, Addons)
  const saveVehicles = (updated) => {
    setVehicles(updated);
    saveState("cargo_vehicles", updated);
  };

  const saveLocations = (updated) => {
    setLocations(updated);
    saveState("cargo_locations", updated);
  };

  const savePackages = (updated) => {
    setPackages(updated);
    saveState("cargo_packages", updated);
  };

  const saveAddons = (updated) => {
    setAddons(updated);
    saveState("cargo_addons", updated);
  };

  const saveFaqs = (updated) => {
    setFaqs(updated);
    saveState("cargo_faqs", updated);
  };

  // Auth Functions
  const registerUser = (email, password) => {
    // Simulated registration
    const user = { email, phone: "", firstName: "Klient", lastName: "CAR-GO" };
    setCurrentUser(user);
    saveState("cargo_user", user);

    // Update customer records in local storage
    const localUsers = JSON.parse(localStorage.getItem("cargo_users_db") || "[]");
    if (!localUsers.some((u) => u.email === email)) {
      localUsers.push({ email, password, firstName: "Klient", lastName: "CAR-GO", phone: "" });
      localStorage.setItem("cargo_users_db", JSON.stringify(localUsers));
    }
    return true;
  };

  const loginUser = (email, password) => {
    const localUsers = JSON.parse(localStorage.getItem("cargo_users_db") || "[]");
    const user = localUsers.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      saveState("cargo_user", user);
      return true;
    }
    // Simple fallback check
    if (email && password.length >= 4) {
      const fallbackUser = { email, firstName: "Klient", lastName: "CAR-GO", phone: "" };
      setCurrentUser(fallbackUser);
      saveState("cargo_user", fallbackUser);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("cargo_user");
  };

  const updateProfile = (phone, password = null) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, phone };
    setCurrentUser(updatedUser);
    saveState("cargo_user", updatedUser);

    const localUsers = JSON.parse(localStorage.getItem("cargo_users_db") || "[]");
    const updatedUsers = localUsers.map((u) => {
      if (u.email === currentUser.email) {
        return { ...u, phone, ...(password ? { password } : {}) };
      }
      return u;
    });
    localStorage.setItem("cargo_users_db", JSON.stringify(updatedUsers));
  };

  const loginAdmin = (username, password) => {
    if ((username === "admin" && password === "admin123") || (username === "employee" && password === "employee123")) {
      const role = username === "admin" ? "owner" : "employee";
      const admin = { username, role };
      setAdminUser(admin);
      saveState("cargo_admin", admin);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem("cargo_admin");
  };

  // Helper to translate labels
  const t = (key) => {
    return cmsTranslations[lang]?.[key] || cmsTranslations["en"]?.[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang: updateLang,
        vehicles,
        setVehicles: saveVehicles,
        locations,
        setLocations: saveLocations,
        packages,
        setPackages: savePackages,
        addons,
        setAddons: saveAddons,
        faqs,
        setFaqs: saveFaqs,
        reviews,
        bookings,
        emails,
        currentUser,
        adminUser,
        cmsTexts,
        searchParams,
        setSearchParams,
        t,
        addBooking,
        updateBookingStatus,
        addReview,
        updateReview,
        deleteReview,
        updateCmsTranslation,
        updateCmsText,
        registerUser,
        loginUser,
        logoutUser,
        updateProfile,
        loginAdmin,
        logoutAdmin,
        logEmail
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
