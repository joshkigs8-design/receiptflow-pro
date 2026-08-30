import { useState, useMemo, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Building,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Clock,
  Copy,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  History,
  Image,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  User,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  extractUnitsWithAi,
  checkPropertyUnitsDuplicate,
  importBulkUnits,
  getLandlordPropertiesForAdmin,
  getImportAuditHistory,
  type ExtractedUnitItem,
} from "@/lib/admin.functions";
import { money, shortDate } from "@/lib/format";

interface LandlordOption {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  properties?: number;
}

interface PropertyOption {
  id: string;
  name: string;
  code: string;
  property_type: string;
  units_count: number;
  address: string | null;
  status: string;
}

const SAMPLE_TEXT_SNIPPET = `Room 1 - 10,000 - John Mwangi - 0712345678
Room 2 - 10,000 - Mary Wanjiku - 0723456789
Room 3 - 12,000 - Vacant
Room 4 - 10k - Peter Kiptoo - 0734567890
Room 5 - 15,000 - Grace Atieno - 0745678901
Room 6 - 8500 - Vacant
Shop 1 - 25,000 - Hassan Omar - 0756789012
Shop 2 - 25k - Vacant`;

export function AiBulkImporter({
  landlords,
  initialLandlordId,
  onClose,
}: {
  landlords: LandlordOption[];
  initialLandlordId?: string;
  onClose?: () => void;
}) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Server functions
  const fetchPropertiesFn = useServerFn(getLandlordPropertiesForAdmin);
  const extractAiFn = useServerFn(extractUnitsWithAi);
  const checkDuplicatesFn = useServerFn(checkPropertyUnitsDuplicate);
  const importUnitsFn = useServerFn(importBulkUnits);
  const fetchAuditLogsFn = useServerFn(getImportAuditHistory);

  // Step state: "target" | "input" | "extracting" | "preview" | "importing" | "complete"
  const [step, setStep] = useState<"target" | "input" | "extracting" | "preview" | "complete">("target");

  // Target Selection State
  const [landlordSearch, setLandlordSearch] = useState("");
  const [selectedLandlordId, setSelectedLandlordId] = useState<string>(initialLandlordId || "");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");

  // Input Method State
  const [inputTab, setInputTab] = useState<"paste" | "csv" | "pdf" | "image">("paste");
  const [pastedText, setPastedText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string>("text/plain");

  // Extracted Units & Review State
  const [extractedUnits, setExtractedUnits] = useState<ExtractedUnitItem[]>([]);
  const [existingDuplicates, setExistingDuplicates] = useState<Set<string>>(new Set());
  const [duplicateStrategy, setDuplicateStrategy] = useState<"skip" | "update">("skip");
  const [tableFilter, setTableFilter] = useState<"all" | "ready" | "review" | "duplicate">("all");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionNote, setExtractionNote] = useState<string | null>(null);
  const [extractionProgressText, setExtractionProgressText] = useState("Analyzing input...");

  // Import Result State
  const [importResult, setImportResult] = useState<{
    property_name: string;
    total_submitted: number;
    imported_count: number;
    updated_count: number;
    skipped_duplicates: number;
    tenants_created: number;
    total_units_now: number;
    timestamp: string;
  } | null>(null);

  // Audit History Modal
  const [auditHistoryOpen, setAuditHistoryOpen] = useState(false);

  // Filtered Landlords for Search
  const filteredLandlords = useMemo(() => {
    if (!landlordSearch.trim()) return landlords.slice(0, 50);
    const q = landlordSearch.toLowerCase().trim();
    return landlords.filter(
      (l) =>
        l.email.toLowerCase().includes(q) ||
        (l.full_name && l.full_name.toLowerCase().includes(q)) ||
        (l.company_name && l.company_name.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q)),
    );
  }, [landlords, landlordSearch]);

  const selectedLandlord = useMemo(
    () => landlords.find((l) => l.id === selectedLandlordId),
    [landlords, selectedLandlordId],
  );

  // Fetch properties for selected landlord
  const { data: properties = [], isLoading: propertiesLoading, refetch: refetchProps } = useQuery({
    queryKey: ["admin_landlord_properties", selectedLandlordId],
    queryFn: () => fetchPropertiesFn({ data: { landlordId: selectedLandlordId } }),
    enabled: Boolean(selectedLandlordId),
  });

  const selectedProperty = useMemo(
    () => properties.find((p) => p.id === selectedPropertyId),
    [properties, selectedPropertyId],
  );

  // Auto-select first property if only 1 exists
  useEffect(() => {
    if (properties.length === 1 && !selectedPropertyId && properties[0]?.id) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);

  // Audit History Query
  const { data: auditHistory = [], refetch: refetchAudit } = useQuery({
    queryKey: ["admin_ai_import_audit"],
    queryFn: () => fetchAuditLogsFn(),
    enabled: auditHistoryOpen,
  });

  // Handle File Drop / Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setFileMimeType(file.type || "application/octet-stream");

    if (file.type.startsWith("image/")) {
      setInputTab("image");
      const reader = new FileReader();
      reader.onload = () => {
        setFileBase64(reader.result as string);
        toast.success(`Photo loaded: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      };
      reader.readAsDataURL(file);
    } else if (file.name.endsWith(".csv") || file.name.endsWith(".tsv") || file.type.includes("csv") || file.type.includes("text")) {
      setInputTab("csv");
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setPastedText(text);
        setFileBase64(null);
        toast.success(`Spreadsheet loaded: ${file.name} (${text.split("\n").length} lines)`);
      };
      reader.readAsText(file);
    } else {
      // PDF or binary document
      const reader = new FileReader();
      reader.onload = () => {
        setFileBase64(reader.result as string);
        toast.success(`Document loaded: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Extraction Mutation
  const extractMutation = useMutation({
    mutationFn: async () => {
      setIsExtracting(true);
      setStep("extracting");
      setExtractionProgressText("Analyzing unit list structure with Gemini AI...");

      const timer1 = setTimeout(() => setExtractionProgressText("Extracting unit identifiers & rent amounts..."), 1200);
      const timer2 = setTimeout(() => setExtractionProgressText("Identifying tenant names & occupancy status..."), 2600);
      const timer3 = setTimeout(() => setExtractionProgressText("Normalizing currency & validating integrity..."), 4000);

      try {
        const res = await extractAiFn({
          data: {
            textContent: pastedText.trim() || undefined,
            imageBase64: fileBase64 || undefined,
            mimeType: fileMimeType,
          },
        });

        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);

        if (!res.units || res.units.length === 0) {
          throw new Error("No rental units could be confidently detected. Please check the uploaded content.");
        }

        // Cross-check duplicates against existing DB records in selected property
        const unitNumbers = res.units.map((u) => u.unit_number);
        const dupRes = await checkDuplicatesFn({
          data: {
            propertyId: selectedPropertyId,
            unitNumbers,
          },
        });

        const dupSet = new Set(dupRes.duplicates.map((d) => d.toLowerCase().trim()));
        setExistingDuplicates(dupSet);

        // Mark duplicate flag on units
        const enriched = res.units.map((u) => ({
          ...u,
          is_duplicate: dupSet.has(u.unit_number.toLowerCase().trim()),
          validation_flags: dupSet.has(u.unit_number.toLowerCase().trim())
            ? [...u.validation_flags, "Already exists in property"]
            : u.validation_flags,
        }));

        setExtractedUnits(enriched);
        setExtractionNote(res.note || null);
        setStep("preview");
        toast.success(`✨ Successfully extracted ${enriched.length} unit records!`);
      } catch (err: any) {
        setStep("input");
        toast.error(err?.message || "Failed to extract units.");
      } finally {
        setIsExtracting(false);
      }
    },
  });

  // Bulk Import Mutation
  const importMutation = useMutation({
    mutationFn: async () => {
      if (!selectedLandlordId || !selectedPropertyId) {
        throw new Error("Target landlord and property are required.");
      }

      const validUnitsToImport = extractedUnits.map((u) => ({
        unit_number: u.unit_number.trim(),
        rent: Number(u.rent) || 0,
        deposit: Number(u.deposit) || Number(u.rent) || 0,
        floor: u.floor || null,
        status: u.status,
        tenant_name: u.tenant_name || null,
        tenant_phone: u.tenant_phone || null,
        notes: u.notes || null,
      }));

      const res = await importUnitsFn({
        data: {
          landlordId: selectedLandlordId,
          propertyId: selectedPropertyId,
          units: validUnitsToImport,
          duplicateStrategy,
          sourceFilename: uploadedFileName || "Pasted text list",
        },
      });

      return res;
    },
    onSuccess: (res) => {
      setImportResult(res);
      setStep("complete");
      qc.invalidateQueries({ queryKey: ["admin_landlord_properties", selectedLandlordId] });
      qc.invalidateQueries({ queryKey: ["adminOverview"] });
      toast.success(`🎉 ${res.imported_count} units successfully imported into ${res.property_name}!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Import failed. Please review error.");
    },
  });

  // Inline Row Edits
  const handleUpdateRow = (index: number, field: keyof ExtractedUnitItem, value: any) => {
    setExtractedUnits((prev) => {
      const current = prev[index];
      if (!current) return prev;

      const next = [...prev];
      const target: ExtractedUnitItem = { ...current, [field]: value };

      // Re-evaluate validation flags
      const flags: string[] = [];
      if (Number(target.rent) <= 0) flags.push("Missing rent amount");
      if (!target.unit_number || !target.unit_number.trim()) flags.push("Missing unit number");
      if (target.is_duplicate) flags.push("Already exists in property");

      target.validation_flags = flags;
      target.confidence = flags.length === 0 ? "high" : "medium";

      next[index] = target;
      return next;
    });
  };

  const handleDeleteRow = (index: number) => {
    setExtractedUnits((prev) => prev.filter((_, i) => i !== index));
    toast.info("Row removed from preview.");
  };

  const handleAddBlankRow = () => {
    setExtractedUnits((prev) => [
      ...prev,
      {
        unit_number: `Unit ${prev.length + 1}`,
        rent: 10000,
        deposit: 10000,
        status: "vacant",
        confidence: "high",
        validation_flags: [],
      },
    ]);
  };

  // Preview Counts & Summary
  const counts = useMemo(() => {
    let ready = 0;
    let review = 0;
    let duplicates = 0;

    for (const u of extractedUnits) {
      if (u.is_duplicate) {
        duplicates++;
      } else if (u.validation_flags.length > 0 || u.confidence === "low" || Number(u.rent) <= 0) {
        review++;
      } else {
        ready++;
      }
    }

    return {
      total: extractedUnits.length,
      ready,
      review,
      duplicates,
    };
  }, [extractedUnits]);

  // Filtered Preview Rows
  const displayedUnits = useMemo(() => {
    if (tableFilter === "all") return extractedUnits;
    if (tableFilter === "duplicate") return extractedUnits.filter((u) => u.is_duplicate);
    if (tableFilter === "review") return extractedUnits.filter((u) => u.validation_flags.length > 0 && !u.is_duplicate);
    if (tableFilter === "ready") return extractedUnits.filter((u) => u.validation_flags.length === 0 && !u.is_duplicate);
    return extractedUnits;
  }, [extractedUnits, tableFilter]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#063B2A] text-white shadow-xl border border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A261D] border border-[#C9A227]/40 text-xs font-bold text-[#C9A227]">
            <Sparkles className="size-3.5" /> AI Bulk Unit Importer
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight">
            Rapid Multi-Unit Onboarding
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl">
            Extract, validate, and bulk-insert up to 500+ units for any landlord from messy lists, spreadsheets, PDFs, or handwritten photos.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAuditHistoryOpen(true)}
            className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs font-semibold h-9"
          >
            <History className="size-3.5 mr-1.5 text-[#C9A227]" /> Import History
          </Button>

          {onClose ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full text-white/80 hover:text-white hover:bg-white/10 h-9"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* STEP PROGRESS BREADCRUMB */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs font-bold">
        <div
          className={`p-3 rounded-2xl border text-center transition-all flex items-center justify-center gap-1.5 ${
            step === "target"
              ? "bg-[#087443] text-white border-[#C9A227]"
              : selectedLandlordId && selectedPropertyId
                ? "bg-[#E8F2ED] text-[#063B2A] border-[#087443]/30"
                : "bg-muted/40 text-muted-foreground border-border"
          }`}
        >
          <Building2 className="size-3.5 shrink-0" />
          <span className="truncate">1. Target Property</span>
          {selectedLandlordId && selectedPropertyId ? <Check className="size-3 text-[#087443]" /> : null}
        </div>

        <div
          className={`p-3 rounded-2xl border text-center transition-all flex items-center justify-center gap-1.5 ${
            step === "input" || step === "extracting"
              ? "bg-[#087443] text-white border-[#C9A227]"
              : extractedUnits.length > 0
                ? "bg-[#E8F2ED] text-[#063B2A] border-[#087443]/30"
                : "bg-muted/40 text-muted-foreground border-border"
          }`}
        >
          <Sparkles className="size-3.5 shrink-0" />
          <span className="truncate">2. Upload &amp; Extract</span>
          {extractedUnits.length > 0 ? <Check className="size-3 text-[#087443]" /> : null}
        </div>

        <div
          className={`p-3 rounded-2xl border text-center transition-all flex items-center justify-center gap-1.5 ${
            step === "preview"
              ? "bg-[#087443] text-white border-[#C9A227]"
              : step === "complete"
                ? "bg-[#E8F2ED] text-[#063B2A] border-[#087443]/30"
                : "bg-muted/40 text-muted-foreground border-border"
          }`}
        >
          <FileCheck2 className="size-3.5 shrink-0" />
          <span className="truncate">3. Review Table</span>
          {step === "complete" ? <Check className="size-3 text-[#087443]" /> : null}
        </div>

        <div
          className={`hidden sm:flex p-3 rounded-2xl border text-center transition-all items-center justify-center gap-1.5 ${
            step === "complete"
              ? "bg-[#087443] text-white border-[#C9A227]"
              : "bg-muted/40 text-muted-foreground border-border"
          }`}
        >
          <BadgeCheck className="size-3.5 shrink-0" />
          <span className="truncate">4. Committed</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: TARGET LANDLORD & PROPERTY SELECTION                              */}
      {/* ========================================================================= */}
      {step === "target" ? (
        <div className="surface-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-sm space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <Building2 className="size-5 text-primary" /> Step 1: Select Target Landlord &amp; Property
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify the authenticated landlord account and destination property where these units will be imported. The AI never determines or guesses these IDs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Landlord Selector */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                1. Select Landlord Account
              </Label>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Filter landlord by name, email, phone..."
                  value={landlordSearch}
                  onChange={(e) => setLandlordSearch(e.target.value)}
                  className="pl-9 h-10 rounded-2xl text-xs"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 p-2 rounded-2xl border border-border bg-muted/20">
                {filteredLandlords.map((l) => {
                  const isSelected = l.id === selectedLandlordId;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setSelectedLandlordId(l.id);
                        setSelectedPropertyId(""); // Reset property when landlord changes
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#087443] text-white shadow-sm font-semibold"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold truncate">{l.full_name || l.company_name || l.email}</p>
                        <p className={`text-[11px] truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                          {l.email} {l.phone ? `· ${l.phone}` : ""}
                        </p>
                      </div>
                      {isSelected ? <Check className="size-4 shrink-0 text-white" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Property Selector */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                2. Select Destination Property
              </Label>

              {!selectedLandlordId ? (
                <div className="p-8 rounded-2xl border border-dashed text-center text-xs text-muted-foreground bg-muted/10 space-y-1">
                  <Building2 className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="font-semibold">Please select a landlord account first</p>
                  <p>Properties for that landlord will appear here.</p>
                </div>
              ) : propertiesLoading ? (
                <div className="p-8 rounded-2xl border text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin text-primary" /> Loading landlord properties...
                </div>
              ) : properties.length === 0 ? (
                <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-left text-xs space-y-2 text-amber-800 dark:text-amber-300">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="size-4 shrink-0" /> No properties found for this landlord
                  </p>
                  <p>
                    This landlord has not created any property yet. Please create a property first in their portfolio before importing units.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 rounded-2xl border border-border bg-muted/20">
                  {properties.map((p) => {
                    const isSelected = p.id === selectedPropertyId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPropertyId(p.id)}
                        className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                          isSelected
                            ? "bg-[#063B2A] text-white border-[#C9A227] shadow-sm font-semibold"
                            : "hover:bg-muted border-border text-foreground"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-sm">{p.name}</p>
                          <p className={`text-[11px] ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                            Code: <span className="font-mono">{p.code}</span> · {p.units_count} existing units · {p.property_type}
                          </p>
                        </div>
                        {isSelected ? <BadgeCheck className="size-5 shrink-0 text-[#C9A227]" /> : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Summary & Proceed Button */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              {selectedLandlord && selectedProperty ? (
                <p className="flex items-center gap-1.5 text-foreground font-semibold">
                  <CheckCircle2 className="size-4 text-[#087443]" />
                  Units will be added to: <strong className="text-primary">{selectedProperty.name}</strong> ({selectedLandlord.full_name || selectedLandlord.email})
                </p>
              ) : (
                <p className="italic">Select both a landlord and a property to continue.</p>
              )}
            </div>

            <Button
              disabled={!selectedLandlordId || !selectedPropertyId}
              onClick={() => setStep("input")}
              className="rounded-full bg-[#087443] hover:bg-[#063B2A] text-white font-bold h-11 px-8 text-xs sm:text-sm shadow-md"
            >
              Continue to Upload Input <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* STEP 2: INPUT METHOD (PASTE, SPREADSHEET, PDF, IMAGE)                     */}
      {/* ========================================================================= */}
      {step === "input" ? (
        <div className="surface-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Sparkles className="size-5 text-primary" /> Step 2: Upload or Paste Unit List
              </h3>
              <p className="text-xs text-muted-foreground">
                Target: <strong className="text-foreground">{selectedProperty?.name}</strong> (Landlord: {selectedLandlord?.full_name || selectedLandlord?.email})
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep("target")}
              className="rounded-full text-xs self-start sm:self-auto"
            >
              ← Change Target
            </Button>
          </div>

          {/* Input Format Tabs */}
          <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-2xl max-w-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setInputTab("paste")}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                inputTab === "paste"
                  ? "bg-[#087443] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clipboard className="size-3.5" /> Paste Text List
            </button>
            <button
              type="button"
              onClick={() => setInputTab("csv")}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                inputTab === "csv"
                  ? "bg-[#087443] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileSpreadsheet className="size-3.5" /> CSV / Excel
            </button>
            <button
              type="button"
              onClick={() => setInputTab("pdf")}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                inputTab === "pdf"
                  ? "bg-[#087443] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="size-3.5" /> PDF Document
            </button>
            <button
              type="button"
              onClick={() => setInputTab("image")}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                inputTab === "image"
                  ? "bg-[#087443] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Image className="size-3.5" /> Photo / Scan
            </button>
          </div>

          {/* TAB 1: PASTE TEXT */}
          {inputTab === "paste" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-muted-foreground">
                  Paste raw unit lines (messy formats, WhatsApp messages, or notes accepted):
                </Label>
                <button
                  type="button"
                  onClick={() => setPastedText(SAMPLE_TEXT_SNIPPET)}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Load Sample Kenyan List
                </button>
              </div>

              <textarea
                rows={10}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={`e.g.\nRoom 1 - 10,000 - John Mwangi\nRoom 2 - 10,000 - Mary Wanjiku\nRoom 3 - 12k - Vacant\nHouse 4 - 8500 - Peter`}
                className="w-full p-4 rounded-2xl border border-border bg-background text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              />
            </div>
          ) : null}

          {/* TAB 2, 3, 4: FILE UPLOADER */}
          {inputTab !== "paste" ? (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={
                  inputTab === "image"
                    ? "image/png,image/jpeg,image/webp,image/jpg"
                    : inputTab === "pdf"
                      ? "application/pdf"
                      : ".csv,.xlsx,.xls,.tsv,.txt"
                }
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#087443]/40 hover:border-[#087443] bg-[#E8F2ED]/30 dark:bg-[#0D3528]/20 p-10 rounded-3xl text-center cursor-pointer transition-all hover:scale-[1.005] space-y-3"
              >
                <div className="size-14 rounded-2xl bg-[#E8F2ED] dark:bg-[#0D3528] text-[#087443] flex items-center justify-center mx-auto shadow-sm">
                  <UploadCloud className="size-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-display font-bold text-sm text-foreground">
                    {uploadedFileName ? (
                      <span className="text-[#087443] font-bold">Selected: {uploadedFileName}</span>
                    ) : (
                      `Click to upload ${inputTab.toUpperCase()} file`
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inputTab === "image"
                      ? "Handwritten lists, ledger photos, or screenshots (.png, .jpg, .webp)"
                      : inputTab === "pdf"
                        ? "Rental schedules or PDF statements"
                        : "Excel spreadsheets or comma-separated files (.xlsx, .csv)"}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="rounded-full text-xs font-bold">
                  Browse Device
                </Button>
              </div>

              {pastedText ? (
                <div className="p-3 rounded-2xl bg-muted/40 border text-xs font-mono max-h-36 overflow-y-auto">
                  <p className="font-bold text-muted-foreground mb-1">Parsed Text Preview:</p>
                  <pre className="text-[11px] whitespace-pre-wrap">{pastedText.slice(0, 500)}...</pre>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Action Trigger */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Gemini AI will normalize currency and structure every unit without assigning properties or accounts.
            </p>

            <Button
              size="lg"
              disabled={(!pastedText.trim() && !fileBase64) || isExtracting}
              onClick={() => extractMutation.mutate()}
              className="rounded-full bg-[#087443] hover:bg-[#063B2A] text-white font-bold h-12 px-8 text-sm shadow-md"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" /> Extracting with AI...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2 text-[#C9A227]" /> Extract Units With AI →
                </>
              )}
            </Button>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* EXTRACTING ANIMATION SCREEN                                               */}
      {/* ========================================================================= */}
      {step === "extracting" ? (
        <div className="surface-card p-12 rounded-3xl border border-border/80 shadow-lg text-center space-y-6">
          <div className="size-20 rounded-3xl bg-[#E8F2ED] dark:bg-[#0D3528] text-[#087443] flex items-center justify-center mx-auto shadow-md animate-pulse">
            <Sparkles className="size-10 text-[#C9A227]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-display text-xl font-bold">✨ Extracting Unit Records...</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed">
              {extractionProgressText}
            </p>
          </div>

          <div className="w-full max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#087443] via-[#C9A227] to-[#087443] animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* STEP 3: EDITABLE PREVIEW TABLE & DUPLICATE RESOLUTION                     */}
      {/* ========================================================================= */}
      {step === "preview" ? (
        <div className="space-y-6">
          {/* Summary KPIs Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0A261D] border border-border shadow-sm text-center">
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Total Extracted</p>
              <p className="font-display text-2xl font-black mt-0.5">{counts.total}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#087443]/20 shadow-sm text-center">
              <p className="text-[11px] font-bold text-[#087443] dark:text-[#52B788] uppercase">Ready to Import</p>
              <p className="font-display text-2xl font-black text-[#087443] dark:text-[#52B788] mt-0.5">{counts.ready}</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-sm text-center">
              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">Needs Review</p>
              <p className="font-display text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{counts.review}</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-sm text-center">
              <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase">Existing Duplicates</p>
              <p className="font-display text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{counts.duplicates}</p>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold flex items-center gap-2">
                  <FileCheck2 className="size-5 text-primary" /> Review &amp; Edit Extracted Units
                </h3>
                <p className="text-xs text-muted-foreground">
                  You can edit values directly in any cell before saving to the database.
                </p>
              </div>

              {/* Filter Pills & Add Row */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-muted/60 p-1 rounded-full text-xs">
                  {(["all", "ready", "review", "duplicate"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTableFilter(tab)}
                      className={`px-3 py-1 rounded-full font-bold capitalize transition-all ${
                        tableFilter === tab
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddBlankRow}
                  className="rounded-full text-xs h-8 gap-1 font-bold"
                >
                  <Plus className="size-3.5" /> Add Unit
                </Button>
              </div>
            </div>

            {/* Duplicate Handling Control */}
            {counts.duplicates > 0 ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 text-amber-900 dark:text-amber-300">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="size-4 shrink-0" /> {counts.duplicates} unit(s) already exist in {selectedProperty?.name}
                  </p>
                  <p className="text-[11px] opacity-90">
                    Choose whether to skip duplicates (safe default) or update their rent/status.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDuplicateStrategy("skip")}
                    className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                      duplicateStrategy === "skip"
                        ? "bg-[#087443] text-white shadow-sm"
                        : "bg-white/80 dark:bg-card text-foreground border"
                    }`}
                  >
                    Skip Duplicates (Safe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuplicateStrategy("update")}
                    className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                      duplicateStrategy === "update"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-white/80 dark:bg-card text-foreground border"
                    }`}
                  >
                    Update Existing Records
                  </button>
                </div>
              </div>
            ) : null}

            {/* Editable Data Table */}
            <div className="overflow-x-auto rounded-2xl border border-border">
              <Table className="min-w-[850px] text-xs">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Unit / Room</TableHead>
                    <TableHead>Rent (KES)</TableHead>
                    <TableHead>Deposit (KES)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tenant Name</TableHead>
                    <TableHead>Tenant Phone</TableHead>
                    <TableHead>Validation Status</TableHead>
                    <TableHead className="w-12 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/60">
                  {displayedUnits.map((unit, idx) => {
                    const originalIndex = extractedUnits.indexOf(unit);
                    const isDup = unit.is_duplicate;
                    const hasErrors = unit.validation_flags.length > 0;

                    return (
                      <TableRow
                        key={originalIndex}
                        className={`hover:bg-muted/30 transition-colors ${
                          isDup ? "bg-rose-500/5" : hasErrors ? "bg-amber-500/5" : ""
                        }`}
                      >
                        <TableCell className="text-center font-mono text-muted-foreground">
                          {originalIndex + 1}
                        </TableCell>

                        {/* Unit Number */}
                        <TableCell>
                          <Input
                            value={unit.unit_number}
                            onChange={(e) => handleUpdateRow(originalIndex, "unit_number", e.target.value)}
                            className="h-8 text-xs font-bold font-mono rounded-lg w-28"
                          />
                        </TableCell>

                        {/* Rent */}
                        <TableCell>
                          <Input
                            type="number"
                            value={unit.rent || ""}
                            onChange={(e) => handleUpdateRow(originalIndex, "rent", parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs font-bold font-mono rounded-lg w-28 text-emerald-600"
                          />
                        </TableCell>

                        {/* Deposit */}
                        <TableCell>
                          <Input
                            type="number"
                            value={unit.deposit ?? ""}
                            onChange={(e) => handleUpdateRow(originalIndex, "deposit", parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs font-mono rounded-lg w-28"
                          />
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Select
                            value={unit.status}
                            onValueChange={(val: "occupied" | "vacant") => handleUpdateRow(originalIndex, "status", val)}
                          >
                            <SelectTrigger className="h-8 text-xs rounded-lg w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vacant">Vacant</SelectItem>
                              <SelectItem value="occupied">Occupied</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* Tenant Name */}
                        <TableCell>
                          <Input
                            value={unit.tenant_name || ""}
                            placeholder="Optional"
                            onChange={(e) => handleUpdateRow(originalIndex, "tenant_name", e.target.value)}
                            className="h-8 text-xs rounded-lg min-w-[130px]"
                          />
                        </TableCell>

                        {/* Tenant Phone */}
                        <TableCell>
                          <Input
                            value={unit.tenant_phone || ""}
                            placeholder="07XX..."
                            onChange={(e) => handleUpdateRow(originalIndex, "tenant_phone", e.target.value)}
                            className="h-8 text-xs font-mono rounded-lg w-32"
                          />
                        </TableCell>

                        {/* Validation Status */}
                        <TableCell>
                          {isDup ? (
                            <Badge variant="destructive" className="text-[10px] uppercase font-bold">
                              Duplicate
                            </Badge>
                          ) : hasErrors ? (
                            <Badge variant="outline" className="text-[10px] text-amber-600 bg-amber-500/10 border-amber-500/20">
                              ⚠ {unit.validation_flags[0]}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                              ✓ Valid
                            </Badge>
                          )}
                        </TableCell>

                        {/* Delete Action */}
                        <TableCell className="text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(originalIndex)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Bottom Final Confirm & Import Bar */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                Destination: <strong className="text-foreground">{selectedProperty?.name}</strong> · Landlord ID:{" "}
                <span className="font-mono text-[11px]">{selectedLandlordId.slice(0, 8)}...</span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("input")}
                  className="rounded-full text-xs h-11 px-5"
                >
                  ← Re-upload / Edit Input
                </Button>

                <Button
                  disabled={extractedUnits.length === 0 || importMutation.isPending}
                  onClick={() => importMutation.mutate()}
                  className="rounded-full bg-[#087443] hover:bg-[#063B2A] text-white font-bold h-11 px-8 text-xs sm:text-sm shadow-md"
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" /> Inserting Units...
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="size-4 mr-2 text-[#C9A227]" />
                      IMPORT APPROVED UNITS ({extractedUnits.length})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* STEP 4: IMPORT COMPLETED CONFIRMATION                                     */}
      {/* ========================================================================= */}
      {step === "complete" && importResult ? (
        <div className="surface-card p-8 sm:p-12 rounded-3xl border border-border/80 shadow-xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="size-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="size-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl font-black text-foreground">
              ✓ Bulk Import Completed Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              All records have been inserted and linked directly to{" "}
              <strong className="text-foreground">{importResult.property_name}</strong>.
            </p>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-muted/40 border text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">New Units Added</p>
              <p className="font-display text-xl font-bold text-emerald-600">{importResult.imported_count}</p>
            </div>
            <div className="p-3 rounded-2xl bg-muted/40 border text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Units Updated</p>
              <p className="font-display text-xl font-bold">{importResult.updated_count}</p>
            </div>
            <div className="p-3 rounded-2xl bg-muted/40 border text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Duplicates Skipped</p>
              <p className="font-display text-xl font-bold text-muted-foreground">{importResult.skipped_duplicates}</p>
            </div>
            <div className="p-3 rounded-2xl bg-muted/40 border text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Tenants Linked</p>
              <p className="font-display text-xl font-bold text-primary">{importResult.tenants_created}</p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-3">
            <Button
              onClick={() => {
                setExtractedUnits([]);
                setPastedText("");
                setFileBase64(null);
                setUploadedFileName("");
                setStep("input");
              }}
              className="rounded-full bg-[#087443] hover:bg-[#063B2A] text-white font-bold h-11 px-6 text-xs shadow-sm"
            >
              <Plus className="size-4 mr-1.5" /> Import Another File for this Property
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setExtractedUnits([]);
                setSelectedPropertyId("");
                setStep("target");
              }}
              className="rounded-full text-xs font-bold h-11 px-6"
            >
              Select Another Landlord / Property
            </Button>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* AUDIT LOGS HISTORY DIALOG                                                 */}
      {/* ========================================================================= */}
      <Dialog open={auditHistoryOpen} onOpenChange={setAuditHistoryOpen}>
        <DialogContent className="max-w-3xl rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <History className="size-5 text-primary" /> AI Bulk Import Audit Logs
            </DialogTitle>
            <DialogDescription className="text-xs">
              Historical record of all bulk unit batch imports executed by administrators.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {auditHistory.length ? (
              <div className="overflow-x-auto rounded-2xl border border-border">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date &amp; Time</TableHead>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Action Summary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border/60">
                    {auditHistory.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-muted-foreground whitespace-nowrap">
                          {shortDate(log.created_at)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {log.landlord_name}
                        </TableCell>
                        <TableCell className="font-mono text-[11px]">
                          {log.action}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-8 text-center">
                No AI bulk unit imports logged in history yet.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
