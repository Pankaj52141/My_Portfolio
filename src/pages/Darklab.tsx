import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Search, Plus, X, Upload, TrendingUp, TrendingDown,
  Lock, ChevronLeft, ChevronRight, Trash2, BarChart3,
  Target, Calendar, ImageIcon, Loader2, Eye, ArrowLeft,
  LogIn, LogOut, Mail,
} from "lucide-react";

/* ───────────────── types ───────────────── */
interface TradeEntry {
  id: string;
  trade_date: string;
  screenshot_url: string;
  pnl_amount: number;
  instrument: string | null;
  notes: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 12;

/* ────────────── helpers ────────────── */
const formatPnl = (amount: number) => {
  const abs = Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount >= 0 ? `+₹${abs}` : `-₹${abs}`;
};

/* ══════════════════ COMPONENT ══════════════════ */
const DarkLab = () => {
  /* ── state ── */
  const [entries, setEntries] = useState<TradeEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // upload form
  const [formDate, setFormDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formPnl, setFormPnl] = useState("");
  const [formInstrument, setFormInstrument] = useState("OPTIONS");
  const [formNotes, setFormNotes] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formPreview, setFormPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // auth state
  const [isOwner, setIsOwner] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  /* ── auth: check persisted owner session ── */
  useEffect(() => {
    const ownerVerified = localStorage.getItem("darklab_owner_verified") === "true";
    setIsOwner(ownerVerified);
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setAuthLoading(true);
    setOtpMessage("");
    try {
      const res = await fetch(`${apiBaseUrl}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
      setOtpMessage(data.message || "OTP sent! Check your email.");
    } catch (err: any) {
      setOtpMessage(err.message || "Failed to send OTP");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue) return;
    setAuthLoading(true);
    setOtpMessage("");
    try {
      const res = await fetch(`${apiBaseUrl}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      if (data.darkLabAccess) {
        localStorage.setItem("darklab_owner_verified", "true");
        setIsOwner(true);
        setShowAuthModal(false);
        resetAuthForm();
      } else {
        setOtpMessage("Access denied. Only the owner can manage trades.");
      }
    } catch (err: any) {
      setOtpMessage(err.message || "Verification failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("darklab_owner_verified");
    setIsOwner(false);
  };

  const resetAuthForm = () => {
    setAuthEmail("");
    setOtpValue("");
    setOtpSent(false);
    setOtpMessage("");
  };

  /* ── fetch ── */
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from("trading_journal")
        .select("*")
        .order("trade_date", { ascending: false });
      if (error) throw error;
      setEntries((data as TradeEntry[]) || []);
    } catch (err) {
      console.error("Error fetching trades:", err);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── filter + paginate ── */
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter((entry) => {
      const date = new Date(entry.trade_date + "T00:00:00");
      const monthName = format(date, "MMMM").toLowerCase();
      const dayName = format(date, "EEEE").toLowerCase();
      const dateStr = format(date, "MMM dd, yyyy").toLowerCase();
      const pnlStr = entry.pnl_amount.toString();
      return (
        monthName.includes(q) ||
        dayName.includes(q) ||
        dateStr.includes(q) ||
        pnlStr.includes(q) ||
        entry.instrument?.toLowerCase().includes(q) ||
        entry.notes?.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, entries]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ITEMS_PER_PAGE));
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /* ── stats ── */
  const stats = useMemo(() => {
    const total = entries.length;
    const totalPnl = entries.reduce((s, e) => s + Number(e.pnl_amount), 0);
    const wins = entries.filter((e) => Number(e.pnl_amount) > 0).length;
    const losses = entries.filter((e) => Number(e.pnl_amount) < 0).length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const bestDay = entries.length > 0 ? Math.max(...entries.map((e) => Number(e.pnl_amount))) : 0;
    const worstDay = entries.length > 0 ? Math.min(...entries.map((e) => Number(e.pnl_amount))) : 0;
    return { total, totalPnl, wins, losses, winRate, bestDay, worstDay };
  }, [entries]);

  /* ── upload logic ── */
  const uploadScreenshot = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("trading-screenshots")
        .upload(fileName, file, { contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from("trading-screenshots")
        .getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch {
      // fallback → base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFile || !formPnl) return;
    setIsUploading(true);
    try {
      const screenshotUrl = await uploadScreenshot(formFile);
      const { error } = await (supabase as any).from("trading_journal").insert({
        trade_date: formDate,
        screenshot_url: screenshotUrl,
        pnl_amount: parseFloat(formPnl),
        instrument: formInstrument || "OPTIONS",
        notes: formNotes || null,
      });
      if (error) throw error;
      await fetchEntries();
      resetForm();
      setIsUploadOpen(false);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload trade. Make sure the 'trading_journal' table exists in Supabase.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from("trading_journal")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFormFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setFormPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const resetForm = () => {
    setFormDate(format(new Date(), "yyyy-MM-dd"));
    setFormPnl("");
    setFormInstrument("OPTIONS");
    setFormNotes("");
    setFormFile(null);
    setFormPreview(null);
    setIsDragging(false);
  };

  /* ══════════════════ RENDER ══════════════════ */
  return (
    <div className="darklab-page min-h-screen relative overflow-x-hidden">
      {/* ── background layers ── */}
      <div className="fixed inset-0 z-0 darklab-bg" />
      <div className="fixed inset-0 z-[1] darklab-grid-overlay pointer-events-none" />
      <div className="fixed inset-0 z-[2] darklab-scanlines pointer-events-none" />

      {/* ── main content ── */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">

        {/* ─────── HEADER ─────── */}
        <motion.header
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = "/"}
              className="p-2 rounded-lg bg-white/5 border border-cyan-500/20 hover:border-cyan-400/50
                         hover:bg-cyan-500/10 transition-all duration-300 group"
              title="Back to Portfolio"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="darklab-neon-text">DarkLab</span>
              <span className="text-white/40 mx-2">//</span>
              <span className="text-white/90">Verified Trading Journal.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isOwner ? (
              <div className="flex items-center gap-2">
                {isOwner && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full
                                  border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-semibold text-emerald-300 tracking-wider uppercase">
                      Owner
                    </span>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-full
                             border border-red-500/20 bg-red-500/5 hover:bg-red-500/10
                             hover:border-red-500/40 transition-all duration-300 backdrop-blur-sm"
                >
                  <LogOut className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] font-semibold text-red-300 tracking-wider uppercase">
                    Sign Out
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full
                           border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10
                           hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-300 tracking-wider uppercase">
                  Sign In to Manage
                </span>
              </button>
            )}
          </div>
        </motion.header>

        {/* ─────── STATS BAR ─────── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatCard
            icon={<BarChart3 className="w-4 h-4" />}
            label="Total Trades"
            value={stats.total.toString()}
            accent="cyan"
          />
          <StatCard
            icon={stats.totalPnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            label="Net P&L"
            value={formatPnl(stats.totalPnl)}
            accent={stats.totalPnl >= 0 ? "green" : "red"}
          />
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label="Win Rate"
            value={`${stats.winRate.toFixed(1)}%`}
            accent={stats.winRate >= 50 ? "green" : "red"}
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Best Day"
            value={formatPnl(stats.bestDay)}
            accent="green"
          />
        </motion.div>

        {/* ─────── SEARCH + ACTIONS ─────── */}
        <motion.div
          className="darklab-container p-4 sm:p-5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search input */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/60
                                 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search Month, Day, Week..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-cyan-500/20
                           text-white/90 placeholder-white/30 text-sm
                           focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30
                           transition-all duration-300"
              />
            </div>
            {/* Calendar icon */}
            <button className="p-3 rounded-xl bg-black/40 border border-cyan-500/20
                               hover:border-cyan-400/50 hover:bg-cyan-500/10
                               transition-all duration-300">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </button>
            {/* Add trade button — owner only */}
            {isOwner && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="darklab-add-btn flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                           font-semibold text-sm transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Add Trade</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* ─────── CARDS GRID ─────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="darklab-card-skeleton rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : paginatedEntries.length === 0 ? (
          <motion.div
            className="darklab-container p-12 sm:p-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl
                            bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <ImageIcon className="w-8 h-8 text-cyan-500/60" />
            </div>
            <h3 className="text-xl font-semibold text-white/80 mb-2">No trades yet</h3>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              Start documenting your trading journey. Upload your first Groww P&L screenshot
              and track your options trading performance.
            </p>
            {isOwner && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="darklab-add-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl
                           font-semibold text-sm transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Upload First Trade
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {paginatedEntries.map((entry, i) => {
              const pnl = Number(entry.pnl_amount);
              const isProfit = pnl >= 0;
              const date = new Date(entry.trade_date + "T00:00:00");

              return (
                <motion.div
                  key={entry.id}
                  className={`darklab-trade-card group relative rounded-xl overflow-hidden cursor-pointer
                    ${isProfit ? "darklab-card-profit" : "darklab-card-loss"}`}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  onClick={() => setSelectedImage(entry.screenshot_url)}
                  layout
                >
                  {/* Neon border glow overlay */}
                  <div className={`absolute inset-0 rounded-xl z-0 pointer-events-none
                    ${isProfit ? "darklab-glow-green" : "darklab-glow-red"}`}
                  />

                  {/* View icon on hover */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center
                                  bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                    <Eye className="w-8 h-8 text-white/0 group-hover:text-white/80
                                    transition-all duration-300 transform scale-50 group-hover:scale-100" />
                  </div>

                  {/* Delete button — owner only */}
                  {isOwner && (
                    <button
                      className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100
                                 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 backdrop-blur-sm
                                 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(entry.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  )}

                  {/* Screenshot */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={entry.screenshot_url}
                      alt={`Trade ${format(date, "MMM dd")}`}
                      className="w-full h-full object-cover transition-transform duration-500
                                 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient overlay at bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 h-16
                                    bg-gradient-to-t from-[#0a0a14] to-transparent" />
                  </div>

                  {/* Info bar */}
                  <div className="relative z-10 flex items-center justify-between px-3.5 py-3
                                  bg-[#0a0a14]/90 backdrop-blur-sm">
                    {/* Date badge */}
                    <div
                      className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg
                        ${isProfit
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          : "bg-red-500/15 border border-red-500/30 text-red-400"
                        }`}
                    >
                      <span className="text-[10px] font-bold uppercase leading-none tracking-wider">
                        {format(date, "MMM")}
                      </span>
                      <span className="text-lg font-black leading-none mt-0.5">
                        {format(date, "dd")}
                      </span>
                    </div>
                    {/* P&L */}
                    <span
                      className={`text-sm font-bold font-mono tracking-wide
                        ${isProfit ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {formatPnl(pnl)}
                    </span>
                  </div>

                  {/* Instrument tag */}
                  {entry.instrument && (
                    <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md
                                    bg-black/60 backdrop-blur-sm border border-white/10
                                    text-[10px] font-semibold text-white/60 uppercase tracking-wider
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {entry.instrument}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ─────── PAGINATION ─────── */}
        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-3 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/5
                         hover:bg-cyan-500/15 hover:border-cyan-400/50
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg
                            border border-cyan-500/20 bg-black/30">
              <span className="text-white/50 text-sm">Page</span>
              <span className="text-cyan-400 font-bold text-sm min-w-[1.5rem] text-center">
                {currentPage}
              </span>
              <span className="text-white/50 text-sm">of {totalPages}</span>
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/5
                         hover:bg-cyan-500/15 hover:border-cyan-400/50
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </motion.div>
        )}
      </div>

      {/* ═══════════ UPLOAD MODAL ═══════════ */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => { setIsUploadOpen(false); resetForm(); }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-lg darklab-modal rounded-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => { setIsUploadOpen(false); resetForm(); }}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>

              <h2 className="text-xl font-bold text-white mb-1">
                <span className="darklab-neon-text">New</span> Trade Entry
              </h2>
              <p className="text-white/40 text-sm mb-6">
                Upload your Groww P&L screenshot for today's trade.
              </p>

              <form onSubmit={handleUpload} className="space-y-5">
                {/* Date + P&L row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                      Trade Date
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="darklab-input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                      P&L Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPnl}
                      onChange={(e) => setFormPnl(e.target.value)}
                      placeholder="+1240.50 or -315.20"
                      className="darklab-input w-full"
                      required
                    />
                  </div>
                </div>

                {/* Instrument */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Instrument
                  </label>
                  <input
                    type="text"
                    value={formInstrument}
                    onChange={(e) => setFormInstrument(e.target.value)}
                    placeholder="OPTIONS, FUTURES, EQUITY..."
                    className="darklab-input w-full"
                  />
                </div>

                {/* Screenshot upload */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Screenshot
                  </label>
                  <div
                    className={`darklab-dropzone relative rounded-xl border-2 border-dashed
                      transition-all duration-300 cursor-pointer overflow-hidden
                      ${isDragging
                        ? "border-cyan-400 bg-cyan-500/10"
                        : formPreview
                          ? "border-emerald-500/40 bg-emerald-500/5"
                          : "border-white/15 hover:border-cyan-500/40 hover:bg-cyan-500/5"
                      }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileSelect(file);
                    }}
                  >
                    {formPreview ? (
                      <div className="relative">
                        <img
                          src={formPreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center
                                        opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                          <span className="text-white text-sm font-medium">Click to change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 px-6">
                        <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20
                                        flex items-center justify-center mb-4">
                          <Upload className="w-6 h-6 text-cyan-500/60" />
                        </div>
                        <p className="text-white/60 text-sm font-medium mb-1">
                          Drop screenshot here or click to browse
                        </p>
                        <p className="text-white/30 text-xs">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Notes <span className="text-white/30">(optional)</span>
                  </label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="What did you learn from this trade?"
                    className="darklab-input w-full h-20 resize-none"
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!formFile || !formPnl || isUploading}
                  className="darklab-add-btn w-full py-3.5 rounded-xl font-bold text-sm
                             flex items-center justify-center gap-2
                             disabled:opacity-40 disabled:cursor-not-allowed
                             transition-all duration-300"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Trade
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ DELETE CONFIRM ═══════════ */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              className="relative darklab-modal rounded-2xl p-6 max-w-sm w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30
                              flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Trade?</h3>
              <p className="text-white/40 text-sm mb-6">
                This action cannot be undone. The trade entry and screenshot will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/60
                             hover:bg-white/5 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40
                             text-red-400 hover:bg-red-500/30 text-sm font-bold transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ IMAGE LIGHTBOX ═══════════ */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-lg" />
            <motion.img
              src={selectedImage}
              alt="Trade screenshot"
              className="relative z-10 max-w-full max-h-[85vh] rounded-xl shadow-2xl
                         border border-white/10 object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            />
            <button
              className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/10
                         hover:bg-white/20 backdrop-blur-sm transition-all"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ SIGN-IN MODAL ═══════════ */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => { setShowAuthModal(false); resetAuthForm(); }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative w-full max-w-sm darklab-modal rounded-2xl p-6 sm:p-8 text-center"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => { setShowAuthModal(false); resetAuthForm(); }}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>

              {otpSent ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30
                                  flex items-center justify-center mx-auto mb-5">
                    <Mail className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Enter OTP</h2>
                  <p className="text-white/40 text-sm mb-5 leading-relaxed">
                    OTP sent to<br />
                    <span className="text-cyan-400 font-medium">{authEmail}</span>
                  </p>

                  {otpMessage && (
                    <p className={`text-xs mb-4 px-3 py-2 rounded-lg ${
                      otpMessage.toLowerCase().includes("denied") || otpMessage.toLowerCase().includes("invalid") || otpMessage.toLowerCase().includes("expired") || otpMessage.toLowerCase().includes("fail")
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    }`}>
                      {otpMessage}
                    </p>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder="Enter 5-digit OTP"
                      className="darklab-input w-full text-center text-xl font-bold tracking-[0.5em] py-4"
                      required
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={authLoading || otpValue.length !== 5}
                      className="darklab-add-btn w-full py-3 rounded-xl font-bold text-sm
                                 flex items-center justify-center gap-2
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-all duration-300"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Verify OTP
                        </>
                      )}
                    </button>
                  </form>

                  <button
                    onClick={() => { setOtpSent(false); setOtpValue(""); setOtpMessage(""); }}
                    className="mt-4 text-cyan-400 text-sm hover:text-cyan-300 transition-colors underline
                               underline-offset-4"
                  >
                    Use a different email
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30
                                  flex items-center justify-center mx-auto mb-5">
                    <Lock className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    <span className="darklab-neon-text">Owner</span> Sign In
                  </h2>
                  <p className="text-white/40 text-sm mb-6">
                    Sign in with your email to manage trades.
                  </p>

                  {otpMessage && (
                    <p className="text-xs mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                      {otpMessage}
                    </p>
                  )}

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="darklab-input w-full text-center"
                      required
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={authLoading || !authEmail}
                      className="darklab-add-btn w-full py-3 rounded-xl font-bold text-sm
                                 flex items-center justify-center gap-2
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-all duration-300"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send OTP
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────── Stat Card Sub-component ─────── */
const StatCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "cyan" | "green" | "red";
}) => {
  const accentMap = {
    cyan: {
      border: "border-cyan-500/20",
      bg: "bg-cyan-500/5",
      iconBg: "bg-cyan-500/15",
      iconColor: "text-cyan-400",
      valueColor: "text-cyan-300",
    },
    green: {
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-300",
    },
    red: {
      border: "border-red-500/20",
      bg: "bg-red-500/5",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-400",
      valueColor: "text-red-300",
    },
  };

  const a = accentMap[accent];

  return (
    <div className={`rounded-xl ${a.border} ${a.bg} border backdrop-blur-sm p-4
                     hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className={`p-1.5 rounded-lg ${a.iconBg} ${a.iconColor}`}>
          {icon}
        </div>
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-lg font-bold font-mono ${a.valueColor}`}>{value}</p>
    </div>
  );
};

export default DarkLab;
