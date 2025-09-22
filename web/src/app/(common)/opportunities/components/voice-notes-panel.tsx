"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { VoiceNote, VoiceNoteMeta } from "@/types/opportunity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, RefreshCcw, Upload } from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoiceNotesPanelProps {
  opportunityId: number;
  isActive: boolean;
}

const statusMap: Record<VoiceNote["status"], { label: string; variant: string }> = {
  processing: { label: "处理中", variant: "bg-amber-100 text-amber-700" },
  completed: { label: "已完成", variant: "bg-emerald-100 text-emerald-700" },
  failed: { label: "失败", variant: "bg-rose-100 text-rose-700" },
};

function VoiceNoteCard({ note }: { note: VoiceNote }) {
  const metadata = (note.aiMetadata || {}) as VoiceNoteMeta;

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            {note.summary || note.filename}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            上传于 {dayjs(note.createdAt).format("YYYY/MM/DD HH:mm")}
          </p>
        </div>
        <Badge
          className={cn(
            "text-xs",
            statusMap[note.status]?.variant || "bg-slate-100 text-slate-600"
          )}
        >
          {statusMap[note.status]?.label || note.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {note.summary && (
          <div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {note.summary}
            </p>
          </div>
        )}

        {metadata.actionItems && metadata.actionItems.length > 0 && (
          <div className="text-sm">
            <p className="font-medium mb-1">关键行动：</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {metadata.actionItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {metadata.followUps && metadata.followUps.length > 0 && (
          <div className="text-sm">
            <p className="font-medium mb-1">建议跟进：</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {metadata.followUps.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {note.transcript && (
          <details className="text-sm">
            <summary className="cursor-pointer text-primary">查看完整转写</summary>
            <p className="mt-2 whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {note.transcript}
            </p>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

export function VoiceNotesPanel({ opportunityId, isActive }: VoiceNotesPanelProps) {
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchNotes = async () => {
    if (!opportunityId) return;
    try {
      setLoading(true);
      const data = await api.opportunities.voiceNotes.list(String(opportunityId));
      setNotes(data);
    } catch (error) {
      console.error("获取语音笔记失败", error);
      toast.error("获取语音笔记失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchNotes();
    }
  }, [isActive, opportunityId]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const uploaded = await api.opportunities.voiceNotes.upload(
        String(opportunityId),
        file,
        note.trim() || undefined
      );
      setNotes((prev) => [uploaded, ...prev]);
      setNote("");
      toast.success("语音文件上传成功，AI 正在生成摘要");
      fetchNotes();
    } catch (error) {
      console.error("上传语音失败", error);
      toast.error("上传语音失败，请稍后再试");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">上传语音并生成摘要</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="补充说明（可选），例如通话背景或目标"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
          />
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              上传语音
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={fetchNotes}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCcw
                className={cn("h-4 w-4", loading && "animate-spin")}
              />
              刷新
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            支持 mp3 / wav / m4a / webm 格式，上传后将自动调用 AI 进行文字转写和摘要。
          </p>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> 正在加载语音笔记...
        </div>
      ) : notes.length === 0 ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Mic className="h-4 w-4" /> 暂无语音笔记，试着上传一次销售通话吧。
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((item) => (
            <VoiceNoteCard key={item.id} note={item} />
          ))}
        </div>
      )}
    </div>
  );
}
