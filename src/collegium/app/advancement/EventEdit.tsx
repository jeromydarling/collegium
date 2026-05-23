import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  CalendarPlus,
  Save,
  Trash2,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  chapters,
  type EventItem,
  type EventSpeaker,
} from "../../data/demo";
import { demoStore, useEvent } from "../../lib/demoStore";

/**
 * Event create / edit form — the missing creation surface that lets a
 * steward actually put an event into the system. Lives at:
 *
 *   /app/advancement/event/new           — create
 *   /app/advancement/event/new?chapter=X — create, chapter pre-filled
 *   /app/advancement/event/:id/edit      — edit existing
 *
 * On save, writes through demoStore.addEvent / updateEvent so the
 * merged useAllEvents() view updates everywhere instantly (Advancement
 * list, EventDetail, Calendar, Chapter detail).
 */

const KINDS: EventItem["kind"][] = [
  "luncheon",
  "red-mass",
  "cle",
  "service-clinic",
  "reading-group",
  "retreat",
  "conference",
];

const KIND_LABEL: Record<EventItem["kind"], string> = {
  luncheon: "Luncheon",
  "red-mass": "Red Mass",
  cle: "CLE",
  "service-clinic": "Service clinic",
  "reading-group": "Reading group",
  retreat: "Retreat",
  conference: "Conference",
};

type FormState = {
  chapterId: string;
  title: string;
  date: string;
  time: string;
  kind: EventItem["kind"];
  location: string;
  capacity: number;
  description: string;
  speakers: EventSpeaker[];
};

const EMPTY: FormState = {
  chapterId: chapters[0]?.id ?? "",
  title: "",
  date: "",
  time: "",
  kind: "luncheon",
  location: "",
  capacity: 40,
  description: "",
  speakers: [],
};

export function EventEdit() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id && id !== "new";
  const existing = useEvent(isEdit ? id : undefined);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Pre-fill on load: editing existing → from store; creating → from query
  // param (chapter) and sensible defaults.
  useEffect(() => {
    if (isEdit && existing && existing.id !== loadedId) {
      setForm({
        chapterId: existing.chapterId,
        title: existing.title,
        date: existing.date,
        time: existing.time,
        kind: existing.kind,
        location: existing.location,
        capacity: existing.capacity,
        description: existing.description,
        speakers: existing.speakers ? [...existing.speakers] : [],
      });
      setLoadedId(existing.id);
    } else if (!isEdit && loadedId !== "new") {
      const chapterFromQuery = params.get("chapter");
      setForm({
        ...EMPTY,
        chapterId:
          chapterFromQuery && chapters.some((c) => c.id === chapterFromQuery)
            ? chapterFromQuery
            : EMPTY.chapterId,
      });
      setLoadedId("new");
    }
  }, [isEdit, existing, loadedId, params]);

  if (isEdit && !existing) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        <Link
          to="/app/advancement"
          className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft size={12} /> Advancement
        </Link>
        <p className="text-sm text-[hsl(var(--c-slate-soft))]">
          That event was not found.
        </p>
      </div>
    );
  }

  const valid =
    form.title.trim().length > 0 &&
    form.date.length > 0 &&
    form.location.trim().length > 0 &&
    form.chapterId.length > 0 &&
    form.capacity > 0;

  function save() {
    if (!valid) return;
    const payload: Omit<EventItem, "id"> = {
      chapterId: form.chapterId,
      title: form.title.trim(),
      date: form.date,
      time: form.time.trim() || "12:00 PM",
      kind: form.kind,
      location: form.location.trim(),
      rsvpCount: existing?.rsvpCount ?? 0,
      capacity: form.capacity,
      description: form.description.trim(),
      speakers: form.speakers.filter((s) => s.name.trim() && s.role.trim()),
      attendedBy: existing?.attendedBy,
    };
    if (isEdit && id) {
      demoStore.updateEvent(id, payload);
      navigate(`/app/advancement/event/${id}`);
    } else {
      const newId = demoStore.addEvent(payload);
      navigate(`/app/advancement/event/${newId}`);
    }
  }

  function remove() {
    if (!isEdit || !id) return;
    demoStore.deleteEvent(id);
    navigate("/app/advancement");
  }

  function addSpeaker() {
    setForm((f) => ({
      ...f,
      speakers: [...f.speakers, { name: "", role: "", affiliation: "" }],
    }));
  }

  function updateSpeaker(i: number, patch: Partial<EventSpeaker>) {
    setForm((f) => ({
      ...f,
      speakers: f.speakers.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  }

  function removeSpeaker(i: number) {
    setForm((f) => ({
      ...f,
      speakers: f.speakers.filter((_, idx) => idx !== i),
    }));
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-3xl mx-auto">
      <Link
        to={isEdit && id ? `/app/advancement/event/${id}` : "/app/advancement"}
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> {isEdit ? "Event" : "Advancement"}
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <CalendarPlus size={14} />
          <span className="collegium-latin text-sm">
            {isEdit ? "Emendare" : "Novum"}
          </span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          {isEdit ? "Edit event" : "New event"}
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          {isEdit
            ? "Update event details, speakers, or capacity. Changes are visible network-wide as soon as you save."
            : "Put a gathering on the chapter calendar. Members can RSVP and attendance gets ticked off member-by-member on the day."}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="space-y-5 collegium-safe-bottom"
      >
        <section className="collegium-card p-4 sm:p-5 space-y-3">
          <Field label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Monthly Luncheon — 'Equity and the Practice of Mercy'"
              className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
              required
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Chapter" required>
              <select
                value={form.chapterId}
                onChange={(e) =>
                  setForm({ ...form, chapterId: e.target.value })
                }
                className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
                required
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.split("—")[0].trim()}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Kind" required>
              <select
                value={form.kind}
                onChange={(e) =>
                  setForm({
                    ...form,
                    kind: e.target.value as EventItem["kind"],
                  })
                }
                className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
                required
              >
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {KIND_LABEL[k]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Date" required>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
                required
              />
            </Field>
            <Field label="Time">
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="12:00 PM"
                className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
              />
            </Field>
            <Field label="Capacity" required>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    capacity: Math.max(1, Number(e.target.value) || 0),
                  })
                }
                min={1}
                className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
                required
              />
            </Field>
          </div>
          <Field label="Location" required>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Boston Athenæum, 10½ Beacon St."
              className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="One paragraph — what is the gathering, who is it for, what should attendees know?"
              rows={3}
              className="w-full text-sm py-2 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white resize-y"
            />
          </Field>
        </section>

        <section className="collegium-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="collegium-display text-lg">Speakers</h2>
              <p className="text-xs text-[hsl(var(--c-slate-soft))]">
                Name + role required; affiliation optional. Leave empty for a
                member-led gathering.
              </p>
            </div>
            <button
              type="button"
              onClick={addSpeaker}
              className="collegium-btn-ghost text-xs inline-flex items-center gap-1"
            >
              <Plus size={11} /> Add speaker
            </button>
          </div>
          {form.speakers.length === 0 ? (
            <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
              No speakers added.
            </p>
          ) : (
            <div className="space-y-3">
              {form.speakers.map((sp, i) => (
                <div
                  key={i}
                  className="grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end"
                >
                  <Field label="Name">
                    <input
                      type="text"
                      value={sp.name}
                      onChange={(e) =>
                        updateSpeaker(i, { name: e.target.value })
                      }
                      placeholder="Hon. Judith Mahoney"
                      className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
                    />
                  </Field>
                  <Field label="Role">
                    <input
                      type="text"
                      value={sp.role}
                      onChange={(e) =>
                        updateSpeaker(i, { role: e.target.value })
                      }
                      placeholder="Keynote"
                      className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
                    />
                  </Field>
                  <Field label="Affiliation">
                    <input
                      type="text"
                      value={sp.affiliation ?? ""}
                      onChange={(e) =>
                        updateSpeaker(i, { affiliation: e.target.value })
                      }
                      placeholder="Mass. Appeals Court (ret.)"
                      className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => removeSpeaker(i)}
                    className="collegium-btn-ghost text-xs inline-flex items-center gap-1 self-end pb-1"
                    aria-label="Remove speaker"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!valid}
              className={
                valid
                  ? "collegium-btn-primary text-sm inline-flex items-center gap-1.5"
                  : "collegium-btn-ghost text-sm cursor-not-allowed opacity-50 inline-flex items-center gap-1.5"
              }
            >
              <Save size={14} /> {isEdit ? "Save changes" : "Create event"}
            </button>
            <Link
              to={
                isEdit && id
                  ? `/app/advancement/event/${id}`
                  : "/app/advancement"
              }
              className="collegium-btn-ghost text-sm"
            >
              Cancel
            </Link>
          </div>
          {isEdit && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="collegium-btn-ghost text-xs text-[hsl(8_55%_42%)] inline-flex items-center gap-1"
            >
              <Trash2 size={12} /> Delete event
            </button>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="collegium-card p-4 border-l-4 border-[hsl(8_55%_52%)] bg-[hsl(8_55%_52%/0.06)]">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle
                size={16}
                className="text-[hsl(8_55%_42%)] mt-0.5 shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-[hsl(var(--c-ink))]">
                  Delete this event?
                </p>
                <p className="text-xs text-[hsl(var(--c-slate-soft))]">
                  RSVPs and attendance records for this event will be removed.
                  This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={remove}
                className="collegium-btn-primary text-xs bg-[hsl(8_55%_42%)] hover:bg-[hsl(8_55%_36%)]"
              >
                Yes, delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="collegium-btn-ghost text-xs"
              >
                Keep it
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
        {label}
        {required && <span className="text-[hsl(var(--c-wine))]">*</span>}
      </span>
      {children}
    </label>
  );
}
