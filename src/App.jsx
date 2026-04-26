import { useState, useRef, useEffect } from "react";

const VOTER_ROLES = [
  { id: "first_time", label: "First-Time Voter", icon: "🌱", desc: "Never voted before" },
  { id: "student", label: "Student", icon: "🎓", desc: "Age 18-25, college/university" },
  { id: "senior", label: "Senior Citizen", icon: "🧓", desc: "60+ years, need simple guidance" },
  { id: "rural", label: "Rural Voter", icon: "🌾", desc: "Village / remote area voter" },
  { id: "nri", label: "NRI Voter", icon: "✈️", desc: "Indian living abroad" },
];

const TIMELINE = [
  { icon: "📅", label: "Election Announced", desc: "Election Commission announces schedule & Model Code of Conduct begins", day: "Day 0" },
  { icon: "📄", label: "Nomination Filing", desc: "Candidates file nomination papers; scrutiny & withdrawal window", day: "Day 1–14" },
  { icon: "🗣️", label: "Campaign Period", desc: "Parties campaign; rallies, manifestos; ends 48h before polling", day: "Day 15–28" },
  { icon: "🗳️", label: "Voting Day", desc: "EVMs open; voters cast ballots with Voter ID or approved documents", day: "Polling Day" },
  { icon: "📊", label: "Vote Counting", desc: "Votes counted under strict observation; VVPAT slips verified", day: "Count Day" },
  { icon: "🏆", label: "Results & Formation", desc: "Winners declared; majority party forms government, PM/CM sworn in", day: "Result Day" },
];

const MYTHS = [
  { myth: "Voting is compulsory in India", fact: "Voting is a fundamental RIGHT, not a legal obligation. However, it is a civic duty.", icon: "🗳️" },
  { myth: "You need a Voter ID card to vote", fact: "12 alternative documents are accepted — Aadhaar, Passport, PAN, Driving Licence and more.", icon: "🪪" },
  { myth: "NOTA means your vote is wasted", fact: "NOTA registers your dissent officially. If NOTA gets the most votes, re-election may be considered.", icon: "📝" },
  { myth: "EVM machines can be easily hacked", fact: "EVMs are standalone devices with no WiFi/Bluetooth. They are rigorously tested and audited.", icon: "🖥️" },
  { myth: "NRIs cannot vote in Indian elections", fact: "NRIs can register in their home constituency and vote in person when in India.", icon: "🌍" },
];

const QUICK_QUESTIONS = [
  "How do I register to vote?",
  "What documents do I need on voting day?",
  "What is NOTA and how does I use it?",
  "How does an EVM work?",
  "What happens if no party gets majority?",
  "Explain the election process like I'm 12 years old",
];

const SYSTEM_PROMPT = (role) => `You are "Know Your Vote" — a friendly, expert Indian Election Education Assistant.

Current user role: ${role || "general citizen"}

Your job:
- Explain Indian election processes clearly and accurately
- Tailor explanations to the user's role (${role || "general"})
- Be warm, encouraging, and civic-minded
- Use simple language, emojis where helpful, and short paragraphs
- Cover: voter registration, EVM, NOTA, Lok Sabha/Vidhan Sabha differences, Model Code of Conduct, candidacy, counting, coalition government, etc.
- Always be non-partisan and factual
- If asked to "explain like I'm 12", use very simple fun analogies
- For NRI voters: mention overseas voter registration and Overseas Electors
- For senior citizens: be extra patient, suggest assisted voting facilities
- For rural voters: mention BLO (Booth Level Officer), mobile voter registration vans
- For students: mention campus voter registration drives, 18-year enrollment

Keep responses concise (3–5 short paragraphs max). End with a relevant follow-up question to keep them engaged.`;

export default function KnowYourVote() {
  const [screen, setScreen] = useState("home"); // home | role | chat
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState("chat"); // chat | timeline | myths
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT(selectedRole?.label),
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.find((b) => b.type === "text")?.text || "Sorry, I couldn't get a response.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const startChat = (role) => {
    setSelectedRole(role);
    const greeting = `Namaste! 🙏 I'm your **Know Your Vote** guide, tailored for **${role.label}**.

Ask me anything about Indian elections — voter registration, EVMs, NOTA, timelines, or what happens after voting. I'm here to make civic education simple and clear.

What would you like to know first?`;
    setMessages([{ role: "assistant", content: greeting }]);
    setScreen("chat");
    setActiveTab("chat");
  };

  const renderMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={styles.page}>
      <div style={styles.homeWrap}>
        <div style={styles.badge}>🇮🇳 Civic Education Initiative</div>
        <h1 style={styles.heroTitle}>Know Your<br /><span style={styles.heroAccent}>Vote</span></h1>
        <p style={styles.heroSub}>India's smart election guide — understand your democratic rights, step by step.</p>
        <div style={styles.pillRow}>
          {["📋 Step-by-step process","🗓️ Election timeline","💬 AI Q&A","🔍 Myth vs Fact"].map(p => (
            <span key={p} style={styles.pill}>{p}</span>
          ))}
        </div>
        <button style={styles.ctaBtn} onClick={() => setScreen("role")}>
          Get Started →
        </button>
        <p style={styles.heroNote}>Free · Non-partisan · Always accurate</p>
        <div style={styles.langToggle}>
          <button style={lang==="en"?styles.langActive:styles.langBtn} onClick={()=>setLang("en")}>EN</button>
          <button style={lang==="hi"?styles.langActive:styles.langBtn} onClick={()=>setLang("hi")}>हिं</button>
        </div>
      </div>
    </div>
  );

  // ── ROLE SELECTION ────────────────────────────────────────────────────────
  if (screen === "role") return (
    <div style={styles.page}>
      <div style={styles.roleWrap}>
        <button style={styles.back} onClick={() => setScreen("home")}>← Back</button>
        <h2 style={styles.roleTitle}>Who are you?</h2>
        <p style={styles.roleSub}>We'll personalise your election guide based on your needs.</p>
        <div style={styles.roleGrid}>
          {VOTER_ROLES.map(r => (
            <button key={r.id} style={styles.roleCard} onClick={() => startChat(r)}>
              <span style={styles.roleIcon}>{r.icon}</span>
              <strong style={styles.roleLabel}>{r.label}</strong>
              <span style={styles.roleDesc}>{r.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  return (
    <div style={styles.appWrap}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.back2} onClick={() => setScreen("role")}>←</button>
        <div>
          <div style={styles.headerTitle}>🗳️ Know Your Vote</div>
          <div style={styles.headerSub}>{selectedRole?.icon} {selectedRole?.label}</div>
        </div>
        <div style={styles.langToggle2}>
          <button style={lang==="en"?styles.langActive:styles.langBtn} onClick={()=>setLang("en")}>EN</button>
          <button style={lang==="hi"?styles.langActive:styles.langBtn} onClick={()=>setLang("hi")}>हिं</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[["chat","💬 Ask AI"],["timeline","🗓️ Timeline"],["myths","🔍 Myths"]].map(([id,label]) => (
          <button key={id} style={activeTab===id?styles.tabActive:styles.tab} onClick={()=>setActiveTab(id)}>{label}</button>
        ))}
      </div>

      {/* TAB: CHAT */}
      {activeTab === "chat" && (
        <div style={styles.chatArea}>
          <div style={styles.msgList}>
            {messages.map((m, i) => (
              <div key={i} style={m.role==="user" ? styles.userMsg : styles.botMsg}>
                {m.role === "assistant" && <div style={styles.botAvatar}>🗳️</div>}
                <div
                  style={m.role==="user" ? styles.userBubble : styles.botBubble}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                />
              </div>
            ))}
            {loading && (
              <div style={styles.botMsg}>
                <div style={styles.botAvatar}>🗳️</div>
                <div style={styles.botBubble}><span style={styles.typing}>Thinking…</span></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions */}
          <div style={styles.quickWrap}>
            <div style={styles.quickScroll}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} style={styles.quickBtn} onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={styles.inputRow}>
            <input
              ref={inputRef}
              style={styles.input}
              placeholder={lang==="hi" ? "अपना सवाल लिखें…" : "Ask about elections…"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && sendMessage()}
              disabled={loading}
            />
            <button style={styles.sendBtn} onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* TAB: TIMELINE */}
      {activeTab === "timeline" && (
        <div style={styles.scrollArea}>
          <h3 style={styles.sectionTitle}>Indian Election Timeline</h3>
          <p style={styles.sectionSub}>From announcement to oath-taking — here's how democracy works in India.</p>
          <div style={styles.timeline}>
            {TIMELINE.map((step, i) => (
              <div key={i} style={styles.timelineItem}>
                <div style={styles.timelineLine}>
                  <div style={styles.timelineDot}>{step.icon}</div>
                  {i < TIMELINE.length - 1 && <div style={styles.timelineConnector} />}
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineDay}>{step.day}</div>
                  <div style={styles.timelineLabel}>{step.label}</div>
                  <div style={styles.timelineDesc}>{step.desc}</div>
                  <button style={styles.askMore} onClick={() => { setActiveTab("chat"); sendMessage(`Tell me more about: ${step.label}`); }}>
                    Ask AI about this →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MYTHS */}
      {activeTab === "myths" && (
        <div style={styles.scrollArea}>
          <h3 style={styles.sectionTitle}>Myth vs. Fact</h3>
          <p style={styles.sectionSub}>Common election misconceptions — busted with facts.</p>
          <div style={styles.mythList}>
            {MYTHS.map((m, i) => (
              <div key={i} style={styles.mythCard}>
                <div style={styles.mythIcon}>{m.icon}</div>
                <div style={styles.mythContent}>
                  <div style={styles.mythBad}>❌ Myth: {m.myth}</div>
                  <div style={styles.mythGood}>✅ Fact: {m.fact}</div>
                </div>
                <button style={styles.askMore} onClick={() => { setActiveTab("chat"); sendMessage(`Explain more about: "${m.myth}"`); }}>
                  Ask AI →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────
const C = {
  saffron: "#FF6B35",
  green: "#06A77D",
  navy: "#0D2137",
  cream: "#FFFBF5",
  card: "#FFFFFF",
  muted: "#6B7A8D",
  border: "#E8EDF2",
  chatBg: "#F4F7FA",
};

const styles = {
  page: { minHeight:"100vh", background:`linear-gradient(135deg, ${C.navy} 0%, #1a3a5c 50%, #0D2137 100%)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Georgia', 'Times New Roman', serif", padding:"20px" },
  homeWrap: { maxWidth:480, width:"100%", textAlign:"center" },
  badge: { display:"inline-block", background:"rgba(255,107,53,0.2)", color:C.saffron, border:`1px solid ${C.saffron}`, borderRadius:20, padding:"6px 16px", fontSize:12, letterSpacing:1, marginBottom:24, fontFamily:"monospace" },
  heroTitle: { fontSize:"clamp(52px, 10vw, 80px)", color:"#FFFFFF", margin:"0 0 8px", lineHeight:1, fontStyle:"italic" },
  heroAccent: { color:C.saffron },
  heroSub: { color:"rgba(255,255,255,0.7)", fontSize:17, lineHeight:1.6, margin:"0 0 28px" },
  pillRow: { display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:32 },
  pill: { background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.85)", borderRadius:20, padding:"5px 14px", fontSize:12, border:"1px solid rgba(255,255,255,0.2)" },
  ctaBtn: { background:`linear-gradient(135deg, ${C.saffron}, #e55a2b)`, color:"#fff", border:"none", borderRadius:12, padding:"16px 40px", fontSize:18, fontWeight:"bold", cursor:"pointer", marginBottom:16, boxShadow:"0 8px 32px rgba(255,107,53,0.4)" },
  heroNote: { color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:24 },
  langToggle: { display:"flex", gap:8, justifyContent:"center" },
  langToggle2: { display:"flex", gap:6, marginLeft:"auto" },
  langBtn: { background:"transparent", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:6, padding:"4px 10px", fontSize:12, cursor:"pointer" },
  langActive: { background:C.saffron, color:"#fff", border:`1px solid ${C.saffron}`, borderRadius:6, padding:"4px 10px", fontSize:12, cursor:"pointer" },

  roleWrap: { maxWidth:520, width:"100%", textAlign:"center" },
  back: { background:"transparent", color:"rgba(255,255,255,0.6)", border:"none", fontSize:14, cursor:"pointer", marginBottom:20, display:"block" },
  roleTitle: { color:"#fff", fontSize:32, marginBottom:8, fontStyle:"italic" },
  roleSub: { color:"rgba(255,255,255,0.6)", marginBottom:28, fontSize:15 },
  roleGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:12 },
  roleCard: { background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:16, padding:"20px 12px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8, transition:"all 0.2s", color:"#fff", fontSize:14 },
  roleIcon: { fontSize:32 },
  roleLabel: { fontWeight:"bold", fontSize:13 },
  roleDesc: { color:"rgba(255,255,255,0.55)", fontSize:11 },

  appWrap: { display:"flex", flexDirection:"column", height:"100vh", background:C.chatBg, fontFamily:"'Segoe UI', system-ui, sans-serif", maxWidth:680, margin:"0 auto" },
  header: { background:`linear-gradient(135deg, ${C.navy}, #1a3a5c)`, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 },
  back2: { background:"transparent", color:"rgba(255,255,255,0.6)", border:"none", fontSize:20, cursor:"pointer", padding:"4px 8px" },
  headerTitle: { color:"#fff", fontWeight:"bold", fontSize:16 },
  headerSub: { color:"rgba(255,255,255,0.6)", fontSize:12 },
  tabs: { display:"flex", background:"#fff", borderBottom:`1px solid ${C.border}` },
  tab: { flex:1, padding:"12px 8px", background:"transparent", border:"none", cursor:"pointer", fontSize:13, color:C.muted, fontWeight:500 },
  tabActive: { flex:1, padding:"12px 8px", background:"transparent", border:"none", cursor:"pointer", fontSize:13, color:C.saffron, fontWeight:"bold", borderBottom:`3px solid ${C.saffron}` },

  chatArea: { display:"flex", flexDirection:"column", flex:1, overflow:"hidden" },
  msgList: { flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:12 },
  userMsg: { display:"flex", justifyContent:"flex-end" },
  botMsg: { display:"flex", gap:8, alignItems:"flex-start" },
  botAvatar: { fontSize:22, flexShrink:0, marginTop:2 },
  userBubble: { background:C.saffron, color:"#fff", borderRadius:"18px 18px 4px 18px", padding:"10px 14px", fontSize:14, lineHeight:1.5, maxWidth:"78%" },
  botBubble: { background:"#fff", border:`1px solid ${C.border}`, borderRadius:"4px 18px 18px 18px", padding:"12px 16px", fontSize:14, lineHeight:1.6, maxWidth:"82%", color:C.navy, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
  typing: { color:C.muted, fontStyle:"italic" },

  quickWrap: { background:"#fff", borderTop:`1px solid ${C.border}`, padding:"8px 12px 4px" },
  quickScroll: { display:"flex", gap:8, overflowX:"auto", paddingBottom:4 },
  quickBtn: { background:"#f0f4f8", border:`1px solid ${C.border}`, borderRadius:16, padding:"6px 12px", fontSize:12, color:C.navy, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 },

  inputRow: { display:"flex", gap:8, padding:"10px 12px", background:"#fff", borderTop:`1px solid ${C.border}` },
  input: { flex:1, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", fontFamily:"inherit" },
  sendBtn: { background:C.saffron, color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", fontSize:14, fontWeight:"bold", cursor:"pointer" },

  scrollArea: { flex:1, overflowY:"auto", padding:"20px 16px" },
  sectionTitle: { fontSize:22, color:C.navy, fontWeight:"bold", margin:"0 0 4px" },
  sectionSub: { color:C.muted, fontSize:14, marginBottom:20 },

  timeline: { display:"flex", flexDirection:"column", gap:0 },
  timelineItem: { display:"flex", gap:0, alignItems:"flex-start" },
  timelineLine: { display:"flex", flexDirection:"column", alignItems:"center", width:50, flexShrink:0 },
  timelineDot: { fontSize:24, background:"#fff", border:`3px solid ${C.saffron}`, borderRadius:"50%", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(255,107,53,0.2)", zIndex:1 },
  timelineConnector: { width:3, flex:1, minHeight:20, background:`linear-gradient(${C.saffron}, ${C.green})`, margin:"2px 0" },
  timelineContent: { background:"#fff", borderRadius:12, padding:"14px 16px", margin:"0 0 16px 12px", flex:1, border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" },
  timelineDay: { fontSize:11, color:C.saffron, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1, marginBottom:4 },
  timelineLabel: { fontSize:16, fontWeight:"bold", color:C.navy, marginBottom:4 },
  timelineDesc: { fontSize:13, color:C.muted, lineHeight:1.5, marginBottom:8 },
  askMore: { background:"transparent", border:`1px solid ${C.green}`, color:C.green, borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer", fontWeight:500 },

  mythList: { display:"flex", flexDirection:"column", gap:14 },
  mythCard: { background:"#fff", borderRadius:14, padding:"16px", border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.05)", display:"flex", gap:12, alignItems:"flex-start" },
  mythIcon: { fontSize:28, flexShrink:0 },
  mythContent: { flex:1 },
  mythBad: { fontSize:13, color:"#c0392b", marginBottom:6, lineHeight:1.4 },
  mythGood: { fontSize:13, color:C.green, lineHeight:1.4, marginBottom:8 },
};
