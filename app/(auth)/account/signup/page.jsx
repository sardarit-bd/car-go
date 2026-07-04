"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, AlertTriangle, Loader2, Mail, Phone } from "lucide-react";
import * as yup from "yup";
import { useApp } from "@/app/context/AppContext";

const signupSchema = yup.object().shape({
  firstName: yup.string().required("Imię jest wymagane").min(2, "Imię musi mieć minimum 2 znaki"),
  lastName: yup.string().required("Nazwisko jest wymagane").min(2, "Nazwisko musi mieć minimum 2 znaki"),
  email: yup.string().required("E-mail jest wymagany").email("Podaj poprawny adres e-mail"),
  phone: yup.string().required("Numer telefonu jest wymagany").matches(/^[+]?[\d\s-]{7,15}$/, "Podaj poprawny numer telefonu"),
  password: yup.string().required("Hasło jest wymagane").min(8, "Hasło musi mieć minimum 8 znaków").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Hasło musi zawierać małą literę, wielką literę oraz cyfrę"),
  confirmPassword: yup.string().required("Potwierdzenie hasła jest wymagane").oneOf([yup.ref("password")], "Hasła nie są identyczne"),
  terms: yup.boolean().oneOf([true], "Musisz zaakceptować regulamin"),
});

export default function CustomerSignup() {
  const router = useRouter();
  const { registerUser, t } = useApp(); // Use registerUser from context

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      await signupSchema.validate(formData, { abortEarly: false });
    } catch (validationError) {
      const errors = {};
      validationError.inner.forEach((err) => {
        if (!errors[err.path]) errors[err.path] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    // Call the centralized context function
    const result = await registerUser(payload);

    if (result.success) {
      router.push("/account"); // Redirect to account page after successful signup
    } else {
      if (result.message.toLowerCase().includes("exist")) {
        setError("Konto z tym adresem e-mail już istnieje. Przejdź do logowania.");
      } else {
        setError(result.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-28 animate-fade-in">
      <div className="glass-panel p-8 rounded-2xl space-y-6 shadow-sm border border-slate-100">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-800 uppercase">Rejestracja</h1>
          <p className="text-xs text-slate-500">Utwórz konto, aby dokonywać rezerwacji i zarządzać pojazdami.</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-brand-red/10 border border-brand-red/30 rounded-lg text-xs text-brand-red">
            <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" /><span>Imię</span>
              </label>
              <input type="text" name="firstName" placeholder="Jan" value={formData.firstName} onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white border ${fieldErrors.firstName ? "border-brand-red" : "border-slate-200"} focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400`} />
              {fieldErrors.firstName && <p className="text-[10px] text-brand-red mt-1 font-semibold">{fieldErrors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" /><span>Nazwisko</span>
              </label>
              <input type="text" name="lastName" placeholder="Kowalski" value={formData.lastName} onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white border ${fieldErrors.lastName ? "border-brand-red" : "border-slate-200"} focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400`} />
              {fieldErrors.lastName && <p className="text-[10px] text-brand-red mt-1 font-semibold">{fieldErrors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /><span>Adres e-mail</span>
            </label>
            <input type="email" name="email" placeholder="jan.kowalski@example.com" value={formData.email} onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-white border ${fieldErrors.email ? "border-brand-red" : "border-slate-200"} focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400`} />
            {fieldErrors.email && <p className="text-[10px] text-brand-red mt-1 font-semibold">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /><span>Numer telefonu</span>
            </label>
            <input type="tel" name="phone" placeholder="+48 123 456 789" value={formData.phone} onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-white border ${fieldErrors.phone ? "border-brand-red" : "border-slate-200"} focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400`} />
            {fieldErrors.phone && <p className="text-[10px] text-brand-red mt-1 font-semibold">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" /><span>Hasło</span>
            </label>
            <input type="password" name="password" placeholder="Minimum 8 znaków" value={formData.password} onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-white border ${fieldErrors.password ? "border-brand-red" : "border-slate-200"} focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400`} />
            {fieldErrors.password && <p className="text-[10px] text-brand-red mt-1 font-semibold">{fieldErrors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" /><span>Potwierdź hasło</span>
            </label>
            <input type="password" name="confirmPassword" placeholder="Powtórz hasło" value={formData.confirmPassword} onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-white border ${fieldErrors.confirmPassword ? "border-brand-red" : "border-slate-200"} focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400`} />
            {fieldErrors.confirmPassword && <p className="text-[10px] text-brand-red mt-1 font-semibold">{fieldErrors.confirmPassword}</p>}
          </div>

          <div className="flex items-start space-x-2">
            <input type="checkbox" name="terms" id="terms" checked={formData.terms} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-brand-red cursor-pointer" />
            <label htmlFor="terms" className="text-[11px] text-slate-500 leading-snug cursor-pointer">
              Akceptuję <Link href="/terms" className="text-brand-red font-bold">regulamin</Link> oraz <Link href="/privacy" className="text-brand-red font-bold">politykę prywatności</Link>.
            </label>
          </div>
          {fieldErrors.terms && <p className="text-[10px] text-brand-red font-semibold -mt-2">{fieldErrors.terms}</p>}

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg transition duration-200 shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Rejestracja...</>) : ("Zarejestruj się")}
          </button>

          <div className="text-center text-xs text-slate-500">
            Masz już konto? <Link href="/account/login" className="text-brand-red font-bold hover:underline">Zaloguj się</Link>
          </div>
        </form>
      </div>
    </div>
  );
}