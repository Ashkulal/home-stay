import { useState, useRef, useEffect } from "react";

const PHONE = "919481580589";

const KB = [
  { patterns: [/hi|hello|hey|namaste/i], response: "Hello! Welcome to Silent Peak Kudremukh! 🏔️ How can I help you today?" },
  { patterns: [/price|cost|rate|how\s*much|tariff|budget/i], response: "💰 Silent Peak Pricing:\n\n👤 ₹1,500 per person per night\n🍳 Home-cooked food included\n🏔️ Mountain views included\n\nContact us for group discounts!" },
  { patterns: [/book|reserv|stay|room|available/i], response: "📞 To book your stay:\n\n📱 WhatsApp: +91 94815 80589\n📞 Call: +91 94815 80589\n📝 Or use the Contact form\n\nWe'll confirm availability!" },
  { patterns: [/location|where|direction|address|reach/i], response: "📍 Silent Peak Kudremukh Homestay\nKudremukh, Chikkamagaluru, Karnataka\n\n🚗 From Bangalore: ~5-6 hours by road\n\nWhatsApp us for live directions!" },
  { patterns: [/check.?in|check.?out|time/i], response: "⏰ Timings:\n🕐 Check-in: 12:00 PM\n🕐 Check-out: 11:00 AM\n\n📞 Need early/late? Message us!" },
  { patterns: [/amenit|wifi|parking|feature|offer/i], response: "🏔️ Amenities:\n✅ Free Wi-Fi\n✅ Parking\n✅ Mountain View\n✅ Homemade Food\n✅ Campfire\n✅ Garden\n✅ Hot Water" },
  { patterns: [/food|eat|meal|coffee|veg|non.?veg/i], response: "🍽️ Food:\n🍳 Breakfast: Dosa, Idli, Pongal\n🍛 Lunch: Rice, Sambar, Curry\n🍽️ Dinner: Roti, Rice, Dal\n☕ Fresh coffee from estate" },
  { patterns: [/contact|phone|whatsapp|call|number/i], response: "📞 Contact:\n📱 WhatsApp: +91 94815 80589\n📞 Call: +91 94815 80589\n📧 info@silentpeak.in" },
  { patterns: [/trek|trekking|hike|adventure|activity/i], response: "🥾 Activities:\n🏔️ Trekking\n🐴 Horse Riding\n🚙 Jeep Safari\n⛺ Camping\n🔥 Campfire\n🌿 Nature Walk\n🐦 Bird Watching\n📸 Photography" },
  { patterns: [/weather|season|best\s*time|when/i], response: "🌤️ Best Time:\n🍂 Oct-Feb: Best - cool & pleasant\n🌧️ Jun-Sep: Monsoon - lush green\n☀️ Mar-May: Summer - warm" },
  { patterns: [/thank|thanks/i], response: "You're welcome! 😊 Anything else about Silent Peak?" },
  { patterns: [/bye|goodbye/i], response: "Goodbye! 🏔️ Hope to see you at Silent Peak soon!" },
];

const FALLBACK = [
  "I can help with pricing, food, activities, and more. Try asking!",
  "Great question! WhatsApp us at +91 94815 80589 for quick help.",
  "Not sure about that. Want me to connect you with our team?",
];

function getAIResponse(input) {
  const text = input.toLowerCase().trim();
  for (const item of KB) {
    for (const pattern of item.patterns) {
      if (pattern.test(text)) return item.response;
    }
  }
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm the Silent Peak AI assistant. Ask me about pricing, food, activities, or peaks! 🏔️" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((p) => [...p, { from: "user", text: text.trim() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((p) => [...p, { from: "bot", text: getAIResponse(text) }]);
      setTyping(false);
    }, 600 + Math.random() * 600);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-red-500 hover:bg-red-400 rotate-0" : "bg-gold-500 hover:bg-gold-400 animate-bounce"
        }`}>
        <span className="text-forest-900 text-2xl">{isOpen ? "✕" : "💬"}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-3 left-3 sm:left-auto sm:w-[380px] sm:right-5 z-50 glass rounded-2xl shadow-2xl gold-border overflow-hidden flex flex-col" style={{ height: "min(520px, calc(100vh - 120px))" }}>
          <div className="bg-gradient-to-r from-forest-700 to-forest-800 p-4 border-b border-gold-500/20">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="w-10 h-10 rounded-full border border-gold-500/30" />
              <div>
                <p className="font-bold text-gold-500">Silent Peak AI</p>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span> Online
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "bg-gold-500 text-forest-900 rounded-br-md"
                    : "glass text-gray-300 gold-border rounded-bl-md"
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="glass gold-border px-4 py-3 rounded-2xl rounded-bl-md text-sm">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gold-500/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-gold-500/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-gold-500/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="px-3 py-2 border-t border-gold-500/10 flex gap-1.5 overflow-x-auto">
            {["💰 Price", "📅 Check-in", "🍽️ Food", "🥾 Activities", "📍 Location"].map((label, i) => (
              <button key={i} onClick={() => send(label.slice(2))}
                className="shrink-0 glass text-gold-500 text-xs px-3 py-1.5 rounded-full hover:bg-gold-500/10 transition-colors gold-border">
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="p-3 border-t border-gold-500/10 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about price, food, peaks..."
              className="flex-1 bg-forest-900/50 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none gold-border focus:border-gold-500" />
            <button type="submit" disabled={!input.trim()}
              className="bg-gold-500 text-forest-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold-400 transition-colors disabled:opacity-40 shrink-0 font-bold">
              →
            </button>
          </form>

          <div className="px-4 py-2 border-t border-gold-500/10">
            <a href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-green-400 text-xs font-semibold hover:text-green-300 transition-colors">
              💬 Chat on WhatsApp for human support
            </a>
          </div>
        </div>
      )}
    </>
  );
}
