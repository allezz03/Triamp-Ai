import React, { useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  LayoutDashboard, ScanSearch, Files, History, Settings, CircleHelp, Bell,
  Search, Plus, UploadCloud, Image as ImageIcon, FileText, ArrowUp, Sparkles,
  ChevronDown, MoreHorizontal, CheckCircle2, Clock3, AlertTriangle, X,
  Menu, Download, MessageSquareText, SlidersHorizontal, Send, Paperclip,
  Layers3, Activity, FileCheck2, PanelLeftClose
} from 'lucide-react'
import './style.css'

const initialAnalyses = [
  { name: 'Piastrella effetto marmo — Lotto A24', type: 'Analisi visiva', date: 'Oggi, 10:42', status: 'Completata', tone: 'green', detail: '3 immagini · 2,4 MB' },
  { name: 'Scheda tecnica gres porcellanato', type: 'Analisi documento', date: 'Ieri, 16:18', status: 'Completata', tone: 'green', detail: 'PDF · 8 pagine' },
  { name: 'Controllo variazioni cromatiche', type: 'Analisi visiva', date: '5 nov 2026', status: 'Da verificare', tone: 'amber', detail: '5 immagini · 6,1 MB' },
]
const nav = [
  { label: 'Workspace', items: [{ name: 'Panoramica', icon: LayoutDashboard }, { name: 'Nuova analisi', icon: ScanSearch }, { name: 'Documenti', icon: Files }, { name: 'Cronologia', icon: History }] },
  { label: 'Preferenze', items: [{ name: 'Impostazioni', icon: Settings }, { name: 'Centro assistenza', icon: CircleHelp }] },
]
function App() {
  const [active, setActive] = useState('Panoramica')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Ciao! Sono l’assistente TrimapAI. Posso aiutarti a interpretare immagini, schede tecniche e documentazione di prodotto. Da dove vuoi iniziare?' }])
  const [analyses, setAnalyses] = useState(initialAnalyses)
  const inputRef = useRef(null)
  const title = active === 'Panoramica' ? 'Panoramica' : active
  const upload = (list) => setFiles(old => [...old, ...Array.from(list || []).map(f => ({ name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB', kind: f.type.startsWith('image/') ? 'image' : 'file' }))])
  const send = () => {
    if (!prompt.trim()) return
    const q = prompt.trim()
    setMessages(m => [...m, { role: 'user', text: q }, { role: 'assistant', text: 'Ho ricevuto la tua richiesta. In questa demo posso mostrarti il flusso di conversazione: quando verrà collegato il motore IA di TrimapAI, qui compariranno le analisi basate sui tuoi file e sui dati tecnici.' }])
    setPrompt('')
  }
  const startAnalysis = () => {
    if (!files.length) { inputRef.current?.click(); return }
    setAnalyses(a => [{ name: files[0].name, type: 'Analisi dimostrativa', date: 'Adesso', status: 'Demo', tone: 'blue', detail: `${files.length} file caricati` }, ...a])
    setActive('Cronologia')
  }
  const page = () => {
    if (active === 'Nuova analisi') return <section className="page-grid">
      <div className="panel upload-panel">
        <div className="panel-head"><div><div className="eyebrow">AREA DI LAVORO</div><h2>Carica i tuoi file</h2><p>Seleziona immagini o documenti da analizzare.</p></div><span className="step">01 / 02</span></div>
        <label className="dropzone"><input ref={inputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.xlsx" onChange={e => upload(e.target.files)} /><span className="upload-icon"><UploadCloud size={25}/></span><strong>Trascina qui i tuoi file</strong><span>oppure <b>sfoglia dal computer</b></span><small>JPG, PNG, PDF, DOCX · massimo 25 MB per file</small></label>
        {files.length > 0 && <div className="file-list">{files.map((f,i)=><div className="file-row" key={i}><span className="file-icon">{f.kind === 'image' ? <ImageIcon/> : <FileText/>}</span><div className="file-info"><b>{f.name}</b><small>{f.size}</small></div><button className="icon-btn" onClick={()=>setFiles(v=>v.filter((_,j)=>j!==i))}><X size={16}/></button></div>)}</div>}
        <div className="analysis-options"><h3><SlidersHorizontal size={17}/> Tipo di analisi</h3><div className="option selected"><span className="option-radio"/><div><b>Analisi intelligente</b><small>Analisi generale di immagini e documenti</small></div><Sparkles size={18}/></div><div className="option"><span className="option-radio"/><div><b>Controllo qualità visivo</b><small>Ricerca di difetti e variazioni superficiali</small></div></div></div>
        <button className="primary-btn full" onClick={startAnalysis}>Avvia analisi dimostrativa <ArrowUp size={17}/></button>
        <p className="demo-note">Demo: i file restano nel browser e non vengono inviati a un servizio IA.</p>
      </div>
      <aside className="side-info"><div className="tip-card"><div className="tip-symbol"><Sparkles/></div><h3>Ottieni il massimo dall'analisi</h3><p>Per risultati più chiari, carica immagini nitide e documenti completi. Puoi aggiungere più file alla stessa analisi.</p><div className="tip-line"><CheckCircle2/> Immagini ad alta risoluzione</div><div className="tip-line"><CheckCircle2/> Documenti leggibili</div><div className="tip-line"><CheckCircle2/> Informazioni sul lotto</div></div><div className="mini-card"><div className="mini-title">Formati supportati</div><div className="format-grid"><span><ImageIcon/> JPG / PNG</span><span><FileText/> PDF</span><span><FileText/> DOCX</span><span><Layers3/> XLSX</span></div></div></aside>
    </section>
    if (active === 'Documenti') return <div className="panel"><div className="panel-head"><div><div className="eyebrow">ARCHIVIO</div><h2>I tuoi documenti</h2><p>Raccogli qui i materiali utili alle tue analisi.</p></div><button className="primary-btn" onClick={()=>setActive('Nuova analisi')}><Plus size={17}/> Aggiungi file</button></div><div className="empty-state"><div className="empty-icon"><Files/></div><h3>Nessun documento archiviato</h3><p>I documenti caricati saranno visualizzati qui quando sarà attivato l'archivio.</p><button className="secondary-btn" onClick={()=>setActive('Nuova analisi')}>Carica il primo documento</button></div></div>
    if (active === 'Cronologia') return <div className="panel"><div className="panel-head"><div><div className="eyebrow">ATTIVITÀ</div><h2>Cronologia analisi</h2><p>Rivedi le attività recenti del workspace.</p></div><button className="secondary-btn"><Download size={16}/> Esporta</button></div><AnalysisTable analyses={analyses}/></div>
    if (active === 'Impostazioni' || active === 'Centro assistenza') return <div className="panel"><div className="eyebrow">TRIMAPAI</div><h2>{active}</h2><p className="muted">Questa sezione sarà disponibile nella prossima versione.</p></div>
    return <Dashboard analyses={analyses} setActive={setActive} messages={messages} prompt={prompt} setPrompt={setPrompt} send={send}/>
  }
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen?'open':''}`}><div className="brand"><div className="brand-mark">T</div><div><b>Trimap<span>AI</span></b><small>INTELLIGENT CERAMIC ANALYSIS</small></div><button className="close-menu" onClick={()=>setMobileOpen(false)}><X/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">C</div><div><b>Workspace Ceramica</b><small>Piano dimostrativo</small></div><ChevronDown size={16}/></div>
      {nav.map(group=><div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(item=><button key={item.name} className={`nav-item ${active===item.name?'active':''}`} onClick={()=>{setActive(item.name);setMobileOpen(false)}}><item.icon size={18}/>{item.name}{item.name==='Nuova analisi'&&<span className="nav-plus">+</span>}</button>)}</div>)}
      <div className="sidebar-bottom"><div className="plan-card"><div className="plan-top"><Sparkles size={16}/> <b>TrimapAI Preview</b></div><p>Stai esplorando la versione dimostrativa della piattaforma.</p><div className="plan-progress"><span/></div><small>Ambiente demo</small></div><div className="user-row"><div className="user-avatar">CM</div><div><b>Carmine Masella</b><small>Amministratore</small></div><MoreHorizontal size={19}/></div></div>
    </aside>
    <main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>{title}</b></div><div className="top-actions"><div className="status-pill"><i/> Sistema operativo</div><button className="icon-btn notification"><Bell size={19}/><i/></button><div className="top-avatar">CM</div></div></header>
      <div className="content"><div className="page-heading"><div><div className="eyebrow">DOMENICA, 8 NOVEMBRE 2026</div><h1>{active==='Panoramica'?'Buongiorno, Carmine':title}<span>.</span></h1><p>{active==='Panoramica'?'Tutto quello che ti serve per analizzare e comprendere i tuoi materiali ceramici.':'Gestisci le tue attività e i tuoi materiali in un unico spazio.'}</p></div>{active==='Panoramica'&&<button className="primary-btn" onClick={()=>setActive('Nuova analisi')}><Plus size={17}/> Nuova analisi</button>}</div>{page()}<footer>© 2026 TrimapAI <span>·</span> Intelligent Ceramic Analysis <span className="footer-right">Demo frontend · Non collegato al motore IA</span></footer></div>
    </main>
  </div>
}
function Dashboard({analyses,setActive,messages,prompt,setPrompt,send}) {
 return <>
  <div className="hero-strip"><div className="hero-copy"><div className="hero-tag"><Sparkles size={14}/> IL TUO ASSISTENTE PER LA CERAMICA</div><h2>La conoscenza dei tuoi materiali,<br/>in un unico spazio.</h2><p>Carica immagini e documenti, esplora i dati e dialoga con il tuo assistente intelligente.</p><button className="hero-btn" onClick={()=>setActive('Nuova analisi')}>Inizia una nuova analisi <ArrowUp size={16}/></button></div><div className="hero-art"><div className="art-glow"/><div className="tile tile-back"/><div className="tile tile-mid"/><div className="tile tile-front"><div className="tile-vein"/></div><div className="art-chip"><Activity size={15}/> Precisione · Qualità · Analisi</div></div></div>
  <div className="stats-grid"><Stat icon={ScanSearch} label="Analisi effettuate" value="12" note="+3 questa settimana" color="blue"/><Stat icon={Files} label="Documenti caricati" value="28" note="Nel workspace" color="purple"/><Stat icon={CheckCircle2} label="Analisi completate" value="10" note="83% del totale" color="green"/><Stat icon={Clock3} label="Tempo risparmiato" value="—" note="Disponibile con IA attiva" color="orange"/></div>
  <div className="dashboard-grid"><div className="panel recent-panel"><div className="panel-head"><div><h2>Analisi recenti</h2><p>Le ultime attività del tuo workspace</p></div><button className="text-btn" onClick={()=>setActive('Cronologia')}>Vedi tutte <span>→</span></button></div><AnalysisTable analyses={analyses.slice(0,3)}/></div>
   <div className="panel assistant-panel"><div className="assistant-head"><div className="assistant-icon"><Sparkles size={18}/></div><div><h3>Assistente TrimapAI</h3><small><i/> Pronto ad aiutarti <span className="demo-label">DEMO</span></small></div><MoreHorizontal size={20}/></div><div className="chat-preview">{messages.slice(-2).map((m,i)=><div key={i} className={`chat-line ${m.role}`}>{m.role==='assistant'&&<div className="tiny-ai"><Sparkles size={12}/></div>}<p>{m.text}</p></div>)}</div><div className="suggestions"><button onClick={()=>setPrompt('Quali difetti posso individuare su una superficie ceramica?')}>Come individuare i difetti?</button><button onClick={()=>setPrompt('Quali informazioni contiene una scheda tecnica?')}>Leggere una scheda tecnica</button></div><div className="chat-input"><button title="Allega file" onClick={()=>setActive('Nuova analisi')}><Paperclip size={17}/></button><input value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Chiedi qualcosa a TrimapAI..."/><button className="send-btn" onClick={send}><Send size={16}/></button></div><div className="chat-foot">Le risposte mostrate sono simulate a scopo dimostrativo.</div></div>
  </div>
 </>
}
function Stat({icon:Icon,label,value,note,color}) { return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div> }
function AnalysisTable({analyses}) { return <div className="table-wrap"><table><thead><tr><th>Nome analisi</th><th>Tipologia</th><th>Data</th><th>Stato</th><th></th></tr></thead><tbody>{analyses.map((a,i)=><tr key={i}><td><div className="analysis-name"><span className="doc-symbol">{a.type.includes('visiva')?<ImageIcon size={16}/>:<FileText size={16}/>}</span><div><b>{a.name}</b><small>{a.detail}</small></div></div></td><td>{a.type}</td><td>{a.date}</td><td><span className={`status ${a.tone}`}><i/>{a.status}</span></td><td><button className="icon-btn"><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table></div> }
createRoot(document.getElementById('root')).render(<App />)
