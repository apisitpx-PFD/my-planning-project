import { useState } from "react";

const initialOrders = [
  { id: "WO-001", product: "ชิ้นส่วน A-100", qty: 500, unit: "ชิ้น", start: "2026-03-01", end: "2026-03-05", progress: 80, status: "กำลังผลิต", priority: "สูง", machine: "เครื่อง #1" },
  { id: "WO-002", product: "ประกอบ B-200", qty: 200, unit: "ชุด", start: "2026-03-03", end: "2026-03-08", progress: 40, status: "กำลังผลิต", priority: "ปกติ", machine: "เครื่อง #2" },
  { id: "WO-003", product: "ชิ้นส่วน C-300", qty: 1000, unit: "ชิ้น", start: "2026-03-06", end: "2026-03-12", progress: 0, status: "รอผลิต", priority: "ต่ำ", machine: "เครื่อง #3" },
  { id: "WO-004", product: "โมดูล D-400", qty: 50, unit: "ชุด", start: "2026-02-25", end: "2026-03-02", progress: 100, status: "เสร็จสิ้น", priority: "สูง", machine: "เครื่อง #1" },
  { id: "WO-005", product: "ชิ้นส่วน E-500", qty: 300, unit: "ชิ้น", start: "2026-03-04", end: "2026-03-09", progress: 15, status: "ล่าช้า", priority: "สูง", machine: "เครื่อง #4" },
];

const statusColor = {
  "กำลังผลิต": { bg: "#1e40af", text: "#93c5fd", dot: "#3b82f6" },
  "รอผลิต": { bg: "#374151", text: "#d1d5db", dot: "#6b7280" },
  "เสร็จสิ้น": { bg: "#065f46", text: "#6ee7b7", dot: "#10b981" },
  "ล่าช้า": { bg: "#7f1d1d", text: "#fca5a5", dot: "#ef4444" },
};

const priorityColor = { "สูง": "#ef4444", "ปกติ": "#f59e0b", "ต่ำ": "#6b7280" };

export default function ProductionPlanner() {
  const [orders, setOrders] = useState(initialOrders);
  const [view, setView] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
  const [showAdd, setShowAdd] = useState(false);
  const [newOrder, setNewOrder] = useState({ id: "", product: "", qty: "", unit: "ชิ้น", start: "", end: "", progress: 0, status: "รอผลิต", priority: "ปกติ", machine: "" });

  const filtered = filterStatus === "ทั้งหมด" ? orders : orders.filter(o => o.status === filterStatus);
  const stats = {
    total: orders.length,
    active: orders.filter(o => o.status === "กำลังผลิต").length,
    done: orders.filter(o => o.status === "เสร็จสิ้น").length,
    late: orders.filter(o => o.status === "ล่าช้า").length,
  };

  const updateProgress = (id, val) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const progress = Math.max(0, Math.min(100, val));
      const status = progress === 100 ? "เสร็จสิ้น" : progress > 0 ? "กำลังผลิต" : o.status;
      return { ...o, progress, status };
    }));
  };

  const addOrder = () => {
    if (!newOrder.id || !newOrder.product) return;
    setOrders(prev => [...prev, { ...newOrder, qty: Number(newOrder.qty), progress: Number(newOrder.progress) }]);
    setShowAdd(false);
    setNewOrder({ id: "", product: "", qty: "", unit: "ชิ้น", start: "", end: "", progress: 0, status: "รอผลิต", priority: "ปกติ", machine: "" });
  };

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif", background: "#0f172a", minHeight: "100vh", color: "#e2e8f0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#1e293b", borderBottom: "1px solid #1e3a5f", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚙️</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#f1f5f9" }}>ระบบวางแผนการผลิต</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Production Planning & Tracking</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["dashboard", "orders", "gantt"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, background: view === v ? "#3b82f6" : "transparent", color: view === v ? "#fff" : "#94a3b8" }}>
              {{ dashboard: "📊 ภาพรวม", orders: "📋 ใบงาน", gantt: "📅 Gantt" }[v]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "ใบงานทั้งหมด", value: stats.total, icon: "📋", color: "#60a5fa", bg: "#1e3a5f" },
                { label: "กำลังผลิต", value: stats.active, icon: "🔧", color: "#93c5fd", bg: "#1e3a5f" },
                { label: "เสร็จสิ้น", value: stats.done, icon: "✅", color: "#34d399", bg: "#064e3b" },
                { label: "ล่าช้า", value: stats.late, icon: "⚠️", color: "#f87171", bg: "#450a0a" },
              ].map(card => (
                <div key={card.label} style={{ background: `linear-gradient(135deg,${card.bg},#1e293b)`, border: `1px solid ${card.color}30`, borderRadius: 12, padding: "20px 24px" }}>
                  <div style={{ fontSize: 28 }}>{card.icon}</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: card.color, lineHeight: 1.1, marginTop: 8 }}>{card.value}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{card.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 18, color: "#f1f5f9" }}>ความคืบหน้าใบงาน</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {orders.map(o => {
                  const sc = statusColor[o.status];
                  return (
                    <div key={o.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 130px 60px", gap: 16, alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "#60a5fa", fontWeight: 700 }}>{o.id}</div>
                      <div>
                        <div style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 7 }}>{o.product}</div>
                        <div style={{ height: 8, background: "#334155", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${o.progress}%`, background: o.status === "ล่าช้า" ? "#ef4444" : o.status === "เสร็จสิ้น" ? "#10b981" : "#3b82f6", borderRadius: 4 }} />
                        </div>
                      </div>
                      <span style={{ background: sc.bg, color: sc.text, fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>
                        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: sc.dot, marginRight: 5 }} />{o.status}
                      </span>
                      <div style={{ fontWeight: 700, color: o.progress === 100 ? "#34d399" : "#f1f5f9", textAlign: "right" }}>{o.progress}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {view === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["ทั้งหมด", "กำลังผลิต", "รอผลิต", "เสร็จสิ้น", "ล่าช้า"].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid", borderColor: filterStatus === s ? "#3b82f6" : "#334155", background: filterStatus === s ? "#1e3a5f" : "transparent", color: filterStatus === s ? "#60a5fa" : "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                ))}
              </div>
              <button onClick={() => setShowAdd(true)} style={{ padding: "8px 18px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>+ เพิ่มใบงาน</button>
            </div>

            {showAdd && (
              <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 28, width: 480 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20, color: "#f1f5f9" }}>➕ เพิ่มใบงานใหม่</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[["id","เลขที่ใบงาน","text"],["product","ชื่อสินค้า","text"],["qty","จำนวน","number"],["unit","หน่วย","text"],["start","วันเริ่ม","date"],["end","วันสิ้นสุด","date"],["machine","เครื่องจักร","text"]].map(([k, label, type]) => (
                      <div key={k}>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{label}</div>
                        <input type={type} value={newOrder[k]} onChange={e => setNewOrder(p => ({ ...p, [k]: e.target.value }))}
                          style={{ width: "100%", padding: "7px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: 6, color: "#f1f5f9", fontFamily: "inherit", fontSize: 13, boxSizing: "border-box" }} />
                      </div>
                    ))}
                    <div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>ความสำคัญ</div>
                      <select value={newOrder.priority} onChange={e => setNewOrder(p => ({ ...p, priority: e.target.value }))}
                        style={{ width: "100%", padding: "7px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: 6, color: "#f1f5f9", fontFamily: "inherit", fontSize: 13 }}>
                        {["สูง","ปกติ","ต่ำ"].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
                    <button onClick={() => setShowAdd(false)} style={{ padding: "8px 20px", background: "transparent", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontFamily: "inherit" }}>ยกเลิก</button>
                    <button onClick={addOrder} style={{ padding: "8px 20px", background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>บันทึก</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(o => {
                const sc = statusColor[o.status];
                const isOpen = selected === o.id;
                return (
                  <div key={o.id} style={{ background: "#1e293b", border: `1px solid ${isOpen ? "#3b82f6" : "#334155"}`, borderRadius: 12, overflow: "hidden" }}>
                    <div onClick={() => setSelected(isOpen ? null : o.id)} style={{ padding: "14px 20px", cursor: "pointer", display: "grid", gridTemplateColumns: "100px 1fr 130px 90px 60px 30px", gap: 14, alignItems: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#60a5fa" }}>{o.id}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 14 }}>{o.product}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{o.qty.toLocaleString()} {o.unit} · {o.machine}</div>
                      </div>
                      <span style={{ background: sc.bg, color: sc.text, fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, marginRight: 5, display: "inline-block" }} />{o.status}
                      </span>
                      <div>
                        <div style={{ height: 6, background: "#334155", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${o.progress}%`, background: o.status === "ล่าช้า" ? "#ef4444" : o.status === "เสร็จสิ้น" ? "#10b981" : "#3b82f6", borderRadius: 3 }} />
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: "#f1f5f9", textAlign: "right" }}>{o.progress}%</div>
                      <div style={{ color: "#64748b", textAlign: "center" }}>{isOpen ? "▲" : "▼"}</div>
                    </div>
                    {isOpen && (
                      <div style={{ borderTop: "1px solid #334155", padding: "16px 20px", background: "#0f172a" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 18 }}>
                          {[["วันเริ่มต้น", o.start], ["วันสิ้นสุด", o.end], ["ความสำคัญ", o.priority]].map(([k, v]) => (
                            <div key={k}>
                              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>{k}</div>
                              <div style={{ fontWeight: 600, color: k === "ความสำคัญ" ? priorityColor[v] : "#cbd5e1" }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>อัปเดตความคืบหน้า ({o.progress}%)</div>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <input type="range" min="0" max="100" value={o.progress} onChange={e => updateProgress(o.id, Number(e.target.value))} style={{ flex: 1, accentColor: "#3b82f6" }} />
                            <input type="number" min="0" max="100" value={o.progress} onChange={e => updateProgress(o.id, Number(e.target.value))}
                              style={{ width: 60, padding: "6px 8px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#f1f5f9", fontFamily: "inherit", textAlign: "center", fontSize: 14 }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GANTT */}
        {view === "gantt" && (
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: "#f1f5f9" }}>📅 Gantt Chart — มีนาคม 2026</div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", borderBottom: "1px solid #334155" }}>
                <div style={{ padding: "10px 16px", fontSize: 12, color: "#64748b", fontWeight: 600, borderRight: "1px solid #334155" }}>ใบงาน</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(15,1fr)", padding: "0 8px" }}>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map(d => (
                    <div key={d} style={{ textAlign: "center", padding: "10px 0", fontSize: 11, color: d === 3 ? "#60a5fa" : "#64748b", fontWeight: d === 3 ? 700 : 400, borderLeft: d === 3 ? "1px solid #3b82f640" : "none" }}>{d}</div>
                  ))}
                </div>
              </div>
              {orders.map((o, idx) => {
                const s = new Date(o.start).getDate();
                const e = new Date(o.end).getDate();
                const left = ((Math.max(s, 1) - 1) / 15) * 100;
                const width = ((Math.min(e, 15) - Math.max(s, 1) + 1) / 15) * 100;
                const barColor = o.status === "ล่าช้า" ? "#ef4444" : o.status === "เสร็จสิ้น" ? "#10b981" : o.status === "กำลังผลิต" ? "#3b82f6" : "#475569";
                return (
                  <div key={o.id} style={{ display: "grid", gridTemplateColumns: "160px 1fr", borderBottom: idx < orders.length - 1 ? "1px solid #334155" : "none", background: idx % 2 === 0 ? "#1e293b" : "#0f172a" }}>
                    <div style={{ padding: "12px 16px", borderRight: "1px solid #334155" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa" }}>{o.id}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{o.product.slice(0, 14)}</div>
                    </div>
                    <div style={{ position: "relative", height: 52, padding: "0 8px" }}>
                      <div style={{ position: "absolute", top: 12, left: `calc(8px + ${left}%)`, width: `${width}%`, height: 28, background: barColor, borderRadius: 6, opacity: 0.9, display: "flex", alignItems: "center", overflow: "hidden", minWidth: 30 }}>
                        <div style={{ height: "100%", width: `${o.progress}%`, background: "rgba(255,255,255,0.25)", position: "absolute", left: 0, top: 0, borderRadius: 6 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", position: "relative", zIndex: 1, paddingLeft: 8 }}>{o.progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ textAlign: "center", padding: 10, fontSize: 12, color: "#60a5fa", borderTop: "1px solid #334155" }}>📍 วันนี้: 3 มีนาคม 2026</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
