"use client";
import { useTheme } from "./theme-context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";

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
    const { name, value, type } = e.target;
    if (type === "checkbox" && name === "languages") {
      const checked = (e.target as HTMLInputElement).checked;
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
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] py-16 text-center overflow-hidden">
        {/* Soft animated gradient background */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-[#23243a] dark:via-[#18181c] dark:to-[#23243a] opacity-80 animate-gradient-move"
        />
        {/* Decorative blurred circle */}
        <div
          aria-hidden
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-300/30 dark:bg-blue-900/30 rounded-full blur-3xl z-0"
        />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700 dark:from-blue-300 dark:via-blue-500 dark:to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
            Zainab Najmi
          </h1>
          <p className="text-2xl sm:text-3xl mb-4 font-light text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            Helping You{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-300">
              Heal
            </span>
            ,{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-300">
              Grow
            </span>
            , and{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-300">
              Thrive
            </span>
          </p>
          <span className="p-5 text-lg sm:text-xl text-blue-700 dark:text-blue-300 mb-8 block">
            Psychologist | Mental Wellness Expert | Therapy That Listens
          </span>
          {/* Call to Action */}
          <a
            href="#book-session"
            className="inline-block mt-4 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Book a Session
          </a>
          {/* Animated scroll down indicator */}
          <div className="mt-12 flex flex-col items-center animate-bounce">
            <span className="text-blue-600 dark:text-blue-300 text-3xl">
              &#8595;
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Scroll Down
            </span>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-8 py-8 px-4 max-w-3xl mx-auto bg-white/80 dark:bg-[#23243a]/80 rounded-xl shadow-md">
        <Image
          src="/zain.jpeg"
          alt="Profile"
          width={128}
          height={128}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
          priority
        />
        <div className="text-left">
          <h2 className="text-2xl font-semibold mb-2">About Me</h2>
          <p className="mb-2 text-base">
            I believe that &#39;Every Emotion is Important&#39; and my aim is to
            put my client&#39;s needs first in order to fully support them on
            their well-being journey. I come with significant experience in
            counselling adults across a wide range of mental health concerns from
            various cultural backgrounds. I am also an ABA therapist and certified
            in hypnosis and graphology.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            M.A. in Clinical Psychology | 7 Years Experience
          </p>
        </div>
      </section>

      {/* Fields of Expertise Section */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Fields of Expertise
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              label: "Depression",
              icon: "🫶",
              color:
                "from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800",
            },
            {
              label: "Anxiety",
              icon: "🌱",
              color:
                "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
            },
            {
              label: "Stress",
              icon: "💆‍♀️",
              color:
                "from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800",
            },
            {
              label: "Relationship Issues",
              icon: "💞",
              color:
                "from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
            },
            {
              label: "Adolescent Psychology",
              icon: "🧒",
              color:
                "from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
            },
            {
              label: "OCD",
              icon: "🔄",
              color:
                "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700",
            },
          ].map(({ label, icon, color }) => (
            <div
              key={label}
              className={`
                rounded-2xl shadow-md p-8 flex flex-col items-center justify-center text-center
                bg-gradient-to-br ${color}
                transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group
              `}
            >
              <span className="text-4xl mb-4 transition-transform group-hover:scale-125">
                {icon}
              </span>
              <span className="text-lg font-semibold mb-2">{label}</span>
              <span className="block h-1 w-8 bg-blue-400 dark:bg-blue-600 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </div>
          ))}
        </div>
      </section>

      {/* Her Approach Section */}
      <section className="py-12 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Therapy?</h2>
        <p className="text-base mb-2">
          My approach is client-centered, empathetic, and confidential. I believe
          in creating a safe space for you to share, heal, and grow at your own
          pace.
        </p>
      </section>

      {/* Book a Session Section */}
      <section id="book-session" className="py-12 px-4 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Book a Session</h2>
        <form
          className="flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a] placeholder-gray-400 dark:placeholder-gray-300"
          />
          <div className="w-full max-w-md flex gap-2">
            <select
              name="countryCode"
              value={form.countryCode || "+91"}
              onChange={handleChange}
              className="w-[50%] rounded-lg border border-gray-300 dark:border-gray-700 px-2 py-2 bg-white dark:bg-[#23243a] text-sm placeholder-gray-400 dark:placeholder-gray-300"
              required
            >
              <option value="+91">🇮🇳 India (+91)</option>
              <option value="+1">🇺🇸 USA (+1)</option>
              <option value="+44">🇬🇧 UK (+44)</option>
              <option value="+61">🇦🇺 Australia (+61)</option>
              <option value="+971">🇦🇪 UAE (+971)</option>
              <option value="+81">🇯🇵 Japan (+81)</option>
              <option value="+49">🇩🇪 Germany (+49)</option>
              <option value="+33">🇫🇷 France (+33)</option>
              <option value="+39">🇮🇹 Italy (+39)</option>
              <option value="+7">🇷🇺 Russia (+7)</option>
              <option value="+86">🇨🇳 China (+86)</option>
              <option value="+82">🇰🇷 South Korea (+82)</option>
              <option value="+34">🇪🇸 Spain (+34)</option>
              <option value="+55">🇧🇷 Brazil (+55)</option>
              <option value="+27">🇿🇦 South Africa (+27)</option>
              <option value="+92">🇵🇰 Pakistan (+92)</option>
              <option value="+880">🇧🇩 Bangladesh (+880)</option>
              <option value="+62">🇮🇩 Indonesia (+62)</option>
              <option value="+20">🇪🇬 Egypt (+20)</option>
              <option value="+966">🇸🇦 Saudi Arabia (+966)</option>
              <option value="+90">🇹🇷 Turkey (+90)</option>
              <option value="+48">🇵🇱 Poland (+48)</option>
              <option value="+31">🇳🇱 Netherlands (+31)</option>
              <option value="+41">🇨🇭 Switzerland (+41)</option>
              <option value="+46">🇸🇪 Sweden (+46)</option>
              <option value="+47">🇳🇴 Norway (+47)</option>
              <option value="+45">🇩🇰 Denmark (+45)</option>
              <option value="+358">🇫🇮 Finland (+358)</option>
              <option value="+64">🇳🇿 New Zealand (+64)</option>
              <option value="+63">🇵🇭 Philippines (+63)</option>
              <option value="+65">🇸🇬 Singapore (+65)</option>
              <option value="+60">🇲🇾 Malaysia (+60)</option>
              <option value="+66">🇹🇭 Thailand (+66)</option>
              <option value="+52">🇲🇽 Mexico (+52)</option>
              <option value="+1-876">🇯🇲 Jamaica (+1-876)</option>
              <option value="+1-809">🇩🇴 Dominican Republic (+1-809)</option>
              <option value="+1-868">🇹🇹 Trinidad & Tobago (+1-868)</option>
              <option value="+1-784">🇻🇨 St. Vincent (+1-784)</option>
              <option value="+1-758">🇱🇨 St. Lucia (+1-758)</option>
              <option value="+1-721">🇸🇽 Sint Maarten (+1-721)</option>
              <option value="+1-242">🇧🇸 Bahamas (+1-242)</option>
              <option value="+1-246">🇧🇧 Barbados (+1-246)</option>
              <option value="+1-441">🇧🇲 Bermuda (+1-441)</option>
              <option value="+1-473">🇬🇩 Grenada (+1-473)</option>
              <option value="+1-664">🇲🇸 Montserrat (+1-664)</option>
              <option value="+1-869">🇰🇳 St. Kitts & Nevis (+1-869)</option>
              <option value="+1-345">🇰🇾 Cayman Islands (+1-345)</option>
              <option value="+1-649">🇹🇨 Turks & Caicos (+1-649)</option>
              <option value="+1-767">🇩🇲 Dominica (+1-767)</option>
              <option value="+1-809">🇩🇴 Dominican Republic (+1-809)</option>
              <option value="+1-868">🇹🇹 Trinidad & Tobago (+1-868)</option>
              {/* Add more as needed */}
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{7,15}"
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a] placeholder-gray-400 dark:placeholder-gray-300"
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
            className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a] placeholder-gray-400 dark:placeholder-gray-300"
            rows={4}
          />
          <div className="w-full max-w-md flex flex-col gap-2">
            <label className="text-left font-medium mb-1">
              Comfortable Language(s):
            </label>
            <div className="flex gap-4">
              {[
                {
                  label: "Hindi/Urdu",
                  value: "Hindi",
                  color: "bg-yellow-100 dark:bg-yellow-900",
                },
                {
                  label: "English",
                  value: "English",
                  color: "bg-blue-100 dark:bg-blue-900",
                },
                {
                  label: "Gujrati",
                  value: "Gujrati",
                  color: "bg-green-100 dark:bg-green-900",
                },
              ].map(({ label, value, color }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer shadow-sm transition-all border border-gray-200 dark:border-gray-700 ${color} hover:scale-105`}
                >
                  <input
                    type="checkbox"
                    name="languages"
                    value={value}
                    checked={form.languages.includes(value)}
                    onChange={handleChange}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span className="font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-blue-700 transition"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
          {status === "success" && (
            <p className="text-green-600 mt-2">
              Message sent!. Will get back to you shortly
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 mt-2">Failed to send. Try again.</p>
          )}
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
              <h3 className="text-lg font-semibold mb-2">
                Feature Under Development
              </h3>
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
          <a
            href="https://www.linkedin.com/in/zainab-najmi-3936b116a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank"
            rel="noopener"
            className="hover:scale-110 transition-transform"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-6 h-6 text-blue-700 dark:text-blue-300" />
          </a>
          <a
            href="https://instagram.com/healthymind_14"
            target="_blank"
            rel="noopener"
            className="hover:scale-110 transition-transform"
            aria-label="Instagram"
          >
            <FaInstagram className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </a>
        </div>
        <span className="text-xs text-gray-500">
          © {new Date().getFullYear()} Zainab Najmi. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
