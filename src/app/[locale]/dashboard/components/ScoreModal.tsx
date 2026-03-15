"use client";

import { useEffect, useState } from "react";
import { Trophy, Coins, Star, Loader2, X } from "lucide-react";
import { getAllScoresAction } from "../logic/actions"; // 作成したアクション

interface ScoreModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  coins: number; // Dashboardから渡される最新のコイン数
}

export function ScoreModal({ open, onClose, userId, coins }: ScoreModalProps) {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      getAllScoresAction(userId).then((data) => {
        setScores(data);
        setLoading(false);
      });
    }
  }, [open, userId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-background border-2 border-foreground/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* ヘッダー */}
        <div className="p-6 border-b border-foreground/5 flex justify-between items-center bg-foreground/[0.02]">
          <h2 className="text-xl font-black uppercase flex items-center gap-2 tracking-tighter text-foreground">
            <Trophy className="w-5 h-5 text-yellow-500" />
            STATS
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {/* --- 表示ロジック1: コインの表示 --- */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-yellow-500 rounded-xl text-black">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-yellow-600/70 font-bold tracking-widest">Total Coins</p>
              <p className="text-2xl font-black text-yellow-600">{coins.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-mono uppercase text-foreground/30 ml-1 font-bold">Game Progress</p>
            
            {/* --- 表示ロジック2: スコアリストのループ表示 --- */}
            {loading ? (
              <div className="flex justify-center py-10 opacity-30"><Loader2 className="w-6 h-6 animate-spin text-foreground" /></div>
            ) : scores.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-foreground/5 rounded-2xl text-[10px] font-mono text-foreground/20 italic">No records found</div>
            ) : (
              scores.map((s) => (
                <div key={s.id} className="bg-foreground/[0.03] border border-foreground/5 p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">{s.gameType}</span>
                    <span className="text-sm font-black text-foreground">SCORE: {s.score.toLocaleString()}</span>
                  </div>
                  
                  {/* metadataの中身を表示するロジック */}
                  {s.metadata?.stockItems && (
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-foreground/5">
                      {Object.entries(s.metadata.stockItems).map(([name, count]: any) => (
                        <div key={name} className="flex justify-between text-[9px] bg-background/50 px-2 py-1 rounded border border-foreground/[0.03]">
                          <span className="text-foreground/40">{name}</span>
                          <span className="font-bold text-foreground">x{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 bg-foreground/[0.02] text-center border-t border-foreground/5">
          <p className="text-[8px] font-mono text-foreground/20 uppercase tracking-[0.3em]">Last Updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}