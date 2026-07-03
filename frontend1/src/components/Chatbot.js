import { useState, useRef, useEffect } from "react";

const WHATSAPP = "918660874196";

const BOT_RESPONSES = {
  greetings: ["Hello! Welcome to Ibbani Homestay 🏡", "Hi there! How can I help you today?", "Namaste! Welcome to Ibbani Homestay"],
  booking: [
    "To book your stay:\n1. Register/Login\n2. Go to Bookings\n3. Select dates & confirm\n4. Pay via UPI\n\nNeed help? Chat on WhatsApp!"
  ],
  price: [
    "Our homestay starts at ₹120/night.\n\n👨‍👩‍👧‍👦 Up to 4 guests\n🍳 Home-cooked food included\n🏔️ Mountain views\n\nBook now for the best experience!"
  ],
  location: [
    "Ibbani Homestay is located in the beautiful Western Ghats of Karnataka.\n\n📍 Google Maps link available on our homestay page\n🚗 Easy access by road from Bangalore (5-6 hrs)"
  ],
  checkin: [
    "⏰ Check-in: 12:00 PM\n⏰ Check-out: 11:00 AM\n\nEarly check-in / late check-out available on request. Just WhatsApp us!"
  ],
  amenities: [
    "Amenities at Ibbani Homestay:\n✅ WiFi\n✅ Parking\n✅ Mountain View\n✅ Home Food\n✅ Bonfire\n✅ Garden\n✅ Coffee Estate nearby"
  ],
  contact: [
    "📱 WhatsApp: +91 8660874196\n📧 Email: info@ibbanistay.com\n💳 UPI: paytmqr70c5mh@ptys\n\nChat on WhatsApp for instant response!"
  ],
  food: [
    "🍛 Authentic Malnad cuisine served!\n\n🍳 Breakfast: Dosa, Idli, Pongal\n🍛 Lunch: Rice, Sambar, Rasam, Curry\n🍽️ Dinner: Roti, Rice, Dal, Curry\n☕ Fresh coffee from our estate"
  ],
  cancel: [
    "To cancel a booking:\n1. Go to My Bookings\n2. Click 'Cancel' on the pending booking\n\nRefund will be processed within 3-5 business days."
  ],
  fallback: [
    "I'm not sure about that. Let me connect you with our team on WhatsApp!",
    "Great question! Our team can help on WhatsApp.",
    "I can help with bookings, prices, check-in times, and more. Try asking about those!"
  ]
};

function getResponse(input) {
  const text = input.toLowerCase();

  if (text.match(/hi|hello|hey|namaste|good morning|good evening/)) return randomOf(BOT_RESPONSES.greetings);
  if (text.match(/book|reserv|stay|room/)) return randomOf(BOT_RESPONSES.booking);
  if (text.match(/price|cost|rate|charge|how much|tariff/)) return randomOf(BOT_RESPONSES.price);
  if (text.match(/location|where|map|direction|address|find/)) return randomOf(BOT_RESPONSES.location);
  if (text.match(/check.?in|check.?out|time|arrival|depart/)) return randomOf(BOT_RESPONSES.checkin);
  if (text.match(/amenit|facilit|wifi|parking|food|bonfire|feature/)) return randomOf(BOT_RESPONSES.amenities);
  if (text.match(/contact|phone|whatsapp|email|call|number/)) return randomOf(BOT_RESPONSES.contact);
  if (text.match(/food|eat|meal|breakfast|lunch|dinner|menu|cook|coffee/)) return randomOf(BOT_RESPONSES.food);
  if (text.match(/cancel|refund|cancell/)) return randomOf(BOT_RESPONSES.cancel);

  return randomOf(BOT_RESPONSES.fallback);
}

function randomOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm the Ibbani Homestay assistant. Ask me anything about our homestay, booking, pricing, or amenities! 🏡" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { from: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botMsg = { from: "bot", text: getResponse(text) };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const quickActions = [
    { label: "💰 Pricing", text: "What are the prices?" },
    { label: "📅 Check-in", text: "What are check-in times?" },
    { label: "📍 Location", text: "Where is the homestay?" },
    { label: "🍽️ Food", text: "What food is served?" },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-red-500 hover:bg-red-600 rotate-0" : "bg-emerald-600 hover:bg-emerald-700 animate-bounce"
        }`}
      >
        <span className="text-white text-2xl">{isOpen ? "✕" : "💬"}</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: "500px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🏡</div>
              <div>
                <p className="font-bold">Ibbani Homestay</p>
                <p className="text-emerald-100 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full"></span> Online now
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "bg-emerald-600 text-white rounded-br-md"
                    : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-md"
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-400 shadow-sm border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md text-sm">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEnd} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
            {quickActions.map((qa, i) => (
              <button key={i} onClick={() => sendMessage(qa.text)}
                className="shrink-0 bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors font-medium border border-emerald-100">
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about booking, price, food..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="submit" disabled={!input.trim()}
              className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-40 shrink-0">
              →
            </button>
          </form>

          {/* WhatsApp CTA */}
          <div className="px-4 py-2 bg-green-50 border-t border-green-100">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-green-700 text-xs font-semibold hover:text-green-800">
              💬 Chat with us on WhatsApp for instant support
            </a>
          </div>
        </div>
      )}
    </>
  );
}
