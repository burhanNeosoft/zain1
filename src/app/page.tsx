"use client";
import { useTheme } from "./ThemeProvider";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import Slot from "@/models/Slot";

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
  // Add this state for slots
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  // New state
  const [activeDate, setActiveDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Add these helper functions and computed values
  const to12h = (hm: string) => {
    const [h, m] = hm.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = (h % 12) || 12;
    return `${hh}:${m.toString().padStart(2, "0")} ${ampm}`;
  };
  const to12hRange = (range: string) => {
    const [s, e] = range.split("-");
    return `${to12h(s)} - ${to12h(e)}`;
  };

  // Group slots by date
  const grouped = availableSlots.reduce((acc: Record<string, any[]>, slot: any) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});
  const dates = Object.keys(grouped);

  const cleanupPastSlots = async () => {
    // Call cleanup via API
    fetch('/api/admin/slots', { method: 'DELETE' })
    .then(res => res.json())
    .then(data => console.log(data.message))
    .catch(err => console.error('Cleanup failed:', err));
  };

  useEffect(() => { 
    setMounted(true); 
    //cleanupPastSlots();
  }, []);

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

  // Add this function to fetch available slots
  const fetchAvailableSlots = async (date?: string) => {
    setLoadingSlots(true);
    try {
      const response = await fetch(`/api/admin/slots${date ? `?date=${date}` : ""}`);
      const data = await response.json();
      if (data.success) {
        // Filter only available (not booked) slots
        const available = data.slots.filter((slot: any) => !slot.isBooked);
        setAvailableSlots(available);
        const firstDate = available[0]?.date || date || "";
        setActiveDate(firstDate);
        setSelectedSlot(null);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Add useEffect to fetch slots when popup opens
  useEffect(() => {
    if (showPopup) {
      fetchAvailableSlots();
    }
  }, [showPopup]);

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
      <section
        className="relative flex flex-col sm:flex-row items-center justify-center gap-8 py-10 px-6 max-w-3xl mx-auto
          bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-[#23243a] dark:via-[#23243a] dark:to-[#18181c]
          rounded-2xl shadow-xl border-l-8 border-blue-200 dark:border-blue-800 animate-fade-in"
      >
        {/* Decorative quote icon */}
        <span className="absolute -top-6 left-6 text-5xl text-blue-200 dark:text-blue-900 opacity-60 select-none pointer-events-none">
          &ldquo;
        </span>
        <Image
          src="/zain.jpeg"
          alt="Profile"
          width={128}
          height={128}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900 shadow-lg"
          priority
        />
        <div className="text-left flex-1">
          <h2 className="text-3xl font-bold mb-2 text-blue-700 dark:text-blue-300">
            About Me
          </h2>
          <p className="mb-3 text-base leading-relaxed text-gray-700 dark:text-gray-200">
            I believe that{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-300">
              &quot;Every Emotion is Important&quot;
            </span>{" "}
            and my aim is to put my client&#39;s needs first in order to fully
            support them on their well-being journey. I come with significant
            experience in counselling adults across a wide range of mental health
            concerns from various cultural backgrounds. I am also an{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-300">
              ABA therapist
            </span>{" "}
            and certified in hypnosis and graphology.
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">
            M.A. in Clinical Psychology &bull; 7 Years Experience
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
      <section className="py-12 px-4 max-w-3xl mx-auto text-center relative">
        {/* Decorative background blur */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 flex justify-center items-center"
        >
          <div className="w-72 h-72 bg-blue-200/40 dark:bg-blue-900/30 rounded-full blur-3xl mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
          <span className="text-3xl">🧠</span> Why Therapy?
        </h2>
        <p className="text-lg mb-4 text-gray-700 dark:text-gray-200 font-medium max-w-2xl mx-auto">
          My approach is{" "}
          <span className="text-blue-600 dark:text-blue-300 font-semibold">
            client-centered
          </span>
          ,{" "}
          <span className="text-blue-600 dark:text-blue-300 font-semibold">
            empathetic
          </span>
          , and{" "}
          <span className="text-blue-600 dark:text-blue-300 font-semibold">
            confidential
          </span>
          .
        </p>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          I believe in creating a{" "}
          <span className="italic">safe space</span> for you to share, heal, and
          grow at your own pace. Every journey is unique, and together we’ll find
          the path that feels right for you.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm font-semibold shadow-sm">
            Empathy
          </span>
          <span className="inline-block px-4 py-2 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-sm font-semibold shadow-sm">
            Confidentiality
          </span>
          <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-sm font-semibold shadow-sm">
            Support
          </span>
        </div>
      </section>

      {/* Book a Session Section */}
      <section
        id="book-session"
        className="py-14 px-4 max-w-2xl mx-auto text-center relative"
      >
        {/* Decorative blurred background */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 flex justify-center items-center"
        >
          <div className="w-80 h-80 bg-blue-200/40 dark:bg-blue-900/30 rounded-full blur-3xl mx-auto"></div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
          <span className="text-2xl">📅</span> Book a Session
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-300 text-base max-w-lg mx-auto">
          Ready to take the next step? Fill out the form below and I’ll get back to you as soon as possible.
        </p>
        <form
          className="flex flex-col gap-4 items-center bg-white/80 dark:bg-[#18181c]/80 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900 backdrop-blur"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a] placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
          />
          <div className="w-full max-w-md flex gap-2">
            <select
              name="countryCode"
              value={form.countryCode || "+91"}
              onChange={handleChange}
              className="w-[50%] rounded-lg border border-gray-300 dark:border-gray-700 px-2 py-2 bg-white dark:bg-[#23243a] text-sm placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
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
              {/* ...add more as needed... */}
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{7,15}"
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a] placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
          {/* <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a] placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
          /> */}
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#23243a] placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
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
            className="bg-blue-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-400"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
          {status === "success" && (
            <p className="text-green-600 mt-2">
              Message sent! Will get back to you shortly.
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
        {/* Replace the popup with this expandable section */}
        <section className="py-14 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-300">
              📅 Schedule a Session
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose your preferred date and time for a consultation
            </p>
          </div>

          {/* Toggle Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>{showPopup ? "Hide" : "Show"} Available Slots</span>
              <span className={`transition-transform duration-300 ${showPopup ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>

          {/* Expandable Content */}
          <div className={`transition-all duration-500 overflow-hidden ${
            showPopup ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white/80 dark:bg-[#18181c]/80 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900 backdrop-blur">
              {loadingSlots ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading available slots...</p>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="space-y-6">
                  {/* Date pills - horizontal scroll */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-3 pb-2 min-w-max">
                      {dates.map((date) => (
                        <button
                          key={date}
                          onClick={() => {
                            setActiveDate(date);
                            setSelectedSlot(null);
                          }}
                          className={`whitespace-nowrap px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                            activeDate === date
                              ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                              : "bg-white dark:bg-[#23243a] text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:shadow-md"
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(date).getDate()}
                          </div>
                          <div className="text-xs opacity-75">
                            {new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time slots grid */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Available Times for {activeDate && new Date(activeDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric"
                      })}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {grouped[activeDate]?.map((slot: any) => {
                        const selected = selectedSlot?._id === slot._id;
                        return (
                          <button
                            key={slot._id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                              selected
                                ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                                : "bg-white dark:bg-[#23243a] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-md hover:scale-102"
                            }`}
                          >
                            <div className="text-lg font-semibold">
                              {to12hRange(slot.time)}
                            </div>
                            <div className="text-xs opacity-75 mt-1">
                              {selected ? "Selected" : "Click to select"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Confirmation section */}
                  {selectedSlot && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="text-center space-y-4">
                        <div className="text-2xl">🎉</div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          Session Confirmed!
                        </h4>
                        <div className="space-y-2 text-gray-600 dark:text-gray-400">
                          <p className="font-medium">
                            {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric"
                            })}
                          </p>
                          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            {to12hRange(selectedSlot.time)}
                          </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => {
                              alert(`Booking confirmed for ${selectedSlot.date} at ${to12hRange(selectedSlot.time)}`);
                              setSelectedSlot(null);
                              setShowPopup(false);
                            }}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                          >
                            Confirm Booking
                          </button>
                          <button
                            onClick={() => setSelectedSlot(null)}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                          >
                            Change Selection
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🙁</div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    No Available Slots
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please check back later or contact us directly to schedule a session.
                  </p>
                  <button
                    onClick={() => fetchAvailableSlots()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Refresh Slots
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
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
