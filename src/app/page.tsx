"use client";
import { useTheme } from "./theme-context";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    email: "",
    message: "",
    languages: [] as string[],
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "languages") {
      setForm((prev) => ({
        ...prev,
        languages: checked
          ? [...prev.languages, value]
          : prev.languages.filter((lang) => lang !== value),
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const payload = {
      ...form,
      phone: `${form.countryCode || "+91"}${form.phone}`,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        setForm({
          name: "",
          countryCode: "+91",
          phone: "",
          email: "",
          message: "",
          languages: [],
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6fa] via-[#e3eafc] to-[#f7f7f7] dark:from-[#18181c] dark:via-[#23243a] dark:to-[#222] transition-colors text-neutral-900 dark:text-white">
      {/* Header with theme toggle */}
      <header className="w-full flex justify-end items-center h-[56px] px-6 pt-4">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#e3eafc] dark:hover:bg-[#23243a] hover:border-transparent font-medium text-sm px-4 py-2"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        )}
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] py-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Dr. [Her Name]</h1>
        <p className="text-xl sm:text-2xl mb-2 font-light">Helping You Heal, Grow, and Thrive</p>
        <span className="text-base sm:text-lg text-blue-700 dark:text-blue-300 mb-8">Psychologist | Mental Wellness Expert | Therapy That Listens</span>
      </section>

      {/* About Me Section */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-8 py-8 px-4 max-w-3xl mx-auto bg-white/80 dark:bg-[#23243a]/80 rounded-xl shadow-md">
        <img src="/profile-placeholder.jpg" alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900" />
        <div className="text-left">
          <h2 className="text-2xl font-semibold mb-2">About Me</h2>
          <p className="mb-2 text-base">I am a passionate psychologist with over 10 years of experience helping individuals find balance, healing, and growth. My approach is warm, empathetic, and client-centered. [Placeholder bio]</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">PhD in Clinical Psychology | 10+ Years Experience</p>
        </div>
      </section>

      {/* Fields of Expertise Section */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Fields of Expertise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {['Anxiety', 'Depression', 'Relationship Therapy', 'Adolescent Psychology', 'CBT', 'Mindfulness'].map((field) => (
            <div key={field} className="bg-white dark:bg-[#23243a] rounded-xl shadow-sm p-6 text-center transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer">
              <span className="text-lg font-medium">{field}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Her Approach Section */}
      <section className="py-12 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Therapy?</h2>
        <p className="text-base mb-2">My approach is client-centered, empathetic, and confidential. I believe in creating a safe space for you to share, heal, and grow at your own pace. [Placeholder approach]</p>
      </section>

      {/* Book a Session Section */}
      <section className="py-12 px-4 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Book a Session</h2>
        <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a]"
          />
          <div className="w-full max-w-md flex gap-2">
            <select
              name="countryCode"
              value={form.countryCode || "+91"}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-2 py-2 bg-white dark:bg-[#23243a] text-sm"
              required
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+971">🇦🇪 +971</option>
              {/* Add more country codes as needed */}
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{7,15}"
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a]"
            />
          </div>
          {/* <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a]"
          /> */}
          
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a]"
            rows={4}
          />
          <div className="w-full max-w-md flex flex-col gap-2">
            <label className="text-left font-medium mb-1">Comfortable Language(s):</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="languages"
                  value="Hindi"
                  checked={form.languages.includes("Hindi")}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Hindi
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="languages"
                  value="English"
                  checked={form.languages.includes("English")}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                English
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="languages"
                  value="Lisan"
                  checked={form.languages.includes("Lisan")}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Lisan
              </label>
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-blue-700 transition">
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
          {status === "success" && <p className="text-green-600 mt-2">Message sent!. Will get back to you shortly</p>}
          {status === "error" && <p className="text-red-600 mt-2">Failed to send. Try again.</p>}
        </form>
        <p className="mt-4 text-sm text-gray-500">
          Or{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowPopup(true);
            }}
            className="underline text-blue-600 cursor-pointer"
          >
            schedule a call
          </a>
        </p>
        {showPopup && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#23243a] rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold mb-2">Feature Under Development</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The {"Schedule a Call"} feature is coming soon!
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className="w-full py-6 flex flex-col items-center gap-2 bg-white/80 dark:bg-[#23243a]/80 mt-8">
        <div className="flex gap-4 mb-2">
          <a href="https://linkedin.com/" target="_blank" rel="noopener" className="hover:underline text-blue-700 dark:text-blue-300">LinkedIn</a>
          <a href="https://instagram.com/" target="_blank" rel="noopener" className="hover:underline text-pink-600 dark:text-pink-400">Instagram</a>
        </div>
        <span className="text-xs text-gray-500">© {new Date().getFullYear()} Dr. [Her Name]. All rights reserved.</span>
      </footer>
    </div>
  );
}
