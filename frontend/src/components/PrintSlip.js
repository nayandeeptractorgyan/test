import React from 'react';

export default function PrintSlip({ ticket, onClose }) {
  if (!ticket) return null;
  const d = new Date(ticket.createdAt);
  const date = d.toLocaleDateString('en-IN', { day:'2-digit', month:'2-digit', year:'numeric' });
  const time = d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

  return (
    <>
      <div style={S.overlay} onClick={onClose}>
        <div style={S.container} onClick={e => e.stopPropagation()}>
          {/* Preview */}
          <div style={S.previewPane}>
            <div style={S.previewLbl}>Ticket Preview</div>
            <TicketSlip ticket={ticket} date={date} time={time} />
          </div>
          {/* Actions */}
          <div style={S.actionsPane}>
            <div style={S.successBubble}>✅</div>
            <h2 style={S.successTitle}>Ticket Issued!</h2>
            <p style={S.successSub}>
              Serial <strong style={{ color:'#7C5CBF' }}>#{ticket.serialNumber}</strong> · ₹{ticket.price}
            </p>
            <div style={S.infoGrid}>
              <InfoRow label="Class"    value={ticket.ticketClassId?.name || `₹${ticket.price}`} />
              <InfoRow label="Operator" value={ticket.operatorId?.name || '—'} />
              <InfoRow label="Date"     value={date} />
              <InfoRow label="Time"     value={time} />
            </div>
            <button style={S.printBtn} onClick={() => window.print()}>🖨️&nbsp; Print Ticket</button>
            <button style={S.closeBtn} onClick={onClose}>Close Without Printing</button>
            <p style={S.hint}>Click outside to dismiss</p>
          </div>
        </div>
      </div>
      <div id="print-slip"><TicketSlip ticket={ticket} date={date} time={time} /></div>
      <style>{`
        @media print {
          body > * { display:none !important; }
          #print-slip { display:flex !important; position:fixed; inset:0; align-items:center; justify-content:center; background:white; }
        }
      `}</style>
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #EDE8DE' }}>
      <span style={{ color:'#5A5870', fontSize:'0.8rem', fontWeight:700 }}>{label}</span>
      <span style={{ fontWeight:800, fontSize:'0.88rem', color:'#1A1A2A' }}>{value}</span>
    </div>
  );
}

function TicketSlip({ ticket, date, time }) {
  return (
    <div style={slip.wrap}>
      <div style={slip.header}>
        <div style={{ fontSize:'1.8rem' }}>🅿️</div>
        <div style={slip.title}>PARKING TICKET</div>
        <div style={slip.sub}>Official Receipt</div>
      </div>
      <div style={slip.dash} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 0' }}>
        <span style={slip.fieldLbl}>AMOUNT</span>
        <span style={slip.amount}>₹{ticket.price}</span>
      </div>
      <div style={slip.dash} />
      <SlipRow label="Serial No" value={'#'+ticket.serialNumber} />
      <SlipRow label="Date"      value={date} />
      <SlipRow label="Time"      value={time} />
      <SlipRow label="Operator"  value={ticket.operatorId?.name || 'N/A'} />
      <div style={slip.dash} />
      <div style={slip.footer}>Drive safely · Park responsibly</div>
      <div style={{ borderTop:'2px dotted #ddd', marginTop:10 }} />
    </div>
  );
}

function SlipRow({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
      <span style={{ fontSize:'0.62rem', color:'#888', textTransform:'uppercase' }}>{label}</span>
      <span style={{ fontSize:'0.8rem', fontWeight:700, fontFamily:'monospace' }}>{value}</span>
    </div>
  );
}

const S = {
  overlay: { position:'fixed', inset:0, background:'rgba(26,26,42,0.35)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:20 },
  container: { display:'flex', background:'#FEFCF8', border:'1.5px solid #DDD8CE', borderRadius:22, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.14)', maxWidth:620, width:'100%', animation:'modalIn 0.22s ease' },
  previewPane: { background:'#F2EDE4', padding:'32px 22px', display:'flex', flexDirection:'column', alignItems:'center', gap:16, borderRight:'1.5px solid #DDD8CE' },
  previewLbl: { fontSize:'0.7rem', fontWeight:800, color:'#9996AC', textTransform:'uppercase', letterSpacing:'0.08em' },
  actionsPane: { padding:'32px 28px', flex:1, display:'flex', flexDirection:'column', alignItems:'flex-start' },
  successBubble: { fontSize:'2.4rem', marginBottom:8 },
  successTitle: { fontSize:'1.45rem', fontWeight:900, marginBottom:4, color:'#1A1A2A' },
  successSub: { color:'#5A5870', marginBottom:22, fontSize:'0.92rem' },
  infoGrid: { width:'100%', marginBottom:24 },
  printBtn: { width:'100%', padding:'14px', marginBottom:10, background:'#4CAF6E', color:'white', border:'none', borderRadius:12, cursor:'pointer', fontSize:'1rem', fontWeight:900, fontFamily:"'Nunito',sans-serif", boxShadow:'0 4px 14px rgba(76,175,110,0.28)' },
  closeBtn: { width:'100%', padding:'11px', background:'transparent', color:'#5A5870', border:'1.5px solid #DDD8CE', borderRadius:12, cursor:'pointer', fontSize:'0.87rem', fontFamily:"'Nunito',sans-serif", fontWeight:700 },
  hint: { color:'#9996AC', fontSize:'0.72rem', marginTop:'auto', paddingTop:16 },
};

const slip = {
  wrap: { background:'white', color:'#111', fontFamily:"'Courier New',monospace", width:200, padding:'18px 14px', borderRadius:4 },
  header: { textAlign:'center', marginBottom:4 },
  title: { fontSize:'0.82rem', fontWeight:900, letterSpacing:'0.1em' },
  sub: { fontSize:'0.56rem', color:'#999', marginTop:2 },
  dash: { borderTop:'1px dashed #ccc', margin:'8px 0' },
  fieldLbl: { fontSize:'0.62rem', color:'#888', textTransform:'uppercase' },
  amount: { fontSize:'1.5rem', fontWeight:900 },
  footer: { textAlign:'center', fontSize:'0.6rem', color:'#999' },
};
