"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AMENITIES, CONDITION_LABELS } from "@/lib/amenities";
import { parks } from "@/data/parks";
import { isFeatureReport } from "@/lib/report-rollup";
import { findPark } from "@/lib/repository";
import { formatShortDate } from "@/lib/format";
import { PHOTO_DATA_URL_LIMIT } from "@/lib/community-file";
import { REPORT_CONDITIONS, type ReportDraft } from "@/lib/types";
import { useCommunity } from "@/context/Community";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const STORED_PHOTO_LIMIT = PHOTO_DATA_URL_LIMIT - 50_000;

function shrinkPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("read"));
        return;
      }
      const image = new Image();
      image.onload = () => {
        const longest = Math.max(image.width, image.height, 1);
        let edge = Math.min(1600, longest);
        let quality = 0.82;
        const paint = () => {
          const scale = edge / longest;
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          if (!context) return "";
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/jpeg", quality);
        };
        let url = paint();
        while (url && url.length > STORED_PHOTO_LIMIT && (quality > 0.45 || edge > 640)) {
          if (quality > 0.45) quality = Math.round((quality - 0.12) * 100) / 100;
          else edge = Math.round(edge * 0.75);
          url = paint();
        }
        if (!url) {
          reject(new Error("canvas"));
          return;
        }
        resolve(url);
      };
      image.onerror = () => reject(new Error("image"));
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function ReportForm({ parkId, heading = "Add an accessibility report" }: { parkId?: string; heading?: string }) {
  const { addReport, reports } = useCommunity();
  const [draft, setDraft] = useState<ReportDraft>({
    parkId: parkId ?? "",
    condition: "",
    feature: "",
    note: "",
    author: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoMessage, setPhotoMessage] = useState("");
  const [preparingPhoto, setPreparingPhoto] = useState(false);
  const [savedId, setSavedId] = useState("");
  const photoInput = useRef<HTMLInputElement>(null);

  const visible = useMemo(
    () =>
      reports
        .filter((report) => (parkId ? report.parkId === parkId : true))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [parkId, reports],
  );

  async function onPhoto(file: File | undefined) {
    if (!file) {
      setDraft((current) => ({ ...current, photoName: undefined, photoDataUrl: undefined }));
      setPhotoMessage("");
      setPreparingPhoto(false);
      return;
    }
    setPreparingPhoto(true);
    setDraft((current) => ({ ...current, photoName: undefined, photoDataUrl: undefined }));
    setPhotoMessage("Preparing the photo…");
    try {
      const dataUrl = await shrinkPhoto(file);
      if (dataUrl.length > STORED_PHOTO_LIMIT) {
        setPhotoMessage("That photo is still too large to store. Try a smaller one.");
        return;
      }
      setDraft((current) => ({ ...current, photoName: file.name, photoDataUrl: dataUrl }));
      setPhotoMessage(`${file.name} attached.`);
    } catch {
      setPhotoMessage("Could not read that photo. Try a JPEG or PNG.");
    } finally {
      setPreparingPhoto(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await addReport({ ...draft, parkId: parkId ?? draft.parkId });
    if (!result.ok) {
      setErrors(result.errors);
      setSavedId("");
      return;
    }
    setErrors({});
    setSavedId(result.id);
    setPhotoMessage("");
    if (photoInput.current) photoInput.current.value = "";
    setDraft({
      parkId: parkId ?? "",
      condition: "",
      feature: "",
      note: "",
      author: "",
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-paper p-5 shadow-card" noValidate>
        <h2 className="font-serif text-3xl font-semibold">{heading}</h2>
        <p className="mt-2 text-base text-muted">
          A report that a known feature works can become a visitor badge after an admin approves it. A problem stays a report, with a link to the park, and does not add a badge.
        </p>
        <div className="mt-4 grid gap-4">
          {parkId ? null : (
            <div>
              <Label htmlFor="report-park">Park</Label>
              <select
                id="report-park"
                value={draft.parkId}
                onChange={(event) => setDraft((current) => ({ ...current, parkId: event.target.value }))}
                aria-invalid={Boolean(errors.parkId)}
                aria-describedby={errors.parkId ? "report-park-error" : undefined}
                className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-paper px-3"
                required
              >
                <option value="">Choose a park</option>
                {parks.map((park) => (
                  <option key={park.id} value={park.id}>
                    {park.name} — {park.town}
                  </option>
                ))}
              </select>
              <FieldError id="report-park-error" message={errors.parkId} />
            </div>
          )}
          <div>
            <Label htmlFor="report-condition">Condition</Label>
            <select
              id="report-condition"
              value={draft.condition}
              onChange={(event) =>
                setDraft((current) => ({ ...current, condition: event.target.value as ReportDraft["condition"] }))
              }
              aria-invalid={Boolean(errors.condition)}
              aria-describedby={errors.condition ? "report-condition-error" : undefined}
              className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-paper px-3"
              required
            >
              <option value="">What did you find?</option>
              {REPORT_CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {CONDITION_LABELS[condition]}
                </option>
              ))}
            </select>
            <FieldError id="report-condition-error" message={errors.condition} />
          </div>
          <div>
            <Label htmlFor="report-feature">Feature</Label>
            <select
              id="report-feature"
              value={draft.feature}
              onChange={(event) =>
                setDraft((current) => ({ ...current, feature: event.target.value as ReportDraft["feature"] }))
              }
              aria-invalid={Boolean(errors.feature)}
              aria-describedby={errors.feature ? "report-feature-error" : undefined}
              className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-paper px-3"
              required
            >
              <option value="">Which part of the park?</option>
              <option value="general">General / not sure</option>
              {AMENITIES.map((amenity) => (
                <option key={amenity.id} value={amenity.id}>
                  {amenity.short}
                </option>
              ))}
            </select>
            <FieldError id="report-feature-error" message={errors.feature} />
          </div>
          <div>
            <Label htmlFor="report-note">What should the next family know?</Label>
            <Textarea
              id="report-note"
              value={draft.note}
              onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
              aria-invalid={Boolean(errors.note)}
              aria-describedby={errors.note ? "report-note-error" : "report-note-hint"}
              className="mt-1"
              required
            />
            <p id="report-note-hint" className="mt-1 text-sm text-muted">
              Include where in the park, and whether a wheelchair could get through.
            </p>
            <FieldError id="report-note-error" message={errors.note} />
          </div>
          <div>
            <Label htmlFor="report-photo">Photo of a ramp, gate, or restroom (optional)</Label>
            <Input
              ref={photoInput}
              id="report-photo"
              type="file"
              accept="image/*"
              className="mt-1 file:mr-3 file:rounded-full file:border-0 file:bg-soft file:px-3 file:py-2 file:font-semibold"
              onChange={(event) => void onPhoto(event.target.files?.[0])}
            />
            {photoMessage ? <p className="mt-1 text-sm font-semibold">{photoMessage}</p> : null}
            {draft.photoDataUrl ? (
              <img src={draft.photoDataUrl} alt="Photo you are attaching to this report" className="mt-3 max-h-48 rounded-2xl object-contain" />
            ) : null}
          </div>
          <div>
            <Label htmlFor="report-author">Your name, as you want it shown</Label>
            <Input
              id="report-author"
              value={draft.author}
              onChange={(event) => setDraft((current) => ({ ...current, author: event.target.value }))}
              className="mt-1"
              placeholder="Optional"
            />
          </div>
          {errors.form ? (
            <p role="alert" className="text-sm font-semibold">
              {errors.form}
            </p>
          ) : null}
          {errors.photo ? <FieldError id="report-photo-error" message={errors.photo} /> : null}
          <Button type="submit" disabled={preparingPhoto}>
            Submit report
          </Button>
          {savedId ? (
            <p role="status" className="text-sm font-semibold text-pine">
              Saved. It stays off the public list until an admin approves it.
            </p>
          ) : null}
        </div>
      </form>

      <div>
        <h3 className="font-serif text-2xl font-semibold">Recent reports</h3>
        {visible.length === 0 ? (
          <p className="mt-3 text-muted">No approved reports yet for this view.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {visible.map((report) => {
              const park = findPark(report.parkId);
              const feature =
                report.feature === "general"
                  ? "General"
                  : AMENITIES.find((item) => item.id === report.feature)?.short ?? report.feature;
              return (
                <li key={report.id} className="rounded-3xl border border-line bg-paper p-4">
                  <p className="text-sm font-semibold text-pine">
                    {isFeatureReport(report) ? "Feature" : "Issue"} · {CONDITION_LABELS[report.condition]} · {feature}
                  </p>
                  {park ? (
                    <p className="mt-1 text-sm font-semibold">
                      <Link href={`/parks/${park.slug}`} className="underline underline-offset-2">
                        {park.name}, {park.town}
                      </Link>
                    </p>
                  ) : null}
                  <p className="mt-2">{report.note}</p>
                  {report.photoDataUrl ? (
                    <img
                      src={report.photoDataUrl}
                      alt={report.photoName ? `Photo attached to this report: ${report.photoName}` : "Photo attached to this report"}
                      className="mt-3 max-h-48 rounded-2xl object-cover"
                    />
                  ) : report.photoName ? (
                    <p className="mt-2 text-sm text-muted">Photo noted: {report.photoName}</p>
                  ) : null}
                  <p className="mt-2 text-sm text-muted">
                    {report.author} · {formatShortDate(report.createdAt)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
