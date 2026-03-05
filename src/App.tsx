import React, { useState } from 'react';
import { extractAccountData, reconcileAccountData, generateRetellAgentSpec } from './services/geminiService';
import { 
  ClipboardList, 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  FileJson, 
  HelpCircle,
  Copy,
  Terminal,
  Building2,
  ShieldAlert,
  GitMerge,
  FileText,
  History,
  ArrowRight,
  Activity,
  Mic2,
  Settings,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Mode = 'extraction' | 'versioning' | 'agent-engineering';

export default function App() {
  const [mode, setMode] = useState<Mode>('extraction');
  const [transcript, setTranscript] = useState('');
  const [v1Memo, setV1Memo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleExecute = async () => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      if (mode === 'extraction') {
        if (!transcript.trim()) throw new Error('Transcript is required');
        const data = await extractAccountData(transcript);
        setResult(data);
      } else if (mode === 'versioning') {
        if (!transcript.trim() || !v1Memo.trim()) throw new Error('V1 Memo and Transcript are required');
        const parsedV1 = JSON.parse(v1Memo);
        const data = await reconcileAccountData(parsedV1, transcript);
        setResult(data);
      } else if (mode === 'agent-engineering') {
        if (!v1Memo.trim()) throw new Error('Account Memo JSON is required');
        const parsedMemo = JSON.parse(v1Memo);
        const data = await generateRetellAgentSpec(parsedMemo);
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Ensure inputs are valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] px-6 py-4 flex flex-col md:flex-row items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#141414] p-2 rounded-lg">
            <ClipboardList className="w-6 h-6 text-[#E4E3E0]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">Clara Intelligence Suite</h1>
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Precision Service Trade Systems v3.0</p>
          </div>
        </div>
        
        <div className="flex bg-[#141414]/5 p-1 rounded-xl border border-[#141414]/10 overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => { setMode('extraction'); setResult(null); setError(null); }}
            className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'extraction' ? 'bg-[#141414] text-[#E4E3E0] shadow-sm' : 'opacity-50 hover:opacity-100'}`}
          >
            <Terminal className="w-3 h-3" />
            Extraction
          </button>
          <button
            onClick={() => { setMode('versioning'); setResult(null); setError(null); }}
            className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'versioning' ? 'bg-[#141414] text-[#E4E3E0] shadow-sm' : 'opacity-50 hover:opacity-100'}`}
          >
            <GitMerge className="w-3 h-3" />
            Versioning
          </button>
          <button
            onClick={() => { setMode('agent-engineering'); setResult(null); setError(null); }}
            className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'agent-engineering' ? 'bg-[#141414] text-[#E4E3E0] shadow-sm' : 'opacity-50 hover:opacity-100'}`}
          >
            <Mic2 className="w-3 h-3" />
            Agent Engineering
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-2 px-3 py-1 border border-[#141414] rounded-full text-[10px] font-mono uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Ready
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <section className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase opacity-50 flex items-center gap-2">
              <Activity className="w-3 h-3" />
              {mode === 'extraction' ? 'Extraction Parameters' : mode === 'versioning' ? 'Reconciliation Workspace' : 'Agent Configuration'}
            </h2>
          </div>

          <div className="space-y-4">
            {(mode === 'versioning' || mode === 'agent-engineering') && (
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase opacity-40 flex items-center gap-2">
                  <FileJson className="w-3 h-3" />
                  {mode === 'versioning' ? 'Existing V1 Memo (JSON)' : 'Account Memo JSON (v1 or v2)'}
                </label>
                <textarea
                  value={v1Memo}
                  onChange={(e) => setV1Memo(e.target.value)}
                  placeholder="Paste JSON memo here..."
                  className={`w-full ${mode === 'agent-engineering' ? 'h-[500px]' : 'h-[200px]'} p-4 bg-white border border-[#141414] rounded-xl focus:ring-2 focus:ring-[#141414] focus:outline-none transition-all resize-none font-mono text-xs leading-relaxed shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]`}
                />
              </div>
            )}

            {mode !== 'agent-engineering' && (
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase opacity-40 flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  {mode === 'extraction' ? 'Demo Call Transcript' : 'Onboarding Transcript'}
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={mode === 'extraction' ? "Paste demo call transcript..." : "Paste onboarding transcript..."}
                  className={`w-full ${mode === 'extraction' ? 'h-[600px]' : 'h-[380px]'} p-6 bg-white border border-[#141414] rounded-xl focus:ring-2 focus:ring-[#141414] focus:outline-none transition-all resize-none font-mono text-sm leading-relaxed shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]`}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleExecute}
            disabled={isProcessing || (mode === 'extraction' && !transcript.trim()) || (mode === 'versioning' && (!transcript.trim() || !v1Memo.trim())) || (mode === 'agent-engineering' && !v1Memo.trim())}
            className="w-full py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {mode === 'extraction' ? 'Extracting...' : mode === 'versioning' ? 'Reconciling...' : 'Engineering Prompt...'}
              </>
            ) : (
              <>
                {mode === 'extraction' ? <Send className="w-5 h-5" /> : mode === 'versioning' ? <GitMerge className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                {mode === 'extraction' ? 'Execute Extraction' : mode === 'versioning' ? 'Merge & Version' : 'Generate Agent Spec'}
              </>
            )}
          </button>
        </section>

        {/* Output Section */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase opacity-50 flex items-center gap-2">
              <FileJson className="w-3 h-3" />
              {mode === 'extraction' ? 'Structured Output' : mode === 'versioning' ? 'V2 Reconciled Memo' : 'Retell Agent Spec'}
            </label>
            {result && (
              <button
                onClick={() => copyToClipboard(mode === 'versioning' ? result.updated_memo : result)}
                className="text-[10px] font-mono uppercase flex items-center gap-1 hover:opacity-70 transition-opacity"
              >
                {copyStatus === 'copied' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copyStatus === 'copied' ? 'Copied' : 'Copy JSON'}
              </button>
            )}
          </div>

          <div className="relative min-h-[600px] h-[calc(100vh-250px)] bg-[#141414] rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(20,20,20,0.2)]">
            <AnimatePresence mode="wait">
              {!result && !isProcessing && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-[#E4E3E0]/30 p-12 text-center"
                >
                  <Terminal className="w-12 h-12 mb-4 opacity-10" />
                  <p className="font-mono text-xs uppercase tracking-widest">Awaiting system input...</p>
                  <p className="text-[10px] mt-2 max-w-[200px]">
                    {mode === 'extraction' 
                      ? 'Paste a transcript to generate the Account Memo.' 
                      : mode === 'versioning'
                      ? 'Provide V1 Memo and Onboarding Transcript to reconcile.'
                      : 'Provide an Account Memo to engineer a voice agent prompt.'}
                  </p>
                </motion.div>
              )}

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-[#141414] z-20"
                >
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-[#E4E3E0] animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-[#E4E3E0]/20 animate-pulse" />
                  </div>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#E4E3E0] animate-pulse">
                    {mode === 'extraction' ? 'Analyzing Transcript...' : mode === 'versioning' ? 'Reconciling Versions...' : 'Engineering Voice Agent...'}
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
                >
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-red-500 font-bold uppercase tracking-widest mb-2">Process Failed</h3>
                  <p className="text-[#E4E3E0]/60 text-xs font-mono">{error}</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col"
                >
                  {/* Summary Bar */}
                  <div className="bg-white/5 border-b border-white/10 p-4 flex gap-4 overflow-x-auto no-scrollbar">
                    {mode === 'extraction' ? (
                      <>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <Building2 className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{result.company_name || 'Unknown Co'}</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <ShieldAlert className="w-3 h-3 text-orange-400" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{result.emergency_definition?.triggers?.length || 0} Triggers</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <HelpCircle className="w-3 h-3 text-red-400" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{result.questions_or_unknowns?.length || 0} Unknowns</span>
                        </div>
                      </>
                    ) : mode === 'versioning' ? (
                      <>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <History className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{result.stats.fields_persisted} Persisted</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <ArrowRight className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{result.stats.fields_modified} Modified</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 text-purple-400" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{result.stats.questions_resolved} Resolved</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <Mic2 className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{result.agent_name}</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <Settings className="w-3 h-3 text-orange-400" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{result.voice.model}</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <ShieldAlert className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{result.tools.length} Tools</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Content Tabs */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                      <div className="space-y-8">
                        {mode === 'versioning' && (
                          <div className="space-y-4">
                            <h3 className="text-[10px] font-mono uppercase text-white/40 flex items-center gap-2">
                              <History className="w-3 h-3" />
                              Reconciliation Changelog
                            </h3>
                            <div className="space-y-3">
                              {result.changelog.map((entry: any, i: number) => (
                                <div key={i} className={`p-3 rounded-lg border ${entry.needs_review ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="text-[10px] font-mono text-emerald-400">{entry.field}</span>
                                    <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                      entry.action === 'added' ? 'bg-blue-500/20 text-blue-400' :
                                      entry.action === 'modified' ? 'bg-orange-500/20 text-orange-400' :
                                      entry.action === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                                      'bg-white/10 text-white/60'
                                    }`}>
                                      {entry.action}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-white/60 mb-2 leading-relaxed italic">"{entry.reason}"</p>
                                  <div className="grid grid-cols-2 gap-4 text-[9px] font-mono">
                                    <div className="opacity-40">
                                      <p className="uppercase mb-1">Old Value</p>
                                      <p className="truncate">{JSON.stringify(entry.old_value) || 'null'}</p>
                                    </div>
                                    <div className="text-emerald-400/80">
                                      <p className="uppercase mb-1 opacity-40 text-white">New Value</p>
                                      <p className="truncate">{JSON.stringify(entry.new_value)}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {mode === 'agent-engineering' && (
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <h3 className="text-[10px] font-mono uppercase text-white/40 flex items-center gap-2">
                                <Terminal className="w-3 h-3" />
                                System Prompt
                              </h3>
                              <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                {result.system_prompt}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h3 className="text-[10px] font-mono uppercase text-white/40 flex items-center gap-2">
                                  <Settings className="w-3 h-3" />
                                  Agent Variables
                                </h3>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                                  {Object.entries(result.variables).map(([key, val]: [string, any]) => (
                                    <div key={key}>
                                      <p className="text-[8px] font-mono uppercase text-white/40 mb-1">{key}</p>
                                      <p className="text-[10px] font-mono text-emerald-400 truncate">{val}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h3 className="text-[10px] font-mono uppercase text-white/40 flex items-center gap-2">
                                  <ShieldAlert className="w-3 h-3" />
                                  Transfer Protocol
                                </h3>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                                  <div>
                                    <p className="text-[8px] font-mono uppercase text-white/40 mb-1">Attempts</p>
                                    <p className="text-[10px] font-mono text-emerald-400">{result.transfer_protocol.attempts}</p>
                                  </div>
                                  <div>
                                    <p className="text-[8px] font-mono uppercase text-white/40 mb-1">Fail Message</p>
                                    <p className="text-[10px] font-mono text-emerald-400 italic">"{result.transfer_protocol.fail_message}"</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <h3 className="text-[10px] font-mono uppercase text-white/40 flex items-center gap-2">
                            <FileJson className="w-3 h-3" />
                            {mode === 'versioning' ? 'V2 Memo Payload' : mode === 'agent-engineering' ? 'Full Spec JSON' : 'Memo Payload'}
                          </h3>
                          <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
                            {JSON.stringify(mode === 'versioning' ? result.updated_memo : result, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unknowns Footer (Shared) */}
                  {((mode === 'extraction' && result.questions_or_unknowns?.length > 0) || 
                    (mode === 'versioning' && result.updated_memo.questions_or_unknowns?.length > 0)) && (
                    <div className="bg-red-500/10 border-t border-red-500/20 p-4">
                      <h4 className="text-[10px] font-mono uppercase text-red-400 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" />
                        {mode === 'extraction' ? 'Critical Gaps Identified' : 'Remaining Unknowns'}
                      </h4>
                      <ul className="space-y-1">
                        {(mode === 'extraction' ? result.questions_or_unknowns : result.updated_memo.questions_or_unknowns).map((q: string, i: number) => (
                          <li key={i} className="text-[10px] font-mono text-red-300/70 flex gap-2">
                            <span className="opacity-30">[{i + 1}]</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Footer Stats */}
      <footer className="mt-12 border-t border-[#141414] p-6 bg-white/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase opacity-40">System Mode</p>
            <p className="text-xs font-bold uppercase tracking-tight">{mode}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase opacity-40">Engine Status</p>
            <p className="text-xs font-bold uppercase tracking-tight text-emerald-600">Operational</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase opacity-40">Intelligence</p>
            <p className="text-xs font-bold uppercase tracking-tight">Gemini 3 Flash</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase opacity-40">Logic Layer</p>
            <p className="text-xs font-bold uppercase tracking-tight">Agent Spec v3.0</p>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
