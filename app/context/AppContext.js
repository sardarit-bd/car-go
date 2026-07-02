"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
const AppContext = createContext();

// Default CMS translations
const initialTranslations = {
  pl: {
    brandName: "CAR-GO", tagline: "Szybko, Wygodnie, Bezpiecznie", phoneHours: "Pon-Sob: 8:00 - 22:00",
    navHome: "Główna", navVehicles: "Pojazdy", navFAQ: "FAQ", navReviews: "Opinie", navTerms: "Regulamin",
    navContact: "Kontakt", navMyAccount: "Moje Konto", navLogin: "Zaloguj", navLogout: "Wyloguj",
    searchTitle: "Wynajmij Samochód Już Dziś", pickupLocation: "Miejsce odbioru", returnLocation: "Miejsce zwrotu",
    pickupDate: "Data odbioru", returnDate: "Data zwrotu", pickupTime: "Godzina odbioru", returnTime: "Godzina zwrotu",
    searchBtn: "SZUKAJ POJAZDU", minDaysWarning: "Dla tej lokalizacji minimalny okres wynajmu to {days} dni!",
    requiredFields: "Proszę uzupełnić wszystkie pola wyszukiwania.", aboutTitle: "O Naszej Firmie",
    aboutText: "CAR-GO to nowoczesna wypożyczalnia samochodów z siedzibą w Skarbimierzu-Osiedlu. Oferujemy wynajem krótko- i długoterminowy w miastach Oława, Grodków i Brzeg, a także dostawę pod wskazany adres. Nasza flota składa się z nowoczesnych, bezpiecznych i w pełni wyposażonych aut. Stawiamy na przejrzyste warunki, brak ukrytych kosztów oraz pełen profesjonalizm.",
    motto1: "Nielimitowany przebieg", motto2: "Dostawa pod dom", motto3: "Brak ukrytych opłat", motto4: "Szybki proces online",
    fleetTitle: "Nasza Flota Pojazdów", fleetSubtitle: "Wybierz idealny samochód dostosowany do Twoich potrzeb. Każdy pojazd jest regularnie serwisowany.",
    priceFrom: "Cena od", dayUnit: "/doba", fuelPetrol: "Benzyna", fuelDiesel: "Diesel", gearAuto: "Automatyczna", gearManual: "Manualna",
    seatsUnit: "miejsca", luggageUnit: "L", reviewsTitle: "Opinie Naszych Klientów", addReview: "Dodaj Opinię",
    ratingLabel: "Ocena", reviewTextLabel: "Treść opinii", submitBtn: "Wyślij", checkoutStep1: "Wybór Pojazdu",
    checkoutStep2: "Pakiety i Dodatki", checkoutStep3: "Dane i Płatność", checkoutStep4: "Potwierdzenie", reserveBtn: "REZERWUJĘ",
    includedLabel: "W cenie rezerwacji", vatLabel: "Podatek VAT 23%", mileageLabel: "Nielimitowany przebieg",
    cancellationLabel: "Darmowe odwołanie", summaryTitle: "Podsumowanie", packageTitle: "Wybierz Pakiet Ochrony",
    addonsTitle: "Wybierz Dodatki", totalPrice: "RAZEM BRUTTO", firstName: "Imię", lastName: "Nazwisko", phone: "Telefon",
    email: "Adres E-mail", notes: "Uwagi do rezerwacji", paymentTitle: "Wybierz Metodę Płatności",
    payOnline: "Płatność Online (BLIK, Przelewy24, Autopay)", payPickup: "Płatność przy odbiorze (Gotówka)",
    invoiceCheck: "Chcę otrzymać fakturę VAT", companyName: "Pełna nazwa firmy", companyAddress: "Adres firmy", nip: "Numer NIP",
    consentsTitle: "Wymagane zgody", consentPrivacy: "Akceptuję Politykę Prywatności", consentTerms: "Akceptuję Regulamin Wypożyczalni",
    consentData: "Wyrażam zgodę na przetwarzanie danych osobowych w celu rezerwacji",
    consentMarketing: "Wyrażam zgodę na przetwarzanie danych w celach marketingowych (opcjonalnie)",
    confirmTitle: "Dziękujemy za dokonanie rezerwacji!", confirmNum: "Przypisany numer rezerwacji",
    confirmPickupText: "Ważne! Rezerwacja online musi zostać potwierdzona przez administratora. Maksymalny czas oczekiwania wynosi 24 godziny.",
    confirmPayBtn: "OPŁAĆ REZERWACJĘ", confirmOnlineText: "Wybrałeś płatność online. Proszę kliknąć przycisk poniżej aby dokonać transakcji.",
    lookupTitle: "Szybkie Sprawdzenie Rezerwacji", lookupPlaceholder: "Wpisz numer rezerwacji...", lookupBtn: "SPRAWDŹ",
    lookupNotFound: "Nie znaleziono rezerwacji o podanym numerze.",
    lookupMaskedAlert: "Dane osobowe zostały częściowo ukryte w celu zachowania bezpieczeństwa.",
    statusAwaiting: "Oczekuje na potwierdzenie", statusConfirmed: "Potwierdzona", statusCancelled: "Anulowana",
    payStatusPaid: "Opłacona online", payStatusPickup: "Płatność przy odbiorze", payStatusAwaiting: "Oczekuje na płatność",
    depositLabel: "Kaucja zabezpieczająca", docRequired: "Dokumenty wymagane przy odbiorze pojazdu:",
    docId: "Dowód osobisty / Paszport", docLicense: "Ważne prawo jazdy", docCard: "Karta płatnicza",
    individualPriceAlert: "Cena Indywidualna - skontaktujemy się telefonicznie w celu ustalenia kosztów transportu.",
    contactTitle: "Skontaktuj się z nami", contactFormTitle: "Napisz do nas", contactName: "Twoje Imię",
    contactEmail: "Twój E-mail", contactMessage: "Treść wiadomości", contactSubmit: "Wyślij Wiadomość",
    contactSuccess: "Wiadomość została wysłana! Odpowiemy najszybciej jak to możliwe.", faqTitle: "Często Zadawane Pytania (FAQ)",
    navMyReservations: "Moje Rezerwacje", navBlog: "Blog", specifications: "Specyfikacja", viewAllVehicles: "Zobacz wszystkie pojazdy",
    payments: "Płatności", locationsTitle: "Lokalizacje", sentSuccess: "Wysłano pomyślnie!", capacityFilter: "Miejsca siedzące",
    seatsFilterAll: "Dowolna liczba miejsc", seatsFilter4: "4 miejsca", seatsFilter5: "5 miejsc",
    longTermTitle: "Wynajem Długoterminowy",
    longTermText: "Potrzebujesz samochodu na wynajem długoterminowy? Skontaktuj się z nami już dziś i omówmy ofertę dopasowaną do Twoich potrzeb.",
    contactUsBtn: "Skontaktuj się", readMore: "Czytaj więcej", publishedOn: "Opublikowano", blogTitle: "Nasz Blog i Porady",
    blogSubtitle: "Dowiedz się więcej o wynajmie samochodów, podróżach oraz najlepszych trasach w rejonie.",
    verifyEmailLabel: "Adres e-mail rezerwacji", printVoucher: "Drukuj potwierdzenie", downloadPdf: "Pobierz PDF",
    supportLabel: "Infolinia / Wsparcie", payPickupInfo: "Gotówka / Karta przy odbiorze", technicalSupport: "Obsługa techniczna",
    domainValidity: "Domena ważna do", backToVehicles: "Powrót do pojazdów"
  },
  en: {
    brandName: "CAR-GO", tagline: "Fast, Convenient, Safe", phoneHours: "Mon-Sat: 8:00 AM - 22:00 PM",
    navHome: "Home", navVehicles: "Vehicles", navFAQ: "FAQ", navReviews: "Reviews", navTerms: "Terms",
    navContact: "Contact", navMyAccount: "My Account", navLogin: "Login", navLogout: "Logout",
    searchTitle: "Rent a Car Today", pickupLocation: "Pickup location", returnLocation: "Return location",
    pickupDate: "Pickup date", returnDate: "Return date", pickupTime: "Pickup time", returnTime: "Return time",
    searchBtn: "SEARCH VEHICLE", minDaysWarning: "For this location, the minimum rental period is {days} days!",
    requiredFields: "Please fill in all search fields.", aboutTitle: "About Our Company",
    aboutText: "CAR-GO is a modern car rental agency based in Skarbimierz-Osiedle. We offer short- and long-term rental in Oława, Grodków, and Brzeg, as well as direct delivery to your specified address. Our fleet consists of modern, safe, and fully equipped cars. We focus on transparent terms, no hidden costs, and absolute professionalism.",
    motto1: "Unlimited mileage", motto2: "Delivery to home", motto3: "No hidden fees", motto4: "Quick online process",
    fleetTitle: "Our Vehicle Fleet", fleetSubtitle: "Select the ideal car tailored to your needs. Every vehicle is serviced regularly.",
    priceFrom: "Price from", dayUnit: "/day", fuelPetrol: "Petrol", fuelDiesel: "Diesel", gearAuto: "Automatic", gearManual: "Manual",
    seatsUnit: "seats", luggageUnit: "L", reviewsTitle: "Our Customer Reviews", addReview: "Add Review",
    ratingLabel: "Rating", reviewTextLabel: "Review description", submitBtn: "Submit", checkoutStep1: "Vehicle Selection",
    checkoutStep2: "Packages & Extras", checkoutStep3: "Details & Payment", checkoutStep4: "Confirmation", reserveBtn: "RESERVE",
    includedLabel: "Included in booking", vatLabel: "23% VAT tax", mileageLabel: "Unlimited mileage",
    cancellationLabel: "Free cancellation", summaryTitle: "Summary", packageTitle: "Select Protection Package",
    addonsTitle: "Select Add-ons", totalPrice: "TOTAL GROSS", firstName: "First name", lastName: "Last name", phone: "Phone",
    email: "Email address", notes: "Booking comments", paymentTitle: "Select Payment Method",
    payOnline: "Online Payment (BLIK, Przelewy24, Autopay)", payPickup: "Payment upon pickup (Cash)",
    invoiceCheck: "I want to receive a VAT Invoice", companyName: "Full company name", companyAddress: "Company address", nip: "VAT Identification Number (NIP)",
    consentsTitle: "Required consents", consentPrivacy: "I accept the Privacy Policy", consentTerms: "I accept the Rental Terms and Conditions",
    consentData: "I consent to the processing of my personal data for the reservation",
    consentMarketing: "I consent to the processing of my data for marketing purposes (optional)",
    confirmTitle: "Thank you for your booking!", confirmNum: "Assigned reservation number",
    confirmPickupText: "Important! The online reservation must be confirmed by the administrator. The maximum waiting time is 24 hours.",
    confirmPayBtn: "PAY ONLINE NOW", confirmOnlineText: "You selected online payment. Please click the button below to complete the transaction.",
    lookupTitle: "Quick Reservation Check", lookupPlaceholder: "Enter reservation number...", lookupBtn: "CHECK",
    lookupNotFound: "Reservation with this number was not found.",
    lookupMaskedAlert: "Personal details have been partially hidden for security reasons.",
    statusAwaiting: "Awaiting confirmation", statusConfirmed: "Confirmed", statusCancelled: "Cancelled",
    payStatusPaid: "Paid online", payStatusPickup: "Payment upon pickup", payStatusAwaiting: "Awaiting payment",
    depositLabel: "Security deposit", docRequired: "Documents required when collecting the vehicle:",
    docId: "National ID Card / Passport", docLicense: "Valid driving licence", docCard: "Payment card",
    individualPriceAlert: "Individual Price – we will contact you by phone to determine transportation costs.",
    contactTitle: "Contact Us", contactFormTitle: "Write to Us", contactName: "Your Name",
    contactEmail: "Your Email", contactMessage: "Message content", contactSubmit: "Send Message",
    contactSuccess: "Message has been sent! We will reply as soon as possible.", faqTitle: "Frequently Asked Questions (FAQ)",
    navMyReservations: "My Reservations", navBlog: "Blog", specifications: "Specifications", viewAllVehicles: "View all vehicles",
    payments: "Payments", locationsTitle: "Locations", sentSuccess: "Sent successfully!", capacityFilter: "Seating capacity",
    seatsFilterAll: "All capacities", seatsFilter4: "4 seats", seatsFilter5: "5 seats",
    longTermTitle: "Long-Term Rental",
    longTermText: "Need a car for long-term rental? Contact us today and let's discuss a customized rental solution for your needs.",
    contactUsBtn: "Contact us", readMore: "Read more", publishedOn: "Published on", blogTitle: "Our Blog & Tips",
    blogSubtitle: "Learn more about car rental, travels and best routes in the region.",
    verifyEmailLabel: "Booking Email Address", printVoucher: "Print confirmation", downloadPdf: "Download PDF",
    supportLabel: "Hotline / Support", payPickupInfo: "Cash / Card at Pickup", technicalSupport: "Technical support",
    domainValidity: "Domain valid until", backToVehicles: "Back to vehicles"
  }
};

const initialVehicles = [
  { id: "fiat-500", brand: "Fiat", model: "500", class: "A (Economy)", fuel: "Petrol", seats: 4, luggage: 185, transmission: "Manual", price: 99, deposit: 1000, image: "/fiat500.png", description: "Idealny, kompaktowy i ekonomiczny samochód miejski.", descriptionEn: "Perfect, compact and economic city car.", specs: { engine: "1.0 Hybrid 70 HP", consumption: "4.6 l/100km", aircon: "Yes", year: "2023" } },
  { id: "skoda-fabia", brand: "Skoda", model: "Fabia", class: "B (Compact)", fuel: "Petrol", seats: 5, luggage: 380, transmission: "Manual", price: 129, deposit: 1200, image: "/skoda-fabia.png", description: "Przestronny i niezawodny hatchback.", descriptionEn: "Spacious and reliable hatchback.", specs: { engine: "1.0 TSI 95 HP", consumption: "5.1 l/100km", aircon: "Yes", year: "2023" } },
  { id: "toyota-corolla", brand: "Toyota", model: "Corolla", class: "C (Medium/Sedan)", fuel: "Petrol", seats: 5, luggage: 470, transmission: "Automatic", price: 169, deposit: 1500, image: "/toyota-corolla.png", description: "Nowoczesny sedan z napędem hybrydowym.", descriptionEn: "Modern hybrid sedan.", specs: { engine: "1.8 Hybrid 140 HP", consumption: "4.2 l/100km", aircon: "Yes (Dual-zone)", year: "2022" } },
  { id: "hyundai-tucson", brand: "Hyundai", model: "Tucson", class: "D (SUV)", fuel: "Petrol", seats: 5, luggage: 620, transmission: "Automatic", price: 219, deposit: 2000, image: "/hyundai-tucson.png", description: "Mocny i stylowy SUV.", descriptionEn: "Powerful and stylish SUV.", specs: { engine: "1.6 T-GDI 150 HP", consumption: "6.8 l/100km", aircon: "Yes (Climatronic)", year: "2023" } },
  { id: "bmw-3", brand: "BMW", model: "3 Series", class: "E (Premium)", fuel: "Diesel", seats: 5, luggage: 480, transmission: "Automatic", price: 299, deposit: 2500, image: "/bmw-3.png", description: "Luksusowy sedan sportowy.", descriptionEn: "Luxury sport sedan.", specs: { engine: "2.0d 190 HP", consumption: "5.3 l/100km", aircon: "Yes (Automatic 3-zone)", year: "2022" } }
];

const initialLocations = [
  { id: "skarbimierz", name: "Skarbimierz-Osiedle", minDays: 1 },
  { id: "brzeg", name: "Brzeg", minDays: 1 },
  { id: "olawa", name: "Oława", minDays: 5 },
  { id: "grodkow", name: "Grodków", minDays: 5 },
  { id: "delivery", name: "Dostawa pod wskazany adres / Custom Address Delivery", minDays: 1, isCustomAddress: true }
];

const initialPackages = [
  { id: "basic", name: "Podstawowy / Basic", pricePerDay: 0, featuresPl: ["Udział własny w szkodzie do 5000 PLN"], featuresEn: ["Deductible in case of damage up to 5000 PLN"] },
  { id: "gold", name: "Złoty / Gold Protect", pricePerDay: 30, featuresPl: ["Obniżony udział w szkodzie do 1500 PLN"], featuresEn: ["Reduced deductible up to 1500 PLN"] },
  { id: "platinum", name: "Platynowy / Platinum Protect", pricePerDay: 60, featuresPl: ["Zniesienie udziału własnego (0 PLN)"], featuresEn: ["Zero deductible (0 PLN)"] }
];

const initialAddons = [
  { id: "child-seat", name: "Fotelik dla dziecka / Child Seat", price: 15, isPerDay: true, descriptionPl: "Bezpieczny fotelik", descriptionEn: "Safe child seat" },
  { id: "booster", name: "Podkładka dla dziecka / Booster Seat", price: 8, isPerDay: true, descriptionPl: "Podwyższenie", descriptionEn: "Booster support" },
  { id: "gps", name: "Nawigacja GPS / GPS Navigation", price: 10, isPerDay: true, descriptionPl: "Mapy Europy", descriptionEn: "Maps of Europe" },
  { id: "extra-driver", name: "Dodatkowy kierowca / Additional Driver", price: 50, isPerDay: false, descriptionPl: "Drugi kierowca", descriptionEn: "Second driver" }
];

const initialFAQ = [
  { id: 1, questionPl: "Jakie dokumenty?", questionEn: "What documents?", answerPl: "Dowód, prawo jazdy, karta.", answerEn: "ID, license, card." },
  { id: 2, questionPl: "Kaucja?", questionEn: "Deposit?", answerPl: "Tak, zależna od auta.", answerEn: "Yes, depends on car." },
  { id: 3, questionPl: "Za granicę?", questionEn: "Abroad?", answerPl: "Tylko UE.", answerEn: "EU only." },
  { id: 4, questionPl: "Awaria?", questionEn: "Breakdown?", answerPl: "Zadzwoń na infolinię.", answerEn: "Call hotline." }
];

const initialReviews = [
  { id: 1, name: "Tomasz", rating: 5, car: "Toyota Corolla", text: "Bardzo dobry kontakt!", date: "2026-06-05", approved: true },
  { id: 2, name: "Anna", rating: 5, car: "Fiat 500", text: "Urocze małe auto!", date: "2026-06-10", approved: true },
  { id: 3, name: "John", rating: 4, car: "BMW 3 Series", text: "Car was clean.", date: "2026-06-12", approved: true }
];

const initialContentTexts = {
  homeHeader: { pl: "WYNAJEM SAMOCHODÓW", en: "CAR RENTAL" },
  homeSubheader: { pl: "Zawsze na czas, zawsze pod Twój adres.", en: "Always on time, delivered straight to your address." },
  whyChooseUs: { pl: "Dlaczego my?", en: "Why Choose Us?" },
  reviewsHeader: { pl: "Oceny klientów mówią same za siebie", en: "Customer reviews speak for themselves" }
};

export function AppProvider({ children }) {
  const [lang, setLang] = useState("pl");
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [locations, setLocations] = useState(initialLocations);
  const [packages, setPackages] = useState(initialPackages);
  const [addons, setAddons] = useState(initialAddons);
  const [faqs, setFaqs] = useState(initialFAQ);
  const [reviews, setReviews] = useState(initialReviews);
  const [bookings, setBookings] = useState([]);
  const [emails, setEmails] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [cmsTranslations, setCmsTranslations] = useState(initialTranslations);
  const [cmsTexts, setCmsTexts] = useState(initialContentTexts);
  const [searchParamsState, setSearchParamsState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cargo_search_params");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const setSearchParams = (params) => {
    setSearchParamsState(params);
    if (typeof window !== "undefined") {
      if (params) localStorage.setItem("cargo_search_params", JSON.stringify(params));
      else localStorage.removeItem("cargo_search_params");
    }
  };

  const mapBooking = (b) => {
    const pickup = new Date(b.pickupDate);
    const returnD = new Date(b.returnDate);
    const days = Math.max(1, Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24)));
    return {
      id: b.id,
      customer: { firstName: b.customerFirstName || "Unknown", lastName: b.customerLastName || "", email: b.customerEmail || "", phone: b.phoneNumber || "" },
      dates: {
        pickupDate: pickup.toISOString().split('T')[0], returnDate: returnD.toISOString().split('T')[0],
        pickupTime: pickup.toISOString().split('T')[1].substring(0, 5), returnTime: returnD.toISOString().split('T')[1].substring(0, 5),
        pickupLocation: b.pickupLocationId || "Custom Address", returnLocation: b.returnLocationId || "Custom Address",
      },
      car: { brand: b.vehicle?.brand || "Unknown", model: b.vehicle?.model || "Unknown", class: b.vehicle?.class || "Standard", deposit: 0, price: parseFloat(b.vehicle?.pricePerDay) || 0 },
      pricing: { total: parseFloat(b.totalPrice) || 0, days: days, packageCost: b.packageData?.price || 0, addonsCost: 0 },
      status: b.status.toLowerCase(),
    };
  };

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/api/vehicle");
      const backendVehicles = response.data.data.vehicles;
      const mappedVehicles = backendVehicles.map((v) => ({
        id: v.id, brand: v.brand, model: v.model, class: v.class || "Standard", fuel: "Petrol", seats: v.seats, luggage: 0, transmission: "Manual", 
        price: parseFloat(v.pricePerDay) || 0, deposit: 0,
        image: v.images && v.images.length > 0 ? `${process.env.NEXT_PUBLIC_API_URL}${v.images[0].imageUrl}` : "/fallback-car.png", 
        description: v.description, descriptionEn: v.description, specs: { engine: "N/A", consumption: "N/A", aircon: "Yes", year: "N/A" }
      }));
      setVehicles(mappedVehicles); saveState("cargo_vehicles", mappedVehicles);
    } catch (error) { console.error("Failed to fetch vehicles:", error); setVehicles(initialVehicles); }
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get("/api/locations");
      const backendLocations = response.data.data || response.data; 
      const mapped = backendLocations.map((l) => {
        let frontendId = l.id; const nameLower = l.name.toLowerCase();
        if (nameLower.includes("skarbimierz")) frontendId = "skarbimierz";
        else if (nameLower.includes("brzeg")) frontendId = "brzeg";
        else if (nameLower.includes("oława") || nameLower.includes("olawa")) frontendId = "olawa";
        else if (nameLower.includes("grodków") || nameLower.includes("grodkow")) frontendId = "grodkow";
        else if (nameLower.includes("dostawa") || nameLower.includes("custom")) frontendId = "delivery";
        return { id: frontendId, backendId: l.id, name: l.name, minDays: 1, isCustomAddress: frontendId === "delivery" };
      });
      setLocations(mapped); saveState("cargo_locations", mapped);
    } catch (error) { console.error("Failed to fetch locations:", error); setLocations(initialLocations); }
  };

  const fetchPackages = async () => {
    try {
      const response = await api.get("/api/packages");
      const backendPackages = response.data.data;
      const mapped = backendPackages.map(pkg => {
        let frontendId = pkg.id; const nameLower = pkg.name.toLowerCase();
        if (nameLower.includes("gold")) frontendId = "gold";
        else if (nameLower.includes("platinum")) frontendId = "platinum";
        else if (nameLower.includes("basic")) frontendId = "basic";
        return { id: frontendId, backendId: pkg.id, name: pkg.name, pricePerDay: parseFloat(pkg.price), featuresPl: pkg.description || [], featuresEn: pkg.description || [] };
      });
      setPackages(mapped); saveState("cargo_packages", mapped);
    } catch (error) { console.error("Failed to fetch packages:", error); }
  };

  const fetchAddons = async () => {
    try {
      const response = await api.get("/api/addons");
      const backendAddons = response.data.data;
      const mapped = backendAddons.map(addon => {
        let frontendId = addon.id; const nameLower = addon.name.toLowerCase();
        if (nameLower.includes("child")) frontendId = "child-seat";
        else if (nameLower.includes("booster")) frontendId = "booster";
        else if (nameLower.includes("gps")) frontendId = "gps";
        else if (nameLower.includes("driver")) frontendId = "extra-driver";
        return { id: frontendId, backendId: addon.id, name: addon.name, price: parseFloat(addon.price), isPerDay: true, descriptionPl: addon.description, descriptionEn: addon.description };
      });
      setAddons(mapped); saveState("cargo_addons", mapped);
    } catch (error) { console.error("Failed to fetch addons:", error); }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get("/api/reservations");
      const backendBookings = response.data.data;
      const mapped = backendBookings.map(mapBooking);
      setBookings(mapped); saveState("cargo_bookings", mapped);
    } catch (error) { console.error("Failed to fetch bookings:", error); }
  };

  const addVehicle = async (vehicleData) => {
    try {
      const formData = new FormData();
      formData.append("name", `${vehicleData.brand} ${vehicleData.model}`);
      formData.append("brand", vehicleData.brand); formData.append("model", vehicleData.model);
      formData.append("description", vehicleData.description); formData.append("class", vehicleData.class);
      formData.append("seats", vehicleData.seats); formData.append("pricePerDay", vehicleData.price);
      await api.post("/api/vehicle", formData, { headers: { "Content-Type": "multipart/form-data" } });
      await fetchVehicles(); return { success: true };
    } catch (error) { console.error("Failed to add vehicle:", error); return { success: false, message: error.response?.data?.message || "Failed" }; }
  };

  const deleteVehicle = async (vehicleId) => {
    try { await api.delete(`/api/vehicle/${vehicleId}`); await fetchVehicles(); return { success: true }; } 
    catch (error) { console.error("Failed to delete vehicle:", error); return { success: false }; }
  };

  const addLocation = async (locationData) => {
    try {
      await api.post("/api/locations", { name: locationData.name, address: locationData.name, city: "Default City", country: "PL", phone: "+48000000000" });
      await fetchLocations(); return { success: true };
    } catch (error) { console.error("Failed to add location:", error); return { success: false }; }
  };

  const deleteLocation = async (locationId) => {
    try { await api.delete(`/api/locations/${locationId}`); await fetchLocations(); return { success: true }; } 
    catch (error) { console.error("Failed to delete location:", error); return { success: false }; }
  };

  const updatePackagePrice = async (packageId, newPrice) => {
    try { await api.patch(`/api/packages/${packageId}`, { price: parseFloat(newPrice) }); } 
    catch (error) { console.error("Failed to update package price:", error); }
  };

  const updateAddonPrice = async (addonId, newPrice) => {
    try { await api.patch(`/api/addons/${addonId}`, { price: parseFloat(newPrice) }); } 
    catch (error) { console.error("Failed to update addon price:", error); }
  };

  const updateBookingStatus = async (bookingId, newStatus, newPrice = null) => {
    try {
      if (newPrice !== null) await api.patch(`/api/reservations/${bookingId}`, { totalPrice: parseFloat(newPrice) });
      await api.patch(`/api/reservations/${bookingId}/status`, { status: newStatus.toUpperCase() });
      
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
      setBookings(updated); saveState("cargo_bookings", updated);

      const booking = updated.find((b) => b.id === bookingId);
      if (!booking) return;

      if (newStatus === "confirmed") {
        logEmail({ id: "email_" + Math.random().toString(36).substr(2, 9), to: booking.customer.email, subject: `[CAR-GO.PL] Rezerwacja ${booking.id} Została Potwierdzona!`, body: "Confirmed email body...", date: new Date().toLocaleString() });
      } else if (newStatus === "cancelled") {
        logEmail({ id: "email_" + Math.random().toString(36).substr(2, 9), to: booking.customer.email, subject: `[CAR-GO.PL] Rezerwacja ${booking.id} Została Anulowana`, body: "Cancelled email body...", date: new Date().toLocaleString() });
      }
    } catch (error) { console.error("Failed to update booking status:", error); alert("Failed to update booking status."); }
  };

  const updateReview = async (reviewId, approved) => {
    try {
      await api.patch(`/api/reviews/${reviewId}/status`, { status: approved ? "APPROVED" : "PENDING" });
      const updated = reviews.map((r) => r.id === reviewId ? { ...r, approved } : r);
      setReviews(updated); saveState("cargo_reviews", updated);
    } catch (error) { console.error("Failed to update review:", error); }
  };

  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/api/reviews/${reviewId}`);
      const updated = reviews.filter((r) => r.id !== reviewId);
      setReviews(updated); saveState("cargo_reviews", updated);
    } catch (error) { console.error("Failed to delete review:", error); }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      
      // Robustly extract user and token from different possible response structures
      const responseData = response.data.data || response.data;
      const user = responseData.user || responseData;
      const token = responseData.token || response.data.token;

      if (token) {
        localStorage.setItem("token", token);
      }
      
      setUser(user);
      
      // Case-insensitive role check
      const userRole = user?.role?.toUpperCase();
      if (userRole === "ADMIN" || userRole === "EMPLOYEE") {
        const adminData = {
          username: user.email,
          role: userRole === "ADMIN" ? "owner" : "employee"
        };
        setAdminUser(adminData);
        saveState("cargo_admin", adminData);
      }
      
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logoutUser = async () => {
    try { await api.post("/api/auth/logout"); } catch (error) { console.error("Logout API error:", error); } 
    finally {
      clearUser(); setAdminUser(null);
      if (typeof window !== "undefined") { localStorage.removeItem("cargo_admin"); localStorage.removeItem("token"); }
    }
  };

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
    const localUser = localStorage.getItem("user");
    const localAdmin = localStorage.getItem("cargo_admin");
    const localTranslations = localStorage.getItem("cargo_translations");
    const localCmsTexts = localStorage.getItem("cargo_cmstexts");

    if (localVehicles) { try { setVehicles(JSON.parse(localVehicles)); } catch (e) { setVehicles(initialVehicles); } }
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
    
    fetchVehicles(); fetchLocations(); fetchPackages(); fetchAddons(); fetchBookings();
  }, []);

  const saveState = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } 
    catch (error) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn(`LocalStorage quota exceeded.`);
        localStorage.removeItem('cargo_emails'); localStorage.removeItem('cargo_bookings'); localStorage.removeItem('cargo_reviews');
        try { const trimmed = Array.isArray(value) ? value.slice(0, 10) : value; localStorage.setItem(key, JSON.stringify(trimmed)); } catch (e) {}
      }
    }
  };

  const updateLang = (newLang) => { setLang(newLang); localStorage.setItem("cargo_lang", newLang); };

  const addBooking = (newBooking) => {
    const updated = [newBooking, ...bookings].slice(0, 50);
    setBookings(updated); saveState("cargo_bookings", updated);
    logEmail({ id: "email_" + Math.random().toString(36).substr(2, 9), to: newBooking.customer.email, subject: `[CAR-GO.PL] Rezerwacja ${newBooking.id}`, body: "Booking received", date: new Date().toLocaleString() });
  };

  const logEmail = (emailLog) => {
    const updated = [emailLog, ...emails].slice(0, 100);
    setEmails(updated); saveState("cargo_emails", updated);
  };

  const addReview = (newReview) => {
    const updated = [newReview, ...reviews];
    setReviews(updated); saveState("cargo_reviews", updated);
  };

  const updateCmsTranslation = (language, key, text) => {
    const updated = { ...cmsTranslations, [language]: { ...cmsTranslations[language], [key]: text } };
    setCmsTranslations(updated); saveState("cargo_translations", updated);
  };

  const updateCmsText = (key, textPl, textEn) => {
    const updated = { ...cmsTexts, [key]: { pl: textPl, en: textEn } };
    setCmsTexts(updated); saveState("cargo_cmstexts", updated);
  };

  const saveVehicles = (updated) => { setVehicles(updated); saveState("cargo_vehicles", updated); };
  const saveLocations = (updated) => { setLocations(updated); saveState("cargo_locations", updated); };
  const savePackages = (updated) => { setPackages(updated); saveState("cargo_packages", updated); };
  const saveAddons = (updated) => { setAddons(updated); saveState("cargo_addons", updated); };
  const saveFaqs = (updated) => { setFaqs(updated); saveState("cargo_faqs", updated); };

  const setUser = (user) => {
    setCurrentUser(user);
    if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(user));
  };

  const clearUser = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("user");
  };

  const registerUser = async (userData) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      const { user } = response.data.data; setUser(user); return { success: true, user };
    } catch (error) { return { success: false, message: error.response?.data?.message || "Registration failed" }; }
  };

  const updateProfile = (phone, password = null) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, phone };
    setCurrentUser(updatedUser); saveState("cargo_user", updatedUser);
  };

  const loginAdmin = (username, password) => {
    if ((username === "admin" && password === "admin123") || (username === "employee" && password === "employee123")) {
      const role = username === "admin" ? "owner" : "employee";
      const admin = { username, role }; setAdminUser(admin); saveState("cargo_admin", admin); return true;
    }
    return false;
  };

  const logoutAdmin = () => { setAdminUser(null); localStorage.removeItem("cargo_admin"); };

  const t = (key) => {
    return cmsTranslations[lang]?.[key] || cmsTranslations["en"]?.[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        lang, setLang: updateLang, vehicles, setVehicles: saveVehicles, locations, setLocations: saveLocations,
        packages, setPackages: savePackages, addons, setAddons: saveAddons, faqs, setFaqs: saveFaqs,
        reviews, bookings, emails, currentUser, adminUser, cmsTexts, searchParams: searchParamsState, setSearchParams,
        fetchVehicles, fetchLocations, fetchPackages, fetchAddons, fetchBookings,
        addVehicle, deleteVehicle, addLocation, deleteLocation, updatePackagePrice, updateAddonPrice,
        t, addBooking, updateBookingStatus, addReview, updateReview, deleteReview,
        updateCmsTranslation, updateCmsText, registerUser, loginUser, logoutUser, updateProfile, loginAdmin, logoutAdmin, logEmail
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}