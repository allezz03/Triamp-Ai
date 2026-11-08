import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Sparkles, Plus, Search, Paperclip, ArrowUp, PanelRightClose, PanelRightOpen, Menu, X, MessageSquare, Clock3, FileText, Image as ImageIcon, ChevronDown, MoreHorizontal, Trash2, SlidersHorizontal, CircleHelp, Settings2, LayoutDashboard } from 'lucide-react'
import './style.css'

const starter = [
  { id: 1, title: 'Variazioni cromatiche lotto A24', time: 'Oggi · 10:42' },
  { id: 2, title: 'Analisi scheda tecnica gres', time: 'Ieri · 16:18' },
  { id: 3, title: 'Possibili difetti superficiali', time: '5 nov · 11:06' },
  { id: 4, title: 'Confronto campioni effetto marmo', time: '4 nov · 09:32' },
  { id: 5, title: 'Resistenza e assorbimento acqua', time: '2 nov · 15:50' },
]
function App() {
  const [history, setHistory] = useState(starter)
  const [current, setCurrent] = useState(1)
  const [chats, setChats] = useState({1: [{role:'assistant', text:'Ciao! Sono TrimapAI, il tuo assistente per il mondo della ceramica.\\n\\nPuoi chiedermi di analizzare immagini, interpretare documenti tecnici o approfondire caratteristiche e difetti dei materiali. Come posso aiutarti oggi?'}]})
  const [value, setValue] = useState('')
  const [files, setFiles] = useState([])
  const [rightOpen, setRightOpen] = useState(true)
  const [mobileHistory, setMobileHistory] = useState(false)
  const [search, setSearch] = useState('')
  const fileRef = useRef(null)
  const activeChat = chats[current] || []
  const filtered = history.filter(h => h.title.toLowerCase().includes(search.toLowerCase()))
  const newChat = () => {
    const id = Date.now()
    setHistory(h => [{id, title:'Nuova conversazione', time:'Adesso'}, ...h])
    setChats(c => ({...c, [id]: [{role:'assistant', text:'Nuova conversazione avviata. Raccontami cosa vuoi analizzare: puoi scrivere una domanda oppure allegare immagini e documenti.'}]}))
    setCurrent(id); setValue(''); setFiles([]); setMobileHistory(false)
  }
  const choose = id => { setCurrent(id); setMobileHistory(false); setFiles([]) }
  const attach = list => setFiles(f => [...f, ...Array.from(list || []).map(x => ({name:x.name, size:(x.size/1024/1024).toFixed(2)+' MB', type:x.type.startsWith('image/')?'image':'file'}))])
  const send = () => {
    if (!value.trim() && !files.length) return
    const text = value.trim() || 'Analizza i file che ho allegato.'
    const fileNames = files.map(f=>f.name)
    setChats(c => ({...c, [current]: [...(c[current]||[]), {role:'user', text, files:fileNames}, {role:'assistant', text:'Ho ricevuto la tua richiesta'+(fileNames.length?' e '+fileNames.length+' file allegat'+(fileNames.length===1?'o':'i'):'')+'.\\n\\nQuesta è una risposta dimostrativa: quando collegheremo il motore IA di TrimapAI, qui verrà mostrata l’analisi effettiva con risultati, osservazioni e riferimenti ai documenti.'}]}))
    setHistory(h => h.map(item => item.id===current && item.title==='Nuova conversazione' ? {...item, title:text.slice(0,38)+(text.length>38?'…':'')} : item))
    setValue(''); setFiles([])
  }
  return <div className="shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><span>T</span></div><div><b>Trimap<span>AI</span></b><small>INTELLIGENT CERAMIC ANALYSIS</small></div></div>
      <div className="top-center"><span className="online-dot"/> Ambiente dimostrativo <ChevronDown size={14}/></div>
      <div className="top-right"><button className="top-icon" title="Impostazioni"><Settings2 size={18}/></button><div className="avatar">CM</div></div>
    </header>
    <div className="layout">
      <main className="chat-area">
        <div className="chat-toolbar"><div className="chat-name"><span className="ai-small"><Sparkles size={15}/></span><b>{history.find(h=>h.id===current)?.title || 'Nuova conversazione'}</b><span className="demo-chip">DEMO</span></div><div className="toolbar-actions"><button onClick={newChat}><Plus size={16}/> Nuova chat</button><button className="history-toggle" onClick={()=>setRightOpen(v=>!v)}>{rightOpen?<PanelRightClose size={17}/>:<PanelRightOpen size={17}/>}</button><button className="mobile-history" onClick={()=>setMobileHistory(true)}><Clock3 size={17}/></button></div></div>
        <section className="conversation">
          {activeChat.length <= 1 ? <div className="welcome">
            <div className="welcome-icon"><Sparkles size={24}/></div>
            <div className="welcome-kicker">IL TUO ASSISTENTE INTELLIGENTE</div>
            <h1>Da dove iniziamo<br/>oggi?</h1>
            <p>Chiedi, esplora e analizza i tuoi materiali ceramici.<br/>Puoi scrivere una domanda o allegare i tuoi file.</p>
            <div className="prompt-grid">
              <button onClick={()=>setValue('Quali difetti superficiali puoi individuare in una piastrella?')}><ImageIcon/><b>Analisi visiva</b><span>Individua difetti e variazioni</span></button>
              <button onClick={()=>setValue('Riassumi i punti principali di una scheda tecnica per gres porcellanato.')}><FileText/><b>Analisi documenti</b><span>Interpreta schede e PDF</span></button>
              <button onClick={()=>setValue('Quali parametri incidono sulla qualità finale di una piastrella?')}><SlidersHorizontal/><b>Supporto tecnico</b><span>Approfondisci materiali e processi</span></button>
            </div>
          </div> : <div className="messages">{activeChat.map((m,i)=><div className={`message ${m.role}`} key={i}><div className="message-avatar">{m.role==='assistant'?<Sparkles size={15}/>: 'CM'}</div><div className="message-body"><div className="message-author">{m.role==='assistant'?'TrimapAI':'Tu'}</div><p>{m.text}</p>{m.files?.length>0&&<div className="attached-in-message">{m.files.map((f,j)=><span key={j}><FileText size={13}/>{f}</span>)}</div>}</div></div>)}</div>}
        </section>
        <div className="composer-wrap">
          {files.length>0&&<div className="pending-files">{files.map((f,i)=><div className="pending-file" key={i}><span>{f.type==='image'?<ImageIcon size={15}/>:<FileText size={15}/>}</span><div><b>{f.name}</b><small>{f.size}</small></div><button onClick={()=>setFiles(v=>v.filter((_,j)=>j!==i))}><X size={14}/></button></div>)}</div>}
          <div className="composer"><button className="attach-btn" onClick={()=>fileRef.current?.click()} title="Allega file"><Paperclip size={19}/></button><input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.xlsx" onChange={e=>attach(e.target.files)}/><textarea value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Scrivi un messaggio a TrimapAI..." rows="1"/><button className="send" onClick={send} disabled={!value.trim()&&!files.length}><ArrowUp size={19}/></button></div>
          <div className="composer-hint">TrimapAI può commettere errori. Verifica sempre le informazioni tecniche importanti.</div>
        </div>
      </main>
      {rightOpen&&<aside className="history-panel"><div className="history-head"><div><span className="eyebrow">WORKSPACE</span><h3>Cronologia</h3></div><button className="new-icon" onClick={newChat}><Plus size={17}/></button></div><button className="history-new" onClick={newChat}><Plus size={16}/> Nuova conversazione</button><div className="history-search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cerca nelle chat..."/></div><div className="history-label">RECENTI</div><div className="history-list">{filtered.map(h=><button key={h.id} className={`history-item ${current===h.id?'selected':''}`} onClick={()=>choose(h.id)}><MessageSquare size={15}/><span><b>{h.title}</b><small>{h.time}</small></span><MoreHorizontal className="more" size={16}/></button>)}{filtered.length===0&&<div className="no-results">Nessuna conversazione trovata</div>}</div><div className="history-bottom"><div className="history-note"><div className="note-icon"><Sparkles size={15}/></div><div><b>TrimapAI Preview</b><p>Questa demo mostra l'esperienza di utilizzo. Le risposte non sono ancora collegate al motore IA.</p></div></div><button className="help-link"><CircleHelp size={15}/> Centro assistenza</button></div></aside>}
      {mobileHistory&&<div className="mobile-overlay" onClick={()=>setMobileHistory(false)}><aside className="mobile-history-panel" onClick={e=>e.stopPropagation()}><div className="mobile-history-top"><b>Cronologia</b><button onClick={()=>setMobileHistory(false)}><X/></button></div><button className="history-new" onClick={newChat}><Plus size={16}/> Nuova conversazione</button>{filtered.map(h=><button key={h.id} className={`history-item ${current===h.id?'selected':''}`} onClick={()=>choose(h.id)}><MessageSquare size={15}/><span><b>{h.title}</b><small>{h.time}</small></span></button>)}</aside></div>}
    </div>
    <footer className="foot"><span>© 2026 TrimapAI</span><span>·</span><span>Intelligent Ceramic Analysis</span><span className="foot-right">Frontend demo · Motore IA non collegato</span></footer>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>)
