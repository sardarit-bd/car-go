"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  KeyRound,
  Lock,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/app/context/AppContext";

export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword, verifyResetOtp, resetPasswordWithOtp, lang } =
    useApp();

  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError(
        lang === "en" ? "Email is required" : "E-mail jest wymagany",
      );
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email.toLowerCase().trim());
    setLoading(false);

    if (result.success) {
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError(
        lang === "en"
          ? "Enter the 6-digit code"
          : "Wprowadź 6-cyfrowy kod",
      );
      return;
    }

    setLoading(true);
    const result = await verifyResetOtp(email, otp);
    setLoading(false);

    if (result.success) {
      setStep(3);
    } else {
      setError(result.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError(
        lang === "en"
          ? "Password must be at least 6 characters"
          : "Hasło musi mieć minimum 6 znaków",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        lang === "en" ? "Passwords do not match" : "Hasła nie są identyczne",
      );
      return;
    }

    setLoading(true);
    const result = await resetPasswordWithOtp(
      email,
      otp,
      newPassword,
      confirmPassword,
    );
    setLoading(false);

    if (result.success) {
      setSuccessMessage(
        lang === "en"
          ? "Password changed successfully. Redirecting to login..."
          : "Hasło zostało zmienione. Przekierowywanie do logowania...",
      );
      setTimeout(() => {
        router.push("/account/login");
      }, 1800);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-28 animate-fade-in">
      <div className="glass-panel p-8 rounded-2xl space-y-6 shadow-sm border border-slate-100">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-800 uppercase">
            {lang === "en" ? "Reset Password" : "Resetowanie hasła"}
          </h1>
          <p className="text-xs text-slate-500">
            {step === 1 &&
              (lang === "en"
                ? "Enter your email to receive a reset code."
                : "Wprowadź swój e-mail, aby otrzymać kod resetowania.")}
            {step === 2 &&
              (lang === "en"
                ? `Enter the 6-digit code sent to ${email}.`
                : `Wprowadź 6-cyfrowy kod wysłany na ${email}.`)}
            {step === 3 &&
              (lang === "en"
                ? "Set your new password."
                : "Ustaw nowe hasło.")}
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-brand-red/10 border border-brand-red/30 rounded-lg text-xs text-brand-red">
            <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
            <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {step === 1 && !successMessage && (
          <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === "en" ? "Email address" : "Adres e-mail"}</span>
              </label>
              <input
                type="email"
                placeholder={
                  lang === "en"
                    ? "john.smith@example.com"
                    : "jan.kowalski@example.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg transition duration-200 shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === "en" ? "Sending..." : "Wysyłanie..."}
                </>
              ) : lang === "en" ? (
                "Send code"
              ) : (
                "Wyślij kod"
              )}
            </button>
          </form>
        )}

        {step === 2 && !successMessage && (
          <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === "en" ? "Verification code" : "Kod weryfikacyjny"}</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm tracking-[0.4em] text-center focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg transition duration-200 shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === "en" ? "Verifying..." : "Weryfikacja..."}
                </>
              ) : lang === "en" ? (
                "Verify code"
              ) : (
                "Zweryfikuj kod"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
              }}
              className="w-full text-xs text-slate-500 hover:text-brand-red font-semibold"
            >
              {lang === "en" ? "Use a different email" : "Użyj innego adresu e-mail"}
            </button>
          </form>
        )}

        {step === 3 && !successMessage && (
          <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === "en" ? "New password" : "Nowe hasło"}</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {lang === "en" ? "Confirm new password" : "Potwierdź nowe hasło"}
                </span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg transition duration-200 shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === "en" ? "Saving..." : "Zapisywanie..."}
                </>
              ) : lang === "en" ? (
                "Set new password"
              ) : (
                "Ustaw nowe hasło"
              )}
            </button>
          </form>
        )}

        {!successMessage && (
          <div className="text-center text-xs text-slate-500">
            <Link
              href="/account/login"
              className="text-brand-red font-bold hover:underline"
            >
              {lang === "en" ? "Back to login" : "Powrót do logowania"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}