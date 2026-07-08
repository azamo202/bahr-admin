"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";


// تعريف واجهة استجابة الخادم لضمان أمان الأنواع
interface LoginResponse {
  status: boolean;
  message?: string;
  data?: {
    token: string;
    admin: Record<string, unknown>;
  };
}

export default function AdminLogin() {
  const { t, i18n } = useTranslation();
  const isRtl = ['ar', 'ku'].includes(i18n.language);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق المبدئي من البيانات
    if (!email.trim() || !password.trim()) {
      setError(t('login.emptyFields', "يرجى إدخال البريد الإلكتروني وكلمة المرور."));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const apiUrl = API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.status && data.data) {
        setSuccess(data.message || "تم تسجيل الدخول بنجاح.");

        // ملاحظة أمنية: في بيئات الإنتاج عالية الحساسية، يُفضل تخزين التوكن في HttpOnly Cookies بدلاً من LocalStorage
        localStorage.setItem("admin_token", data.data.token);
        localStorage.setItem("admin_data", JSON.stringify(data.data.admin));

        // التوجيه الفوري إلى صفحة الداشبورد
        navigate("/");
      } else {
        setError(
          data.message || "بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.",
        );
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        "حدث خطأ في الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقاً.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-[#0b132b] overflow-hidden px-4 sm:px-6 lg:px-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* عناصر الخلفية المتدرجة والفقاعات اللونية */}
      <div className="absolute top-[-20%] start-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#00b4d8]/20 via-[#0077b6]/10 to-transparent blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] end-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#d32f2f]/15 via-[#ff9800]/5 to-transparent blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] end-[10%] w-[35%] h-[35%] rounded-full bg-gradient-to-br from-[#00b4d8]/10 via-[#d32f2f]/5 to-transparent blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-md w-full bg-[#1c2541]/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 z-10 transition-all duration-300 hover:border-white/20">
        {/* قسم الشعار والعنوان */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00b4d8] to-[#d32f2f] opacity-30 blur-md scale-110"></div>
              <div className="relative h-28 w-28 rounded-full bg-[#0b132b]/95 border-2 border-white/10 shadow-2xl p-1.5 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {t('login.title', "تسجيل الدخول للإدارة")}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            {t('login.subtitle', "يرجى إدخال بياناتك للوصول إلى لوحة التحكم")}
          </p>
        </div>

        {/* التنبيهات (النجاح أو الخطأ) */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2 ms-1"
            >
              {t('login.email', "البريد الإلكتروني")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ps-11 pe-4 py-3 bg-[#0b132b]/60 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] focus:bg-[#0b132b]/95 text-white placeholder-gray-500 outline-none transition-all duration-300"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2 ms-1"
            >
              {t('login.password', "كلمة المرور")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-11 pe-11 py-3 bg-[#0b132b]/60 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] focus:bg-[#0b132b]/95 text-white placeholder-gray-500 outline-none transition-all duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#d32f2f] hover:from-[#0096c7] hover:to-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b132b] focus:ring-[#00b4d8] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t('login.verifying', "جاري التحقق...")}
              </span>
            ) : (
              t('login.submit', "دخول")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

