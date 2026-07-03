import { useState, useRef, useEffect } from "react";

const WHATSAPP = "918660874196";

const KB = [
  {
    patterns: [/hi|hello|hey|namaste|good\s*(morning|evening|afternoon)/i],
    response: "Hello! Welcome to Ibbani Homestay! 🏡 How can I help you today?"
  },
  {
    patterns: [/how\s*are\s*you|how.*doing/i],
    response: "I'm doing great, thank you! Ready to help you plan your mountain getaway at Ibbani Homestay. What would you like to know?"
  },
  {
    patterns: [/book|reserv|stay|room|available|availability/i],
    response: "To book your stay at Ibbani Homestay:\n\n1️⃣ Register/Login on our website\n2️⃣ Go to Bookings → New Booking\n3️⃣ Select dates & number of guests\n4️⃣ Pay via Razorpay or UPI\n\n💡 Pricing: ₹1,500 per person per night\n📞 WhatsApp us for quick booking: +91 8660874196"
  },
  {
    patterns: [/price|cost|rate|charge|how\s*much|tariff|fee|budget/i],
    response: "💰 Ibbani Homestay Pricing:\n\n👤 ₹1,500 per person per night\n👥 Up to 4 guests per room\n🍳 Home-cooked food included\n🏔️ Mountain views included\n\nExample: 2 guests × 2 nights = ₹6,000\n\nBook now on our website!"
  },
  {
    patterns: [/location|where|map|direction|address|find|reach|distance/i],
    response: "📍 Ibbani Homestay is located in the beautiful Western Ghats of Karnataka.\n\n🚗 From Bangalore: ~5-6 hours by road\n🗺️ Google Maps link available on our homestay page\n\nWould you like directions? Chat on WhatsApp for live location sharing!"
  },
  {
    patterns: [/check.?in|check.?out|time|arrival|depart|early|late/i],
    response: "⏰ Check-in & Check-out Times:\n\n🕐 Check-in: 12:00 PM (Noon)\n🕐 Check-out: 11:00 AM\n\n📞 Need early check-in or late check-out? Message us on WhatsApp and we'll try to accommodate!"
  },
  {
    patterns: [/amenit|facilit|wifi|parking|feature|what.*offer|what.*get/i],
    response: "🏡 Amenities at Ibbani Homestay:\n\n✅ WiFi\n✅ Parking\n✅ Mountain Views\n✅ Home-Cooked Food\n✅ Bonfire\n✅ Garden\n✅ Coffee Estate nearby\n✅ Clean rooms with attached bathroom\n\nAll included in your stay!"
  },
  {
    patterns: [/food|eat|meal|breakfast|lunch|dinner|menu|cook|coffee|veg|non.?veg/i],
    response: "🍽️ Food at Ibbani Homestay:\n\n🍳 Breakfast: Dosa, Idli, Pongal, Poori\n🍛 Lunch: Rice, Sambar, Rasam, Vegetable Curry\n🍽️ Dinner: Roti, Rice, Dal, Curry, Salad\n☕ Fresh coffee from our estate\n\nAll meals are home-cooked with local spices. Veg & Non-veg options available."
  },
  {
    patterns: [/contact|phone|whatsapp|email|call|number|reach.*you/i],
    response: "📞 Contact Ibbani Homestay:\n\n📱 WhatsApp: +91 8660874196\n📧 Email: info@ibbanihomestay.com\n💳 UPI: paytmqr70c5mh@ptys\n\n💬 WhatsApp is the fastest way to reach us!"
  },
  {
    patterns: [/cancel|refund|cancell/i],
    response: "❌ Cancellation Policy:\n\n• Cancel before check-in: Full refund\n• Cancel on check-in day: 50% refund\n• No-show: No refund\n\nTo cancel, go to My Bookings → Cancel.\nRefund processed within 3-5 business days."
  },
  {
    patterns: [/pay|payment|upi|razorpay|card|netbank|wallet/i],
    response: "💳 Payment Options:\n\n1️⃣ Razorpay: UPI, Credit/Debit Cards, Netbanking, Wallets\n2️⃣ UPI QR Code: Scan & pay\n3️⃣ Manual: Pay and submit transaction ID\n\nAll payments are secure. You'll get instant confirmation!"
  },
  {
    patterns: [/weather|season|best\s*time|when.*visit|monsoon|winter|summer/i],
    response: "🌤️ Best Time to Visit Ibbani Homestay:\n\n🍂 Oct-Feb: Best season - cool & pleasant\n🌧️ Jun-Sep: Monsoon - lush green but rainy\n☀️ Mar-May: Summer - warm but OK\n\nOctober to February is the most popular time. Book early!"
  },
  {
    patterns: [/trek|trekking|hike|hiking|adventure|activity|things.*do/i],
    response: "🥾 Activities Near Ibbani Homestay:\n\n🏔️ Trekking in Western Ghats\n🌿 Coffee plantation walks\n🔥 Bonfire evenings\n📸 Nature photography\n🐦 Bird watching\n🌅 Sunrise viewpoints\n\nOur team can arrange guided treks!"
  },
  {
    patterns: [/thank|thanks|thx|appreciate/i],
    response: "You're welcome! 😊 Is there anything else I can help you with about Ibbani Homestay?"
  },
  {
    patterns: [/bye|goodbye|see\s*you|take\s*care/i],
    response: "Goodbye! 🏡 We hope to see you at Ibbani Homestay soon. Have a great day!"
  },
  {
    patterns: [/admin|login|register|sign.?up|account/i],
    response: "👤 Account Help:\n\n• Register: Click 'Book Now' → Register\n• Login: Click 'Login' in navbar\n• Admin: Only authorized accounts\n\nNeed help? WhatsApp us!"
  },
  {
    patterns: [/pet|dog|cat|animal/i],
    response: "🐾 Pets are welcome at Ibbani Homestay! Please inform us in advance via WhatsApp so we can prepare."
  },
  {
    patterns: [/parking|car|vehicle|drive/i],
    response: "🅿️ Free parking is available at Ibbani Homestay. You can drive your car right up to the property."
  },
  {
    patterns: [/photo|pics|image|gallery/i],
    response: "📸 Check out our Gallery page on the website for photos of Ibbani Homestay, the rooms, views, and food!"
  }
];

const FALLBACK = [
  "I'm not sure about that. Let me connect you with our team!",
  "Great question! Our team can help on WhatsApp: +91 8660874196",
  "I can help with bookings, pricing, food, check-in times, and more. Try asking about those!",
  "Hmm, I don't have that info. Want me to connect you with our team on WhatsApp?"
];

function getAIResponse(input) {
  const text = input.toLowerCase().trim();

  for (const item of KB) {
    for (const pattern of item.patterns) {
      if (pattern.test(text)) {
        return item.response;
      }
    }
  }

  // Context-aware fallback
  if (text.length < 3) return "Could you tell me more about what you're looking for?";
  if (text.includes("?")) return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];

  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm the Ibbani Homestay AI assistant. Ask me anything about booking, pricing, food, amenities, or check-in times! 🏡" }
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
      const botMsg = { from: "bot", text: getAIResponse(text) };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const quickActions = [
    { label: "💰 Price", text: "What is the price?" },
    { label: "📅 Check-in", text: "What are check-in times?" },
    { label: "🍽️ Food", text: "What food is served?" },
    { label: "📍 Location", text: "Where is the homestay?" },
    { label: "🥾 Activities", text: "What activities are available?" },
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
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: "520px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🏡</div>
              <div className="flex-1">
                <p className="font-bold">Ibbani Homestay AI</p>
                <p className="text-emerald-100 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full"></span> Online · AI Assistant
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
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
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto">
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
              💬 Chat with us on WhatsApp for human support
            </a>
          </div>
        </div>
      )}
    </>
  );
}
