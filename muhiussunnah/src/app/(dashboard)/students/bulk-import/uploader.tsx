"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bulkImportStudentsAction } from "@/server/actions/students";

export function BulkImportUploader({ schoolSlug }: { schoolSlug: string }) {
  const t = useTranslations("studentsExtra");
  const [preview, setPreview] = useState<Record<string, unknown>[] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ inserted: number; skipped: number; errors: string[] } | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);

    const buf = await f.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[];

    if (rows.length === 0) {
      toast.error(t("uploader_no_rows"));
      return;
    }
    if (rows.length > 2000) {
      toast.error(t("uploader_max_rows"));
      return;
    }
    setPreview(rows);
    toast.success(t("uploader_rows_found", { count: rows.length }));
  }

  function submitImport() {
    if (!preview) return;
    startTransition(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await bulkImportStudentsAction(schoolSlug, preview as any);
      if (res.ok && res.data) {
        setResult(res.data);
        toast.success(res.message ?? t("uploader_success"));
      } else if (!res.ok) {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="file">{t("uploader_file_label")}</Label>
        <Input id="file" type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
      </div>

      {file ? (
        <p className="text-sm text-muted-foreground">
          {t("uploader_file_count", { name: file.name, count: preview?.length ?? 0 })}
        </p>
      ) : null}

      {preview && preview.length > 0 ? (
        <>
          <div className="max-h-64 overflow-auto rounded-md border border-border/60 text-xs">
            <table className="w-full">
              <thead className="sticky top-0 bg-muted/50">
                <tr>
                  {Object.keys(preview[0]).map((k) => (
                    <th key={k} className="p-2 text-left font-medium">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 10).map((r, i) => (
                  <tr key={i} className="border-t border-border/60">
                    {Object.values(r).map((v, j) => (
                      <td key={j} className="p-2">{String(v ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length > 10 ? (
            <p className="text-xs text-muted-foreground">{t("uploader_preview_note", { count: preview.length - 10 })}</p>
          ) : null}

          <Button
            type="button"
            onClick={submitImport}
            disabled={pending}
            className="bg-gradient-primary text-white"
          >
            {pending ? t("uploader_importing") : t("uploader_cta", { count: preview.length })}
          </Button>
        </>
      ) : null}

      {result ? (
        <div className="rounded-md border border-success/30 bg-success/5 p-4">
          <p className="text-sm font-semibold">
            {t("uploader_result", { inserted: result.inserted, skipped: result.skipped })}
          </p>
          {result.errors.length > 0 ? (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-muted-foreground">{t("uploader_errors_heading")}</summary>
              <ul className="mt-2 list-disc pl-5 text-xs text-destructive">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </details>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
