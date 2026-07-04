"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Mail, CheckCircle, Clock, Search, Filter } from "lucide-react";
import api from "@/lib/axios";

export default function ContactTab() {
  const { isOwner } = useApp();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filterStatus !== "ALL") params.status = filterStatus;
      if (searchQuery) params.search = searchQuery;

      const res = await api.get("/api/contacts", { params });
      


      let list = [];
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        list = res.data.data.data; 
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        list = res.data.data;   
      } else if (Array.isArray(res.data)) {
        list = res.data; 
      }
      

      setMessages(list);
      
      // Handle pagination metadata
      const meta = res.data?.data || res.data;
      if (meta?.totalPages) setTotalPages(meta.totalPages);
      
    } catch (err) {
      console.error("Failed to fetch contacts:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("Sesja wygasła. Zaloguj się ponownie.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, filterStatus, searchQuery]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/api/contacts/${id}/status`, { status: newStatus });
      await fetchMessages(); // Refresh list
    } catch (err) {
      alert("Błąd aktualizacji statusu.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      READ: "bg-blue-100 text-blue-800 border-blue-300",
      RESOLVED: "bg-green-100 text-green-800 border-green-300",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status] || styles.PENDING}`}>
        {status || "PENDING"}
      </span>
    );
  };

  if (!isOwner) return <div className="p-6 text-brand-red font-bold">Brak uprawnień.</div>;



  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Wiadomości od Klientów ({messages.length})
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Szukaj po imieniu/emailu..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to page 1 when searching
                }}
                className="w-full sm:w-48 pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-red" 
              />
            </div>
            <select 
              value={filterStatus} 
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1); // Reset to page 1 when filtering
              }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-red"
            >
              <option value="ALL">Wszystkie</option>
              <option value="PENDING">Oczekujące</option>
              <option value="READ">Przeczytane</option>
              <option value="RESOLVED">Rozwiązane</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Ładowanie wiadomości...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Brak wiadomości w tej kategorii.
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-black text-slate-800">{msg.name}</h3>
                      {getStatusBadge(msg.status)}
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{new Date(msg.createdAt).toLocaleString("pl-PL")}</span>
                    </div>
                    <p className="text-xs text-brand-red font-bold">{msg.email}</p>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                  
                  <div className="flex md:flex-col gap-2 shrink-0">
                    {msg.status !== "READ" && (
                      <button onClick={() => handleStatusUpdate(msg.id, "READ")} className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg transition flex items-center justify-center gap-1.5 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Oznacz jako przeczytane
                      </button>
                    )}
                    {msg.status !== "RESOLVED" && (
                      <button onClick={() => handleStatusUpdate(msg.id, "RESOLVED")} className="px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg transition flex items-center justify-center gap-1.5 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Rozwiązane
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Poprzednia
            </button>
            <span className="px-4 py-2 text-xs font-bold text-slate-500">
              Strona {page} z {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages} 
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Następna
            </button>
          </div>
        )}
      </div>
    </div>
  );
}