const STORAGE_KEY = "sportabzeichen.athletes.v1";
const GROUP_STORAGE_KEY = "sportabzeichen.groups.v1";
const TRAINING_STATE_STORAGE_KEY = "sportabzeichen.trainingState.v1";
const DISCLAIMER_ACCEPTED_STORAGE_KEY = "sportabzeichen.disclaimerAccepted.v1";
const REQUIREMENT_FILE_CANDIDATES = [
  "./sportabzeichen_2026_requirements.webapp.json",
  "./sportabzeichen_2025_requirements.webapp.json",
  "./sportabzeichen_2026_requirements.json",
  "./sportabzeichen_2025_requirements.json"
];
const CATEGORY_ORDER = ["Ausdauer", "Schnelligkeit", "Kraft", "Koordination"];
const CATEGORY_WITH_SWIMMING_ORDER = [...CATEGORY_ORDER, "Schwimmen"];
const LEVEL_RANK = {
  "-": 0,
  Bronze: 1,
  Silber: 2,
  Gold: 3
};
const LEVEL_POINTS = {
  Bronze: 1,
  Silber: 2,
  Gold: 3
};
const DIGITAL_CATEGORY_ORDER = ["Ausdauer", "Kraft", "Schnelligkeit", "Koordination"];
const AUTO_SWIM_PROOF_OPTION = "__auto_from_performances__";
const ASSOCIATION_BADGE_VIRTUAL_PREFIX = "__virtual_association_badge__";
const SWIM_PROOF_VIRTUAL_KEY = "__virtual_swim_proof__";
const WEEKDAY_OPTIONS = [
  { value: 1, label: "Montag" },
  { value: 2, label: "Dienstag" },
  { value: 3, label: "Mittwoch" },
  { value: 4, label: "Donnerstag" },
  { value: 5, label: "Freitag" },
  { value: 6, label: "Samstag" },
  { value: 0, label: "Sonntag" }
];
const APP_PAGE_INSTANCE_ID = createId();
const TRAINING_ABORT_CONFIRM_WINDOW_MS = 4200;

const state = {
  athletes: [],
  groups: [],
  selectedGroupId: "",
  groupFilterManuallySet: false,
  requirementsInspectorOpen: false,
  requirementsInspectorInput: "",
  requirementsInspectorGender: "M",
  selectedAthleteId: "",
  selectedDisciplineKey: "",
  requirements: null,
  requirementFile: "",
  digitalExportFormat: "groupPerformanceXlsx",
  digitalExportScope: "all",
  digitalExportGroupId: "",
  digitalExportAthleteIds: [],
  importDetectedType: "",
  importDetectedFileName: "",
  importDetectedMessage: "",
  formMode: "create",
  editAthleteId: "",
  groupFormMode: "create",
  editGroupId: "",
  editPerformanceId: "",
  trainingViewMode: "requirements",
  trainingSelectedDisciplineId: "",
  trainingCompactPane: "list",
  trainingMarkedAthleteIds: [],
  trainingInputDrafts: {},
  trainingExamSessions: {}
};

const athletesView = document.getElementById("view-athletes");
const trainingView = document.getElementById("view-training");
const athletesTitle = document.getElementById("athletes-title");
const trainingTitle = document.getElementById("training-title");
const trainingModeToggleButton = document.getElementById("training-mode-toggle-btn");
const trainingBackButton = document.getElementById("training-back-btn");
const trainingSubtitle = document.getElementById("training-subtitle");
const trainingContentTitle = document.getElementById("training-content-title");
const trainingDisciplineList = document.getElementById("training-discipline-list");
const trainingRequirementsPane = document.getElementById("training-requirements-pane");
const trainingExamPane = document.getElementById("training-exam-pane");
const trainingExamControlsHost = document.getElementById("training-exam-controls-host");
const athleteList = document.getElementById("athlete-list");
const requirementsViewButton = document.getElementById("requirements-view-btn");
const emptyState = document.getElementById("empty-state");
const athleteDetailPane = document.getElementById("athlete-detail-pane");
const athleteDetailPlaceholder = document.getElementById("athlete-detail-placeholder");
const athleteDetailContent = document.getElementById("athlete-detail-content");
const athleteDetailTitleWrap = document.getElementById("athlete-detail-title-wrap");
const athleteDetailTitle = document.getElementById("athlete-detail-title");
const athleteDetailName = document.getElementById("athlete-detail-name");
const athleteDetailCode = document.getElementById("athlete-detail-code");
const athleteDetailSubtitle = document.getElementById("athlete-detail-subtitle");
const athleteCategoryStatusRow = document.getElementById("athlete-category-status-row");
const requirementsInspectorPanel = document.getElementById("requirements-inspector-panel");
const disciplineGroups = document.getElementById("discipline-groups");
const disciplineDetailPanel = document.getElementById("discipline-detail-panel");
const openPerformanceModalButton = document.getElementById("toggle-performance-form-btn");

const performanceForm = document.getElementById("performance-form");
const performanceValueInput = document.getElementById("performance-value-input");
const performanceValueLabel = document.getElementById("performance-value-label");
const performanceDateTimeInput = document.getElementById("performance-datetime-input");
const performanceDateTimeLabel = document.getElementById("performance-datetime-label");
const performanceHistory = document.getElementById("performance-history");
const cancelPerformanceEditButton = document.getElementById("cancel-performance-edit-btn");
const deletePerformanceButton = document.getElementById("delete-performance-btn");
const savePerformanceButton = document.getElementById("save-performance-btn");
const performanceModal = document.getElementById("performance-modal");
const performanceModalTitle = document.getElementById("performance-modal-title");
const performanceModalMeta = document.getElementById("performance-modal-meta");
const closePerformanceModalButton = document.getElementById("close-performance-modal-btn");
const performanceSpecialFields = document.getElementById("performance-special-fields");
const performanceSpecialSelectLabel = document.getElementById("performance-special-select-label");
const performanceSpecialSelectText = document.getElementById("performance-special-select-text");
const performanceSpecialSelect = document.getElementById("performance-special-select");
const performanceSpecialLevelLabel = document.getElementById("performance-special-level-label");
const performanceSpecialLevelText = document.getElementById("performance-special-level-text");
const performanceSpecialLevelInput = document.getElementById("performance-special-level");
const performanceSpecialLevelPicker = document.getElementById("performance-special-level-picker");
const performanceSpecialLevelButtons = performanceSpecialLevelPicker
  ? Array.from(performanceSpecialLevelPicker.querySelectorAll(".medal-level-btn[data-level]"))
  : [];
const performanceSpecialHint = document.getElementById("performance-special-hint");
const disclaimerModal = document.getElementById("disclaimer-modal");
const ackDisclaimerButton = document.getElementById("ack-disclaimer-btn");

const athleteModal = document.getElementById("athlete-modal");
const athleteModalTitle = document.getElementById("athlete-modal-title");
const athleteForm = document.getElementById("athlete-form");
const groupModal = document.getElementById("group-modal");
const groupModalTitle = document.getElementById("group-modal-title");
const closeGroupModalButton = document.getElementById("close-group-modal-btn");
const groupModalFilterList = document.getElementById("group-modal-filter-list");
const createGroupButton = document.getElementById("create-group-btn");
const groupFormWrap = document.getElementById("group-form-wrap");
const groupEditorTitle = document.getElementById("group-editor-title");
const groupForm = document.getElementById("group-form");
const saveAthleteButton = document.getElementById("save-athlete-btn");
const deleteAthleteButton = document.getElementById("delete-athlete-btn");
const addAthleteButton = document.getElementById("add-athlete-btn");
const editAthleteButton = document.getElementById("edit-athlete-btn");
const athleteBackButton = document.getElementById("athlete-back-btn");
const closeModalButton = document.getElementById("close-modal-btn");
const cancelModalButton = document.getElementById("cancel-modal-btn");
const athleteGroupSelection = document.getElementById("athlete-group-selection");
const athleteGenderToggle = document.getElementById("athlete-gender-toggle");
const athleteGenderInput = document.getElementById("athlete-gender-input");
const groupNameInput = document.getElementById("group-name-input");
const groupAthleteSelection = document.getElementById("group-athlete-selection");
const groupTrainingSlots = document.getElementById("group-training-slots");
const addTrainingSlotButton = document.getElementById("add-training-slot-btn");
const deleteGroupButton = document.getElementById("delete-group-btn");
const saveGroupButton = document.getElementById("save-group-btn");
const cancelGroupModalButton = document.getElementById("cancel-group-modal-btn");

const installAppButton = document.getElementById("install-app-btn");
const toast = document.getElementById("toast");
const exportFullButton = document.getElementById("export-full-btn");
const exportDigitalButton = document.getElementById("export-digital-btn");
const exportDigitalFormatSelect = document.getElementById("export-digital-format-select");
const exportDigitalScopeSelect = document.getElementById("export-digital-scope-select");
const exportDigitalGroupWrap = document.getElementById("export-digital-group-wrap");
const exportDigitalGroupSelect = document.getElementById("export-digital-group-select");
const exportDigitalAthletesWrap = document.getElementById("export-digital-athletes-wrap");
const exportDigitalAthleteSelection = document.getElementById("export-digital-athlete-selection");
const exportDigitalAthletesAllButton = document.getElementById("export-digital-athletes-all-btn");
const exportDigitalAthletesNoneButton = document.getElementById("export-digital-athletes-none-btn");
const importFileInput = document.getElementById("import-file-input");
const importRunButton = document.getElementById("import-run-btn");
const importDetectedFormat = document.getElementById("import-detected-format");
const importSimpleGroupControls = document.getElementById("import-simple-group-controls");
const importCreateGroupCheckbox = document.getElementById("import-create-group-checkbox");
const importGroupSelectWrap = document.getElementById("import-group-select-wrap");
const importGroupSelect = document.getElementById("import-group-select");
const resultsTotalAthletes = document.getElementById("results-total-athletes");
const resultsTotalGroups = document.getElementById("results-total-groups");
const resultsTotalPerformances = document.getElementById("results-total-performances");

let deferredInstallPrompt = null;
let toastTimer = null;
let xlsxLibraryPromise = null;
let trainingExamTickerHandle = null;
let trainingAbortConfirmTimer = null;
let trainingAbortConfirmState = {
  actionKey: "",
  expiresAt: 0
};

const CSV_IMPORT_ALIASES = {
  id: ["id", "dsaid"],
  dsaId: ["dsaid", "id"],
  firstName: ["vorname", "firstname", "givenname"],
  lastName: ["nachname", "lastname", "surname", "familyname"],
  birthDate: ["geburtsdatum", "birthdate", "geburtstag", "geburtsdt", "gebdatum", "dob"],
  gender: ["geschlecht", "gender", "sex", "geschl", "mw"],
  zip: ["plz", "postleitzahl", "zipcode", "zip", "postalcode", "adressepostleitzahl", "addresspostalcode"],
  city: ["ort", "stadt", "city", "adresseort", "adressestadt", "addresscity", "wohnort"],
  country: ["land", "country", "landercode", "laendercode", "landerkurzel", "laenderkurzel", "adresselanderkurzel", "countrycode", "iso2"],
  street: ["strasseundnr", "strassehsnr", "strassehausnr", "strassehausnummer", "strasse", "street"],
  title: ["titel", "anrede", "title"],
  email: ["email", "mail", "emailadresse", "e-mail"],
  disabilityClass: ["behinderungsklasse", "behinderung", "handicapclass"],
  groupName: ["gruppenname", "gruppe", "group", "groupname"],
  ausdauerCode: ["zifferuebungausdauer", "zifferausdauer"],
  ausdauerValue: ["leistungausdauer", "wertausdauer"],
  kraftCode: ["zifferuebungkraft", "zifferkraft"],
  kraftValue: ["leistungkraft", "wertkraft"],
  schnelligkeitCode: ["zifferuebungschnelligkeit", "zifferschnelligkeit"],
  schnelligkeitValue: ["leistungschnelligkeit", "wertschnelligkeit"],
  koordinationCode: ["zifferuebungkoordination", "zifferkoordination"],
  koordinationValue: ["leistungkoordination", "wertkoordination"],
  swimProofYear: ["nachweisschwimmfertigkeitjahr", "schwimmnachweisjahr", "schwimmfertigkeitjahr"]
};

function updateBodyScrollLock() {
  const athleteModalOpen = athleteModal && !athleteModal.hidden;
  const groupModalOpen = groupModal && !groupModal.hidden;
  const performanceModalOpen = performanceModal && !performanceModal.hidden;
  const disclaimerModalOpen = disclaimerModal && !disclaimerModal.hidden;
  document.body.style.overflow = athleteModalOpen || groupModalOpen || performanceModalOpen || disclaimerModalOpen ? "hidden" : "";
}

function hasAcceptedDisclaimer() {
  return localStorage.getItem(DISCLAIMER_ACCEPTED_STORAGE_KEY) === "accepted";
}

function markDisclaimerAccepted() {
  localStorage.setItem(DISCLAIMER_ACCEPTED_STORAGE_KEY, "accepted");
}

function openDisclaimerModal() {
  if (!disclaimerModal) {
    return;
  }

  disclaimerModal.hidden = false;
  updateBodyScrollLock();
}

function closeDisclaimerModal() {
  if (!disclaimerModal) {
    return;
  }

  disclaimerModal.hidden = true;
  updateBodyScrollLock();
}

function acknowledgeDisclaimer() {
  markDisclaimerAccepted();
  closeDisclaimerModal();
}

function closePerformanceModal() {
  if (!performanceModal) {
    return;
  }

  performanceModal.hidden = true;
  state.editPerformanceId = "";
  performanceModal.style.setProperty("--keyboard-offset", "0px");
  updateBodyScrollLock();
}

function getKeyboardOverlayOffsetPx() {
  if (!window.visualViewport) {
    return 0;
  }

  const viewportBottom = window.visualViewport.height + window.visualViewport.offsetTop;
  const overlap = window.innerHeight - viewportBottom;
  return overlap > 0 ? overlap : 0;
}

function updatePerformanceModalKeyboardOffset() {
  if (!performanceModal || performanceModal.hidden) {
    return;
  }

  const keyboardOffset = Math.round(getKeyboardOverlayOffsetPx());
  performanceModal.style.setProperty("--keyboard-offset", `${keyboardOffset}px`);
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function isValidYearValue(rawValue) {
  const value = normalizeText(rawValue);
  if (!value) {
    return true;
  }

  if (!/^\d{4}$/.test(value)) {
    return false;
  }

  const year = Number(value);
  return Number.isInteger(year) && year >= 1900 && year <= 2100;
}

function normalizeYearValue(rawValue) {
  const value = normalizeText(rawValue);
  if (!value) {
    return "";
  }

  if (!isValidYearValue(value)) {
    return "";
  }

  return String(Number(value));
}

function toOptionalNumber(rawValue) {
  if (rawValue === null || rawValue === undefined) {
    return NaN;
  }

  const textValue = normalizeText(rawValue);
  if (!textValue) {
    return NaN;
  }

  const numeric = Number(textValue);
  return Number.isFinite(numeric) ? numeric : NaN;
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function getRequirementYear() {
  return Number(state.requirements?.year) || getCurrentYear();
}

function calculateYearGroupFromBirthDate(birthDate, referenceYear = getCurrentYear()) {
  if (!birthDate) {
    return "-";
  }

  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) {
    return "-";
  }

  return Math.max(0, referenceYear - birth.getFullYear());
}

function athleteCode(athlete) {
  return `${athlete.gender}${calculateYearGroupFromBirthDate(athlete.birthDate)}`;
}

function getRecentBirthdayInfo(birthDate, lookbackDays = 14) {
  const normalizedBirthDate = normalizeText(birthDate);
  if (!normalizedBirthDate) {
    return null;
  }

  const birthMatch = normalizedBirthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!birthMatch) {
    return null;
  }

  const birthMonth = Number(birthMatch[2]);
  const birthDay = Number(birthMatch[3]);
  if (!Number.isInteger(birthMonth) || !Number.isInteger(birthDay)) {
    return null;
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const buildBirthdayForYear = (year) => {
    let candidate = new Date(year, birthMonth - 1, birthDay);
    if (candidate.getMonth() === birthMonth - 1 && candidate.getDate() === birthDay) {
      return candidate;
    }

    // Handle 29.02 in non-leap years by falling back to 28.02.
    if (birthMonth === 2 && birthDay === 29) {
      candidate = new Date(year, 1, 28);
      if (candidate.getMonth() === 1 && candidate.getDate() === 28) {
        return candidate;
      }
    }

    return null;
  };

  let recentBirthday = buildBirthdayForYear(todayStart.getFullYear());
  if (!recentBirthday) {
    return null;
  }

  if (recentBirthday.getTime() > todayStart.getTime()) {
    const previousYearBirthday = buildBirthdayForYear(todayStart.getFullYear() - 1);
    if (!previousYearBirthday) {
      return null;
    }

    recentBirthday = previousYearBirthday;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysAgo = Math.round((todayStart.getTime() - recentBirthday.getTime()) / millisecondsPerDay);
  if (!Number.isInteger(daysAgo) || daysAgo < 0 || daysAgo > lookbackDays) {
    return null;
  }

  const dateLabel = `${String(recentBirthday.getDate()).padStart(2, "0")}.${String(recentBirthday.getMonth() + 1).padStart(2, "0")}.`;
  if (daysAgo === 0) {
    return {
      daysAgo,
      shortLabel: "Heute",
      detailLabel: `Geburtstag heute (${dateLabel})`
    };
  }

  const dayLabel = daysAgo === 1 ? "Tag" : "Tagen";
  return {
    daysAgo,
    shortLabel: `vor ${daysAgo} ${dayLabel}`,
    detailLabel: `Geburtstag vor ${daysAgo} ${dayLabel} (${dateLabel})`
  };
}

function athleteDisplayName(athlete) {
  return `${athlete.firstName} ${athlete.lastName}`.trim();
}

function toDateTimeLocalValue(isoDate) {
  const source = isoDate ? new Date(isoDate) : new Date();
  if (Number.isNaN(source.getTime())) {
    return "";
  }

  const local = new Date(source.getTime() - source.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function parseDateTimeLocalToIso(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString();
}

function formatDateTime(isoDate) {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(parsed);
}

function formatNormalizedValue(rule, normalizedValue, valueInput = "") {
  const raw = normalizeText(valueInput);
  if (raw) {
    return raw;
  }

  const numeric = Number(normalizedValue);
  if (!Number.isFinite(numeric)) {
    return "-";
  }

  if (rule.unitType === "time_mm_ss") {
    const totalSeconds = Math.max(0, Math.round(numeric));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  if (rule.unitType === "time_seconds") {
    return `${numeric.toLocaleString("de-DE", { maximumFractionDigits: 2 })} s`;
  }

  if (rule.unitType === "level") {
    return `Stufe ${Math.round(numeric)}`;
  }

  return numeric.toLocaleString("de-DE", { maximumFractionDigits: 2 });
}

function normalizePerformanceEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const normalizedValue = Number(entry.valueNormalized ?? entry.value ?? NaN);
  if (!Number.isFinite(normalizedValue)) {
    return null;
  }

  const measuredAt = new Date(entry.measuredAt || entry.createdAt || Date.now());

  return {
    id: entry.id || createId(),
    valueInput: normalizeText(entry.valueInput ?? entry.value ?? ""),
    valueNormalized: normalizedValue,
    measuredAt: Number.isNaN(measuredAt.getTime()) ? new Date().toISOString() : measuredAt.toISOString(),
    meta: entry.meta && typeof entry.meta === "object" ? { ...entry.meta } : {},
    createdAt: entry.createdAt || new Date().toISOString(),
    updatedAt: entry.updatedAt || entry.createdAt || new Date().toISOString()
  };
}

function normalizePerformances(performances) {
  const normalized = {};

  if (!performances || typeof performances !== "object") {
    return normalized;
  }

  for (const [disciplineKey, entries] of Object.entries(performances)) {
    if (!Array.isArray(entries)) {
      continue;
    }

    normalized[disciplineKey] = entries.map((entry) => normalizePerformanceEntry(entry)).filter(Boolean);
  }

  return normalized;
}

function normalizeAthleteRecord(record) {
  const swimProofSelection = normalizeText(record.swimProofSelection || record.swimProofType);
  const normalizedSwimProofSelection = swimProofSelection || (normalizeYearValue(record.swimProofYear) ? AUTO_SWIM_PROOF_OPTION : "");

  return {
    id: normalizeText(record.id) || createId(),
    firstName: normalizeText(record.firstName),
    lastName: normalizeText(record.lastName),
    gender: record.gender === "W" ? "W" : "M",
    birthDate: normalizeText(record.birthDate),
    dsaId: normalizeText(record.dsaId),
    associationBadgeId: normalizeText(record.associationBadgeId),
    associationBadgeLevel: normalizeText(record.associationBadgeLevel),
    zip: normalizeText(record.zip),
    city: normalizeText(record.city),
    country: normalizeText(record.country) || "Deutschland",
    swimProofYear: normalizeYearValue(record.swimProofYear),
    swimProofSelection: normalizedSwimProofSelection,
    swimProofPerformance: normalizeText(record.swimProofPerformance || record.swimProofValue),
    createdAt: record.createdAt || new Date().toISOString(),
    performances: normalizePerformances(record.performances)
  };
}

function normalizeTimeValue(rawValue) {
  const text = normalizeText(rawValue);
  if (!/^\d{2}:\d{2}$/.test(text)) {
    return "";
  }

  const hours = Number(text.slice(0, 2));
  const minutes = Number(text.slice(3, 5));
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return "";
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function normalizeTrainingSlot(slot) {
  if (!slot || typeof slot !== "object") {
    return null;
  }

  const weekday = Number(slot.weekday);
  const startTime = normalizeTimeValue(slot.startTime);
  const endTime = normalizeTimeValue(slot.endTime);
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !startTime || !endTime) {
    return null;
  }

  return {
    id: normalizeText(slot.id) || createId(),
    weekday,
    startTime,
    endTime
  };
}

function normalizeGroupRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const athleteIds = Array.isArray(record.athleteIds)
    ? Array.from(new Set(record.athleteIds.map((athleteId) => normalizeText(athleteId)).filter(Boolean)))
    : [];

  const trainingSlots = Array.isArray(record.trainingSlots) ? record.trainingSlots.map((slot) => normalizeTrainingSlot(slot)).filter(Boolean) : [];
  const now = new Date().toISOString();

  return {
    id: normalizeText(record.id) || createId(),
    name: normalizeText(record.name),
    athleteIds,
    trainingSlots,
    createdAt: record.createdAt || now,
    updatedAt: record.updatedAt || record.createdAt || now
  };
}

function loadAthletes() {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) {
    state.athletes = [];
    return;
  }

  try {
    const parsed = JSON.parse(rawData);
    const athletes = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.athletes) ? parsed.athletes : [];
    state.athletes = athletes.map((entry) => normalizeAthleteRecord(entry));
  } catch (_error) {
    state.athletes = [];
  }
}

function saveAthletes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.athletes));
}

function loadGroups() {
  const rawData = localStorage.getItem(GROUP_STORAGE_KEY);
  if (!rawData) {
    state.groups = [];
    return;
  }

  try {
    const parsed = JSON.parse(rawData);
    const groups = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.groups) ? parsed.groups : [];
    state.groups = groups.map((entry) => normalizeGroupRecord(entry)).filter((entry) => !!entry && !!entry.name);
  } catch (_error) {
    state.groups = [];
  }
}

function saveGroups() {
  localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(state.groups));
}

function normalizeTrainingTimeMarker(marker) {
  if (!marker || typeof marker !== "object") {
    return null;
  }

  const dateNowMs = Number(marker.dateNowMs);
  if (!Number.isFinite(dateNowMs) || dateNowMs <= 0) {
    return null;
  }

  const perfNowMs = Number(marker.perfNowMs);
  return {
    dateNowMs,
    perfNowMs: Number.isFinite(perfNowMs) ? perfNowMs : NaN,
    pageInstanceId: normalizeText(marker.pageInstanceId)
  };
}

function normalizeTrainingExamAthleteState(rawState) {
  if (!rawState || typeof rawState !== "object") {
    return {
      running: false,
      startMarker: null,
      lastElapsedMs: 0,
      lastMeasuredAt: ""
    };
  }

  const startMarker = normalizeTrainingTimeMarker(rawState.startMarker);
  const lastElapsedMs = Number(rawState.lastElapsedMs);

  return {
    running: !!rawState.running && !!startMarker,
    startMarker: !!rawState.running && !!startMarker ? startMarker : null,
    lastElapsedMs: Number.isFinite(lastElapsedMs) && lastElapsedMs > 0 ? lastElapsedMs : 0,
    lastMeasuredAt: normalizeText(rawState.lastMeasuredAt)
  };
}

function normalizeTrainingExamSession(rawSession) {
  if (!rawSession || typeof rawSession !== "object") {
    return {
      isGlobalRunning: false,
      globalStartMarker: null,
      athletes: {}
    };
  }

  const globalStartMarker = normalizeTrainingTimeMarker(rawSession.globalStartMarker);
  const athletes = {};

  if (rawSession.athletes && typeof rawSession.athletes === "object") {
    for (const [rawAthleteId, rawAthleteState] of Object.entries(rawSession.athletes)) {
      const athleteId = normalizeText(rawAthleteId);
      if (!athleteId) {
        continue;
      }

      athletes[athleteId] = normalizeTrainingExamAthleteState(rawAthleteState);
    }
  }

  return {
    isGlobalRunning: !!rawSession.isGlobalRunning && !!globalStartMarker,
    globalStartMarker: !!rawSession.isGlobalRunning && !!globalStartMarker ? globalStartMarker : null,
    athletes
  };
}

function loadTrainingState() {
  state.trainingViewMode = "requirements";
  state.trainingSelectedDisciplineId = "";
  state.trainingCompactPane = "list";
  state.trainingMarkedAthleteIds = [];
  state.trainingInputDrafts = {};
  state.trainingExamSessions = {};

  const rawData = localStorage.getItem(TRAINING_STATE_STORAGE_KEY);
  if (!rawData) {
    return;
  }

  try {
    const parsed = JSON.parse(rawData);
    const parsedMode = normalizeText(parsed?.trainingViewMode);
    state.trainingViewMode = parsedMode === "exam" ? "exam" : "requirements";
    state.trainingSelectedDisciplineId = normalizeText(parsed?.trainingSelectedDisciplineId);
    state.trainingCompactPane = normalizeText(parsed?.trainingCompactPane) === "content" ? "content" : "list";

    const markedAthleteIds = Array.isArray(parsed?.trainingMarkedAthleteIds)
      ? parsed.trainingMarkedAthleteIds.map((athleteId) => normalizeText(athleteId)).filter(Boolean)
      : [];
    state.trainingMarkedAthleteIds = Array.from(new Set(markedAthleteIds));

    if (parsed?.trainingExamSessions && typeof parsed.trainingExamSessions === "object") {
      for (const [disciplineIdRaw, rawSession] of Object.entries(parsed.trainingExamSessions)) {
        const disciplineId = normalizeText(disciplineIdRaw);
        if (!disciplineId) {
          continue;
        }

        state.trainingExamSessions[disciplineId] = normalizeTrainingExamSession(rawSession);
      }
    }
  } catch (_error) {
    state.trainingViewMode = "requirements";
    state.trainingSelectedDisciplineId = "";
    state.trainingCompactPane = "list";
    state.trainingMarkedAthleteIds = [];
    state.trainingInputDrafts = {};
    state.trainingExamSessions = {};
  }
}

function saveTrainingState() {
  const payload = {
    trainingViewMode: state.trainingViewMode,
    trainingSelectedDisciplineId: state.trainingSelectedDisciplineId,
    trainingCompactPane: state.trainingCompactPane,
    trainingMarkedAthleteIds: Array.isArray(state.trainingMarkedAthleteIds) ? state.trainingMarkedAthleteIds.slice() : [],
    trainingExamSessions: state.trainingExamSessions
  };

  localStorage.setItem(TRAINING_STATE_STORAGE_KEY, JSON.stringify(payload));
}

function pruneTrainingExamSessions() {
  if (!state.trainingExamSessions || typeof state.trainingExamSessions !== "object") {
    state.trainingExamSessions = {};
    return false;
  }

  const validAthleteIds = new Set(state.athletes.map((athlete) => athlete.id));
  const knownDisciplines = getTrainingDisciplineCatalog();
  const validDisciplineIds = new Set(knownDisciplines.map((discipline) => discipline.id));
  const canValidateDisciplineIds = validDisciplineIds.size > 0;
  let changed = false;

  for (const disciplineId of Object.keys(state.trainingExamSessions)) {
    if (canValidateDisciplineIds && !validDisciplineIds.has(disciplineId)) {
      delete state.trainingExamSessions[disciplineId];
      changed = true;
      continue;
    }

    const session = normalizeTrainingExamSession(state.trainingExamSessions[disciplineId]);
    state.trainingExamSessions[disciplineId] = session;

    for (const athleteId of Object.keys(session.athletes)) {
      if (validAthleteIds.has(athleteId)) {
        continue;
      }

      delete session.athletes[athleteId];
      changed = true;
    }

    if (!session.isGlobalRunning && Object.keys(session.athletes).length === 0) {
      delete state.trainingExamSessions[disciplineId];
      changed = true;
    }
  }

  return changed;
}

function formatDateForFilename(date = new Date()) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

function downloadTextFile(fileName, content, { mimeType = "text/plain;charset=utf-8", withBom = false } = {}) {
  const payload = `${withBom ? "\uFEFF" : ""}${String(content || "")}`;
  const blob = new Blob([payload], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

function downloadBlobFile(fileName, blob) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

function getXlsxLibrary() {
  if (window.XLSX) {
    return Promise.resolve(window.XLSX);
  }

  if (xlsxLibraryPromise) {
    return xlsxLibraryPromise;
  }

  xlsxLibraryPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("xlsx-runtime-lib");
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.XLSX) {
          resolve(window.XLSX);
          return;
        }

        reject(new Error("XLSX library missing after load."));
      }, { once: true });
      existingScript.addEventListener("error", () => {
        reject(new Error("XLSX library load failed."));
      }, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "xlsx-runtime-lib";
    script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    script.async = true;
    script.addEventListener("load", () => {
      if (window.XLSX) {
        resolve(window.XLSX);
        return;
      }

      reject(new Error("XLSX library loaded but not available."));
    }, { once: true });
    script.addEventListener("error", () => {
      reject(new Error("XLSX library failed to load."));
    }, { once: true });
    document.head.append(script);
  }).catch((error) => {
    xlsxLibraryPromise = null;
    throw error;
  });

  return xlsxLibraryPromise;
}

async function downloadRowsAsXlsx(fileName, rows, sheetName = "Export") {
  const XLSX = await getXlsxLibrary();
  const workbook = XLSX.utils.book_new();

  const sheetDefinitions =
    Array.isArray(rows) && rows.length > 0 && !Array.isArray(rows[0]) && Array.isArray(rows[0].rows)
      ? rows
      : [{ name: sheetName, rows }];

  for (const definition of sheetDefinitions) {
    const worksheetRows = Array.isArray(definition?.rows) ? definition.rows : [];
    const worksheetName = normalizeText(definition?.name) || "Export";
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName.slice(0, 31));
  }

  const workbookBytes = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const blob = new Blob([workbookBytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  downloadBlobFile(fileName, blob);
}

function toIsoCountryCode(countryValue) {
  const normalizedCountry = normalizeText(countryValue).toUpperCase();
  if (!normalizedCountry) {
    return "DE";
  }

  if (/^DE(U|UTSCHLAND)?$/.test(normalizedCountry)) {
    return "DE";
  }

  if (/^AT|OESTERREICH|AUSTRIA/.test(normalizedCountry)) {
    return "AT";
  }

  if (/^CH|SCHWEIZ|SWITZERLAND/.test(normalizedCountry)) {
    return "CH";
  }

  if (/^[A-Z]{2}$/.test(normalizedCountry)) {
    return normalizedCountry;
  }

  return normalizedCountry.slice(0, 2);
}

function formatBirthDateForDigitalExport(birthDate) {
  const normalizedBirthDate = normalizeText(birthDate);
  const dateMatch = normalizedBirthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) {
    return "";
  }

  return `${dateMatch[2]}/${dateMatch[3]}/${dateMatch[1]}`;
}

function normalizeCsvToken(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/\u00df/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function detectCsvDelimiter(csvText) {
  const sample = String(csvText || "").slice(0, 6000);
  let commaCount = 0;
  let semicolonCount = 0;
  let tabCount = 0;
  let inQuotes = false;

  for (let index = 0; index < sample.length; index += 1) {
    const char = sample[index];
    if (char === '"') {
      if (inQuotes && sample[index + 1] === '"') {
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (inQuotes) {
      continue;
    }

    if (char === ",") {
      commaCount += 1;
    } else if (char === ";") {
      semicolonCount += 1;
    } else if (char === "\t") {
      tabCount += 1;
    }
  }

  if (tabCount >= semicolonCount && tabCount >= commaCount && tabCount > 0) {
    return "\t";
  }

  return semicolonCount > commaCount ? ";" : ",";
}

function parseCsvText(csvText) {
  const source = String(csvText || "").replace(/^\uFEFF/, "");
  const delimiter = detectCsvDelimiter(source);
  const rows = [];

  let row = [];
  let value = "";
  let inQuotes = false;

  const pushValue = () => {
    row.push(value);
    value = "";
  };

  const pushRow = () => {
    rows.push(row);
    row = [];
  };

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (char === '"') {
      if (inQuotes && source[index + 1] === '"') {
        value += '"';
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && char === delimiter) {
      pushValue();
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      pushValue();
      pushRow();
      if (char === "\r" && source[index + 1] === "\n") {
        index += 1;
      }
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    pushValue();
    pushRow();
  }

  return {
    delimiter,
    rows
  };
}

function escapeCsvCell(value, delimiter = ",") {
  const text = String(value ?? "");
  const escapedText = text.replace(/"/g, '""');
  if (escapedText.includes(delimiter) || escapedText.includes("\n") || escapedText.includes("\r") || escapedText.includes('"')) {
    return `"${escapedText}"`;
  }

  return escapedText;
}

function serializeCsvRows(rows, delimiter = ",") {
  return rows.map((row) => row.map((cell) => escapeCsvCell(cell, delimiter)).join(delimiter)).join("\r\n");
}

function createSportabzeichenDigitalHeaderRows() {
  const columnCount = 21;
  const row1 = Array(columnCount).fill("");
  row1[0] = "V. 1.1";

  const row2 = Array(columnCount).fill("");
  row2[0] = "Bitte beachten: Der Tabellenkopf (Zeilen 1\u20136) darf weder gel\u00f6scht noch ver\u00e4ndert werden, da der Import sonst nicht korrekt verarbeitet werden kann.";

  const row3 = Array(columnCount).fill("");

  const row4 = Array(columnCount).fill("");
  row4[0] = "Pr\u00fcfungsinformationen";
  row4[12] = "Ausdauer";
  row4[14] = "Kraft";
  row4[16] = "Schnelligkeit";
  row4[18] = "Koordination";

  const row5 = Array(columnCount).fill("");
  row5[12] = "Ziffer gem\u00e4\u00df Pr\u00fcfkarte oder A f\u00fcr Verbandsabzeichen";
  row5[14] = "Ziffer gem\u00e4\u00df Pr\u00fcfkarte oder A f\u00fcr Verbandsabzeichen";
  row5[16] = "Ziffer gem\u00e4\u00df Pr\u00fcfkarte oder A f\u00fcr Verbandsabzeichen";
  row5[18] = "Ziffer gem\u00e4\u00df Pr\u00fcfkarte oder A f\u00fcr Verbandsabzeichen";

  const row6 = [
    "ID",
    "Geburtsdatum",
    "Titel",
    "Nachname",
    "Vorname",
    "Geschlecht",
    "Behinderungsklasse",
    "Stra\u00dfe Hs.-Nr.",
    "PLZ",
    "Ort",
    "Land",
    "E-Mail",
    "Ziffer \u00dcbung \nAusdauer",
    "Leistung\nAusdauer",
    "Ziffer \u00dcbung \nKraft",
    "Leistung\nKraft",
    "Ziffer \u00dcbung \nSchnelligkeit",
    "Leistung\nSchnelligkeit",
    "Ziffer \u00dcbung \nKoordination",
    "Leistung\nKoordination",
    "Nachweis Schwimmfertigkeit\nJahr"
  ];

  return [row1, row2, row3, row4, row5, row6];
}

function isLikelyDistanceRule(rule) {
  const disciplineName = normalizeText(rule?.disciplineName).toLowerCase();
  return /(sprung|wurf|stoss|sto\.|schlagball|schuss|schleuderball|weitsprung|hochsprung|kugel|werfen)/.test(disciplineName);
}

function formatDigitalPerformanceValue(rule, entry) {
  const rawValue = normalizeText(entry?.valueInput);
  const normalizedValue = Number(entry?.valueNormalized);
  const fallbackNumeric = Number.isFinite(normalizedValue) ? normalizedValue : parseLocaleNumberSmart(rawValue);

  if (rule.unitType === "time_mm_ss") {
    const seconds = Number.isFinite(normalizedValue) ? normalizedValue : parseFlexibleClockToSeconds(rawValue);
    if (!Number.isFinite(seconds)) {
      return rawValue;
    }

    return formatMinutesSecondsInput(seconds).replace(",", ".");
  }

  if (rule.unitType === "time_seconds") {
    if (!Number.isFinite(fallbackNumeric)) {
      return rawValue;
    }

    return fallbackNumeric.toLocaleString("de-DE", {
      minimumFractionDigits: Number.isInteger(fallbackNumeric) ? 0 : 1,
      maximumFractionDigits: 2
    });
  }

  if (rule.unitType === "level") {
    if (!Number.isFinite(fallbackNumeric)) {
      return rawValue;
    }

    return String(Math.max(1, Math.min(3, Math.round(fallbackNumeric))));
  }

  if (!Number.isFinite(fallbackNumeric)) {
    return rawValue;
  }

  if (isLikelyDistanceRule(rule) && fallbackNumeric > 0 && fallbackNumeric < 25) {
    return String(Math.round(fallbackNumeric * 100));
  }

  if (Number.isInteger(fallbackNumeric)) {
    return String(Math.round(fallbackNumeric));
  }

  return fallbackNumeric.toLocaleString("de-DE", {
    maximumFractionDigits: 2
  });
}

function selectDigitalCategoryExport(athlete, requirementGroup, categoryName) {
  const candidates = [];
  const rules = Array.isArray(requirementGroup?.disciplines)
    ? requirementGroup.disciplines.filter((rule) => normalizeText(rule.category) === categoryName)
    : [];

  for (const rule of rules) {
    const code = normalizeText(rule.disciplineCode || rule.catalogCode);
    if (!code) {
      continue;
    }

    const entries = getPerformanceEntries(athlete, getRuleStorageKey(rule));
    const bestEntry = getBestPerformanceEntry(rule, entries);
    if (!bestEntry) {
      continue;
    }

    const evaluatedLevel = evaluatePerformanceLevel(rule, bestEntry.valueNormalized);
    const measuredAt = new Date(bestEntry.measuredAt).getTime();
    candidates.push({
      code,
      value: formatDigitalPerformanceValue(rule, bestEntry),
      levelRank: getLevelRank(evaluatedLevel),
      measuredAt: Number.isFinite(measuredAt) ? measuredAt : 0,
      priority: 1
    });
  }

  const associationStorageKey = getAssociationBadgeRuleStorageKey(categoryName);
  const associationEntries = getPerformanceEntries(athlete, associationStorageKey);
  if (associationEntries.length > 0) {
    const newestAssociation = associationEntries
      .slice()
      .sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime())[0];

    const status = getAssociationBadgeStatusForCategory(athlete, categoryName);
    const detectedLevel = normalizeBadgeMedalLevel(status?.recognizedLevel || newestAssociation?.meta?.recognizedLevel || newestAssociation?.meta?.badgeLevel);
    const measuredAt = new Date(newestAssociation.measuredAt).getTime();
    const badgeIdentifier =
      normalizeText(newestAssociation?.meta?.badgeId) ||
      normalizeText(athlete.associationBadgeId) ||
      normalizeText(newestAssociation?.valueInput);

    if (badgeIdentifier) {
      candidates.push({
        code: "A",
        value: badgeIdentifier,
        levelRank: getLevelRank(detectedLevel || "-") || getBadgeMedalRank(newestAssociation?.meta?.badgeLevel),
        measuredAt: Number.isFinite(measuredAt) ? measuredAt : 0,
        priority: 2
      });
    }
  }

  if (candidates.length === 0) {
    return {
      code: "",
      value: ""
    };
  }

  candidates.sort((left, right) => {
    if (left.levelRank !== right.levelRank) {
      return right.levelRank - left.levelRank;
    }

    if (left.measuredAt !== right.measuredAt) {
      return right.measuredAt - left.measuredAt;
    }

    return right.priority - left.priority;
  });

  return {
    code: candidates[0].code,
    value: candidates[0].value
  };
}

function createSportabzeichenDigitalDataRow(athlete) {
  const requirementGroup = getRequirementGroupForAthlete(athlete);
  const byCategory = new Map();

  for (const categoryName of DIGITAL_CATEGORY_ORDER) {
    byCategory.set(categoryName, selectDigitalCategoryExport(athlete, requirementGroup, categoryName));
  }

  return [
    normalizeText(athlete.dsaId),
    formatBirthDateForDigitalExport(athlete.birthDate),
    "",
    normalizeText(athlete.lastName),
    normalizeText(athlete.firstName),
    athlete.gender === "W" ? "W" : "M",
    "",
    "",
    normalizeText(athlete.zip),
    normalizeText(athlete.city),
    toIsoCountryCode(athlete.country),
    "",
    normalizeText(byCategory.get("Ausdauer")?.code),
    normalizeText(byCategory.get("Ausdauer")?.value),
    normalizeText(byCategory.get("Kraft")?.code),
    normalizeText(byCategory.get("Kraft")?.value),
    normalizeText(byCategory.get("Schnelligkeit")?.code),
    normalizeText(byCategory.get("Schnelligkeit")?.value),
    normalizeText(byCategory.get("Koordination")?.code),
    normalizeText(byCategory.get("Koordination")?.value),
    normalizeYearValue(athlete.swimProofYear)
  ];
}

function createSportabzeichenDigitalGroupCreateHeaderRow() {
  return [
    "DSA ID",
    "Geburtsdatum",
    "Titel",
    "Nachname",
    "Vorname",
    "Geschlecht",
    "Behinderungsklasse",
    "Strasse und Nr.",
    "Postleitzahl",
    "Ort",
    "Land",
    "E-Mail"
  ];
}

function createSportabzeichenDigitalGroupCreateDataRow(athlete) {
  return [
    normalizeText(athlete.dsaId),
    formatBirthDateForDigitalExport(athlete.birthDate),
    "",
    normalizeText(athlete.lastName),
    normalizeText(athlete.firstName),
    athlete.gender === "W" ? "W" : "M",
    "",
    "",
    normalizeText(athlete.zip),
    normalizeText(athlete.city),
    toIsoCountryCode(athlete.country),
    ""
  ];
}

function getMissingRequiredValuesForRow(row, requiredColumns) {
  if (!Array.isArray(row) || !Array.isArray(requiredColumns)) {
    return [];
  }

  const missing = [];
  for (const column of requiredColumns) {
    const value = normalizeText(row[column.index]);
    if (!value) {
      missing.push(column.label);
    }
  }

  return missing;
}

function getMissingRequiredColumnsForGroupCreateRow(row) {
  return getMissingRequiredValuesForRow(row, [
    { index: 1, label: "Geburtsdatum" },
    { index: 3, label: "Nachname" },
    { index: 4, label: "Vorname" },
    { index: 5, label: "Geschlecht" },
    { index: 8, label: "PLZ" },
    { index: 9, label: "Ort" }
  ]);
}

function getMissingRequiredColumnsForGroupPerformanceRow(row) {
  return getMissingRequiredValuesForRow(row, [
    { index: 1, label: "Geburtsdatum" },
    { index: 3, label: "Nachname" },
    { index: 4, label: "Vorname" },
    { index: 5, label: "Geschlecht" },
    { index: 8, label: "PLZ" },
    { index: 9, label: "Ort" },
    { index: 12, label: "Ziffer Uebung Ausdauer" },
    { index: 13, label: "Leistung Ausdauer" },
    { index: 14, label: "Ziffer Uebung Kraft" },
    { index: 15, label: "Leistung Kraft" },
    { index: 16, label: "Ziffer Uebung Schnelligkeit" },
    { index: 17, label: "Leistung Schnelligkeit" },
    { index: 18, label: "Ziffer Uebung Koordination" },
    { index: 19, label: "Leistung Koordination" }
  ]);
}

function buildSportabzeichenDigitalGroupCreateRows(athletesForExport = state.athletes) {
  const rows = [createSportabzeichenDigitalGroupCreateHeaderRow()];
  const sortedAthletes = getSortedAthletesByDisplayName(athletesForExport || []);
  const skippedAthletes = [];
  let includedCount = 0;

  for (const athlete of sortedAthletes) {
    const dataRow = createSportabzeichenDigitalGroupCreateDataRow(athlete);
    const missingColumns = getMissingRequiredColumnsForGroupCreateRow(dataRow);
    if (missingColumns.length > 0) {
      skippedAthletes.push({
        athlete,
        missingColumns
      });
      continue;
    }

    rows.push(dataRow);
    includedCount += 1;
  }

  return {
    rows,
    includedCount,
    skippedAthletes
  };
}

function getSortedAthletesByDisplayName(athletes) {
  return [...athletes].sort((left, right) => {
    const byLastName = normalizeText(left.lastName).localeCompare(normalizeText(right.lastName), "de");
    if (byLastName !== 0) {
      return byLastName;
    }

    return normalizeText(left.firstName).localeCompare(normalizeText(right.firstName), "de");
  });
}

function getTotalPerformanceEntryCount() {
  let count = 0;

  for (const athlete of state.athletes) {
    const performances = athlete?.performances;
    if (!performances || typeof performances !== "object") {
      continue;
    }

    for (const entries of Object.values(performances)) {
      if (Array.isArray(entries)) {
        count += entries.length;
      }
    }
  }

  return count;
}

function renderResultsSummaryStats() {
  if (resultsTotalAthletes) {
    resultsTotalAthletes.textContent = String(state.athletes.length);
  }

  if (resultsTotalGroups) {
    resultsTotalGroups.textContent = String(state.groups.length);
  }

  if (resultsTotalPerformances) {
    resultsTotalPerformances.textContent = String(getTotalPerformanceEntryCount());
  }
}

function ensureDigitalExportSelectionConsistency() {
  const validFormats = new Set(["groupCreateXlsx", "groupPerformanceXlsx"]);
  if (!validFormats.has(state.digitalExportFormat)) {
    state.digitalExportFormat = "groupPerformanceXlsx";
  }

  const validScopes = new Set(["all", "group", "athletes"]);
  if (!validScopes.has(state.digitalExportScope)) {
    state.digitalExportScope = "all";
  }

  const validGroupIds = new Set(state.groups.map((group) => group.id));
  if (!validGroupIds.has(state.digitalExportGroupId)) {
    state.digitalExportGroupId = state.groups[0]?.id || "";
  }

  const validAthleteIds = new Set(state.athletes.map((athlete) => athlete.id));
  state.digitalExportAthleteIds = (Array.isArray(state.digitalExportAthleteIds) ? state.digitalExportAthleteIds : [])
    .map((athleteId) => normalizeText(athleteId))
    .filter((athleteId) => validAthleteIds.has(athleteId));
}

function renderExportDigitalGroupOptions() {
  if (!exportDigitalGroupSelect) {
    return;
  }

  const previousValue = normalizeText(state.digitalExportGroupId);
  exportDigitalGroupSelect.innerHTML = "";

  if (state.groups.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Keine Gruppen vorhanden";
    exportDigitalGroupSelect.append(option);
    state.digitalExportGroupId = "";
    return;
  }

  const sortedGroups = [...state.groups].sort((left, right) => normalizeText(left.name).localeCompare(normalizeText(right.name), "de"));
  for (const group of sortedGroups) {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    exportDigitalGroupSelect.append(option);
  }

  const hasPrevious = sortedGroups.some((group) => group.id === previousValue);
  state.digitalExportGroupId = hasPrevious ? previousValue : sortedGroups[0].id;
  exportDigitalGroupSelect.value = state.digitalExportGroupId;
}

function renderExportDigitalAthleteSelection() {
  if (!exportDigitalAthleteSelection) {
    return;
  }

  exportDigitalAthleteSelection.innerHTML = "";
  const selectedIdSet = new Set((Array.isArray(state.digitalExportAthleteIds) ? state.digitalExportAthleteIds : []).map((athleteId) => normalizeText(athleteId)).filter(Boolean));
  const sortedAthletes = getSortedAthletesByDisplayName(state.athletes);

  if (sortedAthletes.length === 0) {
    const emptyNote = document.createElement("p");
    emptyNote.className = "group-empty-note";
    emptyNote.textContent = "Noch keine Athleten vorhanden.";
    exportDigitalAthleteSelection.append(emptyNote);
    return;
  }

  for (const athlete of sortedAthletes) {
    const label = document.createElement("label");
    label.className = "results-athlete-choice";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = athlete.id;
    checkbox.checked = selectedIdSet.has(athlete.id);
    checkbox.addEventListener("change", () => {
      const currentSet = new Set((Array.isArray(state.digitalExportAthleteIds) ? state.digitalExportAthleteIds : []).map((athleteId) => normalizeText(athleteId)).filter(Boolean));
      if (checkbox.checked) {
        currentSet.add(athlete.id);
      } else {
        currentSet.delete(athlete.id);
      }
      state.digitalExportAthleteIds = Array.from(currentSet);
    });

    const name = document.createElement("span");
    name.className = "results-athlete-choice-name";
    name.textContent = athleteDisplayName(athlete) || "Unbenannter Athlet";

    const code = document.createElement("span");
    code.className = "results-athlete-choice-code";
    code.textContent = athleteCode(athlete);

    label.append(checkbox, name, code);
    exportDigitalAthleteSelection.append(label);
  }
}

function updateDigitalExportScopeVisibility() {
  const scope = normalizeText(state.digitalExportScope) || "all";
  if (exportDigitalGroupWrap) {
    exportDigitalGroupWrap.hidden = scope !== "group";
  }

  if (exportDigitalAthletesWrap) {
    exportDigitalAthletesWrap.hidden = scope !== "athletes";
  }
}

function selectAllDigitalExportAthletes() {
  state.digitalExportAthleteIds = state.athletes.map((athlete) => athlete.id);
  renderExportDigitalAthleteSelection();
}

function clearDigitalExportAthletesSelection() {
  state.digitalExportAthleteIds = [];
  renderExportDigitalAthleteSelection();
}

function getImportTypeDisplayLabel(importType) {
  if (importType === "full") {
    return "Vollimport (JSON)";
  }

  if (importType === "digitalPerformance") {
    return "Sportabzeichen-Digital CSV mit Leistungen";
  }

  if (importType === "digitalAthletes") {
    return "Sportabzeichen-Digital CSV (Athletenstamm)";
  }

  if (importType === "simple") {
    return "Einfache CSV";
  }

  return "Unbekannt";
}

function updateImportDetectedState(importType, fileName = "", message = "") {
  state.importDetectedType = normalizeText(importType);
  state.importDetectedFileName = normalizeText(fileName);
  state.importDetectedMessage = normalizeText(message);
}

function renderImportGroupSelectOptions() {
  if (!importGroupSelect) {
    return;
  }

  const previousValue = normalizeText(importGroupSelect.value);
  importGroupSelect.innerHTML = "";

  const createNewOption = document.createElement("option");
  createNewOption.value = "__new_from_file__";
  createNewOption.textContent = "Neue Gruppe aus Dateiname anlegen";
  importGroupSelect.append(createNewOption);

  const sortedGroups = [...state.groups].sort((left, right) => normalizeText(left.name).localeCompare(normalizeText(right.name), "de"));
  for (const group of sortedGroups) {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    importGroupSelect.append(option);
  }

  const hasPrevious = Array.from(importGroupSelect.options).some((option) => normalizeText(option.value) === previousValue);
  importGroupSelect.value = hasPrevious ? previousValue : "__new_from_file__";
}

function renderImportControlsState() {
  if (importDetectedFormat) {
    const hasFile = !!importFileInput?.files?.length;
    const typeLabel = getImportTypeDisplayLabel(state.importDetectedType);
    const baseText = hasFile
      ? `Erkannt: ${typeLabel}${state.importDetectedFileName ? ` (${state.importDetectedFileName})` : ""}`
      : "Noch keine Datei ausgewaehlt.";
    importDetectedFormat.textContent = state.importDetectedMessage || baseText;
    importDetectedFormat.classList.toggle("is-ready", state.importDetectedType && state.importDetectedType !== "unknown");
    importDetectedFormat.classList.toggle("is-warning", !!state.importDetectedType && state.importDetectedType === "unknown");
  }

  const isSimpleImport = state.importDetectedType === "simple";
  if (importSimpleGroupControls) {
    importSimpleGroupControls.hidden = !isSimpleImport;
  }

  if (!isSimpleImport && importCreateGroupCheckbox) {
    importCreateGroupCheckbox.checked = false;
  }

  renderImportGroupSelectOptions();
  updateImportGroupInputState();

  if (importRunButton) {
    const hasFile = !!importFileInput?.files?.length;
    importRunButton.disabled = !hasFile || state.importDetectedType === "unknown";
  }
}

function detectImportTypeFromText(fileContent) {
  const trimmedContent = String(fileContent || "").trim();
  if (!trimmedContent) {
    return {
      type: "unknown",
      message: "Datei ist leer."
    };
  }

  if (/^[\[{]/.test(trimmedContent)) {
    try {
      const parsedJson = JSON.parse(trimmedContent);
      const parsedPayload = parseFullImportPayload(parsedJson);
      const athleteCount = Array.isArray(parsedPayload.athletes) ? parsedPayload.athletes.length : 0;
      const groupCount = Array.isArray(parsedPayload.groups) ? parsedPayload.groups.length : 0;
      if (athleteCount > 0 || groupCount > 0) {
        return {
          type: "full",
          message: `Erkannt: Vollimport (JSON) mit ${athleteCount} Athleten und ${groupCount} Gruppen.`
        };
      }

      return {
        type: "unknown",
        message: "JSON erkannt, aber ohne importierbare Athleten/Gruppen."
      };
    } catch (_error) {
      // Continue with CSV detection.
    }
  }

  const parsedCsv = parseCsvText(trimmedContent);
  if (!Array.isArray(parsedCsv.rows) || parsedCsv.rows.length === 0) {
    return {
      type: "unknown",
      message: "Datei enthaelt keine importierbaren Daten."
    };
  }

  const headerIndex = findCsvHeaderRowIndex(parsedCsv.rows);
  if (headerIndex < 0) {
    return {
      type: "unknown",
      message: "CSV-Format nicht erkannt (keine passende Kopfzeile)."
    };
  }

  const headerMap = createCsvHeaderIndexMap(parsedCsv.rows[headerIndex]);
  const detectedType = detectCsvImportType(headerMap);
  if (detectedType === "unknown") {
    return {
      type: "unknown",
      message: "CSV-Format wird nicht unterstuetzt."
    };
  }

  return {
    type: detectedType,
    message: `Erkannt: ${getImportTypeDisplayLabel(detectedType)}.`
  };
}

async function previewSelectedImportFile() {
  if (!importFileInput || !importFileInput.files || importFileInput.files.length === 0) {
    updateImportDetectedState("", "", "Noch keine Datei ausgewaehlt.");
    renderImportControlsState();
    return;
  }

  const file = importFileInput.files[0];
  try {
    const content = await file.text();
    const detection = detectImportTypeFromText(content);
    updateImportDetectedState(detection.type, file.name, detection.message);
  } catch (_error) {
    updateImportDetectedState("unknown", file.name, "Datei konnte nicht gelesen werden.");
  }

  renderImportControlsState();
}

function renderResultsToolsState() {
  ensureDigitalExportSelectionConsistency();

  if (exportDigitalFormatSelect) {
    exportDigitalFormatSelect.value = state.digitalExportFormat;
  }

  if (exportDigitalScopeSelect) {
    exportDigitalScopeSelect.value = state.digitalExportScope;
  }

  renderResultsSummaryStats();
  renderExportDigitalGroupOptions();
  renderExportDigitalAthleteSelection();
  updateDigitalExportScopeVisibility();
  renderImportControlsState();
}

function getDigitalExportAthletes() {
  const scope = normalizeText(state.digitalExportScope) || "all";
  if (scope === "group") {
    const group = getGroupById(state.digitalExportGroupId);
    if (!group) {
      return [];
    }

    const groupMemberIds = new Set(group.athleteIds || []);
    return state.athletes.filter((athlete) => groupMemberIds.has(athlete.id));
  }

  if (scope === "athletes") {
    const selectedIdSet = new Set((Array.isArray(state.digitalExportAthleteIds) ? state.digitalExportAthleteIds : []).map((athleteId) => normalizeText(athleteId)).filter(Boolean));
    return state.athletes.filter((athlete) => selectedIdSet.has(athlete.id));
  }

  return state.athletes;
}

function getDigitalExportScopeLabel() {
  const scope = normalizeText(state.digitalExportScope) || "all";
  if (scope === "group") {
    const group = getGroupById(state.digitalExportGroupId);
    return group ? `Gruppe ${group.name}` : "Gruppe";
  }

  if (scope === "athletes") {
    return "ausgewaehlte Athleten";
  }

  return "alle Athleten";
}

function buildSportabzeichenDigitalGroupPerformanceRows(athletesForExport = state.athletes) {
  const rows = createSportabzeichenDigitalHeaderRows();
  const sortedAthletes = getSortedAthletesByDisplayName(athletesForExport || []);
  const skippedAthletes = [];
  let includedCount = 0;

  for (const athlete of sortedAthletes) {
    const dataRow = createSportabzeichenDigitalDataRow(athlete);
    const missingColumns = getMissingRequiredColumnsForGroupPerformanceRow(dataRow);
    if (missingColumns.length > 0) {
      skippedAthletes.push({
        athlete,
        missingColumns
      });
      continue;
    }

    rows.push(dataRow);
    includedCount += 1;
  }

  return {
    rows,
    includedCount,
    skippedAthletes
  };
}

function buildSportabzeichenDigitalAssociationReferenceRows() {
  const rows = [["Badge-ID", "Verbandsabzeichen", "Kategorie", "Anerkannte DSA-Stufe"]];
  const entries = getAssociationBadgeEntries()
    .slice()
    .sort((left, right) => {
      const byCategory = normalizeText(left.category).localeCompare(normalizeText(right.category), "de");
      if (byCategory !== 0) {
        return byCategory;
      }

      return normalizeText(left.badgeName).localeCompare(normalizeText(right.badgeName), "de");
    });

  for (const entry of entries) {
    rows.push([
      normalizeText(entry.badgeId),
      normalizeText(entry.badgeName),
      normalizeText(entry.category),
      normalizeText(entry.recognizedDsaLevel)
    ]);
  }

  if (rows.length === 1) {
    rows.push(["", "", "", ""]);
  }

  return rows;
}

function getDigitalExportFormatLabel() {
  const format = normalizeText(state.digitalExportFormat) || "groupPerformanceXlsx";
  if (format === "groupCreateXlsx") {
    return "Gruppe anlegen";
  }

  return "Gruppe mit Leistungen";
}

async function exportSportabzeichenDigitalCsv() {
  const exportAthletes = getDigitalExportAthletes();
  if (exportAthletes.length === 0) {
    showToast("Keine Athleten fuer den gewaehlten Exportumfang vorhanden.");
    return;
  }

  const format = normalizeText(state.digitalExportFormat) || "groupPerformanceXlsx";
  const isGroupCreate = format === "groupCreateXlsx";

  const exportResult = isGroupCreate
    ? buildSportabzeichenDigitalGroupCreateRows(exportAthletes)
    : buildSportabzeichenDigitalGroupPerformanceRows(exportAthletes);

  if (exportResult.includedCount <= 0) {
    showToast("Export abgebrochen: Keine vollstaendigen Datensaetze fuer das gewaehlte Format.");
    return;
  }

  const scopeLabel = getDigitalExportScopeLabel();
  const formatLabel = getDigitalExportFormatLabel();
  const skippedCount = exportResult.skippedAthletes.length;
  const skipHint = skippedCount > 0 ? `\n\n${skippedCount} Athleten mit fehlenden Pflichtfeldern werden ausgelassen.` : "";
  const confirmed = window.confirm(`Sportabzeichen-Digital-Export (${formatLabel}) fuer ${exportResult.includedCount} Athleten (${scopeLabel}) erstellen?${skipHint}`);
  if (!confirmed) {
    return;
  }

  const timestamp = formatDateForFilename();
  const fileName = isGroupCreate
    ? `sportabzeichen-digital-gruppe-anlegen-${timestamp}.xlsx`
    : `sportabzeichen-digital-gruppe-leistungen-${timestamp}.xlsx`;
  const workbookSheets = isGroupCreate
    ? [
      {
        name: "Beispieldatei",
        rows: exportResult.rows
      }
    ]
    : [
      {
        name: "Eingabe",
        rows: exportResult.rows
      },
      {
        name: "Verbandsabzeichen",
        rows: buildSportabzeichenDigitalAssociationReferenceRows()
      }
    ];

  try {
    await downloadRowsAsXlsx(fileName, workbookSheets, "Export");
    if (skippedCount > 0) {
      showToast(`Export erstellt: ${exportResult.includedCount} Athleten exportiert, ${skippedCount} ausgelassen.`);
      return;
    }

    showToast(`Sportabzeichen-Digital-Export (${formatLabel}) erstellt.`);
  } catch (_error) {
    showToast("Export fehlgeschlagen: XLSX-Bibliothek konnte nicht geladen werden.");
  }
}

function buildFullExportPayload() {
  return {
    schemaVersion: "1.0.0",
    datasetType: "sportabzeichen.full_export.v1",
    exportedAt: new Date().toISOString(),
    requirementYear: getRequirementYear(),
    requirementFile: normalizeText(state.requirementFile),
    athletes: state.athletes,
    groups: state.groups
  };
}

function exportFullDataset() {
  const timestamp = formatDateForFilename();
  const fileName = `sportabzeichen-full-export-${timestamp}.json`;
  const content = JSON.stringify(buildFullExportPayload(), null, 2);
  downloadTextFile(fileName, content, { mimeType: "application/json;charset=utf-8" });
  showToast("Vollstaendiger Export erstellt.");
}

function updateImportGroupInputState() {
  if (!importCreateGroupCheckbox || !importGroupSelectWrap || !importGroupSelect) {
    return;
  }

  const shouldShow = state.importDetectedType === "simple" && !!importCreateGroupCheckbox.checked;
  importGroupSelectWrap.hidden = !shouldShow;
  importGroupSelect.disabled = !shouldShow;
  if (!shouldShow) {
    importGroupSelect.value = "__new_from_file__";
  }
}

function getSafeImportGroupName(fileName = "") {
  const baseName = normalizeText(String(fileName || "").replace(/\.[^.]+$/, "").replace(/[\-_]+/g, " "));
  if (baseName) {
    return `Import ${baseName}`;
  }

  const stamp = new Date();
  return `Import ${stamp.getDate()}.${stamp.getMonth() + 1}.${stamp.getFullYear()}`;
}

function createCsvHeaderIndexMap(headerRow) {
  const headerMap = new Map();

  headerRow.forEach((headerValue, index) => {
    const token = normalizeCsvToken(headerValue);
    if (!token || headerMap.has(token)) {
      return;
    }

    headerMap.set(token, index);
  });

  return headerMap;
}

function findCsvHeaderIndexByAliases(headerMap, aliases) {
  if (!(headerMap instanceof Map) || !Array.isArray(aliases) || aliases.length === 0) {
    return -1;
  }

  const normalizedAliases = Array.from(new Set(aliases.map((alias) => normalizeCsvToken(alias)).filter(Boolean)));
  for (const alias of normalizedAliases) {
    if (!headerMap.has(alias)) {
      continue;
    }

    return headerMap.get(alias);
  }

  let bestIndex = -1;
  let bestScore = 0;

  for (const [headerToken, index] of headerMap.entries()) {
    for (const alias of normalizedAliases) {
      if (alias.length < 4) {
        continue;
      }

      if (!headerToken.includes(alias) && !alias.includes(headerToken)) {
        continue;
      }

      const score = Math.min(headerToken.length, alias.length);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }
  }

  return bestIndex;
}

function hasCsvHeaderByAliases(headerMap, aliases) {
  return findCsvHeaderIndexByAliases(headerMap, aliases) >= 0;
}

function getCsvValueByAliases(row, headerMap, aliases) {
  const index = findCsvHeaderIndexByAliases(headerMap, aliases);
  if (index < 0) {
    return "";
  }

  return normalizeText(row[index]);
}

function isCsvRowEmpty(row) {
  if (!Array.isArray(row) || row.length === 0) {
    return true;
  }

  return row.every((cell) => !normalizeText(cell));
}

function findCsvHeaderRowIndex(rows) {
  const maxIndex = Math.min(rows.length - 1, 60);
  for (let index = 0; index <= maxIndex; index += 1) {
    const row = rows[index];
    if (!Array.isArray(row) || row.length === 0) {
      continue;
    }

    const headerMap = createCsvHeaderIndexMap(row);
    const hasName = hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.firstName);
    const hasLastName = hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.lastName);
    const hasBirthDate = hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.birthDate);
    const hasGender = hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.gender);

    if (hasName && hasLastName && hasBirthDate && hasGender) {
      return index;
    }
  }

  return -1;
}

function detectCsvImportType(headerMap) {
  const hasBasicAthleteColumns =
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.firstName) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.lastName) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.birthDate) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.gender);

  if (!hasBasicAthleteColumns) {
    return "unknown";
  }

  const hasPerformanceColumns =
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.ausdauerCode) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.ausdauerValue) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.kraftCode) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.kraftValue) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.schnelligkeitCode) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.schnelligkeitValue) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.koordinationCode) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.koordinationValue);

  if (hasPerformanceColumns) {
    return "digitalPerformance";
  }

  const hasLocationColumns =
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.zip) &&
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.city);

  const hasDigitalProfileColumns =
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.dsaId) ||
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.title) ||
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.email) ||
    hasCsvHeaderByAliases(headerMap, CSV_IMPORT_ALIASES.street);

  if (hasDigitalProfileColumns) {
    return "digitalAthletes";
  }

  if (hasLocationColumns) {
    return "simple";
  }

  return "simple";
}

function parseImportedBirthDate(rawValue) {
  const value = normalizeText(rawValue);
  if (!value) {
    return "";
  }

  const createValidatedDate = (year, month, day) => {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      return "";
    }

    const date = new Date(year, month - 1, day);
    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return "";
    }

    return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isoMatch = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return createValidatedDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const compactIsoMatch = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactIsoMatch) {
    return createValidatedDate(Number(compactIsoMatch[1]), Number(compactIsoMatch[2]), Number(compactIsoMatch[3]));
  }

  const dateMatch = value.match(/^(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})$/);
  if (!dateMatch) {
    return "";
  }

  const firstPart = Number(dateMatch[1]);
  const secondPart = Number(dateMatch[2]);
  const year = Number(dateMatch[3]);

  let day = firstPart;
  let month = secondPart;

  if (firstPart <= 12 && secondPart > 12) {
    day = secondPart;
    month = firstPart;
  }

  return createValidatedDate(year, month, day);
}

function normalizeImportedGender(rawValue) {
  const normalized = normalizeCsvToken(rawValue);
  if (normalized === "w" || normalized === "f" || normalized === "weiblich" || normalized === "female") {
    return "W";
  }

  if (normalized === "m" || normalized === "male" || normalized === "mannlich" || normalized === "maennlich") {
    return "M";
  }

  return "M";
}

function createCsvRecordFromRow(row, headerMap) {
  const idValue = getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.id);

  return {
    id: idValue,
    dsaId: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.dsaId) || idValue,
    firstName: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.firstName),
    lastName: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.lastName),
    birthDate: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.birthDate),
    gender: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.gender),
    zip: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.zip),
    city: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.city),
    country: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.country),
    title: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.title),
    street: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.street),
    email: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.email),
    disabilityClass: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.disabilityClass),
    groupName: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.groupName),
    ausdauerCode: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.ausdauerCode),
    ausdauerValue: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.ausdauerValue),
    kraftCode: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.kraftCode),
    kraftValue: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.kraftValue),
    schnelligkeitCode: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.schnelligkeitCode),
    schnelligkeitValue: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.schnelligkeitValue),
    koordinationCode: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.koordinationCode),
    koordinationValue: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.koordinationValue),
    swimProofYear: getCsvValueByAliases(row, headerMap, CSV_IMPORT_ALIASES.swimProofYear)
  };
}

function mergePerformanceMaps(existingPerformances, importedPerformances) {
  const merged = normalizePerformances(existingPerformances);

  if (!importedPerformances || typeof importedPerformances !== "object") {
    return merged;
  }

  for (const [storageKey, importedEntries] of Object.entries(importedPerformances)) {
    if (!Array.isArray(importedEntries)) {
      continue;
    }

    const targetEntries = Array.isArray(merged[storageKey]) ? merged[storageKey].slice() : [];
    for (const importedEntry of importedEntries) {
      const normalizedEntry = normalizePerformanceEntry(importedEntry);
      if (!normalizedEntry) {
        continue;
      }

      const alreadyPresent = targetEntries.some((entry) => {
        const sameValue = Number(entry.valueNormalized) === Number(normalizedEntry.valueNormalized);
        const sameInput = normalizeText(entry.valueInput) === normalizeText(normalizedEntry.valueInput);
        const sameTimestamp = normalizeText(entry.measuredAt) === normalizeText(normalizedEntry.measuredAt);
        return sameValue && sameInput && sameTimestamp;
      });

      if (!alreadyPresent) {
        targetEntries.push(normalizedEntry);
      }
    }

    targetEntries.sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime());
    merged[storageKey] = targetEntries;
  }

  return merged;
}

function formatAthleteIdentityForPrompt(athlete) {
  const displayName = athleteDisplayName(athlete) || "Unbenannter Athlet";
  const birthDate = normalizeText(athlete.birthDate) || "-";
  const gender = normalizeText(athlete.gender) || "-";
  const dsaId = normalizeText(athlete.dsaId) || "-";
  return `${displayName} | ${gender} | ${birthDate} | DSA-ID: ${dsaId}`;
}

function getPotentialAthleteMatchesForImport(importedAthlete) {
  const importedDsaId = normalizeText(importedAthlete?.dsaId).toLowerCase();
  const importedFirstName = normalizeText(importedAthlete?.firstName).toLowerCase();
  const importedLastName = normalizeText(importedAthlete?.lastName).toLowerCase();
  const importedBirthDate = normalizeText(importedAthlete?.birthDate);
  const importedGender = normalizeText(importedAthlete?.gender).toUpperCase();

  const strongMatches = [];
  const weakMatches = [];

  if (importedDsaId) {
    for (const athlete of state.athletes) {
      if (normalizeText(athlete.dsaId).toLowerCase() === importedDsaId) {
        strongMatches.push(athlete);
      }
    }
  }

  for (const athlete of state.athletes) {
    const sameFirstName = normalizeText(athlete.firstName).toLowerCase() === importedFirstName;
    const sameLastName = normalizeText(athlete.lastName).toLowerCase() === importedLastName;
    if (!sameFirstName || !sameLastName) {
      continue;
    }

    const sameBirthDate = importedBirthDate && normalizeText(athlete.birthDate) === importedBirthDate;
    const sameGender = importedGender && normalizeText(athlete.gender).toUpperCase() === importedGender;

    if (sameBirthDate && sameGender) {
      strongMatches.push(athlete);
      continue;
    }

    if (sameBirthDate || sameGender) {
      weakMatches.push(athlete);
    }
  }

  const uniqueStrong = Array.from(new Map(strongMatches.map((athlete) => [athlete.id, athlete])).values());
  const strongIdSet = new Set(uniqueStrong.map((athlete) => athlete.id));
  const uniqueWeak = Array.from(new Map(weakMatches.map((athlete) => [athlete.id, athlete])).values()).filter((athlete) => !strongIdSet.has(athlete.id));

  return {
    strongMatches: uniqueStrong,
    weakMatches: uniqueWeak
  };
}

function askUserToResolveAmbiguousDuplicate(importedAthlete, candidates, sourceLabel = "Import") {
  const importedIdentity = formatAthleteIdentityForPrompt(importedAthlete);
  for (const candidate of candidates) {
    const candidateIdentity = formatAthleteIdentityForPrompt(candidate);
    const confirmed = window.confirm(
      `${sourceLabel}: Moegliches Duplikat erkannt.\n\nImporteintrag:\n${importedIdentity}\n\nVorhandener Athlet:\n${candidateIdentity}\n\nOK = zusammenfuehren\nAbbrechen = naechsten Vorschlag pruefen`
    );
    if (confirmed) {
      return candidate;
    }
  }

  return null;
}

function resolveExistingAthleteForImport(importedAthlete, { interactiveDuplicateResolution = false, sourceLabel = "Import" } = {}) {
  const matches = getPotentialAthleteMatchesForImport(importedAthlete);
  if (matches.strongMatches.length === 1) {
    return matches.strongMatches[0];
  }

  if (matches.strongMatches.length > 1) {
    if (interactiveDuplicateResolution) {
      return askUserToResolveAmbiguousDuplicate(importedAthlete, matches.strongMatches, sourceLabel);
    }

    return matches.strongMatches[0];
  }

  if (matches.weakMatches.length > 0 && interactiveDuplicateResolution) {
    return askUserToResolveAmbiguousDuplicate(importedAthlete, matches.weakMatches, sourceLabel);
  }

  return null;
}

function upsertImportedAthlete(importedAthlete, options = {}) {
  const normalizedAthlete = normalizeAthleteRecord(importedAthlete);
  const existingAthlete = resolveExistingAthleteForImport(normalizedAthlete, options);
  const now = new Date().toISOString();

  if (!existingAthlete) {
    normalizedAthlete.createdAt = normalizedAthlete.createdAt || now;
    normalizedAthlete.updatedAt = now;
    state.athletes.push(normalizedAthlete);
    return {
      athlete: normalizedAthlete,
      created: true
    };
  }

  existingAthlete.firstName = normalizedAthlete.firstName || existingAthlete.firstName;
  existingAthlete.lastName = normalizedAthlete.lastName || existingAthlete.lastName;
  existingAthlete.gender = normalizedAthlete.gender || existingAthlete.gender;
  existingAthlete.birthDate = normalizedAthlete.birthDate || existingAthlete.birthDate;
  existingAthlete.dsaId = normalizedAthlete.dsaId || existingAthlete.dsaId;
  existingAthlete.zip = normalizedAthlete.zip || existingAthlete.zip;
  existingAthlete.city = normalizedAthlete.city || existingAthlete.city;
  existingAthlete.country = normalizedAthlete.country || existingAthlete.country;
  existingAthlete.associationBadgeId = normalizedAthlete.associationBadgeId || existingAthlete.associationBadgeId;
  existingAthlete.associationBadgeLevel = normalizedAthlete.associationBadgeLevel || existingAthlete.associationBadgeLevel;
  existingAthlete.swimProofYear = normalizedAthlete.swimProofYear || existingAthlete.swimProofYear;
  existingAthlete.swimProofSelection = normalizedAthlete.swimProofSelection || existingAthlete.swimProofSelection;
  existingAthlete.swimProofPerformance = normalizedAthlete.swimProofPerformance || existingAthlete.swimProofPerformance;
  existingAthlete.performances = mergePerformanceMaps(existingAthlete.performances, normalizedAthlete.performances);
  existingAthlete.updatedAt = now;

  return {
    athlete: existingAthlete,
    created: false
  };
}

function getGroupByName(groupName) {
  const normalizedName = normalizeText(groupName).toLowerCase();
  if (!normalizedName) {
    return null;
  }

  return state.groups.find((group) => normalizeText(group.name).toLowerCase() === normalizedName) || null;
}

function ensureGroupByName(groupName) {
  const normalizedName = normalizeText(groupName);
  if (!normalizedName) {
    return null;
  }

  const existingGroup = getGroupByName(normalizedName);
  if (existingGroup) {
    return existingGroup;
  }

  const now = new Date().toISOString();
  const createdGroup = normalizeGroupRecord({
    id: createId(),
    name: normalizedName,
    athleteIds: [],
    trainingSlots: [],
    createdAt: now,
    updatedAt: now
  });

  if (!createdGroup) {
    return null;
  }

  state.groups.push(createdGroup);
  return createdGroup;
}

function addAthleteToGroup(group, athleteId) {
  if (!group) {
    return false;
  }

  const normalizedAthleteId = normalizeText(athleteId);
  if (!normalizedAthleteId) {
    return false;
  }

  const hasAthlete = (group.athleteIds || []).includes(normalizedAthleteId);
  if (hasAthlete) {
    return false;
  }

  group.athleteIds = Array.isArray(group.athleteIds) ? group.athleteIds.concat(normalizedAthleteId) : [normalizedAthleteId];
  group.updatedAt = new Date().toISOString();
  return true;
}

function mergeGroupTrainingSlots(existingGroup, importedSlots) {
  const currentSlots = Array.isArray(existingGroup.trainingSlots) ? existingGroup.trainingSlots.slice() : [];
  const normalizedImportedSlots = Array.isArray(importedSlots) ? importedSlots.map((slot) => normalizeTrainingSlot(slot)).filter(Boolean) : [];
  let changed = false;

  for (const slot of normalizedImportedSlots) {
    const hasSameSlot = currentSlots.some((entry) => {
      return Number(entry.weekday) === Number(slot.weekday) && normalizeTimeValue(entry.startTime) === normalizeTimeValue(slot.startTime) && normalizeTimeValue(entry.endTime) === normalizeTimeValue(slot.endTime);
    });

    if (hasSameSlot) {
      continue;
    }

    currentSlots.push(slot);
    changed = true;
  }

  if (changed) {
    existingGroup.trainingSlots = currentSlots;
    existingGroup.updatedAt = new Date().toISOString();
  }

  return changed;
}

function appendImportedPerformanceEntry(athlete, ruleStorageKey, performanceEntry) {
  const normalizedStorageKey = normalizeText(ruleStorageKey);
  if (!normalizedStorageKey) {
    return false;
  }

  const normalizedEntry = normalizePerformanceEntry(performanceEntry);
  if (!normalizedEntry) {
    return false;
  }

  if (!athlete.performances || typeof athlete.performances !== "object") {
    athlete.performances = {};
  }

  const existingEntries = Array.isArray(athlete.performances[normalizedStorageKey]) ? athlete.performances[normalizedStorageKey].slice() : [];
  const alreadyPresent = existingEntries.some((entry) => {
    const sameValue = Number(entry.valueNormalized) === Number(normalizedEntry.valueNormalized);
    const sameInput = normalizeText(entry.valueInput) === normalizeText(normalizedEntry.valueInput);
    const sameTimestamp = normalizeText(entry.measuredAt) === normalizeText(normalizedEntry.measuredAt);
    return sameValue && sameInput && sameTimestamp;
  });

  if (alreadyPresent) {
    return false;
  }

  existingEntries.push(normalizedEntry);
  existingEntries.sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime());
  athlete.performances[normalizedStorageKey] = existingEntries;
  athlete.updatedAt = new Date().toISOString();
  return true;
}

function importAssociationPerformanceFromDigitalRow(athlete, categoryName, badgeIdentifierRaw, measuredAtIso) {
  const badgeIdentifier = normalizeText(badgeIdentifierRaw);
  if (!badgeIdentifier) {
    return false;
  }

  const associationStorageKey = getAssociationBadgeRuleStorageKey(categoryName);
  const badgeEntry =
    getAssociationBadgeEntryById(badgeIdentifier) ||
    getAssociationBadgeEntries().find((entry) => normalizeText(entry.badgeName).toLowerCase() === badgeIdentifier.toLowerCase()) ||
    null;

  const selectedLevel = normalizeBadgeMedalLevel(athlete.associationBadgeLevel) || "Gold";
  const status = badgeEntry ? evaluateAssociationBadgeStatusForMeta(athlete, categoryName, badgeEntry.badgeId, selectedLevel) : null;
  const recognizedLevel = normalizeBadgeMedalLevel(status?.recognizedLevel || selectedLevel) || "Gold";

  const performanceEntry = {
    id: createId(),
    valueInput: badgeEntry ? badgeEntry.badgeName : badgeIdentifier,
    valueNormalized: getBadgeMedalRank(recognizedLevel) || 1,
    measuredAt: measuredAtIso,
    meta: {
      badgeId: badgeEntry ? badgeEntry.badgeId : badgeIdentifier,
      badgeName: badgeEntry ? badgeEntry.badgeName : badgeIdentifier,
      badgeLevel: selectedLevel,
      recognizedLevel,
      category: categoryName,
      importedFrom: "sportabzeichen-digital"
    },
    createdAt: measuredAtIso,
    updatedAt: measuredAtIso
  };

  return appendImportedPerformanceEntry(athlete, associationStorageKey, performanceEntry);
}

function importCategoryPerformanceFromDigitalRow(athlete, requirementGroup, categoryName, disciplineCodeRaw, performanceRaw, measuredAtIso) {
  const disciplineCode = normalizeText(disciplineCodeRaw);
  const performanceValue = normalizeText(performanceRaw);
  if (!disciplineCode || !performanceValue) {
    return false;
  }

  if (disciplineCode.toUpperCase() === "A") {
    return importAssociationPerformanceFromDigitalRow(athlete, categoryName, performanceValue, measuredAtIso);
  }

  const codeToken = normalizeCsvToken(disciplineCode);
  const rule = (requirementGroup?.disciplines || []).find((entry) => {
    if (normalizeText(entry.category) !== categoryName) {
      return false;
    }

    const ruleCode = normalizeText(entry.disciplineCode || entry.catalogCode);
    return normalizeCsvToken(ruleCode) === codeToken;
  });

  if (!rule) {
    return false;
  }

  const parsedPerformance = parsePerformanceValue(rule, performanceValue);
  if (!parsedPerformance.ok) {
    return false;
  }

  const performanceEntry = {
    id: createId(),
    valueInput: parsedPerformance.valueInput,
    valueNormalized: parsedPerformance.normalizedValue,
    measuredAt: measuredAtIso,
    meta: {
      importedFrom: "sportabzeichen-digital",
      category: categoryName,
      code: disciplineCode
    },
    createdAt: measuredAtIso,
    updatedAt: measuredAtIso
  };

  return appendImportedPerformanceEntry(athlete, getRuleStorageKey(rule), performanceEntry);
}

function applyDigitalPerformanceImportToAthlete(athlete, csvRecord, measuredAtIso) {
  const requirementGroup = getRequirementGroupForAthlete(athlete);
  if (!requirementGroup) {
    return 0;
  }

  let importedCount = 0;
  const definitions = [
    {
      category: "Ausdauer",
      code: csvRecord.ausdauerCode,
      value: csvRecord.ausdauerValue
    },
    {
      category: "Kraft",
      code: csvRecord.kraftCode,
      value: csvRecord.kraftValue
    },
    {
      category: "Schnelligkeit",
      code: csvRecord.schnelligkeitCode,
      value: csvRecord.schnelligkeitValue
    },
    {
      category: "Koordination",
      code: csvRecord.koordinationCode,
      value: csvRecord.koordinationValue
    }
  ];

  for (const definition of definitions) {
    if (importCategoryPerformanceFromDigitalRow(athlete, requirementGroup, definition.category, definition.code, definition.value, measuredAtIso)) {
      importedCount += 1;
    }
  }

  const importedSwimProofYear = normalizeYearValue(csvRecord.swimProofYear);
  if (importedSwimProofYear) {
    athlete.swimProofYear = importedSwimProofYear;
    if (!normalizeText(athlete.swimProofSelection)) {
      athlete.swimProofSelection = AUTO_SWIM_PROOF_OPTION;
    }
    athlete.updatedAt = new Date().toISOString();
  }

  return importedCount;
}

function createAthleteDraftFromCsvRecord(csvRecord, importType) {
  const firstName = normalizeText(csvRecord.firstName);
  const lastName = normalizeText(csvRecord.lastName);
  const birthDate = parseImportedBirthDate(csvRecord.birthDate);
  const genderRaw = normalizeText(csvRecord.gender);
  const zip = normalizeText(csvRecord.zip);
  const city = normalizeText(csvRecord.city);

  if (!firstName || !lastName || !birthDate || !genderRaw) {
    return null;
  }

  const countryRaw = normalizeText(csvRecord.country);
  const country = /^DE(U|UTSCHLAND)?$/i.test(countryRaw) ? "Deutschland" : countryRaw || "Deutschland";
  const now = new Date().toISOString();

  return normalizeAthleteRecord({
    id: createId(),
    firstName,
    lastName,
    gender: normalizeImportedGender(genderRaw),
    birthDate,
    dsaId: normalizeText(csvRecord.dsaId),
    zip,
    city,
    country,
    associationBadgeId: "",
    associationBadgeLevel: "",
    swimProofYear: "",
    swimProofSelection: "",
    swimProofPerformance: "",
    performances: {},
    createdAt: now,
    updatedAt: now
  });
}

function parseFullImportPayload(payload) {
  if (Array.isArray(payload)) {
    return {
      athletes: payload,
      groups: []
    };
  }

  if (!payload || typeof payload !== "object") {
    return {
      athletes: [],
      groups: []
    };
  }

  const athletes = Array.isArray(payload.athletes) ? payload.athletes : [];
  const groups = Array.isArray(payload.groups) ? payload.groups : [];

  return {
    athletes,
    groups
  };
}

function importFromFullPayload(payload, { sourceLabel = "Vollimport" } = {}) {
  const parsedPayload = parseFullImportPayload(payload);
  const importedAthletes = parsedPayload.athletes.map((entry) => normalizeAthleteRecord(entry));
  const importedGroups = parsedPayload.groups.map((entry) => normalizeGroupRecord(entry)).filter((entry) => !!entry && !!entry.name);

  let createdAthletes = 0;
  let updatedAthletes = 0;
  let createdGroups = 0;
  let groupAssignments = 0;
  const athleteIdMap = new Map();

  for (const importedAthlete of importedAthletes) {
    const originalId = importedAthlete.id;
    const result = upsertImportedAthlete(importedAthlete, {
      interactiveDuplicateResolution: true,
      sourceLabel
    });
    athleteIdMap.set(originalId, result.athlete.id);
    if (result.created) {
      createdAthletes += 1;
    } else {
      updatedAthletes += 1;
    }
  }

  for (const importedGroup of importedGroups) {
    const byId = getGroupById(importedGroup.id);
    const byName = getGroupByName(importedGroup.name);
    const targetGroup = byId || byName || ensureGroupByName(importedGroup.name);
    if (!targetGroup) {
      continue;
    }

    if (!byId && !byName) {
      createdGroups += 1;
    }

    mergeGroupTrainingSlots(targetGroup, importedGroup.trainingSlots);

    for (const importedAthleteId of importedGroup.athleteIds || []) {
      const mappedAthleteId = athleteIdMap.get(importedAthleteId) || importedAthleteId;
      if (addAthleteToGroup(targetGroup, mappedAthleteId)) {
        groupAssignments += 1;
      }
    }
  }

  return {
    ok: true,
    createdAthletes,
    updatedAthletes,
    createdGroups,
    groupAssignments,
    importedPerformances: 0,
    skippedRows: 0,
    mode: "full"
  };
}

function importFromCsvRows(rows, options = {}) {
  const headerRowIndex = findCsvHeaderRowIndex(rows);
  if (headerRowIndex < 0) {
    return {
      ok: false,
      message: "CSV-Format wurde nicht erkannt. Bitte Kopfzeile pruefen."
    };
  }

  const headerMap = createCsvHeaderIndexMap(rows[headerRowIndex]);
  const importType = detectCsvImportType(headerMap);
  if (importType === "unknown") {
    return {
      ok: false,
      message: "CSV-Format wird nicht unterstuetzt."
    };
  }

  const simpleAssignToGroup = importType === "simple" && !!options.simpleAssignToGroup;
  const simpleGroupSelection = normalizeText(options.simpleGroupSelection);
  const preferredGroupName = getSafeImportGroupName(options.fileName);
  const hadDefaultGroupBeforeImport = simpleAssignToGroup ? !!getGroupByName(preferredGroupName) : false;
  let defaultGroup = null;

  let createdAthletes = 0;
  let updatedAthletes = 0;
  let createdGroups = 0;
  let groupAssignments = 0;
  let importedPerformances = 0;
  let skippedRows = 0;

  for (let rowIndex = headerRowIndex + 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (isCsvRowEmpty(row)) {
      continue;
    }

    const csvRecord = createCsvRecordFromRow(row, headerMap);
    const athleteDraft = createAthleteDraftFromCsvRecord(csvRecord, importType);
    if (!athleteDraft) {
      skippedRows += 1;
      continue;
    }

    const upsertResult = upsertImportedAthlete(athleteDraft);
    if (upsertResult.created) {
      createdAthletes += 1;
    } else {
      updatedAthletes += 1;
    }

    if (importType === "digitalPerformance") {
      const measuredAtIso = new Date().toISOString();
      importedPerformances += applyDigitalPerformanceImportToAthlete(upsertResult.athlete, csvRecord, measuredAtIso);
    }

    const rowGroupName = importType === "simple" ? "" : normalizeText(csvRecord.groupName);
    let targetGroup = null;
    if (rowGroupName) {
      const existingByName = getGroupByName(rowGroupName);
      targetGroup = existingByName || ensureGroupByName(rowGroupName);
      if (!existingByName && targetGroup) {
        createdGroups += 1;
      }
    } else {
      if (simpleAssignToGroup) {
        if (!defaultGroup) {
          if (simpleGroupSelection && simpleGroupSelection !== "__new_from_file__") {
            defaultGroup = getGroupById(simpleGroupSelection);
          }

          if (!defaultGroup) {
            defaultGroup = ensureGroupByName(preferredGroupName);
            if (defaultGroup && !hadDefaultGroupBeforeImport) {
              createdGroups += 1;
            }
          }
        }

        targetGroup = defaultGroup;
      }
    }

    if (targetGroup && addAthleteToGroup(targetGroup, upsertResult.athlete.id)) {
      groupAssignments += 1;
    }
  }

  const touchedAthletes = createdAthletes + updatedAthletes;
  if (touchedAthletes === 0) {
    return {
      ok: false,
      message: "CSV erkannt, aber keine gueltigen Athletenzeilen gefunden. Bitte Spalten fuer Vorname, Nachname, Geburtsdatum und Geschlecht pruefen."
    };
  }

  return {
    ok: true,
    createdAthletes,
    updatedAthletes,
    createdGroups,
    groupAssignments,
    importedPerformances,
    skippedRows,
    mode: importType
  };
}

function importDataFromText(fileContent, options = {}) {
  const trimmedContent = String(fileContent || "").trim();
  if (!trimmedContent) {
    return {
      ok: false,
      message: "Die Datei ist leer."
    };
  }

  if (/^[\[{]/.test(trimmedContent)) {
    try {
      const payload = JSON.parse(trimmedContent);
      return importFromFullPayload(payload, {
        sourceLabel: "Vollimport"
      });
    } catch (_error) {
      // Continue with CSV parsing fallback.
    }
  }

  const parsedCsv = parseCsvText(trimmedContent);
  if (!Array.isArray(parsedCsv.rows) || parsedCsv.rows.length === 0) {
    return {
      ok: false,
      message: "Die Datei enthaelt keine importierbaren Daten."
    };
  }

  return importFromCsvRows(parsedCsv.rows, options);
}

async function runImportFromSelectedFile() {
  if (!importFileInput || !importFileInput.files || importFileInput.files.length === 0) {
    showToast("Bitte zuerst eine Datei auswaehlen.");
    return;
  }

  const file = importFileInput.files[0];
  let content = "";

  try {
    content = await file.text();
  } catch (_error) {
    showToast("Datei konnte nicht gelesen werden.");
    return;
  }

  const quickDetection = detectImportTypeFromText(content);
  updateImportDetectedState(quickDetection.type, file.name, quickDetection.message);
  renderImportControlsState();

  const importResult = importDataFromText(content, {
    fileName: file.name,
    simpleAssignToGroup: state.importDetectedType === "simple" && !!importCreateGroupCheckbox?.checked,
    simpleGroupSelection: normalizeText(importGroupSelect?.value) || "__new_from_file__"
  });

  if (!importResult.ok) {
    showToast(importResult.message || "Import fehlgeschlagen.");
    return;
  }

  if (pruneGroupAthleteAssignments()) {
    // Keep consistent references after merge imports.
  }

  saveAthletes();
  saveGroups();
  refreshAthleteViews();

  importFileInput.value = "";
  updateImportDetectedState("", "", "Noch keine Datei ausgewaehlt.");
  renderImportControlsState();

  const updatedCount = importResult.createdAthletes + importResult.updatedAthletes;
  const summary = [
    `${updatedCount} Athlet${updatedCount === 1 ? "" : "en"}`,
    `${importResult.createdGroups} Gruppe${importResult.createdGroups === 1 ? "" : "n"} neu`,
    `${importResult.importedPerformances} Leistungen`
  ];

  if (importResult.skippedRows > 0) {
    summary.push(`${importResult.skippedRows} Zeilen uebersprungen`);
  }

  showToast(`Import abgeschlossen: ${summary.join(" | ")}`);
}

function getGroupById(groupId) {
  return state.groups.find((group) => group.id === groupId) || null;
}

function getSelectedGroup() {
  return getGroupById(state.selectedGroupId);
}

function getVisibleAthletes() {
  const selectedGroup = getSelectedGroup();
  if (!selectedGroup) {
    return state.athletes;
  }

  const memberIds = new Set(selectedGroup.athleteIds || []);
  return state.athletes.filter((athlete) => memberIds.has(athlete.id));
}

function getNextTrainingStartTimestamp(slot, referenceDate = new Date()) {
  if (!slot) {
    return Number.POSITIVE_INFINITY;
  }

  const weekday = Number(slot.weekday);
  const startTime = normalizeTimeValue(slot.startTime);
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !startTime) {
    return Number.POSITIVE_INFINITY;
  }

  const [hoursRaw, minutesRaw] = startTime.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return Number.POSITIVE_INFINITY;
  }

  const currentDay = referenceDate.getDay();
  let dayOffset = (weekday - currentDay + 7) % 7;

  const target = new Date(referenceDate);
  target.setHours(hours, minutes, 0, 0);

  if (dayOffset === 0 && target.getTime() <= referenceDate.getTime()) {
    dayOffset = 7;
  }

  target.setDate(target.getDate() + dayOffset);
  return target.getTime();
}

function getNearestUpcomingGroupId(referenceDate = new Date()) {
  let nearestGroupId = "";
  let nearestTimestamp = Number.POSITIVE_INFINITY;

  for (const group of state.groups) {
    const slots = Array.isArray(group.trainingSlots) ? group.trainingSlots : [];
    for (const slot of slots) {
      const timestamp = getNextTrainingStartTimestamp(slot, referenceDate);
      if (timestamp < nearestTimestamp) {
        nearestTimestamp = timestamp;
        nearestGroupId = group.id;
      }
    }
  }

  return nearestGroupId;
}

function getDefaultGroupFilterId() {
  if (state.groups.length === 0) {
    return "";
  }

  const nearestGroupId = getNearestUpcomingGroupId();
  if (nearestGroupId) {
    return nearestGroupId;
  }

  return state.groups[0].id;
}

function pruneGroupAthleteAssignments() {
  const validAthleteIds = new Set(state.athletes.map((athlete) => athlete.id));
  let changed = false;

  state.groups = state.groups.map((group) => {
    const filteredAthleteIds = (group.athleteIds || []).filter((athleteId) => validAthleteIds.has(athleteId));
    if (filteredAthleteIds.length === (group.athleteIds || []).length) {
      return group;
    }

    changed = true;
    return {
      ...group,
      athleteIds: filteredAthleteIds,
      updatedAt: new Date().toISOString()
    };
  });

  return changed;
}

function syncSelectedAthleteWithVisibleList() {
  if (!state.selectedAthleteId) {
    return;
  }

  const visibleAthleteIds = new Set(getVisibleAthletes().map((athlete) => athlete.id));
  if (visibleAthleteIds.has(state.selectedAthleteId)) {
    return;
  }

  state.selectedAthleteId = "";
  state.selectedDisciplineKey = "";
  state.editPerformanceId = "";
  closePerformanceModal();
}

function setSelectedGroupFilter(groupId, { manual = true } = {}) {
  const normalizedGroupId = normalizeText(groupId);
  const nextGroupId = normalizedGroupId && getGroupById(normalizedGroupId) ? normalizedGroupId : "";

  state.selectedGroupId = nextGroupId;
  if (manual) {
    state.groupFilterManuallySet = true;
  }

  syncSelectedAthleteWithVisibleList();
  refreshAthleteViews();
}

function ensureDefaultGroupFilterSelection() {
  if (state.groupFilterManuallySet) {
    if (state.selectedGroupId && !getGroupById(state.selectedGroupId)) {
      state.selectedGroupId = "";
    }
    return;
  }

  if (state.selectedGroupId && getGroupById(state.selectedGroupId)) {
    return;
  }

  state.selectedGroupId = getDefaultGroupFilterId();
}

function getSelectedAthlete() {
  return state.athletes.find((athlete) => athlete.id === state.selectedAthleteId) || null;
}

function findAthleteIndexById(athleteId) {
  return state.athletes.findIndex((athlete) => athlete.id === athleteId);
}

function updateAthleteLayoutSelectionState() {
  athletesView.classList.toggle("has-selection", !!getSelectedAthlete() || state.requirementsInspectorOpen);
}

function setRequirementsInspectorOpen(isOpen) {
  const nextValue = !!isOpen;
  if (!nextValue) {
    state.requirementsInspectorOpen = false;
    return;
  }

  state.requirementsInspectorOpen = true;

  const referenceAthlete = getSelectedAthlete() || getVisibleAthletes()[0] || state.athletes[0] || null;
  if (referenceAthlete) {
    state.requirementsInspectorGender = referenceAthlete.gender === "W" ? "W" : "M";
    if (!normalizeText(state.requirementsInspectorInput)) {
      const referenceAge = getRequirementAgeForAthlete(referenceAthlete);
      if (Number.isFinite(Number(referenceAge))) {
        state.requirementsInspectorInput = String(referenceAge);
      }
    }
  }
}

function refreshAthleteViews() {
  ensureDefaultGroupFilterSelection();
  renderGroupFilters();
  renderAthletes();
  renderAthleteDetail();
  renderTrainingView();
  renderResultsToolsState();
}

function clearSelectedAthlete() {
  state.selectedAthleteId = "";
  state.requirementsInspectorOpen = false;
  state.selectedDisciplineKey = "";
  state.editPerformanceId = "";
  closePerformanceModal();
  updateAthleteLayoutSelectionState();
  refreshAthleteViews();
}

function setSelectedAthlete(athleteId) {
  const athleteExists = state.athletes.some((athlete) => athlete.id === athleteId);
  if (!athleteExists) {
    return;
  }

  state.requirementsInspectorOpen = false;
  state.selectedAthleteId = athleteId;
  state.selectedDisciplineKey = "";
  state.editPerformanceId = "";
  closePerformanceModal();

  updateAthleteLayoutSelectionState();
  refreshAthleteViews();
}

function openRequirementsInspectorView() {
  state.selectedAthleteId = "";
  state.selectedDisciplineKey = "";
  state.editPerformanceId = "";
  closePerformanceModal();
  setRequirementsInspectorOpen(true);
  updateAthleteLayoutSelectionState();
  refreshAthleteViews();
}

function getWeekdayLabel(weekdayValue) {
  const weekday = WEEKDAY_OPTIONS.find((entry) => entry.value === Number(weekdayValue));
  return weekday ? weekday.label : "";
}

function getGroupTrainingSummary(group) {
  const slots = Array.isArray(group?.trainingSlots) ? group.trainingSlots.map((slot) => normalizeTrainingSlot(slot)).filter(Boolean) : [];
  if (slots.length === 0) {
    return "Keine Trainingszeiten";
  }

  let nearestSlot = null;
  let nearestTimestamp = Number.POSITIVE_INFINITY;
  const now = new Date();

  for (const slot of slots) {
    const timestamp = getNextTrainingStartTimestamp(slot, now);
    if (timestamp < nearestTimestamp) {
      nearestTimestamp = timestamp;
      nearestSlot = slot;
    }
  }

  if (!nearestSlot) {
    return `${slots.length} Trainingszeit${slots.length === 1 ? "" : "en"}`;
  }

  const weekdayLabel = getWeekdayLabel(nearestSlot.weekday);
  return `Naechstes Training: ${weekdayLabel} ${nearestSlot.startTime}-${nearestSlot.endTime}`;
}

function createGroupFilterRow({ title, meta, isActive = false, isNearest = false, onSelect, onEdit = null }) {
  const row = document.createElement("div");
  row.className = "group-modal-filter-row";

  const selectButton = document.createElement("button");
  selectButton.type = "button";
  selectButton.className = "group-modal-filter-select";

  const titleRow = document.createElement("span");
  titleRow.className = "group-modal-filter-title-row";

  const titleText = document.createElement("span");
  titleText.className = "group-modal-filter-name";
  titleText.textContent = title;
  titleRow.append(titleText);

  if (isActive) {
    selectButton.classList.add("is-active");
  }

  if (isNearest) {
    selectButton.classList.add("group-modal-filter-select--next");
    selectButton.title = "Naechste Trainingsgruppe";
  }

  const metaText = document.createElement("span");
  metaText.className = "group-modal-filter-meta";
  metaText.textContent = meta;

  selectButton.append(titleRow, metaText);

  if (typeof onSelect === "function") {
    selectButton.addEventListener("click", onSelect);
  }

  row.append(selectButton);

  if (typeof onEdit === "function") {
    selectButton.classList.add("has-inline-edit");

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "title-edit-btn group-inline-edit-btn";
    editButton.setAttribute("aria-label", `${title} bearbeiten`);
    editButton.title = `${title} bearbeiten`;
    editButton.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10.5-10.5a1.4 1.4 0 0 0 0-2L16.5 5a1.4 1.4 0 0 0-2 0L4 15.5V20Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /></svg>';
    editButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onEdit();
    });
    row.append(editButton);
  }

  return row;
}

function renderGroupFilters() {
  const selectedGroup = getSelectedGroup();
  if (athletesTitle) {
    athletesTitle.textContent = `${selectedGroup ? selectedGroup.name : "Alle Athleten"} ▾`;
    athletesTitle.title = "Gruppenansicht wechseln";
  }

  if (groupModal && !groupModal.hidden) {
    renderGroupModalFilterList();
  }
}

function renderGroupModalFilterList() {
  if (!groupModalFilterList) {
    return;
  }

  groupModalFilterList.innerHTML = "";

  const nearestGroupId = getNearestUpcomingGroupId();

  const allAthletesMeta = `${state.athletes.length} Athlet${state.athletes.length === 1 ? "" : "en"} gesamt`;
  groupModalFilterList.append(
    createGroupFilterRow({
      title: "Alle Athleten",
      meta: allAthletesMeta,
      isActive: !state.selectedGroupId,
      onSelect: () => {
        setSelectedGroupFilter("", { manual: true });
        closeGroupModal();
      }
    })
  );

  const sortedGroups = [...state.groups].sort((left, right) => left.name.localeCompare(right.name, "de"));
  if (sortedGroups.length === 0) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note group-modal-empty-note";
    empty.textContent = "Noch keine Gruppen vorhanden. Lege mit 'Neue Gruppe' deine erste Gruppe an.";
    groupModalFilterList.append(empty);
    return;
  }

  for (const group of sortedGroups) {
    const memberCount = Array.isArray(group.athleteIds) ? group.athleteIds.length : 0;
    const memberLabel = `${memberCount} Athlet${memberCount === 1 ? "" : "en"}`;
    const trainingSummary = getGroupTrainingSummary(group);
    const isActiveGroup = state.selectedGroupId === group.id;

    groupModalFilterList.append(
      createGroupFilterRow({
        title: group.name,
        meta: `${memberLabel} • ${trainingSummary}`,
        isActive: isActiveGroup,
        isNearest: group.id === nearestGroupId,
        onSelect: () => {
          setSelectedGroupFilter(group.id, { manual: true });
          closeGroupModal();
        },
        onEdit: () => {
          openGroupModal("edit", group);
        }
      })
    );
  }
}

function getPerformanceNowMs() {
  if (typeof performance === "undefined" || typeof performance.now !== "function") {
    return NaN;
  }

  return Number(performance.now());
}

function createTrainingTimeMarker() {
  return {
    dateNowMs: Date.now(),
    perfNowMs: getPerformanceNowMs(),
    pageInstanceId: APP_PAGE_INSTANCE_ID
  };
}

function getElapsedMsSinceTrainingMarker(marker) {
  const normalizedMarker = normalizeTrainingTimeMarker(marker);
  if (!normalizedMarker) {
    return NaN;
  }

  const nowPerf = getPerformanceNowMs();
  const canUsePerformanceNow =
    Number.isFinite(nowPerf) &&
    Number.isFinite(normalizedMarker.perfNowMs) &&
    normalizeText(normalizedMarker.pageInstanceId) === APP_PAGE_INSTANCE_ID;

  if (canUsePerformanceNow) {
    return Math.max(0, nowPerf - normalizedMarker.perfNowMs);
  }

  const elapsedByDate = Date.now() - normalizedMarker.dateNowMs;
  return Number.isFinite(elapsedByDate) ? Math.max(0, elapsedByDate) : NaN;
}

function isTrainingSplitLayout() {
  return window.matchMedia("(min-width: 860px)").matches || window.matchMedia("(orientation: landscape) and (min-width: 700px)").matches;
}

function updateTrainingLayoutSelectionState() {
  if (!trainingView) {
    return;
  }

  const showContentPane = isTrainingSplitLayout() || state.trainingCompactPane === "content";
  trainingView.classList.toggle("has-selection", showContentPane);
}

function updateTrainingExamSurfaceState() {
  const activeView = document.querySelector(".view.is-active")?.dataset.view || "";
  const showExamSurface = activeView === "training" && state.trainingViewMode === "exam";
  document.body.classList.toggle("training-exam-active", showExamSurface);

  if (!showExamSurface) {
    clearTrainingExamGlobalControls();
  }
}

function clearTrainingExamGlobalControls() {
  if (!trainingExamControlsHost) {
    return;
  }

  trainingExamControlsHost.innerHTML = "";
  trainingExamControlsHost.hidden = true;
}

function mountTrainingExamGlobalControls(controlBarElement) {
  if (!trainingExamControlsHost || !(controlBarElement instanceof HTMLElement)) {
    return;
  }

  trainingExamControlsHost.innerHTML = "";
  trainingExamControlsHost.append(controlBarElement);
  trainingExamControlsHost.hidden = false;
}

function isTrainingExamViewActive() {
  return !!document.querySelector('.view.is-active[data-view="training"]') && state.trainingViewMode === "exam";
}

function createTrainingAbortActionKey(scope, disciplineId, athleteIds = []) {
  const normalizedScope = normalizeText(scope);
  const normalizedDisciplineId = normalizeText(disciplineId);
  const normalizedAthleteIds = Array.from(new Set((Array.isArray(athleteIds) ? athleteIds : []).map((athleteId) => normalizeText(athleteId)).filter(Boolean))).sort();
  return `${normalizedScope}|${normalizedDisciplineId}|${normalizedAthleteIds.join(",")}`;
}

function clearTrainingAbortConfirmState({ render = false } = {}) {
  if (trainingAbortConfirmTimer) {
    clearTimeout(trainingAbortConfirmTimer);
    trainingAbortConfirmTimer = null;
  }

  trainingAbortConfirmState = {
    actionKey: "",
    expiresAt: 0
  };

  if (render && isTrainingExamViewActive()) {
    renderTrainingExamPane();
  }
}

function isTrainingAbortConfirmPending(actionKey) {
  const normalizedActionKey = normalizeText(actionKey);
  if (!normalizedActionKey) {
    return false;
  }

  if (normalizeText(trainingAbortConfirmState.actionKey) !== normalizedActionKey) {
    return false;
  }

  if (Number(trainingAbortConfirmState.expiresAt) <= Date.now()) {
    clearTrainingAbortConfirmState({ render: false });
    return false;
  }

  return true;
}

function requestTrainingAbortConfirmation(actionKey, promptMessage = "Zum Abbrechen erneut tippen.") {
  const normalizedActionKey = normalizeText(actionKey);
  if (!normalizedActionKey) {
    return false;
  }

  if (isTrainingAbortConfirmPending(normalizedActionKey)) {
    clearTrainingAbortConfirmState({ render: false });
    return true;
  }

  trainingAbortConfirmState = {
    actionKey: normalizedActionKey,
    expiresAt: Date.now() + TRAINING_ABORT_CONFIRM_WINDOW_MS
  };

  if (trainingAbortConfirmTimer) {
    clearTimeout(trainingAbortConfirmTimer);
  }

  trainingAbortConfirmTimer = setTimeout(() => {
    clearTrainingAbortConfirmState({ render: true });
  }, TRAINING_ABORT_CONFIRM_WINDOW_MS + 80);

  showToast(promptMessage);
  if (isTrainingExamViewActive()) {
    renderTrainingExamPane();
  }

  return false;
}

function normalizeTrainingMarkedAthleteIds({ visibleOnly = false } = {}) {
  const sourceAthletes = visibleOnly ? getVisibleAthletes() : state.athletes;
  const validAthleteIds = new Set(sourceAthletes.map((athlete) => athlete.id));
  const originalIds = Array.isArray(state.trainingMarkedAthleteIds) ? state.trainingMarkedAthleteIds : [];

  const normalizedIds = Array.from(
    new Set(
      originalIds
        .map((athleteId) => normalizeText(athleteId))
        .filter((athleteId) => !!athleteId && validAthleteIds.has(athleteId))
    )
  );

  const changed =
    normalizedIds.length !== originalIds.length ||
    normalizedIds.some((athleteId, index) => athleteId !== originalIds[index]);

  state.trainingMarkedAthleteIds = normalizedIds;
  return changed;
}

function getTrainingMarkedAthleteIdSet() {
  normalizeTrainingMarkedAthleteIds({ visibleOnly: true });
  return new Set(state.trainingMarkedAthleteIds);
}

function isTrainingAthleteMarked(athleteId) {
  const normalizedAthleteId = normalizeText(athleteId);
  if (!normalizedAthleteId) {
    return false;
  }

  return getTrainingMarkedAthleteIdSet().has(normalizedAthleteId);
}

function toggleTrainingAthleteMarked(athleteId) {
  clearTrainingAbortConfirmState({ render: false });

  const normalizedAthleteId = normalizeText(athleteId);
  if (!normalizedAthleteId) {
    return;
  }

  const markedIds = getTrainingMarkedAthleteIdSet();
  if (markedIds.has(normalizedAthleteId)) {
    markedIds.delete(normalizedAthleteId);
  } else {
    markedIds.add(normalizedAthleteId);
  }

  state.trainingMarkedAthleteIds = Array.from(markedIds);
  saveTrainingState();
  renderTrainingExamPane();
}

function markAllVisibleTrainingAthletes() {
  clearTrainingAbortConfirmState({ render: false });

  const selectedDiscipline = getSelectedTrainingDiscipline();
  const markableAthleteIds = selectedDiscipline
    ? getTrainingAthleteRows(selectedDiscipline.id)
        .filter((row) => !!row.rule)
        .map((row) => row.athlete.id)
    : getVisibleAthletes().map((athlete) => athlete.id);

  state.trainingMarkedAthleteIds = Array.from(new Set(markableAthleteIds));
  saveTrainingState();
  renderTrainingExamPane();

  if (markableAthleteIds.length > 0) {
    showToast(`${markableAthleteIds.length} Athleten markiert.`);
    return;
  }

  showToast("Keine passenden Athleten zum Markieren.");
}

function clearVisibleTrainingAthleteMarks() {
  clearTrainingAbortConfirmState({ render: false });

  state.trainingMarkedAthleteIds = [];
  saveTrainingState();
  renderTrainingExamPane();
  showToast("Auswahl aufgehoben.");
}

function getFirstRunningTrainingDisciplineId() {
  if (!state.trainingExamSessions || typeof state.trainingExamSessions !== "object") {
    return "";
  }

  for (const [disciplineId, session] of Object.entries(state.trainingExamSessions)) {
    const hasRunningTimers = Object.values(session?.athletes || {}).some((athleteTimerState) => athleteTimerState?.running && athleteTimerState?.startMarker);
    if (hasRunningTimers) {
      return normalizeText(disciplineId);
    }
  }

  return "";
}

function startTrainingTimersForAthleteIds(selectedDiscipline, athleteIds, { sharedStart = false } = {}) {
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return {
      startedCount: 0
    };
  }

  const session = getTrainingExamSession(selectedDiscipline.id, { create: true });
  if (!session) {
    return {
      startedCount: 0
    };
  }

  const uniqueAthleteIds = Array.from(new Set((Array.isArray(athleteIds) ? athleteIds : []).map((athleteId) => normalizeText(athleteId)).filter(Boolean)));
  const sharedStartMarker = sharedStart ? createTrainingTimeMarker() : null;
  let startedCount = 0;

  for (const athleteId of uniqueAthleteIds) {
    const athlete = state.athletes.find((entry) => entry.id === athleteId) || null;
    if (!athlete) {
      continue;
    }

    const { rule } = getTrainingRuleForAthlete(athlete, selectedDiscipline.id);
    if (!rule) {
      continue;
    }

    const athleteTimerState = getTrainingExamAthleteState(session, athleteId, { create: true });
    if (!athleteTimerState || athleteTimerState.running) {
      continue;
    }

    athleteTimerState.running = true;
    athleteTimerState.startMarker = sharedStartMarker ? { ...sharedStartMarker } : createTrainingTimeMarker();
    startedCount += 1;
  }

  if (sharedStart && startedCount > 0) {
    session.isGlobalRunning = true;
    session.globalStartMarker = sharedStartMarker;
  }

  return {
    startedCount
  };
}

function stopTrainingTimersForAthleteIds(selectedDiscipline, athleteIds) {
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return {
      stoppedCount: 0,
      savedCount: 0,
      failedCount: 0,
      lastSavedValue: ""
    };
  }

  const session = getTrainingExamSession(selectedDiscipline.id, { create: false });
  if (!session) {
    return {
      stoppedCount: 0,
      savedCount: 0,
      failedCount: 0,
      lastSavedValue: ""
    };
  }

  const uniqueAthleteIds = Array.from(new Set((Array.isArray(athleteIds) ? athleteIds : []).map((athleteId) => normalizeText(athleteId)).filter(Boolean)));
  let stoppedCount = 0;
  let savedCount = 0;
  let failedCount = 0;
  let lastSavedValue = "";

  for (const athleteId of uniqueAthleteIds) {
    const athleteTimerState = getTrainingExamAthleteState(session, athleteId, { create: false });
    if (!athleteTimerState || !athleteTimerState.running) {
      continue;
    }

    stoppedCount += 1;

    const athlete = state.athletes.find((entry) => entry.id === athleteId) || null;
    if (!athlete) {
      athleteTimerState.running = false;
      athleteTimerState.startMarker = null;
      failedCount += 1;
      continue;
    }

    const { rule } = getTrainingRuleForAthlete(athlete, selectedDiscipline.id);
    if (!rule) {
      athleteTimerState.running = false;
      athleteTimerState.startMarker = null;
      failedCount += 1;
      continue;
    }

    const stopResult = finalizeTrainingTimerForAthlete(selectedDiscipline, athlete, rule, athleteTimerState);
    if (stopResult.ok) {
      savedCount += 1;
      lastSavedValue = stopResult.valueInput;
    } else {
      failedCount += 1;
    }
  }

  const hasRunningTimers = Object.values(session.athletes || {}).some((athleteTimerState) => athleteTimerState?.running);
  if (!hasRunningTimers) {
    session.isGlobalRunning = false;
    session.globalStartMarker = null;
  }

  return {
    stoppedCount,
    savedCount,
    failedCount,
    lastSavedValue
  };
}

function abortTrainingTimersForAthleteIds(selectedDiscipline, athleteIds) {
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return {
      abortedCount: 0
    };
  }

  const session = getTrainingExamSession(selectedDiscipline.id, { create: false });
  if (!session) {
    return {
      abortedCount: 0
    };
  }

  const uniqueAthleteIds = Array.from(new Set((Array.isArray(athleteIds) ? athleteIds : []).map((athleteId) => normalizeText(athleteId)).filter(Boolean)));
  let abortedCount = 0;

  for (const athleteId of uniqueAthleteIds) {
    const athleteTimerState = getTrainingExamAthleteState(session, athleteId, { create: false });
    if (!athleteTimerState || !athleteTimerState.running) {
      continue;
    }

    athleteTimerState.running = false;
    athleteTimerState.startMarker = null;
    athleteTimerState.lastElapsedMs = 0;
    athleteTimerState.lastMeasuredAt = "";
    abortedCount += 1;
  }

  const hasRunningTimers = Object.values(session.athletes || {}).some((athleteTimerState) => athleteTimerState?.running);
  if (!hasRunningTimers) {
    session.isGlobalRunning = false;
    session.globalStartMarker = null;
  }

  return {
    abortedCount
  };
}

function getRunningTrainingAthleteIds(selectedDiscipline = getSelectedTrainingDiscipline(), { visibleOnly = false } = {}) {
  if (!selectedDiscipline) {
    return [];
  }

  const session = getTrainingExamSession(selectedDiscipline.id, { create: false });
  if (!session) {
    return [];
  }

  const visibleAthleteIds = visibleOnly ? new Set(getVisibleAthletes().map((athlete) => athlete.id)) : null;
  return Object.entries(session.athletes || {})
    .filter(([athleteId, athleteTimerState]) => (!visibleAthleteIds || visibleAthleteIds.has(athleteId)) && !!athleteTimerState?.running)
    .map(([athleteId]) => athleteId);
}

function markRunningVisibleTrainingAthletes() {
  clearTrainingAbortConfirmState({ render: false });

  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    showToast("Laufende Markierung ist nur fuer Zeitdisziplinen verfuegbar.");
    return;
  }

  const runningAthleteIds = getRunningTrainingAthleteIds(selectedDiscipline, { visibleOnly: true });
  if (runningAthleteIds.length === 0) {
    showToast("Aktuell laufen keine Zeiten in der Sicht.");
    return;
  }

  const markedIds = new Set(getTrainingMarkedAthleteIdSet());
  for (const athleteId of runningAthleteIds) {
    markedIds.add(athleteId);
  }

  state.trainingMarkedAthleteIds = Array.from(markedIds);
  saveTrainingState();
  renderTrainingExamPane(selectedDiscipline);
  showToast(`${runningAthleteIds.length} laufende Athleten markiert.`);
}

function isEditableKeyboardTarget(target) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

function handleTrainingExamHotkeys(event) {
  if (!isTrainingExamViewActive() || event.defaultPrevented) {
    return;
  }

  if (event.repeat && !event.altKey) {
    return;
  }

  if (isEditableKeyboardTarget(event.target)) {
    return;
  }

  if ((athleteModal && !athleteModal.hidden) || (groupModal && !groupModal.hidden) || (performanceModal && !performanceModal.hidden)) {
    return;
  }

  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return;
  }

  const key = normalizeText(event.key).toLowerCase();
  const hasCtrlMeta = !!event.ctrlKey || !!event.metaKey;

  if (event.altKey && !hasCtrlMeta && !event.shiftKey && /^[1-9]$/.test(key)) {
    const runningAthleteIdSet = new Set(getRunningTrainingAthleteIds(selectedDiscipline));
    const runningAthleteIdsInViewOrder = getTrainingAthleteRows(selectedDiscipline.id)
      .map((row) => row.athlete.id)
      .filter((athleteId) => runningAthleteIdSet.has(athleteId));

    const targetAthleteId = runningAthleteIdsInViewOrder[Number(key) - 1] || "";
    if (!targetAthleteId) {
      return;
    }

    event.preventDefault();
    stopTrainingAthleteTiming(targetAthleteId);
    return;
  }

  if (!event.shiftKey || event.altKey || hasCtrlMeta) {
    return;
  }

  const runningAthleteIds = getRunningTrainingAthleteIds(selectedDiscipline);
  const runningAthleteIdSet = new Set(runningAthleteIds);
  const markedAthleteIds = Array.from(getTrainingMarkedAthleteIdSet());
  const runningMarkedAthleteIds = markedAthleteIds.filter((athleteId) => runningAthleteIdSet.has(athleteId));

  if (key === "s") {
    event.preventDefault();
    if (markedAthleteIds.length > 0) {
      startTrainingMarkedTiming();
    } else {
      startTrainingGlobalTiming();
    }
    return;
  }

  if (key === "x") {
    event.preventDefault();
    if (runningMarkedAthleteIds.length > 0) {
      stopTrainingMarkedTiming();
    } else {
      stopTrainingGlobalTiming();
    }
    return;
  }

  if (key === "a") {
    event.preventDefault();
    if (runningMarkedAthleteIds.length > 0) {
      abortTrainingMarkedTiming();
    } else {
      abortTrainingGlobalTiming();
    }
    return;
  }

  if (key === "m") {
    event.preventDefault();
    markRunningVisibleTrainingAthletes();
    return;
  }

  if (key === "l") {
    event.preventDefault();
    markAllVisibleTrainingAthletes();
    return;
  }

  if (key === "u") {
    event.preventDefault();
    clearVisibleTrainingAthleteMarks();
  }
}

function getTrainingDisciplineIdFromRule(rule) {
  if (!rule || typeof rule !== "object") {
    return "";
  }

  const category = normalizeText(rule.category);
  const disciplineKey = normalizeText(rule.disciplineKey || rule.disciplineName || rule.ruleId);
  const catalogCode = normalizeText(rule.catalogCode || rule.disciplineCode || "");
  const unitType = normalizeText(rule.unitType || "number");

  if (!category || !disciplineKey || !unitType) {
    return "";
  }

  return `${category}|${disciplineKey}|${catalogCode}|${unitType}`;
}

function getTrainingUnitTypeLabel(unitType) {
  if (unitType === "time_mm_ss") {
    return "Zeit (mm:ss)";
  }

  if (unitType === "time_seconds") {
    return "Zeit (s)";
  }

  if (unitType === "level") {
    return "Stufe";
  }

  return "Wert";
}

function getTrainingDisciplineCatalog() {
  const requirementGroups = Array.isArray(state.requirements?.groups) ? state.requirements.groups : [];
  const byId = new Map();

  for (const requirementGroup of requirementGroups) {
    const groupDisciplines = Array.isArray(requirementGroup?.disciplines) ? requirementGroup.disciplines : [];
    for (const rule of groupDisciplines) {
      const disciplineId = getTrainingDisciplineIdFromRule(rule);
      if (!disciplineId || byId.has(disciplineId)) {
        continue;
      }

      const labelParts = splitDisciplineDisplay(rule);
      byId.set(disciplineId, {
        id: disciplineId,
        category: normalizeText(rule.category) || "Weitere",
        disciplineName: normalizeText(rule.disciplineName) || "Unbekannte Disziplin",
        title: labelParts.title,
        detail: labelParts.detail,
        unitType: normalizeText(rule.unitType || "number")
      });
    }
  }

  const categoryRank = (categoryName) => {
    const index = CATEGORY_ORDER.indexOf(categoryName);
    return index >= 0 ? index : CATEGORY_ORDER.length + 1;
  };

  return Array.from(byId.values()).sort((left, right) => {
    const byCategory = categoryRank(left.category) - categoryRank(right.category);
    if (byCategory !== 0) {
      return byCategory;
    }

    const byTitle = normalizeText(left.title || left.disciplineName).localeCompare(normalizeText(right.title || right.disciplineName), "de");
    if (byTitle !== 0) {
      return byTitle;
    }

    return normalizeText(left.disciplineName).localeCompare(normalizeText(right.disciplineName), "de");
  });
}

function ensureTrainingDisciplineSelection(catalog = getTrainingDisciplineCatalog()) {
  if (!Array.isArray(catalog) || catalog.length === 0) {
    if (!state.trainingSelectedDisciplineId) {
      return false;
    }

    state.trainingSelectedDisciplineId = "";
    return true;
  }

  const hasSelectedDiscipline = catalog.some((discipline) => discipline.id === state.trainingSelectedDisciplineId);
  if (hasSelectedDiscipline) {
    return false;
  }

  state.trainingSelectedDisciplineId = catalog[0].id;
  return true;
}

function getSelectedTrainingDiscipline(catalog = getTrainingDisciplineCatalog()) {
  return catalog.find((discipline) => discipline.id === state.trainingSelectedDisciplineId) || null;
}

function setTrainingSelectedDiscipline(disciplineId) {
  const normalizedDisciplineId = normalizeText(disciplineId);
  if (!normalizedDisciplineId || normalizedDisciplineId === state.trainingSelectedDisciplineId) {
    return;
  }

  clearTrainingAbortConfirmState({ render: false });
  state.trainingSelectedDisciplineId = normalizedDisciplineId;
  if (!isTrainingSplitLayout()) {
    state.trainingCompactPane = "content";
  }
  saveTrainingState();
  renderTrainingView();
}

function getTrainingRuleForAthlete(athlete, disciplineId) {
  const normalizedDisciplineId = normalizeText(disciplineId);
  if (!athlete || !normalizedDisciplineId) {
    return {
      requirementGroup: null,
      rule: null
    };
  }

  const requirementGroup = getRequirementGroupForAthlete(athlete);
  if (!requirementGroup || !Array.isArray(requirementGroup.disciplines)) {
    return {
      requirementGroup,
      rule: null
    };
  }

  const matchingRule = requirementGroup.disciplines.find((rule) => getTrainingDisciplineIdFromRule(rule) === normalizedDisciplineId) || null;
  return {
    requirementGroup,
    rule: matchingRule
  };
}

function getTrainingInputDraftKey(disciplineId, athleteId) {
  return `${normalizeText(disciplineId)}::${normalizeText(athleteId)}`;
}

function getTrainingAttemptDraftKey(disciplineId, athleteId, attemptIndex) {
  const baseKey = getTrainingInputDraftKey(disciplineId, athleteId);
  const normalizedIndex = Number(attemptIndex);
  if (!baseKey || baseKey === "::" || !Number.isInteger(normalizedIndex) || normalizedIndex < 1 || normalizedIndex > 4) {
    return "";
  }

  return `${baseKey}::attempt${normalizedIndex}`;
}

function getTrainingInputDraftValue(disciplineId, athleteId) {
  const draftKey = getTrainingInputDraftKey(disciplineId, athleteId);
  return normalizeText(state.trainingInputDrafts?.[draftKey]);
}

function setTrainingInputDraftValue(disciplineId, athleteId, nextValue) {
  const draftKey = getTrainingInputDraftKey(disciplineId, athleteId);
  if (!draftKey || draftKey === "::") {
    return;
  }

  if (!state.trainingInputDrafts || typeof state.trainingInputDrafts !== "object") {
    state.trainingInputDrafts = {};
  }

  state.trainingInputDrafts[draftKey] = String(nextValue || "");
}

function clearTrainingInputDraftValue(disciplineId, athleteId) {
  const draftKey = getTrainingInputDraftKey(disciplineId, athleteId);
  if (!state.trainingInputDrafts || typeof state.trainingInputDrafts !== "object" || !draftKey) {
    return;
  }

  delete state.trainingInputDrafts[draftKey];
}

function getTrainingAttemptDraftValue(disciplineId, athleteId, attemptIndex) {
  const draftKey = getTrainingAttemptDraftKey(disciplineId, athleteId, attemptIndex);
  return normalizeText(state.trainingInputDrafts?.[draftKey]);
}

function setTrainingAttemptDraftValue(disciplineId, athleteId, attemptIndex, nextValue) {
  const draftKey = getTrainingAttemptDraftKey(disciplineId, athleteId, attemptIndex);
  if (!draftKey) {
    return;
  }

  if (!state.trainingInputDrafts || typeof state.trainingInputDrafts !== "object") {
    state.trainingInputDrafts = {};
  }

  state.trainingInputDrafts[draftKey] = String(nextValue || "");
}

function clearTrainingAttemptDraftValues(disciplineId, athleteId) {
  if (!state.trainingInputDrafts || typeof state.trainingInputDrafts !== "object") {
    return;
  }

  for (let attemptIndex = 1; attemptIndex <= 4; attemptIndex += 1) {
    const attemptKey = getTrainingAttemptDraftKey(disciplineId, athleteId, attemptIndex);
    if (attemptKey) {
      delete state.trainingInputDrafts[attemptKey];
    }
  }
}

function isTrainingThreeOfFourPointsRule(rule) {
  if (!rule || normalizeText(rule.unitType) !== "number") {
    return false;
  }

  const descriptor = [
    normalizeText(rule.disciplineName),
    normalizeText(rule.disciplineBaseName),
    normalizeText(rule.disciplineVariant),
    normalizeText(rule.disciplineKey)
  ]
    .join(" ")
    .toLowerCase();

  return /3\s*von\s*4/.test(descriptor) && /punkt/.test(descriptor);
}

function getTrainingThreeOfFourAutoTotal(disciplineId, athleteId) {
  const attempts = [];

  for (let attemptIndex = 1; attemptIndex <= 4; attemptIndex += 1) {
    const rawValue = getTrainingAttemptDraftValue(disciplineId, athleteId, attemptIndex);
    if (!rawValue) {
      continue;
    }

    const parsed = parseLocaleNumberSmart(rawValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return {
        ok: false,
        message: `Sprung ${attemptIndex} ist ungueltig.`
      };
    }

    attempts.push(parsed);
  }

  if (attempts.length < 3) {
    return {
      ok: false,
      message: "Bitte Gesamtpunkte oder mindestens 3 Spruenge eingeben."
    };
  }

  const sorted = attempts.slice().sort((left, right) => right - left);
  const total = sorted.slice(0, 3).reduce((sum, value) => sum + value, 0);
  return {
    ok: true,
    total
  };
}

function getTrainingExamSession(disciplineId, { create = false } = {}) {
  const normalizedDisciplineId = normalizeText(disciplineId);
  if (!normalizedDisciplineId) {
    return null;
  }

  if (!state.trainingExamSessions || typeof state.trainingExamSessions !== "object") {
    state.trainingExamSessions = {};
  }

  let session = state.trainingExamSessions[normalizedDisciplineId] || null;
  if (!session && create) {
    session = {
      isGlobalRunning: false,
      globalStartMarker: null,
      athletes: {}
    };
    state.trainingExamSessions[normalizedDisciplineId] = session;
  }

  if (!session) {
    return null;
  }

  const normalizedSession = normalizeTrainingExamSession(session);
  state.trainingExamSessions[normalizedDisciplineId] = normalizedSession;
  return normalizedSession;
}

function getTrainingExamAthleteState(session, athleteId, { create = false } = {}) {
  if (!session || typeof session !== "object") {
    return null;
  }

  if (!session.athletes || typeof session.athletes !== "object") {
    session.athletes = {};
  }

  const normalizedAthleteId = normalizeText(athleteId);
  if (!normalizedAthleteId) {
    return null;
  }

  let athleteState = session.athletes[normalizedAthleteId] || null;
  if (!athleteState && create) {
    athleteState = {
      running: false,
      startMarker: null,
      lastElapsedMs: 0,
      lastMeasuredAt: ""
    };
    session.athletes[normalizedAthleteId] = athleteState;
  }

  if (!athleteState) {
    return null;
  }

  const normalizedState = normalizeTrainingExamAthleteState(athleteState);
  session.athletes[normalizedAthleteId] = normalizedState;
  return normalizedState;
}

function hasRunningTrainingTimers() {
  if (!state.trainingExamSessions || typeof state.trainingExamSessions !== "object") {
    return false;
  }

  for (const session of Object.values(state.trainingExamSessions)) {
    const athletes = session?.athletes;
    if (!athletes || typeof athletes !== "object") {
      continue;
    }

    for (const athleteState of Object.values(athletes)) {
      if (athleteState?.running && athleteState?.startMarker) {
        return true;
      }
    }
  }

  return false;
}

function refreshTrainingTimerDisplays(selectedDiscipline = getSelectedTrainingDiscipline()) {
  if (!trainingExamPane || !selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return;
  }

  const session = getTrainingExamSession(selectedDiscipline.id, { create: false });
  if (!session) {
    return;
  }

  const timerValues = trainingExamPane.querySelectorAll(".training-timer-value[data-athlete-id]");
  for (const timerValue of timerValues) {
    const athleteId = normalizeText(timerValue.dataset.athleteId);
    if (!athleteId) {
      continue;
    }

    const athleteTimerState = getTrainingExamAthleteState(session, athleteId, { create: false }) || {
      running: false,
      startMarker: null,
      lastElapsedMs: 0
    };

    const displayedElapsed = athleteTimerState.running
      ? getElapsedMsSinceTrainingMarker(athleteTimerState.startMarker)
      : Number(athleteTimerState.lastElapsedMs || 0);

    timerValue.textContent = Number.isFinite(displayedElapsed) && displayedElapsed > 0 ? formatTrainingElapsedForRule({ unitType: selectedDiscipline.unitType }, displayedElapsed) : "--:--";
  }
}

function updateTrainingExamTicker() {
  const trainingView = document.querySelector('.view.is-active[data-view="training"]');
  const shouldRunTicker = hasRunningTrainingTimers() && !!trainingView && state.trainingViewMode === "exam";
  if (shouldRunTicker && !trainingExamTickerHandle) {
    trainingExamTickerHandle = setInterval(() => {
      const visibleTrainingView = document.querySelector('.view.is-active[data-view="training"]');
      if (!visibleTrainingView || state.trainingViewMode !== "exam") {
        return;
      }

      if (!hasRunningTrainingTimers()) {
        updateTrainingExamTicker();
        return;
      }

      refreshTrainingTimerDisplays();
    }, 120);

    refreshTrainingTimerDisplays();
    return;
  }

  if (!shouldRunTicker && trainingExamTickerHandle) {
    clearInterval(trainingExamTickerHandle);
    trainingExamTickerHandle = null;
  }
}

function getTrainingAthleteRows(disciplineId) {
  const normalizedDisciplineId = normalizeText(disciplineId);
  if (!normalizedDisciplineId) {
    return [];
  }

  const rows = getVisibleAthletes().map((athlete) => {
    const { requirementGroup, rule } = getTrainingRuleForAthlete(athlete, normalizedDisciplineId);
    const storageKey = rule ? getRuleStorageKey(rule) : "";
    const entries = rule ? getPerformanceEntries(athlete, storageKey) : [];
    const bestEntry = rule ? getBestPerformanceEntry(rule, entries) : null;
    const bestLevel = bestEntry && rule ? evaluatePerformanceLevel(rule, bestEntry.valueNormalized) : "-";

    return {
      athlete,
      requirementGroup,
      rule,
      bestEntry,
      bestLevel,
      bestValue: bestEntry && rule ? formatNormalizedValue(rule, bestEntry.valueNormalized, bestEntry.valueInput) : "-"
    };
  });

  rows.sort((left, right) => {
    if (!!left.rule !== !!right.rule) {
      return left.rule ? -1 : 1;
    }

    const byFirstName = normalizeText(left.athlete.firstName).localeCompare(normalizeText(right.athlete.firstName), "de");
    if (byFirstName !== 0) {
      return byFirstName;
    }

    return normalizeText(left.athlete.lastName).localeCompare(normalizeText(right.athlete.lastName), "de");
  });

  return rows;
}

function formatTrainingElapsedForRule(rule, elapsedMs) {
  const numericElapsedMs = Number(elapsedMs);
  if (!Number.isFinite(numericElapsedMs) || numericElapsedMs < 0) {
    return "-";
  }

  const elapsedSeconds = numericElapsedMs / 1000;
  if (rule?.unitType === "time_seconds") {
    const rounded = Math.round(elapsedSeconds * 100) / 100;
    return `${formatNumberInputValue(rounded)} s`;
  }

  return formatMinutesSecondsInput(elapsedSeconds);
}

function getTrainingRawInputForElapsed(rule, elapsedMs) {
  const numericElapsedMs = Number(elapsedMs);
  if (!Number.isFinite(numericElapsedMs) || numericElapsedMs < 0) {
    return "";
  }

  const elapsedSeconds = Math.round((numericElapsedMs / 1000) * 100) / 100;
  if (rule?.unitType === "time_seconds") {
    return formatNumberInputValue(elapsedSeconds);
  }

  return formatMinutesSecondsInput(elapsedSeconds);
}

function appendPerformanceEntryForRule(athlete, rule, rawValueInput, measuredAtIso = "", meta = {}) {
  if (!athlete || !rule) {
    return {
      ok: false,
      message: "Athlet oder Disziplin fehlt."
    };
  }

  const parsedValue = parsePerformanceValue(rule, rawValueInput);
  if (!parsedValue.ok) {
    return {
      ok: false,
      message: parsedValue.message
    };
  }

  const storageKey = getRuleStorageKey(rule);
  const entries = getPerformanceEntries(athlete, storageKey).slice();
  const now = new Date().toISOString();

  const measuredAtCandidate = normalizeText(measuredAtIso);
  const measuredAtDate = measuredAtCandidate ? new Date(measuredAtCandidate) : new Date();
  const measuredAt = Number.isNaN(measuredAtDate.getTime()) ? now : measuredAtDate.toISOString();

  entries.push({
    id: createId(),
    valueInput: parsedValue.valueInput,
    valueNormalized: parsedValue.normalizedValue,
    measuredAt,
    meta: meta && typeof meta === "object" ? { ...meta } : {},
    createdAt: now,
    updatedAt: now
  });

  entries.sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime());
  setPerformanceEntries(athlete, storageKey, entries);
  athlete.updatedAt = now;

  return {
    ok: true,
    valueInput: parsedValue.valueInput
  };
}

function renderTrainingDisciplineList(catalog = getTrainingDisciplineCatalog()) {
  if (!trainingDisciplineList) {
    return;
  }

  trainingDisciplineList.innerHTML = "";

  if (!Array.isArray(catalog) || catalog.length === 0) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note";
    empty.textContent = "Disziplinen werden geladen oder sind nicht verfuegbar.";
    trainingDisciplineList.append(empty);
    return;
  }

  const groupedByCategory = new Map();
  for (const categoryName of CATEGORY_ORDER) {
    groupedByCategory.set(categoryName, []);
  }

  for (const discipline of catalog) {
    const category = normalizeText(discipline.category) || "Weitere";
    if (!groupedByCategory.has(category)) {
      groupedByCategory.set(category, []);
    }

    groupedByCategory.get(category).push(discipline);
  }

  const orderedCategories = [
    ...CATEGORY_ORDER,
    ...Array.from(groupedByCategory.keys()).filter((categoryName) => !CATEGORY_ORDER.includes(categoryName))
  ];

  for (const categoryName of orderedCategories) {
    const categoryDisciplines = groupedByCategory.get(categoryName) || [];
    if (categoryDisciplines.length === 0) {
      continue;
    }

    const section = document.createElement("section");
    section.className = "training-discipline-category";

    const heading = document.createElement("h4");
    heading.className = "training-discipline-category-title";
    heading.textContent = categoryName;

    const list = document.createElement("ul");
    list.className = "training-discipline-category-list";

    for (const discipline of categoryDisciplines) {
      const item = document.createElement("li");

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "training-discipline-btn";
      if (discipline.id === state.trainingSelectedDisciplineId) {
        trigger.classList.add("is-active");
      }
      trigger.dataset.trainingAction = "select-discipline";
      trigger.dataset.disciplineId = discipline.id;

      const title = document.createElement("span");
      title.className = "training-discipline-title";
      title.textContent = discipline.title || discipline.disciplineName;

      const metaParts = [getTrainingUnitTypeLabel(discipline.unitType)];
      if (discipline.detail) {
        metaParts.unshift(discipline.detail);
      }

      const meta = document.createElement("span");
      meta.className = "training-discipline-meta";
      meta.textContent = metaParts.join(" | ");

      trigger.append(title, meta);
      item.append(trigger);
      list.append(item);
    }

    section.append(heading, list);
    trainingDisciplineList.append(section);
  }
}

function resolveTrainingExecutionText(rule) {
  if (!rule) {
    return "-";
  }

  const explicitVariant = normalizeText(rule.disciplineVariant);
  if (explicitVariant) {
    return explicitVariant;
  }

  const labelParts = splitDisciplineDisplay(rule);
  return normalizeText(labelParts.detail) || "-";
}

function createTrainingRequirementChipElement(level, valueText) {
  const chip = document.createElement("span");
  chip.className = `training-requirement-chip training-requirement-chip--${level.toLowerCase()}`;
  chip.textContent = normalizeText(valueText) || "-";
  chip.title = `${level}: ${normalizeText(valueText) || "-"}`;
  return chip;
}

function renderTrainingRequirementsPane(selectedDiscipline = getSelectedTrainingDiscipline()) {
  if (!trainingRequirementsPane) {
    return;
  }

  trainingRequirementsPane.innerHTML = "";

  if (!state.requirements || !Array.isArray(state.requirements?.groups)) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note";
    empty.textContent = "Anforderungen sind noch nicht geladen.";
    trainingRequirementsPane.append(empty);
    return;
  }

  if (!selectedDiscipline) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note";
    empty.textContent = "Bitte zuerst links eine Disziplin waehlen.";
    trainingRequirementsPane.append(empty);
    return;
  }

  const matchingRules = [];
  for (const requirementGroup of state.requirements.groups) {
    const groupDisciplines = Array.isArray(requirementGroup?.disciplines) ? requirementGroup.disciplines : [];
    const matchingRule = groupDisciplines.find((rule) => getTrainingDisciplineIdFromRule(rule) === selectedDiscipline.id);
    if (!matchingRule) {
      continue;
    }

    matchingRules.push({
      ageMin: Number(requirementGroup.ageMin),
      ageMax: Number(requirementGroup.ageMax),
      gender: normalizeText(requirementGroup.gender).toUpperCase() === "W" ? "W" : "M",
      rule: matchingRule
    });
  }

  if (matchingRules.length === 0) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note";
    empty.textContent = "Fuer diese Disziplin wurden keine Anforderungen gefunden.";
    trainingRequirementsPane.append(empty);
    return;
  }

  const modeCard = document.createElement("section");
  modeCard.className = "training-mode-card";

  const heading = document.createElement("div");
  heading.className = "training-mode-title";
  heading.innerHTML = `<div><h3>${selectedDiscipline.disciplineName}</h3><p>Altersklasse x Geschlecht mit Bronze / Silber / Gold.</p></div>`;

  const byAgeBand = new Map();
  for (const entry of matchingRules) {
    const ageBandKey = `${entry.ageMin}-${entry.ageMax}`;
    if (!byAgeBand.has(ageBandKey)) {
      byAgeBand.set(ageBandKey, {
        ageMin: entry.ageMin,
        ageMax: entry.ageMax,
        W: null,
        M: null
      });
    }

    byAgeBand.get(ageBandKey)[entry.gender] = entry.rule;
  }

  const sortedAgeBands = Array.from(byAgeBand.values()).sort((left, right) => {
    if (left.ageMin !== right.ageMin) {
      return left.ageMin - right.ageMin;
    }

    return left.ageMax - right.ageMax;
  });

  const tableWrap = document.createElement("div");
  tableWrap.className = "training-req-table-wrap";

  const table = document.createElement("table");
  table.className = "training-req-table";

  const thead = document.createElement("thead");
  thead.innerHTML =
    "<tr><th>Altersklasse</th><th>W Bronze</th><th>W Silber</th><th>W Gold</th><th>W Ausfuehrung</th><th>M Bronze</th><th>M Silber</th><th>M Gold</th><th>M Ausfuehrung</th></tr>";

  const tbody = document.createElement("tbody");

  const appendRuleCells = (tableRow, rule) => {
    const bronzeCell = document.createElement("td");
    bronzeCell.textContent = normalizeText(rule?.thresholdsRaw?.bronze) || "-";

    const silverCell = document.createElement("td");
    silverCell.textContent = normalizeText(rule?.thresholdsRaw?.silver) || "-";

    const goldCell = document.createElement("td");
    goldCell.textContent = normalizeText(rule?.thresholdsRaw?.gold) || "-";

    const executionCell = document.createElement("td");
    executionCell.textContent = resolveTrainingExecutionText(rule);

    tableRow.append(bronzeCell, silverCell, goldCell, executionCell);
  };

  for (const ageBand of sortedAgeBands) {
    const row = document.createElement("tr");

    const ageCell = document.createElement("td");
    ageCell.className = "training-req-age";
    ageCell.textContent = `${ageBand.ageMin}-${ageBand.ageMax}`;

    row.append(ageCell);
    appendRuleCells(row, ageBand.W);
    appendRuleCells(row, ageBand.M);

    tbody.append(row);
  }

  table.append(thead, tbody);
  tableWrap.append(table);
  modeCard.append(heading, tableWrap);
  trainingRequirementsPane.append(modeCard);
}

function finalizeTrainingTimerForAthlete(selectedDiscipline, athlete, rule, athleteTimerState) {
  if (!selectedDiscipline || !athlete || !rule || !athleteTimerState?.running || !athleteTimerState?.startMarker) {
    return {
      ok: false,
      message: "Zeitlauf ist nicht aktiv."
    };
  }

  const elapsedMs = getElapsedMsSinceTrainingMarker(athleteTimerState.startMarker);
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    athleteTimerState.running = false;
    athleteTimerState.startMarker = null;
    athleteTimerState.lastElapsedMs = 0;
    athleteTimerState.lastMeasuredAt = "";
    return {
      ok: false,
      message: "Zeit konnte nicht gemessen werden."
    };
  }

  const rawInput = getTrainingRawInputForElapsed(rule, elapsedMs);
  const measuredAt = new Date().toISOString();
  const saveResult = appendPerformanceEntryForRule(athlete, rule, rawInput, measuredAt, {
    source: "training_exam_timer"
  });

  athleteTimerState.running = false;
  athleteTimerState.startMarker = null;
  athleteTimerState.lastElapsedMs = elapsedMs;
  athleteTimerState.lastMeasuredAt = measuredAt;

  if (!saveResult.ok) {
    return {
      ok: false,
      message: saveResult.message || "Zeit konnte nicht gespeichert werden."
    };
  }

  return {
    ok: true,
    valueInput: saveResult.valueInput
  };
}

function startTrainingGlobalTiming() {
  clearTrainingAbortConfirmState({ render: false });

  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    showToast("Gemeinsamer Start ist nur fuer Zeitdisziplinen verfuegbar.");
    return;
  }

  const athleteRows = getTrainingAthleteRows(selectedDiscipline.id);
  const eligibleAthleteIds = athleteRows.filter((row) => !!row.rule).map((row) => row.athlete.id);
  if (eligibleAthleteIds.length === 0) {
    showToast("In der aktuellen Auswahl ist keine passende Zeitdisziplin verfuegbar.");
    return;
  }

  const startResult = startTrainingTimersForAthleteIds(selectedDiscipline, eligibleAthleteIds, { sharedStart: true });

  saveTrainingState();
  renderTrainingExamPane(selectedDiscipline);
  updateTrainingExamTicker();
  showToast(startResult.startedCount > 0 ? `${startResult.startedCount} Athleten gestartet.` : "Keine neuen Starts ausgefuehrt.");
}

function stopTrainingGlobalTiming() {
  clearTrainingAbortConfirmState({ render: false });

  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return;
  }

  const session = getTrainingExamSession(selectedDiscipline.id, { create: false });
  const runningAthleteEntries = session
    ? Object.entries(session.athletes || {}).filter(([, athleteTimerState]) => athleteTimerState?.running)
    : [];

  if (!session || (!session.isGlobalRunning && runningAthleteEntries.length === 0)) {
    showToast("Keine aktive gemeinsame Zeitmessung.");
    return;
  }

  const runningAthleteIds = runningAthleteEntries.map(([athleteId]) => athleteId);
  const stopResult = stopTrainingTimersForAthleteIds(selectedDiscipline, runningAthleteIds);

  if (stopResult.savedCount > 0) {
    saveAthletes();
  }

  saveTrainingState();
  refreshAthleteViews();
  updateTrainingExamTicker();

  if (stopResult.savedCount > 0) {
    showToast(`${stopResult.savedCount} Zeit${stopResult.savedCount === 1 ? "" : "en"} gespeichert.`);
    return;
  }

  showToast(stopResult.failedCount > 0 ? "Keine Zeit konnte gespeichert werden." : "Zeitmessung beendet.");
}

function abortTrainingGlobalTiming() {
  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return;
  }

  const runningAthleteIds = getRunningTrainingAthleteIds(selectedDiscipline);
  if (runningAthleteIds.length === 0) {
    showToast("Keine laufenden Starts zum Abbrechen.");
    return;
  }

  const confirmActionKey = createTrainingAbortActionKey("all", selectedDiscipline.id, runningAthleteIds);
  if (!requestTrainingAbortConfirmation(confirmActionKey, "Erneut tippen: Alle laufenden Starts abbrechen.")) {
    return;
  }

  const abortResult = abortTrainingTimersForAthleteIds(selectedDiscipline, runningAthleteIds);
  saveTrainingState();
  renderTrainingExamPane(selectedDiscipline);
  updateTrainingExamTicker();
  showToast(`${abortResult.abortedCount} Start${abortResult.abortedCount === 1 ? "" : "s"} abgebrochen.`);
}

function startTrainingMarkedTiming() {
  clearTrainingAbortConfirmState({ render: false });

  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    showToast("Markierter Start ist nur fuer Zeitdisziplinen verfuegbar.");
    return;
  }

  const markedAthleteIds = Array.from(getTrainingMarkedAthleteIdSet());
  if (markedAthleteIds.length === 0) {
    showToast("Bitte zuerst Athleten markieren.");
    return;
  }

  const startResult = startTrainingTimersForAthleteIds(selectedDiscipline, markedAthleteIds, { sharedStart: false });
  saveTrainingState();
  renderTrainingExamPane(selectedDiscipline);
  updateTrainingExamTicker();

  if (startResult.startedCount > 0) {
    showToast(`${startResult.startedCount} markierte Athleten gestartet.`);
    return;
  }

  showToast("Keine neuen Starts fuer markierte Athleten.");
}

function stopTrainingMarkedTiming() {
  clearTrainingAbortConfirmState({ render: false });

  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    showToast("Markierter Stopp ist nur fuer Zeitdisziplinen verfuegbar.");
    return;
  }

  const markedAthleteIds = Array.from(getTrainingMarkedAthleteIdSet());
  if (markedAthleteIds.length === 0) {
    showToast("Bitte zuerst Athleten markieren.");
    return;
  }

  const stopResult = stopTrainingTimersForAthleteIds(selectedDiscipline, markedAthleteIds);
  if (stopResult.stoppedCount === 0) {
    showToast("Bei markierten Athleten laeuft keine Zeit.");
    return;
  }

  if (stopResult.savedCount > 0) {
    saveAthletes();
  }

  saveTrainingState();
  refreshAthleteViews();
  updateTrainingExamTicker();

  if (stopResult.savedCount > 0) {
    showToast(`${stopResult.savedCount} markierte Zeit${stopResult.savedCount === 1 ? "" : "en"} gespeichert.`);
    return;
  }

  showToast(stopResult.failedCount > 0 ? "Markierte Zeiten konnten nicht gespeichert werden." : "Markierte Athleten gestoppt.");
}

function abortTrainingMarkedTiming() {
  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    showToast("Markierter Abbruch ist nur fuer Zeitdisziplinen verfuegbar.");
    return;
  }

  const markedAthleteIds = Array.from(getTrainingMarkedAthleteIdSet());
  if (markedAthleteIds.length === 0) {
    showToast("Bitte zuerst Athleten markieren.");
    return;
  }

  const session = getTrainingExamSession(selectedDiscipline.id, { create: false });
  const runningMarkedIds = markedAthleteIds.filter((athleteId) => {
    const athleteState = getTrainingExamAthleteState(session, athleteId, { create: false });
    return !!athleteState?.running;
  });

  if (runningMarkedIds.length === 0) {
    showToast("Bei markierten Athleten laeuft kein Start.");
    return;
  }

  const confirmActionKey = createTrainingAbortActionKey("marked", selectedDiscipline.id, runningMarkedIds);
  if (!requestTrainingAbortConfirmation(confirmActionKey, "Erneut tippen: Markierte laufende Starts abbrechen.")) {
    return;
  }

  const abortResult = abortTrainingTimersForAthleteIds(selectedDiscipline, runningMarkedIds);
  if (abortResult.abortedCount <= 0) {
    showToast("Bei markierten Athleten laeuft kein Start.");
    return;
  }

  saveTrainingState();
  renderTrainingExamPane(selectedDiscipline);
  updateTrainingExamTicker();
  showToast(`${abortResult.abortedCount} markierte Start${abortResult.abortedCount === 1 ? "" : "s"} abgebrochen.`);
}

function startTrainingAthleteTiming(athleteId) {
  clearTrainingAbortConfirmState({ render: false });

  const normalizedAthleteId = normalizeText(athleteId);
  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!normalizedAthleteId || !selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return;
  }

  const athlete = state.athletes.find((entry) => entry.id === normalizedAthleteId) || null;
  if (!athlete) {
    return;
  }

  const { rule } = getTrainingRuleForAthlete(athlete, selectedDiscipline.id);
  if (!rule) {
    showToast("Fuer diesen Athleten ist diese Disziplin nicht verfuegbar.");
    return;
  }

  const startResult = startTrainingTimersForAthleteIds(selectedDiscipline, [normalizedAthleteId], { sharedStart: false });
  if (startResult.startedCount <= 0) {
    return;
  }

  saveTrainingState();
  renderTrainingExamPane(selectedDiscipline);
  updateTrainingExamTicker();
}

function stopTrainingAthleteTiming(athleteId) {
  clearTrainingAbortConfirmState({ render: false });

  const normalizedAthleteId = normalizeText(athleteId);
  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!normalizedAthleteId || !selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return;
  }

  const stopResult = stopTrainingTimersForAthleteIds(selectedDiscipline, [normalizedAthleteId]);
  if (stopResult.stoppedCount === 0) {
    return;
  }

  if (stopResult.savedCount > 0) {
    saveAthletes();
  }

  saveTrainingState();
  updateTrainingExamTicker();

  if (stopResult.savedCount <= 0) {
    renderTrainingExamPane(selectedDiscipline);
    showToast("Zeit konnte nicht gespeichert werden.");
    return;
  }

  refreshAthleteViews();
  showToast(`Zeit gespeichert: ${stopResult.lastSavedValue || "Wert"}`);
}

function abortTrainingAthleteTiming(athleteId) {
  const normalizedAthleteId = normalizeText(athleteId);
  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!normalizedAthleteId || !selectedDiscipline || !["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    return;
  }

  const confirmActionKey = createTrainingAbortActionKey("athlete", selectedDiscipline.id, [normalizedAthleteId]);
  if (!requestTrainingAbortConfirmation(confirmActionKey, "Erneut tippen: Start dieses Athleten abbrechen.")) {
    return;
  }

  const abortResult = abortTrainingTimersForAthleteIds(selectedDiscipline, [normalizedAthleteId]);
  if (abortResult.abortedCount <= 0) {
    return;
  }

  saveTrainingState();
  renderTrainingExamPane(selectedDiscipline);
  updateTrainingExamTicker();
  showToast("Start abgebrochen.");
}

function saveTrainingQuickPerformance(athleteId) {
  clearTrainingAbortConfirmState({ render: false });

  const normalizedAthleteId = normalizeText(athleteId);
  const selectedDiscipline = getSelectedTrainingDiscipline();
  if (!normalizedAthleteId || !selectedDiscipline) {
    return;
  }

  if (["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType)) {
    showToast("In dieser Disziplin bitte Start/Stop nutzen.");
    return;
  }

  const athlete = state.athletes.find((entry) => entry.id === normalizedAthleteId) || null;
  if (!athlete) {
    return;
  }

  const { rule } = getTrainingRuleForAthlete(athlete, selectedDiscipline.id);
  if (!rule) {
    showToast("Fuer diesen Athleten ist diese Disziplin nicht verfuegbar.");
    return;
  }

  let rawDraftValue = getTrainingInputDraftValue(selectedDiscipline.id, normalizedAthleteId);
  if (isTrainingThreeOfFourPointsRule(rule)) {
    if (!rawDraftValue) {
      const autoTotalResult = getTrainingThreeOfFourAutoTotal(selectedDiscipline.id, normalizedAthleteId);
      if (!autoTotalResult.ok) {
        showToast(autoTotalResult.message);
        return;
      }

      rawDraftValue = formatNumberInputValue(autoTotalResult.total);
    }
  }

  if (!rawDraftValue) {
    showToast("Bitte zuerst einen Wert eingeben.");
    return;
  }

  const saveResult = appendPerformanceEntryForRule(athlete, rule, rawDraftValue, new Date().toISOString(), {
    source: "training_exam_quick"
  });

  if (!saveResult.ok) {
    showToast(saveResult.message || "Leistung konnte nicht gespeichert werden.");
    return;
  }

  clearTrainingInputDraftValue(selectedDiscipline.id, normalizedAthleteId);
  clearTrainingAttemptDraftValues(selectedDiscipline.id, normalizedAthleteId);
  saveAthletes();
  refreshAthleteViews();
  showToast(`Leistung gespeichert: ${saveResult.valueInput}`);
}

function renderTrainingExamPane(selectedDiscipline = getSelectedTrainingDiscipline()) {
  if (!trainingExamPane) {
    return;
  }

  trainingExamPane.innerHTML = "";
  clearTrainingExamGlobalControls();

  if (!selectedDiscipline) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note";
    empty.textContent = "Bitte zuerst links eine Disziplin waehlen.";
    trainingExamPane.append(empty);
    return;
  }

  const isTimedDiscipline = ["time_mm_ss", "time_seconds"].includes(selectedDiscipline.unitType);
  const modeCard = document.createElement("section");
  modeCard.className = "training-mode-card";

  const titleWrap = document.createElement("div");
  titleWrap.className = "training-mode-title";
  const title = document.createElement("h3");
  title.textContent = selectedDiscipline.disciplineName;
  titleWrap.append(title);
  modeCard.append(titleWrap);

  const athleteRows = getTrainingAthleteRows(selectedDiscipline.id);
  const eligibleAthleteCount = athleteRows.filter((row) => !!row.rule).length;
  const session = getTrainingExamSession(selectedDiscipline.id, { create: false });
  const markedAthleteIdSet = getTrainingMarkedAthleteIdSet();
  const runningAthleteIds = session
    ? Object.entries(session.athletes || {})
        .filter(([, athleteTimerState]) => !!athleteTimerState?.running)
        .map(([athleteId]) => athleteId)
    : [];
  const runningAthleteIdSet = new Set(runningAthleteIds);
  const runningAthleteCount = runningAthleteIds.length;
  const markedRunningAthleteIds = Array.from(markedAthleteIdSet).filter((athleteId) => runningAthleteIdSet.has(athleteId));
  const markedRunningAthleteCount = markedRunningAthleteIds.length;
  const abortAllActionKey = createTrainingAbortActionKey("all", selectedDiscipline.id, runningAthleteIds);
  const abortMarkedActionKey = createTrainingAbortActionKey("marked", selectedDiscipline.id, markedRunningAthleteIds);

  const iconSvgByName = {
    play: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5v14l11-7Z" fill="currentColor"></path></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"></rect></svg>',
    abort: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7 17 17M17 7 7 17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 4 8 15H4l8-15Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path><path d="M12 9v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><circle cx="12" cy="17" r="1" fill="currentColor"></circle></svg>',
    markAll: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 7h9M9 12h9M9 17h9M4 7l1.4 1.4L7.6 6.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    markRunning: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="7" stroke="currentColor" stroke-width="2"></circle><path d="M12 13V9M12 13l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9 3h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>',
    markNone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"></circle><path d="M8 8 16 16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 18.5a4.5 4.5 0 0 1 9 0M14 18.5a3.6 3.6 0 0 1 7 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>',
    running: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="7" stroke="currentColor" stroke-width="2"></circle><path d="M12 13V9M12 13l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9 3h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>',
    checked: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"></circle><path d="m8 12 2.6 2.6L16 9.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    dual: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="12" r="5" stroke="currentColor" stroke-width="2"></circle><circle cx="16" cy="12" r="5" stroke="currentColor" stroke-width="2"></circle></svg>',
    scopeAll: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="2"></circle><path d="M5 12h14M12 5a11 11 0 0 1 0 14M12 5a11 11 0 0 0 0 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
    scopeMarked: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="2"></circle><path d="m8.4 12 2.2 2.2 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
  };

  const createActionIconElement = (iconName, extraClassName = "") => {
    const icon = document.createElement("span");
    icon.className = `training-action-icon${extraClassName ? ` ${extraClassName}` : ""}`;
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = iconSvgByName[iconName] || iconSvgByName.play;
    return icon;
  };

  const createIconButton = ({
    action,
    athleteId = "",
    iconName,
    label,
    className,
    disabled = false,
    pending = false,
    scopeIconName = ""
  }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.trainingAction = action;
    if (athleteId) {
      button.dataset.athleteId = athleteId;
    }
    button.disabled = !!disabled;
    if (pending) {
      button.classList.add("is-pending-confirm");
    }
    button.title = label;
    button.setAttribute("aria-label", label);

    const iconStack = document.createElement("span");
    iconStack.className = "training-action-icon-stack";
    iconStack.append(createActionIconElement(iconName));
    if (scopeIconName) {
      iconStack.append(createActionIconElement(scopeIconName, "training-action-icon--scope"));
    }

    button.append(iconStack);
    return button;
  };

  const createIconStat = (iconName, value, label, styleVariant = "") => {
    const stat = document.createElement("span");
    stat.className = "training-mark-stat";
    if (styleVariant) {
      stat.classList.add(`training-mark-stat--${styleVariant}`);
    }
    stat.title = `${label}: ${value}`;
    stat.setAttribute("aria-label", `${label}: ${value}`);
    stat.append(createActionIconElement(iconName), document.createTextNode(String(value)));
    return stat;
  };

  const runningHotkeyIndexMap = new Map();
  let runningHotkeySlot = 1;
  for (const row of athleteRows) {
    if (runningHotkeySlot > 9) {
      break;
    }

    if (!runningAthleteIdSet.has(row.athlete.id)) {
      continue;
    }

    runningHotkeyIndexMap.set(row.athlete.id, runningHotkeySlot);
    runningHotkeySlot += 1;
  }

  if (isTimedDiscipline) {
    const markToolbar = document.createElement("div");
    markToolbar.className = "training-mark-toolbar";

    const markActions = document.createElement("div");
    markActions.className = "training-mark-actions";
    markActions.append(
      createIconButton({
        action: "mark-all-visible",
        iconName: "markAll",
        label: "Alle sichtbaren Athleten markieren",
        className: "training-mark-btn",
        disabled: athleteRows.length <= 0
      }),
      createIconButton({
        action: "mark-running-visible",
        iconName: "markRunning",
        label: "Alle laufenden Athleten markieren",
        className: "training-mark-btn",
        disabled: runningAthleteCount <= 0
      }),
      createIconButton({
        action: "mark-none-visible",
        iconName: "markNone",
        label: "Markierung loeschen",
        className: "training-mark-btn",
        disabled: markedAthleteIdSet.size <= 0
      })
    );

    const markStats = document.createElement("div");
    markStats.className = "training-mark-stats";
    markStats.append(
      createIconStat("users", athleteRows.length, "Athleten"),
      createIconStat("running", runningAthleteCount, "Laufend", runningAthleteCount > 0 ? "active" : ""),
      createIconStat("checked", markedAthleteIdSet.size, "Markiert", markedAthleteIdSet.size > 0 ? "marked" : ""),
      createIconStat("dual", markedRunningAthleteCount, "Markiert laufend", markedRunningAthleteCount > 0 ? "active" : "")
    );

    markToolbar.append(markActions, markStats);
    modeCard.append(markToolbar);

    const abortAllPending = isTrainingAbortConfirmPending(abortAllActionKey);
    const abortMarkedPending = isTrainingAbortConfirmPending(abortMarkedActionKey);

    const bottomControls = document.createElement("div");
    bottomControls.className = "training-bottom-controls";
    bottomControls.append(
      createIconButton({
        action: "start-all-timing",
        iconName: "play",
        scopeIconName: "scopeAll",
        label: "Alle Athleten starten",
        className: "training-control-icon-btn training-control-icon-btn--start",
        disabled: eligibleAthleteCount <= 0
      }),
      createIconButton({
        action: "stop-all-timing",
        iconName: "stop",
        scopeIconName: "scopeAll",
        label: "Alle Athleten stoppen und speichern",
        className: "training-control-icon-btn training-control-icon-btn--stop",
        disabled: runningAthleteCount <= 0
      }),
      createIconButton({
        action: "abort-all-timing",
        iconName: abortAllPending ? "warning" : "abort",
        scopeIconName: "scopeAll",
        label: abortAllPending ? "Erneut tippen: alle Starts abbrechen" : "Alle laufenden Starts abbrechen",
        className: "training-control-icon-btn training-control-icon-btn--abort",
        disabled: runningAthleteCount <= 0,
        pending: abortAllPending
      }),
      createIconButton({
        action: "start-marked-timing",
        iconName: "play",
        scopeIconName: "scopeMarked",
        label: "Markierte Athleten starten",
        className: "training-control-icon-btn training-control-icon-btn--start training-control-icon-btn--marked",
        disabled: markedAthleteIdSet.size <= 0
      }),
      createIconButton({
        action: "stop-marked-timing",
        iconName: "stop",
        scopeIconName: "scopeMarked",
        label: "Markierte Athleten stoppen und speichern",
        className: "training-control-icon-btn training-control-icon-btn--stop training-control-icon-btn--marked",
        disabled: markedRunningAthleteCount <= 0
      }),
      createIconButton({
        action: "abort-marked-timing",
        iconName: abortMarkedPending ? "warning" : "abort",
        scopeIconName: "scopeMarked",
        label: abortMarkedPending ? "Erneut tippen: markierte Starts abbrechen" : "Markierte laufende Starts abbrechen",
        className: "training-control-icon-btn training-control-icon-btn--abort training-control-icon-btn--marked",
        disabled: markedRunningAthleteCount <= 0,
        pending: abortMarkedPending
      })
    );

    mountTrainingExamGlobalControls(bottomControls);
  }

  if (athleteRows.length === 0) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note";
    empty.textContent = "Keine Athleten in der aktuellen Auswahl.";
    modeCard.append(empty);
    trainingExamPane.append(modeCard);
    updateTrainingExamTicker();
    return;
  }

  const list = document.createElement("ul");
  list.className = "training-athlete-list";

  for (const row of athleteRows) {
    const item = document.createElement("li");
    item.className = "training-athlete-item";
    item.classList.add(`training-athlete-item--${getLevelCssSuffix(row.bestLevel)}`);
    if (isTimedDiscipline) {
      item.classList.add("is-timed");
    }

    const athleteMain = document.createElement("div");
    athleteMain.className = "training-athlete-main";

    const head = document.createElement("div");
    head.className = "training-athlete-head";

    const headLeft = document.createElement("div");
    headLeft.className = "training-athlete-head-left";

    const shouldEnableMarking = isTimedDiscipline && !!row.rule;
    const isMarked = shouldEnableMarking && markedAthleteIdSet.has(row.athlete.id);
    if (isMarked) {
      item.classList.add("is-marked");
    }

    if (shouldEnableMarking) {
      item.dataset.trainingAction = "toggle-athlete-mark";
      item.dataset.athleteId = row.athlete.id;
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-pressed", isMarked ? "true" : "false");
      item.setAttribute("aria-label", `${athleteDisplayName(row.athlete) || "Athlet"} markieren`);
    }

    const name = document.createElement("span");
    name.className = "training-athlete-name";
    name.textContent = athleteDisplayName(row.athlete) || "Athlet";

    const code = document.createElement("span");
    code.className = "training-athlete-age";
    code.textContent = athleteCode(row.athlete);

    const nameRow = document.createElement("div");
    nameRow.className = "training-athlete-name-row";
    nameRow.append(name, code);
    headLeft.append(nameRow);

    const headRight = document.createElement("div");
    headRight.className = "training-athlete-head-right";

    if (shouldEnableMarking) {
      const markedIndicator = document.createElement("span");
      markedIndicator.className = "training-athlete-mark-indicator";
      if (isMarked) {
        markedIndicator.classList.add("is-marked");
      }
      markedIndicator.append(createActionIconElement(isMarked ? "checked" : "scopeMarked", "training-action-icon--tiny"));
      headRight.append(markedIndicator);
    }

    const runningHotkeySlot = isTimedDiscipline ? runningHotkeyIndexMap.get(row.athlete.id) : 0;
    if (Number.isInteger(runningHotkeySlot) && runningHotkeySlot > 0) {
      const hotkeyBadge = document.createElement("span");
      hotkeyBadge.className = "training-hotkey-badge";
      hotkeyBadge.textContent = `Alt+${runningHotkeySlot}`;
      headRight.append(hotkeyBadge);
    }

    head.append(headLeft, headRight);
    athleteMain.append(head);

    if (!row.rule) {
      item.classList.add("is-no-requirement");
      const missing = document.createElement("p");
      missing.className = "training-athlete-meta";
      missing.textContent = "Keine passende Anforderung fuer die Altersgruppe.";
      athleteMain.append(missing);
      item.append(athleteMain);
      list.append(item);
      continue;
    }

    const requirementRow = document.createElement("div");
    requirementRow.className = "training-requirement-row";
    requirementRow.append(
      createTrainingRequirementChipElement("Bronze", row.rule.thresholdsRaw?.bronze),
      createTrainingRequirementChipElement("Silber", row.rule.thresholdsRaw?.silver),
      createTrainingRequirementChipElement("Gold", row.rule.thresholdsRaw?.gold)
    );
    athleteMain.append(requirementRow);

    const executionText = resolveTrainingExecutionText(row.rule);
    if (executionText !== "-" && executionText !== selectedDiscipline.detail) {
      const execution = document.createElement("p");
      execution.className = "training-execution-note";
      execution.textContent = `Ausfuehrung: ${executionText}`;
      athleteMain.append(execution);
    }

    const best = document.createElement("div");
    best.className = "training-athlete-best";
    best.textContent = `Bestleistung: ${row.bestValue}`;
    if (row.bestLevel !== "-") {
      const bestLevel = document.createElement("span");
      bestLevel.className = "training-athlete-best-level";
      bestLevel.textContent = row.bestLevel;
      best.append(bestLevel);
    }
    athleteMain.append(best);

    const actions = document.createElement("div");
    actions.className = "training-athlete-actions";

    if (isTimedDiscipline) {
      actions.classList.add("training-athlete-actions--timed");

      const athleteTimerState =
        getTrainingExamAthleteState(session, row.athlete.id, { create: false }) ||
        {
          running: false,
          startMarker: null,
          lastElapsedMs: 0,
          lastMeasuredAt: ""
        };
      const isRunning = !!athleteTimerState?.running;
      if (isRunning) {
        item.classList.add("is-running");
        actions.classList.add("is-running");
      }

      const displayedElapsed = isRunning
        ? getElapsedMsSinceTrainingMarker(athleteTimerState.startMarker)
        : Number(athleteTimerState?.lastElapsedMs || 0);

      const actionButton = createIconButton({
        action: isRunning ? "stop-athlete-timing" : "start-athlete-timing",
        athleteId: row.athlete.id,
        iconName: isRunning ? "stop" : "play",
        label: isRunning ? "Stopp und automatisch speichern" : "Starten",
        className: `training-athlete-action-btn training-athlete-action-btn--${isRunning ? "stop" : "start"}`
      });

      const timerValue = document.createElement("span");
      timerValue.className = "training-timer-value training-athlete-action-time";
      timerValue.dataset.athleteId = row.athlete.id;
      timerValue.textContent = Number.isFinite(displayedElapsed) && displayedElapsed > 0 ? formatTrainingElapsedForRule(row.rule, displayedElapsed) : "--:--";
      actionButton.append(timerValue);
      actions.append(actionButton);

      if (isRunning) {
        const athleteAbortActionKey = createTrainingAbortActionKey("athlete", selectedDiscipline.id, [row.athlete.id]);
        const athleteAbortPending = isTrainingAbortConfirmPending(athleteAbortActionKey);
        const abortButton = createIconButton({
          action: "abort-athlete-timing",
          athleteId: row.athlete.id,
          iconName: athleteAbortPending ? "warning" : "abort",
          label: athleteAbortPending ? "Erneut tippen zum Abbrechen" : "Start abbrechen",
          className: "training-athlete-inline-btn training-athlete-inline-btn--abort",
          pending: athleteAbortPending
        });
        actions.append(abortButton);
      }

      if (!isRunning && Number(athleteTimerState?.lastElapsedMs || 0) > 0 && athleteTimerState?.lastMeasuredAt) {
        const lastTimeInfo = document.createElement("p");
        lastTimeInfo.className = "training-athlete-meta";
        lastTimeInfo.textContent = `Zuletzt gestoppt: ${formatDateTime(athleteTimerState.lastMeasuredAt)}`;
        athleteMain.append(lastTimeInfo);
      }
    } else {
      const isThreeOfFourPoints = isTrainingThreeOfFourPointsRule(row.rule);
      if (isThreeOfFourPoints) {
        const attemptsGrid = document.createElement("div");
        attemptsGrid.className = "training-attempt-grid";

        for (let attemptIndex = 1; attemptIndex <= 4; attemptIndex += 1) {
          const attemptInput = document.createElement("input");
          attemptInput.type = "text";
          attemptInput.className = "training-quick-attempt-input";
          attemptInput.placeholder = `Sprung ${attemptIndex}`;
          attemptInput.dataset.trainingAction = "quick-attempt-input";
          attemptInput.dataset.athleteId = row.athlete.id;
          attemptInput.dataset.attemptIndex = String(attemptIndex);
          attemptInput.inputMode = "decimal";
          attemptInput.value = getTrainingAttemptDraftValue(selectedDiscipline.id, row.athlete.id, attemptIndex);
          attemptsGrid.append(attemptInput);
        }

        athleteMain.append(attemptsGrid);

        const autoTotal = getTrainingThreeOfFourAutoTotal(selectedDiscipline.id, row.athlete.id);
        const autoTotalInfo = document.createElement("p");
        autoTotalInfo.className = `training-athlete-meta training-attempt-note${autoTotal.ok ? "" : " is-warning"}`;
        autoTotalInfo.textContent = autoTotal.ok
          ? `Auto (beste 3): ${formatNumberInputValue(autoTotal.total)} Punkte`
          : "3 von 4 Wertung: Entweder Gesamtpunkte eintragen oder mindestens 3 Spruenge erfassen.";
        athleteMain.append(autoTotalInfo);
      }

      const quickInput = document.createElement("input");
      quickInput.type = "text";
      quickInput.className = "training-quick-input";
      quickInput.placeholder = isThreeOfFourPoints ? "Gesamtpunkte (optional)" : performanceValuePlaceholder(row.rule);
      quickInput.dataset.trainingAction = "quick-input";
      quickInput.dataset.athleteId = row.athlete.id;
      quickInput.inputMode = row.rule.unitType === "number" ? "decimal" : "text";
      quickInput.value = getTrainingInputDraftValue(selectedDiscipline.id, row.athlete.id);
      actions.append(quickInput);

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "training-athlete-main-btn training-athlete-main-btn--save";
      saveButton.dataset.trainingAction = "save-quick-performance";
      saveButton.dataset.athleteId = row.athlete.id;
      saveButton.textContent = "Speichern";
      actions.append(saveButton);

      if (row.rule.unitType === "level") {
        const levelButtons = document.createElement("div");
        levelButtons.className = "training-quick-levels";

        for (const level of ["Bronze", "Silber", "Gold"]) {
          const levelButton = document.createElement("button");
          levelButton.type = "button";
          levelButton.className = "training-level-btn";
          levelButton.dataset.trainingAction = "quick-level";
          levelButton.dataset.athleteId = row.athlete.id;
          levelButton.dataset.level = level;
          levelButton.textContent = level;
          levelButtons.append(levelButton);
        }

        athleteMain.append(levelButtons);
      }
    }

    item.append(athleteMain, actions);
    list.append(item);
  }

  modeCard.append(list);
  trainingExamPane.append(modeCard);
  updateTrainingExamTicker();
}

function renderTrainingView() {
  if (!trainingDisciplineList || !trainingRequirementsPane || !trainingExamPane) {
    return;
  }

  if (state.trainingViewMode !== "requirements" && state.trainingViewMode !== "exam") {
    state.trainingViewMode = "requirements";
  }

  if (trainingView) {
    trainingView.classList.toggle("is-exam-mode", state.trainingViewMode === "exam");
  }

  if (state.trainingViewMode !== "exam") {
    clearTrainingAbortConfirmState({ render: false });
    clearTrainingExamGlobalControls();
  }

  const catalog = getTrainingDisciplineCatalog();
  let stateChanged = false;

  if (ensureTrainingDisciplineSelection(catalog)) {
    stateChanged = true;
  }

  if (pruneTrainingExamSessions()) {
    stateChanged = true;
  }

  if (normalizeTrainingMarkedAthleteIds({ visibleOnly: true })) {
    stateChanged = true;
  }

  if (stateChanged) {
    saveTrainingState();
  }

  const selectedGroup = getSelectedGroup();
  if (trainingTitle) {
    trainingTitle.textContent = `${selectedGroup ? selectedGroup.name : "Alle Athleten"} ▾`;
    trainingTitle.title = "Gruppenansicht wechseln";
  }

  if (trainingModeToggleButton) {
    trainingModeToggleButton.textContent = state.trainingViewMode === "requirements" ? "Pruefungsmodus starten" : "Anforderungsmodus";
    trainingModeToggleButton.classList.toggle("is-exam", state.trainingViewMode === "exam");
  }

  const selectedDiscipline = getSelectedTrainingDiscipline(catalog);
  if (!selectedDiscipline && !isTrainingSplitLayout()) {
    state.trainingCompactPane = "list";
  }

  if (trainingContentTitle) {
    trainingContentTitle.textContent = selectedDiscipline ? selectedDiscipline.disciplineName : "Disziplin";
  }

  const visibleAthleteCount = getVisibleAthletes().length;
  if (trainingSubtitle) {
    if (state.trainingViewMode === "exam") {
      trainingSubtitle.hidden = true;
      trainingSubtitle.textContent = "";
    } else {
      const disciplineLabel = selectedDiscipline ? selectedDiscipline.disciplineName : "Bitte Disziplin waehlen";
      trainingSubtitle.hidden = false;
      trainingSubtitle.textContent = `Anforderungsmodus | ${disciplineLabel} | ${visibleAthleteCount} Athlet${visibleAthleteCount === 1 ? "" : "en"} in Auswahl`;
    }
  }

  renderTrainingDisciplineList(catalog);

  if (state.trainingViewMode === "exam") {
    trainingRequirementsPane.hidden = true;
    trainingExamPane.hidden = false;
    renderTrainingExamPane(selectedDiscipline);
  } else {
    trainingRequirementsPane.hidden = false;
    trainingExamPane.hidden = true;
    renderTrainingRequirementsPane(selectedDiscipline);
    updateTrainingExamTicker();
  }

  updateTrainingLayoutSelectionState();
  updateTrainingExamSurfaceState();
}

function renderAthletes() {
  athleteList.innerHTML = "";

  if (requirementsViewButton) {
    requirementsViewButton.classList.toggle("is-active", state.requirementsInspectorOpen);
  }

  const selectedGroup = getSelectedGroup();

  const sortedAthletes = [...getVisibleAthletes()].sort((left, right) => {
    const byFirstName = left.firstName.localeCompare(right.firstName, "de");
    if (byFirstName !== 0) {
      return byFirstName;
    }

    return left.lastName.localeCompare(right.lastName, "de");
  });

  for (const athlete of sortedAthletes) {
    const listItem = document.createElement("li");
    listItem.className = "athlete-card";

    if (athlete.id === state.selectedAthleteId) {
      listItem.classList.add("is-selected");
    }

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "athlete-card-btn";
    trigger.dataset.athleteId = athlete.id;

    const main = document.createElement("div");
    main.className = "athlete-main";

    const name = document.createElement("h3");
    name.textContent = athleteDisplayName(athlete) || "Unbenannter Athlet";

    const requirementGroup = getRequirementGroupForAthlete(athlete);
    const categoryLevels = getAthleteCategoryLevels(athlete, requirementGroup);
    const overallAwardLevel = getOverallAwardLevel(categoryLevels);
    const categoryPoints = CATEGORY_ORDER.reduce((sum, categoryName) => sum + (LEVEL_POINTS[categoryLevels[categoryName]] || 0), 0);

    const statusIcons = createAthleteStatusIconsElement(categoryLevels);

    const badge = document.createElement("span");
    badge.className = "age-chip";
    const athleteCodeLabel = athleteCode(athlete);
    badge.textContent = athleteCodeLabel;

    const side = document.createElement("div");
    side.className = "athlete-card-side";
    side.append(badge);

    const overallLevelCss = getLevelCssSuffix(overallAwardLevel);
    trigger.classList.add(`athlete-card-btn--${overallLevelCss}`);
    if (overallAwardLevel === "-") {
      badge.title = "Noch kein Gesamt-Sportabzeichen";
      trigger.title = "Noch kein Gesamt-Sportabzeichen";
    } else {
      badge.title = `Gesamt: ${overallAwardLevel} (${categoryPoints} Punkte)`;
      trigger.title = `Gesamt: ${overallAwardLevel} (${categoryPoints} Punkte)`;
    }

    const birthdayInfo = getRecentBirthdayInfo(athlete.birthDate, 14);
    if (birthdayInfo) {
      listItem.classList.add("athlete-card--birthday");
      badge.classList.add("age-chip--birthday");

      if (birthdayInfo.daysAgo === 0) {
        badge.classList.add("age-chip--birthday-today");
      }

      badge.textContent = "";
      const codeLine = document.createElement("span");
      codeLine.className = "age-chip-code";
      codeLine.textContent = athleteCodeLabel;

      const engravedLine = document.createElement("span");
      engravedLine.className = "age-chip-engraving";
      engravedLine.textContent = birthdayInfo.shortLabel;

      badge.append(codeLine, engravedLine);

      const badgeBaseTitle = normalizeText(badge.title);
      const triggerBaseTitle = normalizeText(trigger.title);
      badge.title = badgeBaseTitle ? `${badgeBaseTitle} • ${birthdayInfo.detailLabel}` : birthdayInfo.detailLabel;
      trigger.title = triggerBaseTitle ? `${triggerBaseTitle} • ${birthdayInfo.detailLabel}` : birthdayInfo.detailLabel;
    }

    main.append(name);
    main.append(statusIcons);
    trigger.append(main, side);
    listItem.append(trigger);
    athleteList.append(listItem);
  }

  emptyState.hidden = sortedAthletes.length > 0;
  if (!emptyState.hidden) {
    const title = emptyState.querySelector("h3");
    const description = emptyState.querySelector("p");
    if (selectedGroup) {
      if (title) {
        title.textContent = "Keine Athleten in dieser Gruppe";
      }
      if (description) {
        description.textContent = `Ordne Athleten der Gruppe ${selectedGroup.name} zu oder wechsle auf Alle Athleten.`;
      }
    } else {
      if (title) {
        title.textContent = "Noch keine Athleten";
      }
      if (description) {
        description.textContent = "Tippe auf das Plus neben dem Titel, um den ersten Sportler anzulegen.";
      }
    }
  }

  if (state.selectedAthleteId && !getSelectedAthlete()) {
    state.selectedAthleteId = "";
    state.selectedDisciplineKey = "";
    state.editPerformanceId = "";
    closePerformanceModal();
  }

  updateAthleteLayoutSelectionState();
}

function getGroupIdsForAthlete(athleteId) {
  const normalizedAthleteId = normalizeText(athleteId);
  if (!normalizedAthleteId) {
    return [];
  }

  return state.groups.filter((group) => (group.athleteIds || []).includes(normalizedAthleteId)).map((group) => group.id);
}

function getDefaultAthleteGroupSelectionForCreate() {
  const selectedGroupId = normalizeText(state.selectedGroupId);
  if (selectedGroupId && getGroupById(selectedGroupId)) {
    return [selectedGroupId];
  }

  return [];
}

function renderAthleteGroupSelection(selectedGroupIds = []) {
  if (!athleteGroupSelection) {
    return;
  }

  athleteGroupSelection.innerHTML = "";

  const selectedSet = new Set((Array.isArray(selectedGroupIds) ? selectedGroupIds : []).map((groupId) => normalizeText(groupId)).filter(Boolean));
  const sortedGroups = [...state.groups].sort((left, right) => left.name.localeCompare(right.name, "de"));

  if (sortedGroups.length === 0) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note";
    empty.textContent = "Noch keine Gruppen vorhanden. Lege zuerst eine Gruppe an.";
    athleteGroupSelection.append(empty);
    return;
  }

  for (const group of sortedGroups) {
    const label = document.createElement("label");
    label.className = "athlete-group-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "athlete-group-checkbox";
    checkbox.value = group.id;
    checkbox.checked = selectedSet.has(group.id);

    const main = document.createElement("div");
    main.className = "athlete-main";

    const name = document.createElement("h3");
    name.textContent = normalizeText(group.name) || "Unbenannte Gruppe";

    const meta = document.createElement("p");
    const memberCount = Array.isArray(group.athleteIds) ? group.athleteIds.length : 0;
    meta.textContent = `${memberCount} Athlet${memberCount === 1 ? "" : "en"} • ${getGroupTrainingSummary(group)}`;

    const side = document.createElement("div");
    side.className = "athlete-group-side";

    const chip = document.createElement("span");
    chip.className = "age-chip";
    chip.textContent = memberCount === 1 ? "1" : String(memberCount);

    main.append(name, meta);
    side.append(chip);
    label.append(checkbox, main, side);

    const updateSelectionState = () => {
      const isSelected = checkbox.checked;
      label.classList.toggle("is-selected", isSelected);
      label.classList.toggle("is-unselected", !isSelected);
    };

    updateSelectionState();
    checkbox.addEventListener("change", updateSelectionState);
    athleteGroupSelection.append(label);
  }
}

function getSelectedAthleteGroupIdsFromForm() {
  if (!athleteGroupSelection) {
    return [];
  }

  return Array.from(athleteGroupSelection.querySelectorAll("input[type='checkbox']:checked"))
    .map((checkbox) => normalizeText(checkbox.value))
    .filter(Boolean);
}

function applyAthleteGroupAssignments(athleteId, selectedGroupIds = []) {
  const normalizedAthleteId = normalizeText(athleteId);
  if (!normalizedAthleteId) {
    return false;
  }

  const selectedSet = new Set((Array.isArray(selectedGroupIds) ? selectedGroupIds : []).map((groupId) => normalizeText(groupId)).filter(Boolean));
  const now = new Date().toISOString();
  let changed = false;

  state.groups = state.groups.map((group) => {
    const currentAthleteIds = Array.isArray(group.athleteIds) ? group.athleteIds : [];
    const currentlyAssigned = currentAthleteIds.includes(normalizedAthleteId);
    const shouldBeAssigned = selectedSet.has(group.id);

    if (currentlyAssigned === shouldBeAssigned) {
      return group;
    }

    changed = true;
    const nextAthleteIds = shouldBeAssigned
      ? Array.from(new Set([...currentAthleteIds, normalizedAthleteId]))
      : currentAthleteIds.filter((groupAthleteId) => groupAthleteId !== normalizedAthleteId);

    return {
      ...group,
      athleteIds: nextAthleteIds,
      updatedAt: now
    };
  });

  return changed;
}

function resetAthleteForm() {
  athleteForm.reset();
  setAthleteGenderSelection("M");
  athleteForm.elements.country.value = "Deutschland";
  renderAthleteGroupSelection(getDefaultAthleteGroupSelectionForCreate());
}

function fillAthleteForm(athlete) {
  athleteForm.elements.firstName.value = athlete.firstName;
  athleteForm.elements.lastName.value = athlete.lastName;
  setAthleteGenderSelection(athlete.gender);
  athleteForm.elements.birthDate.value = athlete.birthDate;
  athleteForm.elements.dsaId.value = athlete.dsaId;
  athleteForm.elements.zip.value = athlete.zip;
  athleteForm.elements.city.value = athlete.city;
  athleteForm.elements.country.value = athlete.country;
  renderAthleteGroupSelection(getGroupIdsForAthlete(athlete.id));
}

function setAthleteGenderSelection(genderValue) {
  const normalizedGender = normalizeText(genderValue).toUpperCase() === "W" ? "W" : "M";

  if (athleteGenderInput) {
    athleteGenderInput.value = normalizedGender;
  }

  if (!athleteGenderToggle) {
    return;
  }

  const genderButtons = athleteGenderToggle.querySelectorAll(".athlete-gender-btn[data-gender-value]");
  for (const button of genderButtons) {
    const buttonGender = normalizeText(button.dataset.genderValue).toUpperCase();
    const isActive = buttonGender === normalizedGender;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }
}

function wireAthleteGenderSelection() {
  if (!athleteGenderToggle) {
    return;
  }

  athleteGenderToggle.addEventListener("click", (event) => {
    const button = event.target.closest(".athlete-gender-btn[data-gender-value]");
    if (!button) {
      return;
    }

    setAthleteGenderSelection(button.dataset.genderValue || "M");
  });
}

function createTrainingSlotRow(slot = null) {
  const row = document.createElement("div");
  row.className = "group-slot-row";
  row.dataset.slotId = normalizeText(slot?.id) || createId();

  const weekdayLabel = document.createElement("label");
  const weekdayText = document.createElement("span");
  weekdayText.textContent = "Wochentag";
  const weekdaySelect = document.createElement("select");
  weekdaySelect.className = "group-slot-weekday";
  const weekdayPlaceholder = document.createElement("option");
  weekdayPlaceholder.value = "";
  weekdayPlaceholder.textContent = "Bitte waehlen";
  weekdaySelect.append(weekdayPlaceholder);
  for (const weekday of WEEKDAY_OPTIONS) {
    const option = document.createElement("option");
    option.value = String(weekday.value);
    option.textContent = weekday.label;
    weekdaySelect.append(option);
  }
  if (Number.isInteger(Number(slot?.weekday))) {
    weekdaySelect.value = String(Number(slot.weekday));
  }
  weekdayLabel.append(weekdayText, weekdaySelect);

  const startLabel = document.createElement("label");
  const startText = document.createElement("span");
  startText.textContent = "Start";
  const startInput = document.createElement("input");
  startInput.type = "time";
  startInput.className = "group-slot-start";
  startInput.value = normalizeTimeValue(slot?.startTime);
  startLabel.append(startText, startInput);

  const endLabel = document.createElement("label");
  const endText = document.createElement("span");
  endText.textContent = "Ende";
  const endInput = document.createElement("input");
  endInput.type = "time";
  endInput.className = "group-slot-end";
  endInput.value = normalizeTimeValue(slot?.endTime);
  endLabel.append(endText, endInput);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "group-slot-remove";
  removeButton.textContent = "Entfernen";
  removeButton.addEventListener("click", () => {
    row.remove();
    updateGroupTrainingSlotsEmptyState();
  });

  row.append(weekdayLabel, startLabel, endLabel, removeButton);
  return row;
}

function updateGroupTrainingSlotsEmptyState() {
  if (!groupTrainingSlots) {
    return;
  }

  const hasRows = groupTrainingSlots.querySelector(".group-slot-row");
  const existingNote = groupTrainingSlots.querySelector(".group-slot-empty-note");

  if (hasRows) {
    if (existingNote) {
      existingNote.remove();
    }
    return;
  }

  if (existingNote) {
    return;
  }

  const emptyNote = document.createElement("p");
  emptyNote.className = "group-empty-note group-slot-empty-note";
  emptyNote.textContent = "Keine Trainingszeiten hinterlegt (optional).";
  groupTrainingSlots.append(emptyNote);
}

function addGroupTrainingSlotRow(slot = null) {
  if (!groupTrainingSlots) {
    return;
  }

  const existingNote = groupTrainingSlots.querySelector(".group-slot-empty-note");
  if (existingNote) {
    existingNote.remove();
  }

  groupTrainingSlots.append(createTrainingSlotRow(slot));
}

function renderGroupTrainingSlots(slots = []) {
  if (!groupTrainingSlots) {
    return;
  }

  groupTrainingSlots.innerHTML = "";

  const normalizedSlots = Array.isArray(slots) ? slots.map((slot) => normalizeTrainingSlot(slot)).filter(Boolean) : [];
  for (const slot of normalizedSlots) {
    addGroupTrainingSlotRow(slot);
  }

  updateGroupTrainingSlotsEmptyState();
}

function renderGroupAthleteSelection(selectedAthleteIds = []) {
  if (!groupAthleteSelection) {
    return;
  }

  groupAthleteSelection.innerHTML = "";
  const selectedSet = new Set((Array.isArray(selectedAthleteIds) ? selectedAthleteIds : []).map((athleteId) => normalizeText(athleteId)).filter(Boolean));
  const sortedAthletes = [...state.athletes].sort((left, right) => {
    const byFirstName = left.firstName.localeCompare(right.firstName, "de");
    if (byFirstName !== 0) {
      return byFirstName;
    }

    return left.lastName.localeCompare(right.lastName, "de");
  });

  if (sortedAthletes.length === 0) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note";
    empty.textContent = "Noch keine Athleten vorhanden. Lege zuerst Athleten an.";
    groupAthleteSelection.append(empty);
    return;
  }

  for (const athlete of sortedAthletes) {
    const label = document.createElement("label");
    label.className = "group-athlete-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "group-athlete-checkbox";
    checkbox.value = athlete.id;
    checkbox.checked = selectedSet.has(athlete.id);

    const main = document.createElement("div");
    main.className = "athlete-main";

    const name = document.createElement("h3");
    name.textContent = athleteDisplayName(athlete) || "Unbenannter Athlet";

    const requirementGroup = getRequirementGroupForAthlete(athlete);
    const categoryLevels = getAthleteCategoryLevels(athlete, requirementGroup);
    const statusIcons = createAthleteStatusIconsElement(categoryLevels);

    const side = document.createElement("div");
    side.className = "group-athlete-side";

    const code = document.createElement("span");
    code.className = "age-chip";
    code.textContent = athleteCode(athlete);

    main.append(name, statusIcons);
    side.append(code);
    label.append(checkbox, main, side);

    const updateSelectionState = () => {
      const isSelected = checkbox.checked;
      label.classList.toggle("is-selected", isSelected);
      label.classList.toggle("is-unselected", !isSelected);
    };

    updateSelectionState();
    checkbox.addEventListener("change", updateSelectionState);

    groupAthleteSelection.append(label);
  }
}

function resetGroupForm() {
  if (groupForm) {
    groupForm.reset();
  }
  if (groupNameInput) {
    groupNameInput.value = "";
  }

  renderGroupAthleteSelection([]);
  renderGroupTrainingSlots([]);
}

function fillGroupForm(group) {
  if (!group) {
    resetGroupForm();
    return;
  }

  if (groupNameInput) {
    groupNameInput.value = group.name;
  }

  renderGroupAthleteSelection(group.athleteIds || []);
  renderGroupTrainingSlots(group.trainingSlots || []);
}

function isGroupEditorVisible() {
  return !!groupFormWrap && !groupFormWrap.hidden;
}

function setGroupEditorVisibility(visible) {
  if (!groupFormWrap) {
    return;
  }

  groupFormWrap.hidden = !visible;
}

function updateGroupModalState() {
  const group = state.groupFormMode === "edit" ? getGroupById(state.editGroupId) : null;
  if (groupModalTitle) {
    groupModalTitle.textContent = "Gruppen";
  }

  if (state.groupFormMode === "edit" && group) {
    if (groupEditorTitle) {
      groupEditorTitle.textContent = `${group.name} bearbeiten`;
    }
    if (saveGroupButton) {
      saveGroupButton.textContent = "Aenderungen speichern";
    }
    if (deleteGroupButton) {
      deleteGroupButton.hidden = false;
    }
  } else {
    if (groupEditorTitle) {
      groupEditorTitle.textContent = "Neue Gruppe";
    }
    if (saveGroupButton) {
      saveGroupButton.textContent = "Speichern";
    }
    if (deleteGroupButton) {
      deleteGroupButton.hidden = true;
    }
  }
}

function openAthleteModal(mode, athlete = null) {
  state.formMode = mode;
  state.editAthleteId = athlete ? athlete.id : "";
  state.requirementsInspectorOpen = false;

  if (mode === "edit" && athlete) {
    athleteModalTitle.textContent = `${athleteDisplayName(athlete)} bearbeiten`;
    saveAthleteButton.textContent = "Aenderungen speichern";
    deleteAthleteButton.hidden = false;
    fillAthleteForm(athlete);
  } else {
    athleteModalTitle.textContent = "Athlet anlegen";
    saveAthleteButton.textContent = "Speichern";
    deleteAthleteButton.hidden = true;
    resetAthleteForm();
  }

  if (groupModal) {
    groupModal.hidden = true;
  }

  athleteModal.hidden = false;
  updateBodyScrollLock();
  athleteForm.elements.firstName.focus();
}

function openGroupModal(mode, group = null) {
  if (!groupModal) {
    return;
  }

  const openMode = mode === "edit" || mode === "create" ? mode : "selector";
  if (openMode === "edit") {
    const fallbackGroup = state.groups[0] || null;
    const targetGroup = group || getSelectedGroup() || fallbackGroup;
    if (targetGroup) {
      state.groupFormMode = "edit";
      state.editGroupId = targetGroup.id;
      fillGroupForm(targetGroup);
      setGroupEditorVisibility(true);
    } else {
      state.groupFormMode = "create";
      state.editGroupId = "";
      resetGroupForm();
      setGroupEditorVisibility(true);
    }
  } else if (openMode === "create") {
    state.groupFormMode = "create";
    state.editGroupId = "";
    resetGroupForm();
    setGroupEditorVisibility(true);
  } else {
    state.groupFormMode = "create";
    state.editGroupId = "";
    resetGroupForm();
    setGroupEditorVisibility(false);
  }

  updateGroupModalState();
  renderGroupModalFilterList();

  if (athleteModal) {
    athleteModal.hidden = true;
  }
  groupModal.hidden = false;
  updateBodyScrollLock();
  if (openMode !== "selector" && groupNameInput) {
    groupNameInput.focus();
  }
}

function closeGroupModal() {
  if (!groupModal) {
    return;
  }

  groupModal.hidden = true;
  updateBodyScrollLock();

  state.groupFormMode = "create";
  state.editGroupId = "";
  setGroupEditorVisibility(false);
  resetGroupForm();
  updateGroupModalState();
}

function closeAthleteModal() {
  athleteModal.hidden = true;
  updateBodyScrollLock();

  state.formMode = "create";
  state.editAthleteId = "";
  resetAthleteForm();

  deleteAthleteButton.hidden = true;
}

function buildAthleteFromFormData(formData, existingAthlete = null) {
  const now = new Date().toISOString();

  return {
    id: existingAthlete ? existingAthlete.id : createId(),
    firstName: normalizeText(formData.get("firstName")),
    lastName: normalizeText(formData.get("lastName")),
    gender: formData.get("gender") === "W" ? "W" : "M",
    birthDate: normalizeText(formData.get("birthDate")),
    dsaId: normalizeText(formData.get("dsaId")),
    associationBadgeId: normalizeText(existingAthlete?.associationBadgeId),
    associationBadgeLevel: normalizeText(existingAthlete?.associationBadgeLevel),
    swimProofYear: normalizeYearValue(existingAthlete?.swimProofYear),
    swimProofSelection: normalizeText(existingAthlete?.swimProofSelection),
    swimProofPerformance: normalizeText(existingAthlete?.swimProofPerformance),
    zip: normalizeText(formData.get("zip")),
    city: normalizeText(formData.get("city")),
    country: normalizeText(formData.get("country")) || "Deutschland",
    createdAt: existingAthlete ? existingAthlete.createdAt : now,
    performances: existingAthlete ? existingAthlete.performances || {} : {},
    updatedAt: now
  };
}

function validateAthlete(athlete, excludedAthleteId = "") {
  if (!athlete.firstName || !athlete.lastName || !athlete.birthDate) {
    return "Bitte fuelle Vorname, Nachname, Geschlecht und Geburtsdatum aus.";
  }

  if (!["M", "W"].includes(athlete.gender)) {
    return "Bitte waehle ein gueltiges Geschlecht.";
  }

  const duplicateDsa =
    !!athlete.dsaId &&
    state.athletes.some((entry) => entry.id !== excludedAthleteId && entry.dsaId && entry.dsaId.toLowerCase() === athlete.dsaId.toLowerCase());

  if (duplicateDsa) {
    return "Die DSA-ID ist bereits vergeben.";
  }

  return "";
}

function handleAthleteSubmit(event) {
  event.preventDefault();

  const existingAthlete = state.formMode === "edit" ? getSelectedAthlete() : null;
  const selectedGroupIds = getSelectedAthleteGroupIdsFromForm();
  const draft = buildAthleteFromFormData(new FormData(athleteForm), existingAthlete);
  const validationError = validateAthlete(draft, existingAthlete ? existingAthlete.id : "");

  if (validationError) {
    showToast(validationError);
    return;
  }

  if (state.formMode === "edit" && existingAthlete) {
    const index = findAthleteIndexById(existingAthlete.id);
    if (index >= 0) {
      state.athletes[index] = draft;
      state.selectedAthleteId = draft.id;
      showToast("Athlet aktualisiert.");
    }
  } else {
    state.athletes.push(draft);
    state.selectedAthleteId = draft.id;
    showToast("Athlet gespeichert.");
  }

  state.selectedDisciplineKey = "";
  state.editPerformanceId = "";
  closePerformanceModal();

  const groupAssignmentsChanged = applyAthleteGroupAssignments(draft.id, selectedGroupIds);
  syncSelectedAthleteWithVisibleList();

  saveAthletes();
  if (groupAssignmentsChanged) {
    saveGroups();
  }
  closeAthleteModal();
  refreshAthleteViews();
}

function deleteCurrentAthleteFromModal() {
  if (state.formMode !== "edit") {
    return;
  }

  const athlete = getSelectedAthlete();
  if (!athlete) {
    return;
  }

  const confirmed = window.confirm(`Athlet ${athleteDisplayName(athlete)} wirklich loeschen?`);
  if (!confirmed) {
    return;
  }

  state.athletes = state.athletes.filter((entry) => entry.id !== athlete.id);
  state.groups = state.groups.map((group) => ({
    ...group,
    athleteIds: (group.athleteIds || []).filter((athleteId) => athleteId !== athlete.id)
  }));

  state.selectedAthleteId = "";
  state.selectedDisciplineKey = "";
  state.editPerformanceId = "";
  closePerformanceModal();

  saveAthletes();
  saveGroups();
  closeAthleteModal();
  refreshAthleteViews();
  showToast("Athlet geloescht.");
}

function buildGroupFromFormData(existingGroup = null) {
  const now = new Date().toISOString();
  const selectedAthleteIds = groupAthleteSelection
    ? Array.from(groupAthleteSelection.querySelectorAll("input[type='checkbox']:checked")).map((checkbox) => normalizeText(checkbox.value)).filter(Boolean)
    : [];

  const trainingSlots = [];
  if (groupTrainingSlots) {
    const rows = Array.from(groupTrainingSlots.querySelectorAll(".group-slot-row"));
    for (const row of rows) {
      const weekdayValue = normalizeText(row.querySelector(".group-slot-weekday")?.value);
      const startValue = normalizeTimeValue(row.querySelector(".group-slot-start")?.value);
      const endValue = normalizeTimeValue(row.querySelector(".group-slot-end")?.value);
      const hasAnyValue = !!weekdayValue || !!startValue || !!endValue;

      if (!hasAnyValue) {
        continue;
      }

      if (!weekdayValue || !startValue || !endValue) {
        return {
          ok: false,
          message: "Bitte pro Trainingszeit Wochentag, Start und Ende angeben."
        };
      }

      if (endValue <= startValue) {
        return {
          ok: false,
          message: "Die Endzeit muss spaeter als die Startzeit sein."
        };
      }

      trainingSlots.push({
        id: normalizeText(row.dataset.slotId) || createId(),
        weekday: Number(weekdayValue),
        startTime: startValue,
        endTime: endValue
      });
    }
  }

  return {
    ok: true,
    group: {
      id: existingGroup ? existingGroup.id : createId(),
      name: normalizeText(groupNameInput?.value),
      athleteIds: Array.from(new Set(selectedAthleteIds)),
      trainingSlots,
      createdAt: existingGroup ? existingGroup.createdAt : now,
      updatedAt: now
    }
  };
}

function validateGroup(group, excludedGroupId = "") {
  if (!group.name) {
    return "Bitte einen Gruppennamen eingeben.";
  }

  const duplicateName = state.groups.some(
    (entry) => entry.id !== excludedGroupId && normalizeText(entry.name).toLowerCase() === normalizeText(group.name).toLowerCase()
  );
  if (duplicateName) {
    return "Eine Gruppe mit diesem Namen existiert bereits.";
  }

  return "";
}

function handleGroupSubmit(event) {
  event.preventDefault();

  const existingGroup = state.groupFormMode === "edit" ? getGroupById(state.editGroupId) : null;
  const buildResult = buildGroupFromFormData(existingGroup);
  if (!buildResult.ok) {
    showToast(buildResult.message);
    return;
  }

  const validationError = validateGroup(buildResult.group, existingGroup ? existingGroup.id : "");
  if (validationError) {
    showToast(validationError);
    return;
  }

  if (existingGroup) {
    const index = state.groups.findIndex((entry) => entry.id === existingGroup.id);
    if (index >= 0) {
      state.groups[index] = buildResult.group;
    }
    showToast("Gruppe aktualisiert.");
  } else {
    state.groups.push(buildResult.group);
    showToast("Gruppe gespeichert.");
  }

  state.selectedGroupId = buildResult.group.id;
  state.groupFilterManuallySet = true;

  saveGroups();
  setSelectedGroupFilter(buildResult.group.id, { manual: true });
  state.groupFormMode = "create";
  state.editGroupId = "";
  setGroupEditorVisibility(false);
  resetGroupForm();
  updateGroupModalState();
  renderGroupModalFilterList();
}

function deleteCurrentGroupFromModal() {
  if (state.groupFormMode !== "edit") {
    return;
  }

  const group = getGroupById(state.editGroupId);
  if (!group) {
    return;
  }

  const confirmed = window.confirm(`Gruppe ${group.name} wirklich loeschen?`);
  if (!confirmed) {
    return;
  }

  state.groups = state.groups.filter((entry) => entry.id !== group.id);
  if (state.selectedGroupId === group.id) {
    state.selectedGroupId = "";
    state.groupFilterManuallySet = false;
  }

  saveGroups();
  state.groupFormMode = "create";
  state.editGroupId = "";
  setGroupEditorVisibility(false);
  resetGroupForm();
  updateGroupModalState();
  renderGroupModalFilterList();
  refreshAthleteViews();
  showToast("Gruppe geloescht.");
}

async function loadRequirementsData() {
  for (const filePath of REQUIREMENT_FILE_CANDIDATES) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        continue;
      }

      const payload = await response.json();
      if (!payload || !Array.isArray(payload.groups)) {
        continue;
      }

      state.requirements = payload;
      state.requirementFile = filePath;
      return;
    } catch (_error) {
      // Try next candidate file.
    }
  }

  state.requirements = null;
  state.requirementFile = "";
}

function getRequirementAgeForAthlete(athlete) {
  const referenceYear = getRequirementYear();
  return calculateYearGroupFromBirthDate(athlete.birthDate, referenceYear);
}

function getRequirementGroupForAthlete(athlete) {
  const groups = state.requirements?.groups;
  if (!Array.isArray(groups)) {
    return null;
  }

  const age = getRequirementAgeForAthlete(athlete);
  if (age === "-") {
    return null;
  }

  return (
    groups.find(
      (group) =>
        group.gender === athlete.gender &&
        Number.isFinite(Number(group.ageMin)) &&
        Number.isFinite(Number(group.ageMax)) &&
        age >= Number(group.ageMin) &&
        age <= Number(group.ageMax)
    ) || null
  );
}

function getSwimProofPolicyValue(policyKey, fallbackValue) {
  const policies = state.requirements?.swimProofRequirements?.policies;
  if (!Array.isArray(policies)) {
    return fallbackValue;
  }

  const matchingPolicy = policies.find((policy) => policy.policyKey === policyKey);
  if (!matchingPolicy || matchingPolicy.value === undefined) {
    return fallbackValue;
  }

  return matchingPolicy.value;
}

function getSwimProofBands() {
  const bands = state.requirements?.swimProofRequirements?.bands;
  return Array.isArray(bands) ? bands : [];
}

function getSwimProofBandForAge(age) {
  const numericAge = Number(age);
  if (!Number.isFinite(numericAge)) {
    return null;
  }

  return (
    getSwimProofBands().find((band) => {
      const ageMin = Number(band.ageMin);
      const ageMax = Number(band.ageMax);
      if (!Number.isFinite(ageMin) || !Number.isFinite(ageMax)) {
        return false;
      }

      return numericAge >= ageMin && numericAge <= ageMax;
    }) || null
  );
}

function getSwimProofBandForAthlete(athlete) {
  const age = getRequirementAgeForAthlete(athlete);
  return getSwimProofBandForAge(age);
}

function getSwimProofOptionsForBand(band) {
  if (!band || typeof band !== "object") {
    return [];
  }

  const requiredProofs = Array.isArray(band.requiredProofs)
    ? band.requiredProofs.map((proof) => ({ ...proof, proofGroup: "required" }))
    : [];
  const alternativeProofs = Array.isArray(band.alternativeProofs)
    ? band.alternativeProofs.map((proof) => ({ ...proof, proofGroup: "alternative" }))
    : [];

  return [...requiredProofs, ...alternativeProofs];
}

function getSwimProofOptionByKey(band, proofKey) {
  if (!proofKey) {
    return null;
  }

  return getSwimProofOptionsForBand(band).find((proof) => proof.proofKey === proofKey) || null;
}

function getAllSwimProofOptions() {
  const uniqueByKey = new Map();

  for (const band of getSwimProofBands()) {
    for (const proof of getSwimProofOptionsForBand(band)) {
      if (!proof?.proofKey || uniqueByKey.has(proof.proofKey)) {
        continue;
      }

      uniqueByKey.set(proof.proofKey, proof);
    }
  }

  return Array.from(uniqueByKey.values());
}

function getAssociationBadgeEntries() {
  const categories = state.requirements?.associationBadges?.categories;
  if (!categories || typeof categories !== "object") {
    return [];
  }

  const entries = [];

  for (const [categoryName, badges] of Object.entries(categories)) {
    if (!Array.isArray(badges)) {
      continue;
    }

    for (const badge of badges) {
      if (!badge || typeof badge !== "object") {
        continue;
      }

      entries.push({
        ...badge,
        category: categoryName
      });
    }
  }

  return entries;
}

function getAssociationBadgeEntryById(badgeId) {
  if (!badgeId) {
    return null;
  }

  return getAssociationBadgeEntries().find((entry) => entry.badgeId === badgeId) || null;
}

function getBadgeMedalRank(levelValue) {
  const normalized = normalizeText(levelValue).toLowerCase();
  if (!normalized) {
    return 0;
  }

  if (normalized.includes("gold")) {
    return 3;
  }

  if (normalized.includes("silber")) {
    return 2;
  }

  if (normalized.includes("bronze")) {
    return 1;
  }

  return 0;
}

function normalizeBadgeMedalLevel(levelValue) {
  const normalized = normalizeText(levelValue).toLowerCase();
  if (!normalized) {
    return "";
  }

  if (normalized === "3" || normalized === "g" || normalized.includes("gold")) {
    return "Gold";
  }

  if (normalized === "2" || normalized === "s" || normalized.includes("silber")) {
    return "Silber";
  }

  if (normalized === "1" || normalized === "b" || normalized.includes("bronze")) {
    return "Bronze";
  }

  return "";
}

function getBadgeStageNumber(levelValue) {
  const normalized = normalizeText(levelValue);
  if (!normalized) {
    return NaN;
  }

  const match = normalized.match(/(?:stufe\s*)?(\d+)/i);
  if (!match) {
    return NaN;
  }

  const stage = Number(match[1]);
  return Number.isFinite(stage) ? stage : NaN;
}

function isAssociationBadgeLevelSufficient(requiredLevel, athleteLevel) {
  const normalizedRequired = normalizeText(requiredLevel);
  if (!normalizedRequired) {
    return true;
  }

  const normalizedAthleteLevel = normalizeText(athleteLevel);
  if (!normalizedAthleteLevel) {
    return false;
  }

  if (normalizedAthleteLevel.toLowerCase() === "gold") {
    return true;
  }

  const requiredMedalRank = getBadgeMedalRank(normalizedRequired);
  const athleteMedalRank = getBadgeMedalRank(normalizedAthleteLevel);
  if (requiredMedalRank > 0 && athleteMedalRank > 0) {
    return athleteMedalRank >= requiredMedalRank;
  }

  const requiredStage = getBadgeStageNumber(normalizedRequired);
  const athleteStage = getBadgeStageNumber(normalizedAthleteLevel);
  if (Number.isFinite(requiredStage) && Number.isFinite(athleteStage)) {
    return athleteStage >= requiredStage;
  }

  return normalizedAthleteLevel.toLowerCase().includes(normalizedRequired.toLowerCase());
}

function getAssociationBadgeRuleStorageKey(categoryName) {
  return `${ASSOCIATION_BADGE_VIRTUAL_PREFIX}::${categoryName}`;
}

function isAssociationBadgeRuleStorageKey(ruleStorageKey) {
  return normalizeText(ruleStorageKey).startsWith(`${ASSOCIATION_BADGE_VIRTUAL_PREFIX}::`);
}

function getAssociationBadgeCategoryFromStorageKey(ruleStorageKey) {
  if (!isAssociationBadgeRuleStorageKey(ruleStorageKey)) {
    return "";
  }

  return normalizeText(ruleStorageKey).slice(`${ASSOCIATION_BADGE_VIRTUAL_PREFIX}::`.length);
}

function getAssociationBadgeEntriesForCategory(categoryName, athlete = null) {
  const normalizedCategory = normalizeText(categoryName);
  if (!normalizedCategory) {
    return [];
  }

  const athleteAge = athlete ? Number(getRequirementAgeForAthlete(athlete)) : NaN;

  return getAssociationBadgeEntries()
    .filter((entry) => normalizeText(entry.category) === normalizedCategory)
    .filter((entry) => {
      if (!Number.isFinite(athleteAge)) {
        return true;
      }

      const ageMin = toOptionalNumber(entry.ageMin);
      const ageMax = toOptionalNumber(entry.ageMax);
      if (Number.isFinite(ageMin) && athleteAge < ageMin) {
        return false;
      }
      if (Number.isFinite(ageMax) && athleteAge > ageMax) {
        return false;
      }

      return true;
    });
}

function getAssociationBadgeLatestEntryForCategory(athlete, categoryName) {
  if (!athlete || !categoryName) {
    return null;
  }

  const entries = getPerformanceEntries(athlete, getAssociationBadgeRuleStorageKey(categoryName));
  if (entries.length === 0) {
    return null;
  }

  return entries
    .slice()
    .sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime())[0];
}

function evaluateAssociationBadgeStatusForMeta(athlete, categoryName, badgeId, badgeLevel) {
  if (!athlete || !badgeId) {
    return null;
  }

  const badge = getAssociationBadgeEntryById(badgeId);
  if (!badge) {
    return {
      valid: false,
      message: "Das gewaehlte Verbandsabzeichen ist in den Anforderungen nicht vorhanden.",
      category: normalizeText(categoryName),
      recognizedLevel: "Gold",
      badgeName: ""
    };
  }

  const categoryMismatch = normalizeText(categoryName) && normalizeText(badge.category) !== normalizeText(categoryName);
  if (categoryMismatch) {
    return {
      valid: false,
      message: `${badge.badgeName} gehoert nicht zur Kategorie ${categoryName}.`,
      category: normalizeText(categoryName),
      recognizedLevel: badge.recognizedDsaLevel || state.requirements?.associationBadges?.recognizedDsaLevel || "Gold",
      badgeName: badge.badgeName,
      organization: badge.organization
    };
  }

  const athleteAge = getRequirementAgeForAthlete(athlete);
  const numericAge = Number(athleteAge);
  const ageMin = toOptionalNumber(badge.ageMin);
  const ageMax = toOptionalNumber(badge.ageMax);
  const ageWithinMin = !Number.isFinite(ageMin) || (Number.isFinite(numericAge) && numericAge >= ageMin);
  const ageWithinMax = !Number.isFinite(ageMax) || (Number.isFinite(numericAge) && numericAge <= ageMax);

  if (!ageWithinMin || !ageWithinMax) {
    const ageTextParts = [];
    if (Number.isFinite(ageMin)) {
      ageTextParts.push(`ab ${ageMin}`);
    }
    if (Number.isFinite(ageMax)) {
      ageTextParts.push(`bis ${ageMax}`);
    }

    return {
      valid: false,
      message: `${badge.badgeName} ist nur ${ageTextParts.join(" ")} Jahre gueltig.`,
      category: badge.category,
      recognizedLevel: badge.recognizedDsaLevel || state.requirements?.associationBadges?.recognizedDsaLevel || "Gold",
      badgeName: badge.badgeName,
      organization: badge.organization
    };
  }

  const hasRequiredLevel = isAssociationBadgeLevelSufficient(badge.minLevel, badgeLevel);
  if (!hasRequiredLevel) {
    return {
      valid: false,
      message: badge.minLevel
        ? `${badge.badgeName} erfordert mindestens ${badge.minLevel}.`
        : `${badge.badgeName} erfordert eine gueltige Stufe.`,
      category: badge.category,
      recognizedLevel: badge.recognizedDsaLevel || state.requirements?.associationBadges?.recognizedDsaLevel || "Gold",
      badgeName: badge.badgeName,
      organization: badge.organization
    };
  }

  const recognizedLevel = badge.recognizedDsaLevel || state.requirements?.associationBadges?.recognizedDsaLevel || "Gold";
  const validLevel = ["Bronze", "Silber", "Gold"].includes(recognizedLevel) ? recognizedLevel : "Gold";

  return {
    valid: true,
    message: "",
    category: badge.category,
    recognizedLevel: validLevel,
    badgeName: badge.badgeName,
    organization: badge.organization
  };
}

function getAssociationBadgeStatusForCategory(athlete, categoryName) {
  if (!athlete || !categoryName) {
    return null;
  }

  const latestEntry = getAssociationBadgeLatestEntryForCategory(athlete, categoryName);
  if (!latestEntry) {
    return null;
  }

  const badgeId = normalizeText(latestEntry.meta?.badgeId);
  const badgeLevel = normalizeText(latestEntry.meta?.badgeLevel);
  const status = evaluateAssociationBadgeStatusForMeta(athlete, categoryName, badgeId, badgeLevel);
  if (!status) {
    return null;
  }

  return {
    ...status,
    category: categoryName,
    badgeId,
    badgeLevel,
    entry: latestEntry
  };
}

function getAssociationBadgeStatus(athlete) {
  if (!athlete) {
    return null;
  }

  let fallbackStatus = null;
  for (const categoryName of CATEGORY_ORDER) {
    const status = getAssociationBadgeStatusForCategory(athlete, categoryName);
    if (!status) {
      continue;
    }

    if (status.valid) {
      return status;
    }

    if (!fallbackStatus) {
      fallbackStatus = status;
    }
  }

  return fallbackStatus;
}

function formatAssociationBadgeOptionLabel(entry) {
  const details = [];

  if (normalizeText(entry.minLevel)) {
    details.push(`mind. ${entry.minLevel}`);
  }

  const ageMin = toOptionalNumber(entry.ageMin);
  const ageMax = toOptionalNumber(entry.ageMax);
  if (Number.isFinite(ageMin) || Number.isFinite(ageMax)) {
    if (Number.isFinite(ageMin) && Number.isFinite(ageMax)) {
      details.push(`${ageMin}-${ageMax} J.`);
    } else if (Number.isFinite(ageMin)) {
      details.push(`ab ${ageMin} J.`);
    } else if (Number.isFinite(ageMax)) {
      details.push(`bis ${ageMax} J.`);
    }
  }

  const detailText = details.length > 0 ? ` | ${details.join(" | ")}` : "";
  return `${entry.badgeName} (${entry.organization})${detailText}`;
}

function formatSwimProofOptionLabel(proof) {
  const details = [];

  if (Number.isFinite(Number(proof.distanceM))) {
    details.push(`${Number(proof.distanceM)} m`);
  }

  if (Number.isFinite(Number(proof.maxTimeSec))) {
    details.push(`max ${formatMinutesSecondsInput(Number(proof.maxTimeSec))}`);
  }

  if (normalizeText(proof.minLevel)) {
    details.push(`mind. ${proof.minLevel}`);
  }

  if (Number.isFinite(Number(proof.durationMin))) {
    details.push(`${Number(proof.durationMin)} min`);
  }

  const typeLabelMap = {
    performance: "Leistung",
    alternative: "Alternative",
    badge: "Abzeichen"
  };

  const typeLabel = typeLabelMap[proof.proofType] || "Nachweis";
  const detailText = details.length > 0 ? ` | ${details.join(" | ")}` : "";
  return `${proof.proofName} (${typeLabel}${detailText})`;
}

function isSwimmingRule(rule) {
  if (!rule || typeof rule !== "object") {
    return false;
  }

  const text = `${rule.disciplineName || ""} ${rule.disciplineKey || ""} ${rule.disciplineBaseName || ""}`.toLowerCase();
  return text.includes("schwimm");
}

function extractDistanceMetersFromRule(rule) {
  const disciplineName = normalizeText(rule?.disciplineName);
  if (!disciplineName) {
    return NaN;
  }

  const kmMatch = disciplineName.match(/(\d+(?:[\.,]\d+)?)\s*km/i);
  if (kmMatch) {
    const kmValue = parseLocaleNumberSmart(kmMatch[1]);
    if (Number.isFinite(kmValue)) {
      return kmValue * 1000;
    }
  }

  const meterMatches = Array.from(disciplineName.matchAll(/(\d+(?:[\.,]\d+)?)\s*m\b/gi));
  if (meterMatches.length === 0) {
    return NaN;
  }

  const numericDistances = meterMatches
    .map((match) => parseLocaleNumberSmart(match[1]))
    .filter((value) => Number.isFinite(value));

  if (numericDistances.length === 0) {
    return NaN;
  }

  return Math.max(...numericDistances);
}

function getPreferredCategoryForSwimProof(proof) {
  const proofKey = normalizeText(proof?.proofKey);
  if (!proofKey) {
    return "";
  }

  if (proofKey.startsWith("speed_")) {
    return "Schnelligkeit";
  }

  if (proofKey.startsWith("endurance_")) {
    return "Ausdauer";
  }

  return "";
}

function isSwimProofBadge(proof) {
  return normalizeText(proof?.proofType).toLowerCase() === "badge";
}

function isSwimProofBadgeLevelRequired(proof) {
  if (!isSwimProofBadge(proof)) {
    return false;
  }

  return normalizeText(proof?.proofKey) === "deutsches_schwimmabzeichen";
}

function normalizeSwimBadgeName(value) {
  return normalizeText(value).toLowerCase();
}

function isAssociationBadgeLevelSelectionRequired(badge) {
  return getBadgeMedalRank(badge?.minLevel) > 0;
}

function allowsAssociationBadgeEvidenceOnly(categoryName, badge) {
  if (normalizeText(categoryName) !== "Ausdauer") {
    return false;
  }

  return normalizeSwimBadgeName(badge?.badgeName) === "deutsches schwimmabzeichen";
}

function findSwimProofBadgeOptionByName(band, badgeName) {
  const normalizedBadgeName = normalizeSwimBadgeName(badgeName);
  if (!normalizedBadgeName) {
    return null;
  }

  return (
    getSwimProofOptionsForBand(band)
      .filter((proof) => isSwimProofBadge(proof))
      .find((proof) => normalizeSwimBadgeName(proof.proofName) === normalizedBadgeName) || null
  );
}

function findAssociationBadgeEntryForSwimProof(athlete, categoryName, proof) {
  if (!athlete || !proof) {
    return null;
  }

  const normalizedProofName = normalizeSwimBadgeName(proof.proofName);
  if (!normalizedProofName) {
    return null;
  }

  return (
    getAssociationBadgeEntriesForCategory(categoryName, athlete).find((entry) => normalizeSwimBadgeName(entry.badgeName) === normalizedProofName) || null
  );
}

function findAssociationBadgeMatchForProof(athlete, band, proof, categoryName = "Ausdauer") {
  if (!athlete || !isSwimProofBadge(proof)) {
    return null;
  }

  const proofForBand = getSwimProofOptionByKey(band, proof.proofKey) || findSwimProofBadgeOptionByName(band, proof.proofName);
  if (!proofForBand) {
    return null;
  }

  const normalizedProofName = normalizeSwimBadgeName(proof.proofName);
  const associationStorageKey = getAssociationBadgeRuleStorageKey(categoryName);
  const associationEntries = getPerformanceEntries(athlete, associationStorageKey);
  if (associationEntries.length === 0) {
    return null;
  }

  const matchingEntries = associationEntries.filter((entry) => {
    const entryBadgeId = normalizeText(entry.meta?.badgeId);
    if (entryBadgeId) {
      const badgeDefinition = getAssociationBadgeEntryById(entryBadgeId);
      if (badgeDefinition && normalizeSwimBadgeName(badgeDefinition.badgeName) === normalizedProofName) {
        return true;
      }
    }

    const entryBadgeName = normalizeSwimBadgeName(entry.meta?.badgeName || entry.valueInput);
    return entryBadgeName === normalizedProofName;
  });

  if (matchingEntries.length === 0) {
    return null;
  }

  const newestEntry = matchingEntries
    .slice()
    .sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime())[0];

  const measuredAt = new Date(newestEntry.measuredAt);
  const measuredYear = Number.isNaN(measuredAt.getTime()) ? "" : String(measuredAt.getFullYear());

  return {
    proof,
    rule: null,
    entry: newestEntry,
    year: measuredYear,
    measuredAtIso: newestEntry.measuredAt,
    performanceText: normalizeText(newestEntry.meta?.badgeName || newestEntry.valueInput || proof.proofName),
    level: normalizeText(newestEntry.meta?.recognizedLevel || newestEntry.meta?.badgeLevel || "Gold"),
    linkedRuleKey: associationStorageKey
  };
}

function findLinkedSwimProofMatchForProof(athlete, requirementGroup, band, proof) {
  if (!proof) {
    return null;
  }

  if (isSwimProofBadge(proof)) {
    return findAssociationBadgeMatchForProof(athlete, band, proof);
  }

  return findPerformanceMatchForProof(athlete, requirementGroup, proof);
}

function findPerformanceMatchForProof(athlete, requirementGroup, proof) {
  if (!athlete || !requirementGroup || !proof) {
    return null;
  }

  const preferredCategory = getPreferredCategoryForSwimProof(proof);
  const rules = Array.isArray(requirementGroup.disciplines) ? requirementGroup.disciplines : [];
  const candidates = [];

  for (const rule of rules) {
    if (!isSwimmingRule(rule)) {
      continue;
    }

    if (preferredCategory && rule.category !== preferredCategory) {
      continue;
    }

    const requiredDistance = Number(proof.distanceM);
    const disciplineDistance = extractDistanceMetersFromRule(rule);
    if (Number.isFinite(requiredDistance)) {
      if (!Number.isFinite(disciplineDistance)) {
        continue;
      }

      const isSpeedProof = normalizeText(proof.proofKey).startsWith("speed_");
      if (isSpeedProof && Math.abs(disciplineDistance - requiredDistance) > 0.5) {
        continue;
      }

      if (!isSpeedProof && disciplineDistance < requiredDistance) {
        continue;
      }
    }

    const entries = getPerformanceEntries(athlete, getRuleStorageKey(rule));
    const bestEntry = getBestPerformanceEntry(rule, entries);
    if (!bestEntry) {
      continue;
    }

    const level = evaluatePerformanceLevel(rule, bestEntry.valueNormalized);
    if (normalizeText(proof.minLevel) && getLevelRank(level) < getLevelRank(proof.minLevel)) {
      continue;
    }

    const maxTimeSeconds = Number(proof.maxTimeSec);
    if (Number.isFinite(maxTimeSeconds)) {
      const measuredValue = Number(bestEntry.valueNormalized);
      if (!Number.isFinite(measuredValue) || rule.better !== "lower" || measuredValue > maxTimeSeconds) {
        continue;
      }
    }

    const minDurationMinutes = Number(proof.durationMin);
    if (Number.isFinite(minDurationMinutes) && rule.better === "higher") {
      const measuredValue = Number(bestEntry.valueNormalized);
      if (!Number.isFinite(measuredValue) || measuredValue < minDurationMinutes * 60) {
        continue;
      }
    }

    const measuredAt = new Date(bestEntry.measuredAt);
    const measuredYear = Number.isNaN(measuredAt.getTime()) ? "" : String(measuredAt.getFullYear());

    candidates.push({
      proof,
      rule,
      entry: bestEntry,
      year: measuredYear,
      measuredAtIso: bestEntry.measuredAt,
      performanceText: formatNormalizedValue(rule, bestEntry.valueNormalized, bestEntry.valueInput),
      level
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  return candidates.reduce((best, current) => {
    const bestTime = new Date(best.measuredAtIso).getTime();
    const currentTime = new Date(current.measuredAtIso).getTime();
    if (currentTime > bestTime) {
      return current;
    }

    return best;
  });
}

function findAutomaticSwimProofMatch(athlete, requirementGroup, band, selectedProofKey = "") {
  if (!band || !requirementGroup) {
    return null;
  }

  const collectMatches = (proofs) => {
    if (!Array.isArray(proofs)) {
      return [];
    }

    return proofs
      .map((proof) => findLinkedSwimProofMatchForProof(athlete, requirementGroup, band, proof))
      .filter(Boolean);
  };

  const pickNewest = (matches) => {
    if (matches.length === 0) {
      return null;
    }

    return matches.reduce((best, current) => {
      const bestTime = new Date(best.measuredAtIso).getTime();
      const currentTime = new Date(current.measuredAtIso).getTime();
      return currentTime > bestTime ? current : best;
    });
  };

  if (selectedProofKey && selectedProofKey !== AUTO_SWIM_PROOF_OPTION) {
    const selectedProof = getSwimProofOptionByKey(band, selectedProofKey);
    if (!selectedProof) {
      return null;
    }

    return findLinkedSwimProofMatchForProof(athlete, requirementGroup, band, selectedProof);
  }

  const requiredMatches = collectMatches(band.requiredProofs);
  const newestRequiredMatch = pickNewest(requiredMatches);
  if (newestRequiredMatch) {
    return newestRequiredMatch;
  }

  const alternativeMatches = collectMatches(band.alternativeProofs);
  return pickNewest(alternativeMatches);
}

function hasLinkedSourceEntry(athlete, linkedRuleKey, linkedEntryId) {
  const normalizedRuleKey = normalizeText(linkedRuleKey);
  const normalizedEntryId = normalizeText(linkedEntryId);
  if (!normalizedRuleKey || !normalizedEntryId) {
    return false;
  }

  return getPerformanceEntries(athlete, normalizedRuleKey).some((entry) => entry.id === normalizedEntryId);
}

function isOrphanedLinkedSwimProofEntry(athlete, entry) {
  if (!entry || !entry.meta) {
    return false;
  }

  const linkedRuleKey = normalizeText(entry.meta.linkedRuleKey);
  const linkedEntryId = normalizeText(entry.meta.linkedEntryId);
  if (!linkedRuleKey || !linkedEntryId) {
    return false;
  }

  return !hasLinkedSourceEntry(athlete, linkedRuleKey, linkedEntryId);
}

function getSwimProofManualEntries(athlete) {
  if (!athlete) {
    return [];
  }

  return getPerformanceEntries(athlete, SWIM_PROOF_VIRTUAL_KEY).filter((entry) => !isOrphanedLinkedSwimProofEntry(athlete, entry));
}

function getLatestSwimProofManualEntry(athlete) {
  const entries = getSwimProofManualEntries(athlete);
  if (entries.length === 0) {
    return null;
  }

  return entries
    .slice()
    .sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime())[0];
}

function resolveSwimProofStatus(athlete, requirementGroup) {
  const requirementYear = getRequirementYear();
  const athleteAge = getRequirementAgeForAthlete(athlete);
  const numericAge = Number(athleteAge);
  const isAdult = Number.isFinite(numericAge) && numericAge >= 18;

  const band = getSwimProofBandForAthlete(athlete);
  const hasStoredSwimProofEntries = getPerformanceEntries(athlete, SWIM_PROOF_VIRTUAL_KEY).length > 0;
  const latestManualEntry = getLatestSwimProofManualEntry(athlete);
  const selectedProofKeyFromEntry = normalizeText(latestManualEntry?.meta?.selectionKey || latestManualEntry?.meta?.proofKey);
  const selectedProofKeyFromLegacy = hasStoredSwimProofEntries ? "" : normalizeText(athlete.swimProofSelection);
  const legacyFallbackAuto = hasStoredSwimProofEntries ? "" : normalizeYearValue(athlete.swimProofYear) ? AUTO_SWIM_PROOF_OPTION : "";
  const effectiveSelection = selectedProofKeyFromEntry || selectedProofKeyFromLegacy || legacyFallbackAuto;
  const isAutoSelection = effectiveSelection === AUTO_SWIM_PROOF_OPTION;
  const selectedProof = getSwimProofOptionByKey(band, effectiveSelection) || getAllSwimProofOptions().find((proof) => proof.proofKey === effectiveSelection) || null;
  const autoMatch = findAutomaticSwimProofMatch(athlete, requirementGroup, band, effectiveSelection);

  const proofDefinition = autoMatch?.proof || (isAutoSelection ? null : selectedProof);
  const proofName = proofDefinition?.proofName || (effectiveSelection && effectiveSelection !== AUTO_SWIM_PROOF_OPTION ? effectiveSelection : "");
  const manualEntryYear = latestManualEntry ? normalizeYearValue(new Date(latestManualEntry.measuredAt).getFullYear()) : "";
  const legacyYearValue = hasStoredSwimProofEntries ? "" : normalizeYearValue(athlete.swimProofYear);
  const proofYear = normalizeYearValue(autoMatch?.year || (isAutoSelection ? "" : manualEntryYear || legacyYearValue));
  const proofYearNumber = Number(proofYear);
  const manualPerformanceText = normalizeText(
    latestManualEntry?.meta?.performanceText ||
      (latestManualEntry && !latestManualEntry.meta?.selectionKey && !latestManualEntry.meta?.proofKey ? latestManualEntry.valueInput : "") ||
      (hasStoredSwimProofEntries ? "" : athlete.swimProofPerformance)
  );
  const performanceText = autoMatch?.performanceText || manualPerformanceText;

  const proofRequiresTime = Number.isFinite(Number(selectedProof?.maxTimeSec));
  let manualTimeSeconds = Number.NaN;
  if (latestManualEntry && !isAutoSelection) {
    manualTimeSeconds = Number(latestManualEntry.valueNormalized);
  }

  const firstAcquisitionRequiresSwim = !!getSwimProofPolicyValue("first_acquisition_requires_swim", true);
  const evidenceValidityYears = Number(getSwimProofPolicyValue("evidence_validity_years", 5));
  const maxEvidenceAge = Number.isFinite(evidenceValidityYears) ? evidenceValidityYears : 5;
  const youthProofNotValidForAdults = !!getSwimProofPolicyValue("youth_proof_not_valid_for_adult_dsa", true);

  const hasLinkedEvidence = !!autoMatch;
  const hasManualEvidence = !!latestManualEntry && !isAutoSelection;
  const hasLegacyManualEvidence = !hasStoredSwimProofEntries && !isAutoSelection && !!selectedProofKeyFromLegacy && !!normalizeYearValue(athlete.swimProofYear);
  const hasAnyEvidence = hasLinkedEvidence || hasManualEvidence || hasLegacyManualEvidence;
  const hasEvidenceYear = Number.isFinite(proofYearNumber);

  let valid = false;
  let reason = "";

  if (!firstAcquisitionRequiresSwim) {
    valid = true;
  } else if (isAutoSelection && !hasLinkedEvidence) {
    reason = "keine verknuepfte Schwimmleistung gefunden";
  } else if (!hasAnyEvidence) {
    reason = "kein Nachweis hinterlegt";
  } else if (proofRequiresTime && !isAutoSelection && !Number.isFinite(manualTimeSeconds)) {
    reason = "Zeitangabe fuer den Nachweis fehlt";
  } else if (proofRequiresTime && !isAutoSelection && Number.isFinite(Number(selectedProof?.maxTimeSec)) && manualTimeSeconds > Number(selectedProof.maxTimeSec)) {
    reason = `Zeitnachweis ueberschreitet ${formatMinutesSecondsInput(Number(selectedProof.maxTimeSec))}`;
  } else if (!hasEvidenceYear) {
    reason = "Jahr fuer den Nachweis fehlt";
  } else if (proofYearNumber > requirementYear) {
    reason = `Nachweisjahr ${proofYearNumber} liegt nach dem Anforderungsjahr ${requirementYear}`;
  } else if (!isAdult) {
    valid = true;
  } else {
    if (youthProofNotValidForAdults) {
      const birthDate = new Date(`${athlete.birthDate}T00:00:00`);
      const adultYear = Number.isNaN(birthDate.getTime()) ? NaN : birthDate.getFullYear() + 18;
      if (Number.isFinite(adultYear) && proofYearNumber < adultYear) {
        reason = "Jugendnachweis ist fuer das Erwachsenen-DSA nicht gueltig";
      }
    }

    if (!reason) {
      const evidenceAge = requirementYear - proofYearNumber;
      if (evidenceAge > maxEvidenceAge) {
        reason = `Nachweis ist aelter als ${maxEvidenceAge} Jahre`;
      } else {
        valid = true;
      }
    }
  }

  const sourceLabel = autoMatch ? "verknuepft" : latestManualEntry ? "manuell" : "kein Eintrag";
  let summary = "Schwimmnachweis fehlt";
  if (valid) {
    const detailParts = [];
    if (proofName) {
      detailParts.push(proofName);
    }
    if (proofYear) {
      detailParts.push(proofYear);
    }
    if (performanceText) {
      detailParts.push(performanceText);
    }

    summary = `Schwimmnachweis ok (${detailParts.join(" | ")}${detailParts.length > 0 ? " | " : ""}${sourceLabel})`;
  } else if (reason) {
    summary = `Schwimmnachweis ungueltig (${reason})`;
  }

  return {
    valid,
    level: valid ? "Gold" : "-",
    summary,
    reason,
    proofKey: proofDefinition?.proofKey || effectiveSelection,
    proofName,
    year: proofYear,
    performanceText,
    selectionKey: effectiveSelection,
    manualEntryId: latestManualEntry?.id || "",
    linkedRuleKey: autoMatch?.linkedRuleKey || (autoMatch?.rule ? getRuleStorageKey(autoMatch.rule) : ""),
    linkedEntryId: autoMatch?.entry?.id || "",
    source: autoMatch ? "linked" : latestManualEntry ? "manual" : "none"
  };
}

function getRuleStorageKey(rule) {
  return `${rule.disciplineKey}::${rule.disciplineCode || ""}`;
}

function isSwimProofRuleStorageKey(ruleStorageKey) {
  return normalizeText(ruleStorageKey) === SWIM_PROOF_VIRTUAL_KEY;
}

function createAssociationVirtualDiscipline(categoryName) {
  const normalizedCategory = normalizeText(categoryName);
  return {
    kind: "association",
    category: normalizedCategory,
    disciplineName: `Verbandsabzeichen (${normalizedCategory})`,
    storageKey: getAssociationBadgeRuleStorageKey(normalizedCategory),
    thresholdsRaw: {
      bronze: "-",
      silver: "-",
      gold: "-"
    },
    unitType: "association_badge"
  };
}

function createSwimProofVirtualDiscipline() {
  return {
    kind: "swimProof",
    category: "Schwimmen",
    disciplineName: "Schwimmnachweis",
    storageKey: SWIM_PROOF_VIRTUAL_KEY,
    thresholdsRaw: {
      bronze: "-",
      silver: "-",
      gold: "-"
    },
    unitType: "swim_proof"
  };
}

function getDisciplineDescriptorByStorageKey(athlete, group, ruleStorageKey) {
  if (!ruleStorageKey) {
    return null;
  }

  if (isAssociationBadgeRuleStorageKey(ruleStorageKey)) {
    const categoryName = getAssociationBadgeCategoryFromStorageKey(ruleStorageKey);
    if (!categoryName) {
      return null;
    }

    return createAssociationVirtualDiscipline(categoryName);
  }

  if (isSwimProofRuleStorageKey(ruleStorageKey)) {
    return createSwimProofVirtualDiscipline();
  }

  const rule = getRuleByStorageKey(group, ruleStorageKey);
  if (!rule) {
    return null;
  }

  return {
    ...rule,
    kind: "standard",
    storageKey: getRuleStorageKey(rule)
  };
}

function getPerformanceEntries(athlete, ruleStorageKey) {
  const entries = athlete.performances?.[ruleStorageKey];
  return Array.isArray(entries) ? entries : [];
}

function setPerformanceEntries(athlete, ruleStorageKey, entries) {
  if (!athlete.performances || typeof athlete.performances !== "object") {
    athlete.performances = {};
  }

  athlete.performances[ruleStorageKey] = entries;
}

function comparePerformance(rule, left, right) {
  if (rule.better === "lower") {
    return left < right;
  }

  return left > right;
}

function evaluatePerformanceLevel(rule, normalizedValue) {
  const value = Number(normalizedValue);
  if (!Number.isFinite(value)) {
    return "-";
  }

  const thresholds = rule.thresholdsNormalized || {};
  const bronze = Number(thresholds.bronze);
  const silver = Number(thresholds.silver);
  const gold = Number(thresholds.gold);

  const reaches = (threshold) => {
    if (!Number.isFinite(threshold)) {
      return false;
    }

    return rule.better === "lower" ? value <= threshold : value >= threshold;
  };

  if (reaches(gold)) {
    return "Gold";
  }

  if (reaches(silver)) {
    return "Silber";
  }

  if (reaches(bronze)) {
    return "Bronze";
  }

  return "-";
}

function getBestPerformanceEntry(rule, entries) {
  const usableEntries = entries.filter((entry) => Number.isFinite(Number(entry.valueNormalized)));
  if (usableEntries.length === 0) {
    return null;
  }

  return usableEntries.reduce((best, current) => {
    const bestValue = Number(best.valueNormalized);
    const currentValue = Number(current.valueNormalized);

    if (comparePerformance(rule, currentValue, bestValue)) {
      return current;
    }

    if (currentValue === bestValue) {
      return new Date(current.measuredAt).getTime() > new Date(best.measuredAt).getTime() ? current : best;
    }

    return best;
  });
}

function getLevelRank(level) {
  return LEVEL_RANK[level] || 0;
}

function getHigherLevel(leftLevel, rightLevel) {
  return getLevelRank(leftLevel) >= getLevelRank(rightLevel) ? leftLevel : rightLevel;
}

function getDisciplineBestLevel(athlete, rule) {
  const entries = getPerformanceEntries(athlete, getRuleStorageKey(rule));
  const bestEntry = getBestPerformanceEntry(rule, entries);
  if (!bestEntry) {
    return "-";
  }

  return evaluatePerformanceLevel(rule, bestEntry.valueNormalized);
}

function getAthleteCategoryLevels(athlete, requirementGroup) {
  const swimProofStatus = resolveSwimProofStatus(athlete, requirementGroup);
  const associationBadgeStatuses = CATEGORY_ORDER.map((categoryName) => getAssociationBadgeStatusForCategory(athlete, categoryName)).filter(Boolean);

  const categoryLevels = {
    Ausdauer: "-",
    Schnelligkeit: "-",
    Kraft: "-",
    Koordination: "-",
    Schwimmen: swimProofStatus.level
  };

  if (!requirementGroup || !Array.isArray(requirementGroup.disciplines)) {
    for (const associationBadgeStatus of associationBadgeStatuses) {
      if (!associationBadgeStatus.valid || !CATEGORY_ORDER.includes(associationBadgeStatus.category)) {
        continue;
      }

      categoryLevels[associationBadgeStatus.category] = getHigherLevel(categoryLevels[associationBadgeStatus.category], associationBadgeStatus.recognizedLevel);
    }

    return categoryLevels;
  }

  for (const categoryName of CATEGORY_ORDER) {
    const rules = requirementGroup.disciplines.filter((rule) => rule.category === categoryName);
    let bestLevel = "-";

    for (const rule of rules) {
      const level = getDisciplineBestLevel(athlete, rule);
      bestLevel = getHigherLevel(bestLevel, level);
    }

    categoryLevels[categoryName] = bestLevel;
  }

  for (const associationBadgeStatus of associationBadgeStatuses) {
    if (!associationBadgeStatus.valid || !CATEGORY_ORDER.includes(associationBadgeStatus.category)) {
      continue;
    }

    categoryLevels[associationBadgeStatus.category] = getHigherLevel(categoryLevels[associationBadgeStatus.category], associationBadgeStatus.recognizedLevel);
  }

  return categoryLevels;
}

function getOverallAwardLevel(categoryLevels) {
  const allCategoriesHaveBronze = CATEGORY_ORDER.every((categoryName) => getLevelRank(categoryLevels[categoryName]) >= 1);
  if (!allCategoriesHaveBronze) {
    return "-";
  }

  const points = CATEGORY_ORDER.reduce((sum, categoryName) => sum + (LEVEL_POINTS[categoryLevels[categoryName]] || 0), 0);
  if (points >= 11) {
    return "Gold";
  }

  if (points >= 8) {
    return "Silber";
  }

  return "Bronze";
}

function getCategoryIconSvg(categoryName) {
  const iconMap = {
    Ausdauer:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 19" fill="none" aria-hidden="true"><path d="M9.20982 11.6797L7.71981 9.40345C7.6348 9.29663 7.54164 9.21176 7.44032 9.14883C7.339 9.0859 7.21821 9.05444 7.07793 9.05444H0.950114C0.598695 8.4091 0.352488 7.8062 0.211493 7.24573C0.0704975 6.68528 0 6.10872 0 5.51606C0 3.9503 0.511186 2.63951 1.53356 1.58371C2.55593 0.527902 3.81954 0 5.3244 0C6.35314 0 7.30713 0.267795 8.18637 0.803383C9.06563 1.33897 9.83684 2.11748 10.5 3.13891C11.2453 2.07506 12.0456 1.28594 12.9007 0.771565C13.7559 0.257188 14.6809 0 15.6756 0C17.1805 0 18.4441 0.527902 19.4664 1.58371C20.4888 2.63951 21 3.9503 21 5.51606C21 6.10872 20.9295 6.68528 20.7885 7.24573C20.6475 7.8062 20.4013 8.4091 20.0499 9.05444H14.1474L12.1154 5.9419C12.0445 5.83801 11.9606 5.76484 11.8635 5.7224C11.7664 5.67996 11.6619 5.65874 11.55 5.65874C11.4267 5.65874 11.3137 5.69825 11.211 5.77728C11.1083 5.8563 11.0399 5.95946 11.0059 6.08677L9.20982 11.6797ZM9.43726 18.583C7.69295 16.9309 6.18172 15.4441 4.90357 14.1227C3.62544 12.8013 2.57189 11.5436 1.74292 10.3495H6.81438L8.84636 13.4906C8.9172 13.6018 9.00754 13.6768 9.11737 13.7155C9.22717 13.7543 9.33805 13.7737 9.45 13.7737C9.57327 13.7737 9.68167 13.7342 9.77519 13.6552C9.86872 13.5762 9.93602 13.473 9.9771 13.3457L11.7902 7.77469L13.2313 9.98948C13.3234 10.1036 13.4229 10.1922 13.5299 10.2551C13.6369 10.318 13.7605 10.3495 13.9008 10.3495H19.2571C18.4281 11.5436 17.3746 12.8013 16.0964 14.1227C14.8183 15.4441 13.3071 16.9309 11.5627 18.583C11.4225 18.7278 11.2574 18.8335 11.0675 18.9001C10.8776 18.9667 10.6885 19 10.5 19C10.3115 19 10.1224 18.9667 9.9325 18.9001C9.74262 18.8335 9.57753 18.7278 9.43726 18.583Z" fill="currentColor"></path></svg>',
    Kraft:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 19" fill="none" aria-hidden="true"><path d="M7.10147 11.0915C8.62602 9.65019 10.1432 8.20884 11.6678 6.76748C11.6385 6.7325 11.6165 6.70451 11.5872 6.67652C10.7369 5.86489 9.89403 5.06025 9.04381 4.24861C8.78727 4.00372 8.52341 3.75883 8.41346 3.40199C8.24488 2.84924 8.3475 2.35246 8.75062 1.93265C9.01449 1.65277 9.30767 1.37989 9.60085 1.12801C10.1945 0.610239 11.0741 0.617236 11.6678 1.12801C11.8584 1.28894 12.0343 1.47085 12.2102 1.63878C12.2395 1.66677 12.2542 1.70875 12.2908 1.72974C12.54 1.11401 13.0384 0.722189 13.5222 0.337361C14.1452 -0.159417 15.0394 -0.0894481 15.6184 0.42832C16.0289 0.799154 16.4247 1.19098 16.8278 1.57581C16.8645 1.61079 16.9011 1.63878 16.9451 1.68076C17.0623 1.57581 17.1723 1.47085 17.2822 1.3659C17.5095 1.149 17.7367 0.925098 17.9712 0.708195C18.2497 0.449311 18.5796 0.386339 18.9094 0.526276C19.2539 0.67321 19.4591 0.974076 19.4371 1.33092C19.4225 1.54082 19.3345 1.71574 19.1806 1.86268C18.8434 2.17754 18.5063 2.4924 18.1545 2.82125C18.2058 2.87722 18.2497 2.9262 18.2937 2.96818C18.7042 3.36001 19.1146 3.75183 19.5178 4.15065C19.7816 4.40954 19.9429 4.7174 19.9868 5.07424C20.0455 5.52204 19.9062 5.92086 19.6057 6.24971C19.3638 6.5156 19.1 6.76748 18.8214 6.99838C18.6455 7.14531 18.433 7.24327 18.2278 7.36921C18.2424 7.3902 18.2644 7.41819 18.2937 7.44618C18.4989 7.65609 18.7335 7.845 18.9094 8.0689C19.3858 8.69162 19.3492 9.37032 18.8214 9.94406C18.5283 10.2589 18.2058 10.5598 17.8613 10.8257C17.2602 11.3015 16.454 11.2595 15.8823 10.7417C15.3692 10.2799 14.8781 9.79013 14.3797 9.30735C13.9033 8.85255 13.4269 8.40475 12.9578 7.94296C12.8845 7.87299 12.8552 7.90098 12.8039 7.95695C11.9243 8.80357 11.0448 9.6432 10.1579 10.4898C9.58619 11.0426 9.01449 11.5953 8.43545 12.1481C8.40613 12.1761 8.36948 12.1971 8.33284 12.232C8.37681 12.281 8.41346 12.323 8.45011 12.358C9.315 13.1836 10.1726 14.0022 11.0374 14.8279C11.3013 15.0798 11.5285 15.3456 11.6165 15.7025C11.7411 16.2133 11.6238 16.675 11.2573 17.0599C10.9861 17.3467 10.7003 17.6196 10.3998 17.8785C9.82074 18.3823 8.95585 18.3893 8.36215 17.8925C8.16426 17.7246 7.97369 17.5357 7.79045 17.3537C7.76113 17.3258 7.74647 17.2838 7.70982 17.2628C7.57789 17.6056 7.36533 17.8645 7.1088 18.0954C6.95488 18.2353 6.80829 18.3823 6.65437 18.5292C6.00936 19.1379 5.03453 19.1659 4.36754 18.5572C3.94243 18.1654 3.53197 17.7596 3.11419 17.3537C3.09953 17.3398 3.08487 17.3258 3.04822 17.2908C2.85032 17.4867 2.65975 17.6756 2.46918 17.8715C2.33725 18.0045 2.19799 18.1234 2.06606 18.2563C1.89748 18.4243 1.68492 18.5292 1.44304 18.5432C1.2085 18.5572 0.812701 18.3893 0.651451 18.0744C0.4902 17.7526 0.534177 17.4167 0.790712 17.1578C1.10588 16.843 1.42106 16.5351 1.75089 16.2342C1.83884 16.1573 1.81685 16.1153 1.75089 16.0523C1.31844 15.6395 0.885997 15.2337 0.468212 14.8069C-0.162131 14.1632 -0.154801 13.2536 0.482871 12.6239C0.680769 12.428 0.885997 12.246 1.0839 12.0501C1.28179 11.8612 1.52367 11.7353 1.80219 11.6443C1.76554 11.6023 1.7289 11.5603 1.69958 11.5254C1.51634 11.3434 1.32577 11.1755 1.14986 10.9796C0.893327 10.6927 0.754065 10.3569 0.761394 9.98604C0.761394 9.6432 0.893326 9.31434 1.1352 9.06246C1.42106 8.76159 1.71424 8.45373 2.03674 8.19485C2.71839 7.64209 3.55396 7.69107 4.19896 8.2998C4.73402 8.80357 5.25442 9.31434 5.78215 9.81812C6.19993 10.2169 6.62505 10.6158 7.04283 11.0146C7.05749 11.0286 7.07948 11.0426 7.08681 11.0566L7.10147 11.0915Z" fill="currentColor"></path></svg>',
    Schnelligkeit:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.75974 1.18994C4.75974 0.531753 5.2915 0 5.94968 0H9.51949C10.1777 0 10.7094 0.531753 10.7094 1.18994C10.7094 1.84812 10.1777 2.37987 9.51949 2.37987H8.92452V3.65905C10.319 3.87473 11.587 4.46226 12.6319 5.31753L13.4351 4.51432C13.8999 4.0495 14.6548 4.0495 15.1196 4.51432C15.5844 4.97914 15.5844 5.734 15.1196 6.19882L14.2235 7.09499C15.0118 8.30352 15.4692 9.75004 15.4692 11.3044C15.4692 15.577 12.0072 19.039 7.73458 19.039C3.46197 19.039 0 15.577 0 11.3044C0 7.4371 2.83725 4.23171 6.54465 3.65905V2.37987H5.94968C5.2915 2.37987 4.75974 1.84812 4.75974 1.18994ZM8.35889 7.42985C8.35889 7.17339 8.15098 6.96548 7.89452 6.96548C7.63806 6.96548 7.43016 7.17339 7.43016 7.42985L7.43016 11.1448C7.43016 11.4012 7.63806 11.6091 7.89452 11.6091C8.15098 11.6091 8.35889 11.4012 8.35889 11.1448V7.42985Z" fill="currentColor"></path></svg>',
    Koordination:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 20" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.1273 1.52588e-05C19.3221 1.53632e-05 20.3326 0.413058 21.1587 1.23914C21.9847 2.06524 22.3978 3.07461 22.3978 4.26725C22.3978 5.45989 21.9847 6.47034 21.1587 7.29861C20.3326 8.1269 19.3221 8.54105 18.1273 8.54105C16.9324 8.54105 15.922 8.1269 15.0959 7.29861C14.2698 6.47034 13.8567 5.45989 13.8567 4.26725C13.8567 3.07461 14.2698 2.06524 15.0959 1.23914C15.922 0.413057 16.9324 1.51543e-05 18.1273 1.52588e-05ZM4.27052 1.52594e-05C5.46535 1.53638e-05 6.47472 0.413058 7.29863 1.23914C8.12254 2.06524 8.53449 3.07461 8.53449 4.26725C8.53449 5.45989 8.12254 6.47034 7.29863 7.29861C6.47472 8.1269 5.46534 8.54105 4.27052 8.54105C3.07569 8.54105 2.06522 8.1269 1.23912 7.29861C0.413042 6.47034 -1.04264e-07 5.45989 0 4.26725C1.04264e-07 3.07461 0.413042 2.06524 1.23912 1.23914C2.06522 0.413057 3.07569 1.51549e-05 4.27052 1.52594e-05ZM22.3981 10.7357L0.000313289 10.7357L0.000313385 9.62943L22.3981 9.62943V10.7357ZM15.8371 17.9058L12.1208 12.9373C11.7209 12.4026 10.9192 12.4026 10.5193 12.9373L6.80299 17.9058C6.30978 18.5652 6.78032 19.5048 7.60377 19.5048H15.0363C15.8597 19.5048 16.3303 18.5652 15.8371 17.9058Z" fill="currentColor"></path></svg>',
    Schwimmen:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 20" fill="none" aria-hidden="true"><path d="M1.3743 19.2069C1.09815 19.3347 0.847698 19.3107 0.622925 19.1348C0.398153 18.9589 0.285767 18.6987 0.285767 18.3542C0.285767 18.1639 0.353021 17.9779 0.48753 17.7961C0.622039 17.6143 0.798111 17.4849 1.01574 17.4077C1.42817 17.263 1.79671 17.0856 2.12138 16.8756C2.44604 16.6655 2.91091 16.5605 3.516 16.5605C4.27093 16.5605 4.89796 16.7421 5.39709 17.1053C5.89621 17.4685 6.4344 17.6501 7.01166 17.6501C7.58892 17.6501 8.09019 17.4685 8.51546 17.1053C8.94073 16.7421 9.53084 16.5605 10.2858 16.5605C11.0407 16.5605 11.6677 16.7421 12.1669 17.1053C12.666 17.4685 13.2042 17.6501 13.7814 17.6501C14.3587 17.6501 14.8641 17.4685 15.2975 17.1053C15.731 16.7421 16.3252 16.5605 17.0801 16.5605C17.6852 16.5605 18.1501 16.6655 18.4748 16.8756C18.7994 17.0856 19.1598 17.263 19.5558 17.4077C19.7734 17.4849 19.9495 17.6101 20.084 17.7835C20.2185 17.9568 20.2858 18.147 20.2858 18.3542C20.2858 18.6987 20.1734 18.9589 19.9486 19.1348C19.7238 19.3107 19.4734 19.3347 19.1972 19.2069C18.8505 19.038 18.5083 18.8672 18.1708 18.6946C17.8333 18.522 17.4697 18.4357 17.0801 18.4357C16.5029 18.4357 15.9811 18.6131 15.5148 18.9678C15.0485 19.3226 14.4707 19.5 13.7814 19.5C13.0921 19.5 12.4815 19.3226 11.9496 18.9678C11.4176 18.6131 10.863 18.4357 10.2858 18.4357C9.70851 18.4357 9.17442 18.6131 8.6835 18.9678C8.19258 19.3226 7.60248 19.5 6.91319 19.5C6.22391 19.5 5.6297 19.3226 5.13058 18.9678C4.63145 18.6131 4.09326 18.4357 3.516 18.4357C3.12641 18.4357 2.76054 18.522 2.41839 18.6946C2.07624 18.8672 1.72821 19.038 1.3743 19.2069ZM1.30044 14.2964C1.03358 14.4073 0.797741 14.3766 0.592942 14.2044C0.388158 14.0321 0.285767 13.787 0.285767 13.4689C0.285767 13.2787 0.348918 13.1035 0.475221 12.9434C0.601525 12.7832 0.765287 12.6683 0.966509 12.5985C1.39534 12.4634 1.77388 12.2908 2.10211 12.0807C2.43034 11.8706 2.90164 11.7656 3.516 11.7656C4.27093 11.7656 4.87923 11.9261 5.34088 12.2471C5.80256 12.568 6.32666 12.7285 6.91319 12.7285C7.49045 12.7285 8.00813 12.568 8.46623 12.2471C8.92432 11.9261 9.53084 11.7656 10.2858 11.7656C11.0407 11.7656 11.6536 11.9261 12.1246 12.2471C12.5955 12.568 13.115 12.7285 13.683 12.7285C14.2602 12.7285 14.782 12.568 15.2483 12.2471C15.7146 11.9261 16.3252 11.7656 17.0801 11.7656C17.6945 11.7656 18.1658 11.8706 18.494 12.0807C18.8223 12.2908 19.1926 12.4634 19.605 12.5985C19.8062 12.6683 19.97 12.7832 20.0963 12.9434C20.2226 13.1035 20.2858 13.2787 20.2858 13.4689C20.2858 13.787 20.1834 14.0321 19.9786 14.2044C19.7738 14.3766 19.538 14.4073 19.2711 14.2964C18.9172 14.1274 18.565 13.9548 18.2147 13.7785C17.8643 13.6022 17.4862 13.5141 17.0801 13.5141C16.5029 13.5141 15.9765 13.6915 15.5009 14.0463C15.0253 14.401 14.4522 14.5784 13.7814 14.5784C13.1107 14.5784 12.5047 14.401 11.9635 14.0463C11.4223 13.6915 10.863 13.5141 10.2858 13.5141C9.70851 13.5141 9.18619 13.6915 8.71882 14.0463C8.25146 14.401 7.6824 14.5784 7.01166 14.5784C6.34092 14.5784 5.73494 14.401 5.19372 14.0463C4.6525 13.6915 4.09326 13.5141 3.516 13.5141C3.11 13.5141 2.72771 13.6022 2.36916 13.7785C2.0106 13.9548 1.65436 14.1274 1.30044 14.2964ZM6.91319 9.7692C6.59924 9.7692 6.29081 9.69574 5.9879 9.54884C5.68499 9.40193 5.45398 9.22123 5.29485 9.00675L8.63212 5.57145L7.41411 4.33196C7.01737 3.91402 6.60031 3.60003 6.16291 3.38997C5.72551 3.1799 5.19499 3.04475 4.57135 2.98452C4.26237 2.94117 4.00834 2.81226 3.80927 2.5978C3.61018 2.38332 3.51064 2.12182 3.51064 1.81333C3.51064 1.46885 3.62356 1.18275 3.84939 0.955041C4.07523 0.727347 4.35084 0.635167 4.67622 0.6785C5.59955 0.79162 6.40675 1.01693 7.09782 1.35443C7.7889 1.69194 8.43341 2.16368 9.03137 2.76966L15.3013 9.20947C15.0929 9.39971 14.8373 9.54057 14.5344 9.63203C14.2315 9.72347 13.9477 9.7692 13.683 9.7692C13.05 9.7692 12.4987 9.59181 12.0288 9.23704C11.5589 8.88227 10.9779 8.70489 10.2858 8.70489C9.59363 8.70489 9.01673 8.88227 8.55507 9.23704C8.0934 9.59181 7.5461 9.7692 6.91319 9.7692ZM15.0669 5.62986C14.3548 5.62986 13.7591 5.38324 13.28 4.89001C12.8008 4.39678 12.5613 3.78842 12.5613 3.06493C12.5613 2.35098 12.8008 1.745 13.28 1.24699C13.7591 0.748996 14.3548 0.5 15.0669 0.5C15.7697 0.5 16.3607 0.748996 16.8399 1.24699C17.319 1.745 17.5586 2.35098 17.5586 3.06493C17.5586 3.78842 17.319 4.39678 16.8399 4.89001C16.3607 5.38324 15.7697 5.62986 15.0669 5.62986Z" fill="currentColor"></path></svg>'
  };

  return iconMap[categoryName] || iconMap.Schwimmen;
}

function createStatusDividerElement() {
  const divider = document.createElement("span");
  divider.className = "status-divider";
  divider.setAttribute("aria-hidden", "true");
  return divider;
}

function createStatusIconElement(categoryName, level, iconSizeClass = "") {
  const normalizedLevel = level && level !== "-" ? level : "none";
  const icon = document.createElement("span");
  icon.className = `status-icon status-icon--${normalizedLevel.toLowerCase()}`;
  if (iconSizeClass) {
    icon.classList.add(iconSizeClass);
  }
  icon.title = `${categoryName}: ${level === "-" ? "keine Stufe" : level}`;
  icon.setAttribute("aria-label", `${categoryName}: ${level === "-" ? "keine Stufe" : level}`);
  icon.innerHTML = getCategoryIconSvg(categoryName);
  return icon;
}

function createAthleteStatusIconsElement(categoryLevels) {
  const row = document.createElement("div");
  row.className = "athlete-status-icons";

  for (const categoryName of CATEGORY_WITH_SWIMMING_ORDER) {
    if (categoryName === "Schwimmen") {
      row.append(createStatusDividerElement());
    }

    const level = categoryLevels[categoryName] || "-";
    const icon = createStatusIconElement(categoryName, level);
    row.append(icon);
  }

  return row;
}

function renderAthleteCategoryStatusRow(categoryLevels) {
  if (!athleteCategoryStatusRow) {
    return;
  }

  athleteCategoryStatusRow.innerHTML = "";

  for (const categoryName of CATEGORY_WITH_SWIMMING_ORDER) {
    if (categoryName === "Schwimmen") {
      athleteCategoryStatusRow.append(createStatusDividerElement());
    }

    const level = categoryLevels[categoryName] || "-";
    const item = document.createElement("span");
    item.className = "category-status-item";

    const icon = createStatusIconElement(categoryName, level);
    icon.classList.add("status-icon--tiny");

    const text = document.createElement("span");
    text.className = "category-status-label";
    text.textContent = categoryName;

    item.append(icon, text);
    athleteCategoryStatusRow.append(item);
  }
}

function getPreferredRequirementsReferenceAthlete() {
  const selectedAthlete = getSelectedAthlete();
  if (selectedAthlete) {
    return selectedAthlete;
  }

  const visibleAthletes = getVisibleAthletes();
  if (visibleAthletes.length > 0) {
    return visibleAthletes[0];
  }

  return state.athletes[0] || null;
}

function getAutomaticRequirementsInspectorGender(explicitGender = "") {
  const normalizedExplicit = normalizeText(explicitGender).toUpperCase();
  if (["M", "W"].includes(normalizedExplicit)) {
    state.requirementsInspectorGender = normalizedExplicit;
    return normalizedExplicit;
  }

  const manuallySelectedGender = normalizeText(state.requirementsInspectorGender).toUpperCase();
  if (["M", "W"].includes(manuallySelectedGender)) {
    return manuallySelectedGender;
  }

  const referenceAthlete = getPreferredRequirementsReferenceAthlete();
  if (referenceAthlete) {
    const detectedGender = referenceAthlete.gender === "W" ? "W" : "M";
    state.requirementsInspectorGender = detectedGender;
    return detectedGender;
  }

  return state.requirementsInspectorGender === "W" ? "W" : "M";
}

function parseRequirementsInspectorInput(rawInput) {
  const originalInput = normalizeText(rawInput);
  if (!originalInput) {
    return {
      hasValue: false,
      valid: true,
      age: NaN,
      birthYear: NaN,
      inputType: "",
      detectedGender: "",
      message: ""
    };
  }

  let inputValue = originalInput;
  let detectedGender = "";

  const genderPrefixMatch = inputValue.match(/^([mMwW])\s*[:\-]?\s*(.+)$/);
  if (genderPrefixMatch) {
    detectedGender = genderPrefixMatch[1].toUpperCase();
    inputValue = normalizeText(genderPrefixMatch[2]);
  }

  if (!detectedGender) {
    const genderSuffixMatch = inputValue.match(/^(.+?)\s*[:\-]?\s*([mMwW])$/);
    if (genderSuffixMatch) {
      detectedGender = genderSuffixMatch[2].toUpperCase();
      inputValue = normalizeText(genderSuffixMatch[1]);
    }
  }

  if (!inputValue) {
    return {
      hasValue: true,
      valid: false,
      age: NaN,
      birthYear: NaN,
      inputType: "",
      detectedGender,
      message: "Bitte Alter, Geburtsjahr oder Geburtsdatum eingeben."
    };
  }

  const requirementYear = getRequirementYear();
  let age = NaN;
  let birthYear = NaN;
  let inputType = "";

  const buildDateFromParts = (year, month, day) => {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      return null;
    }

    const parsed = new Date(year, month - 1, day);
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }

    return parsed;
  };

  const dateIsoMatch = inputValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const dateDottedMatch = inputValue.match(/^(\d{1,2})[\./](\d{1,2})[\./](\d{4})$/);

  if (dateIsoMatch) {
    const year = Number(dateIsoMatch[1]);
    const month = Number(dateIsoMatch[2]);
    const day = Number(dateIsoMatch[3]);
    const parsedDate = buildDateFromParts(year, month, day);
    if (!parsedDate) {
      return {
        hasValue: true,
        valid: false,
        age: NaN,
        birthYear: NaN,
        inputType: "birthDate",
        detectedGender,
        message: "Das Geburtsdatum ist ungueltig."
      };
    }

    birthYear = parsedDate.getFullYear();
    age = requirementYear - birthYear;
    inputType = "birthDate";
  } else if (dateDottedMatch) {
    const day = Number(dateDottedMatch[1]);
    const month = Number(dateDottedMatch[2]);
    const year = Number(dateDottedMatch[3]);
    const parsedDate = buildDateFromParts(year, month, day);
    if (!parsedDate) {
      return {
        hasValue: true,
        valid: false,
        age: NaN,
        birthYear: NaN,
        inputType: "birthDate",
        detectedGender,
        message: "Das Geburtsdatum ist ungueltig."
      };
    }

    birthYear = parsedDate.getFullYear();
    age = requirementYear - birthYear;
    inputType = "birthDate";
  } else if (/^\d{8}$/.test(inputValue)) {
    const rawNumeric = Number(inputValue);
    if (!Number.isFinite(rawNumeric)) {
      return {
        hasValue: true,
        valid: false,
        age: NaN,
        birthYear: NaN,
        inputType: "birthDate",
        detectedGender,
        message: "Die Eingabe konnte nicht als Datum erkannt werden."
      };
    }

    const asYear = Number(inputValue.slice(0, 4));
    const asMonth = Number(inputValue.slice(4, 6));
    const asDay = Number(inputValue.slice(6, 8));

    let parsedDate = null;
    if (asYear >= 1900 && asYear <= 2100) {
      parsedDate = buildDateFromParts(asYear, asMonth, asDay);
    }

    if (!parsedDate) {
      const day = Number(inputValue.slice(0, 2));
      const month = Number(inputValue.slice(2, 4));
      const year = Number(inputValue.slice(4, 8));
      parsedDate = buildDateFromParts(year, month, day);
    }

    if (!parsedDate) {
      return {
        hasValue: true,
        valid: false,
        age: NaN,
        birthYear: NaN,
        inputType: "birthDate",
        detectedGender,
        message: "Die Eingabe konnte nicht als Datum erkannt werden."
      };
    }

    birthYear = parsedDate.getFullYear();
    age = requirementYear - birthYear;
    inputType = "birthDate";
  } else if (/^-?\d+$/.test(inputValue)) {
    const numericValue = Number(inputValue);
    if (!Number.isInteger(numericValue)) {
      return {
        hasValue: true,
        valid: false,
        age: NaN,
        birthYear: NaN,
        inputType: "",
        detectedGender,
        message: "Bitte nur ganze Zahlen verwenden."
      };
    }

    if (numericValue >= 1900 && numericValue <= 2100) {
      birthYear = numericValue;
      age = requirementYear - birthYear;
      inputType = "birthYear";
    } else {
      age = numericValue;
      birthYear = requirementYear - age;
      inputType = "age";
    }
  } else {
    return {
      hasValue: true,
      valid: false,
      age: NaN,
      birthYear: NaN,
      inputType: "",
      detectedGender,
      message: "Bitte Alter, Geburtsjahr oder Geburtsdatum eingeben (z.B. 14, 2012 oder 12.04.2012)."
    };
  }

  if (!Number.isFinite(age) || age < 0 || age > 120) {
    return {
      hasValue: true,
      valid: false,
      age: NaN,
      birthYear: NaN,
      inputType,
      detectedGender,
      message: "Die Eingabe ergibt kein plausibles Alter (0 bis 120)."
    };
  }

  if (!Number.isFinite(birthYear) || birthYear < 1900 || birthYear > 2100) {
    return {
      hasValue: true,
      valid: false,
      age: NaN,
      birthYear: NaN,
      inputType,
      detectedGender,
      message: "Das erkannte Geburtsjahr ist ungueltig."
    };
  }

  return {
    hasValue: true,
    valid: true,
    age,
    birthYear,
    inputType,
    detectedGender,
    message: ""
  };
}

function createRequirementsPreviewAthlete(gender, birthYear) {
  const normalizedGender = normalizeText(gender).toUpperCase() === "W" ? "W" : "M";
  const yearValue = Number.isInteger(Number(birthYear)) ? Number(birthYear) : getRequirementYear() - 18;

  return {
    id: `preview-${normalizedGender}-${yearValue}`,
    firstName: "",
    lastName: "",
    gender: normalizedGender,
    birthDate: `${String(yearValue).padStart(4, "0")}-07-01`,
    dsaId: "",
    associationBadgeId: "",
    associationBadgeLevel: "",
    swimProofYear: "",
    swimProofSelection: "",
    swimProofPerformance: "",
    zip: "",
    city: "",
    country: "Deutschland",
    performances: {},
    createdAt: "",
    updatedAt: ""
  };
}

function getRequirementGroupIdentity(requirementGroup) {
  if (!requirementGroup) {
    return "";
  }

  return `${normalizeText(requirementGroup.gender)}|${normalizeText(requirementGroup.ageMin)}|${normalizeText(requirementGroup.ageMax)}`;
}

function getRequirementPreviewLabel(requirementGroup) {
  if (!requirementGroup) {
    return "Unbekannte Anforderungsgruppe";
  }

  const gender = normalizeText(requirementGroup.gender) || "-";
  const ageMin = normalizeText(requirementGroup.ageMin) || "-";
  const ageMax = normalizeText(requirementGroup.ageMax) || "-";
  return `Anforderungen ${gender} ${ageMin}-${ageMax}`;
}

function describeRequirementsInspectorSource(parsedInput, gender, age, birthYear, usedReferenceAthlete = false) {
  if (usedReferenceAthlete) {
    return `Automatisch aus Athletprofil erkannt: ${gender}${age} (Geburtsjahr ${birthYear})`;
  }

  if (!parsedInput?.hasValue) {
    return `Automatisch erkannt: ${gender}${age} (Geburtsjahr ${birthYear})`;
  }

  if (parsedInput.inputType === "birthDate") {
    return `Erkannt als Geburtsdatum: ${gender}${age} (Geburtsjahr ${birthYear})`;
  }

  if (parsedInput.inputType === "birthYear") {
    return `Erkannt als Geburtsjahr: ${gender}${age} (Geburtsjahr ${birthYear})`;
  }

  return `Erkannt als Alter: ${gender}${age} (Geburtsjahr ${birthYear})`;
}

function resolveRequirementsInspectorTarget(parsedInputOverride = null) {
  const requirementGroups = Array.isArray(state.requirements?.groups) ? state.requirements.groups : [];
  if (requirementGroups.length === 0) {
    return {
      target: null,
      info: "",
      message: "Anforderungen konnten nicht geladen werden."
    };
  }

  const parsedInput = parsedInputOverride || parseRequirementsInspectorInput(state.requirementsInspectorInput);
  if (parsedInput.hasValue && !parsedInput.valid) {
    return {
      target: null,
      info: "",
      message: parsedInput.message
    };
  }

  let age = parsedInput.age;
  let birthYear = parsedInput.birthYear;
  let usedReferenceAthlete = false;

  if (!parsedInput.hasValue) {
    const referenceAthlete = getPreferredRequirementsReferenceAthlete();
    if (!referenceAthlete) {
      return {
        target: null,
        info: "",
        message: "Bitte Alter, Geburtsjahr oder Geburtsdatum eingeben."
      };
    }

    usedReferenceAthlete = true;
    age = Number(getRequirementAgeForAthlete(referenceAthlete));
    birthYear = Number(referenceAthlete.birthDate?.slice(0, 4));

    if (!Number.isFinite(age) || age < 0 || age > 120) {
      return {
        target: null,
        info: "",
        message: "Aus dem Athletprofil konnte kein gueltiges Alter erkannt werden."
      };
    }

    if (!Number.isFinite(birthYear) || birthYear < 1900 || birthYear > 2100) {
      birthYear = getRequirementYear() - age;
    }
  }

  const gender = getAutomaticRequirementsInspectorGender(parsedInput.detectedGender);
  const matchingGroups = requirementGroups
    .filter((requirementGroup) => {
      const matchesGender = normalizeText(requirementGroup.gender).toUpperCase() === gender;
      const ageMin = Number(requirementGroup.ageMin);
      const ageMax = Number(requirementGroup.ageMax);
      return matchesGender && Number.isFinite(ageMin) && Number.isFinite(ageMax) && age >= ageMin && age <= ageMax;
    })
    .sort((left, right) => {
      const leftRange = Number(left.ageMax) - Number(left.ageMin);
      const rightRange = Number(right.ageMax) - Number(right.ageMin);
      if (Number.isFinite(leftRange) && Number.isFinite(rightRange) && leftRange !== rightRange) {
        return leftRange - rightRange;
      }

      return Number(left.ageMin) - Number(right.ageMin);
    });

  const requirementGroup = matchingGroups[0] || null;
  if (!requirementGroup) {
    return {
      target: null,
      info: describeRequirementsInspectorSource(parsedInput, gender, age, birthYear, usedReferenceAthlete),
      message: `Keine passende Anforderungsgruppe fuer ${gender}${age} gefunden.`
    };
  }

  return {
    target: {
      requirementGroup,
      profileAthlete: createRequirementsPreviewAthlete(gender, birthYear),
      label: getRequirementPreviewLabel(requirementGroup)
    },
    info: describeRequirementsInspectorSource(parsedInput, gender, age, birthYear, usedReferenceAthlete),
    message: ""
  };
}

function getRequirementsDescriptorDetailText(profileAthlete, descriptor) {
  if (descriptor.kind === "association") {
    const options = getAssociationBadgeEntriesForCategory(descriptor.category, profileAthlete);
    if (options.length === 0) {
      return "Kein passendes Verbandsabzeichen fuer das Profil gefunden.";
    }

    return `Verbandsabzeichen antippen (${options.length} Moeglichkeiten anzeigen)`;
  }

  if (descriptor.kind === "swimProof") {
    const band = getSwimProofBandForAthlete(profileAthlete);
    const options = getSwimProofOptionsForBand(band);
    if (options.length === 0) {
      return "Schwimmnachweis gemaess Vorgaben erforderlich.";
    }

    return `Schwimmnachweis antippen (${options.length} Moeglichkeiten anzeigen)`;
  }

  return "";
}

function focusRequirementsInspectorInput(selectionStart = null, selectionEnd = null) {
  if (!requirementsInspectorPanel || requirementsInspectorPanel.hidden) {
    return;
  }

  const ageInput = requirementsInspectorPanel.querySelector(".requirements-age-input");
  if (!ageInput || typeof ageInput.focus !== "function") {
    return;
  }

  ageInput.focus({ preventScroll: true });

  if (typeof ageInput.setSelectionRange !== "function") {
    return;
  }

  const valueLength = ageInput.value.length;
  const hasStart = Number.isInteger(selectionStart);
  const hasEnd = Number.isInteger(selectionEnd);
  const nextStart = hasStart ? Math.min(Math.max(selectionStart, 0), valueLength) : valueLength;
  const nextEnd = hasEnd ? Math.min(Math.max(selectionEnd, 0), valueLength) : nextStart;

  ageInput.setSelectionRange(nextStart, nextEnd);
}

function renderRequirementsTargetDisciplines(container, profileAthlete, requirementGroup) {
  const grouped = getRenderableDisciplineGroups(profileAthlete, requirementGroup);
  if (grouped.length === 0) {
    const note = document.createElement("p");
    note.className = "group-empty-note";
    note.textContent = "Keine Disziplinen fuer diese Anforderungsgruppe vorhanden.";
    container.append(note);
    return;
  }

  for (const categoryGroup of grouped) {
    const section = document.createElement("section");
    section.className = "discipline-category";

    const headingWrap = document.createElement("div");
    headingWrap.className = "discipline-category-heading";

    const headingIcon = createStatusIconElement(categoryGroup.category, "-", "status-icon--heading");

    const heading = document.createElement("h3");
    heading.textContent = categoryGroup.category;

    const headingLevel = document.createElement("span");
    headingLevel.className = "discipline-category-level";
    headingLevel.textContent = "Anforderungen";

    headingWrap.append(headingIcon, heading, headingLevel);

    const list = document.createElement("ul");
    list.className = "discipline-list";

    for (const descriptor of categoryGroup.disciplines) {
      const item = document.createElement("li");
      item.className = "discipline-item";

      const row = document.createElement("div");
      row.className = "discipline-btn discipline-btn--none discipline-btn--readonly";

      const left = document.createElement("div");
      left.className = "discipline-left";

      const labelParts = splitDisciplineDisplay(descriptor);

      const name = document.createElement("span");
      name.className = "discipline-name";
      name.textContent = labelParts.title;
      left.append(name);

      if (labelParts.detail) {
        const detail = document.createElement("span");
        detail.className = "discipline-detail";
        detail.textContent = labelParts.detail;
        left.append(detail);
      }

      if (descriptor.kind === "standard") {
        const thresholds = document.createElement("div");
        thresholds.className = "threshold-chip-row";

        const bronzeChip = document.createElement("span");
        bronzeChip.className = "threshold-chip threshold-chip--bronze";
        bronzeChip.textContent = descriptor.thresholdsRaw?.bronze || "-";

        const silberChip = document.createElement("span");
        silberChip.className = "threshold-chip threshold-chip--silber";
        silberChip.textContent = descriptor.thresholdsRaw?.silver || "-";

        const goldChip = document.createElement("span");
        goldChip.className = "threshold-chip threshold-chip--gold";
        goldChip.textContent = descriptor.thresholdsRaw?.gold || "-";

        thresholds.append(bronzeChip, silberChip, goldChip);
        left.append(thresholds);
      } else {
        const detail = document.createElement("span");
        detail.className = "discipline-detail";
        detail.textContent = getRequirementsDescriptorDetailText(profileAthlete, descriptor);
        left.append(detail);
      }

      row.append(left);
      item.append(row);

      if (descriptor.kind === "association" || descriptor.kind === "swimProof") {
        row.classList.add("discipline-btn--association-toggle");
        row.setAttribute("role", "button");
        row.tabIndex = 0;

        const optionsWrap = document.createElement("div");
        optionsWrap.className = "requirements-badge-options";
        optionsWrap.hidden = true;

        let optionLabels = [];
        let emptyText = "";
        if (descriptor.kind === "association") {
          const options = getAssociationBadgeEntriesForCategory(descriptor.category, profileAthlete)
            .slice()
            .sort((leftOption, rightOption) => normalizeText(leftOption.badgeName).localeCompare(normalizeText(rightOption.badgeName), "de"));
          optionLabels = options.map((option) => formatAssociationBadgeOptionLabel(option));
          emptyText = "Keine passenden Verbandsabzeichen gefunden.";
        } else {
          const band = getSwimProofBandForAthlete(profileAthlete);
          const options = getSwimProofOptionsForBand(band)
            .slice()
            .sort((leftOption, rightOption) => normalizeText(leftOption.proofName).localeCompare(normalizeText(rightOption.proofName), "de"));
          optionLabels = options.map((option) => formatSwimProofOptionLabel(option));
          emptyText = "Keine passenden Schwimmnachweise gefunden.";
        }

        if (optionLabels.length === 0) {
          const emptyNote = document.createElement("p");
          emptyNote.className = "group-empty-note";
          emptyNote.textContent = emptyText;
          optionsWrap.append(emptyNote);
        } else {
          const optionList = document.createElement("ul");
          optionList.className = "requirements-badge-list";

          for (const optionLabel of optionLabels) {
            const optionItem = document.createElement("li");
            optionItem.className = "requirements-badge-item";
            optionItem.textContent = optionLabel;
            optionList.append(optionItem);
          }

          optionsWrap.append(optionList);
        }

        const toggleAssociationOptions = () => {
          const shouldOpen = optionsWrap.hidden;
          optionsWrap.hidden = !shouldOpen;
          row.classList.toggle("is-open", shouldOpen);
        };

        row.addEventListener("click", toggleAssociationOptions);
        row.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") {
            return;
          }

          event.preventDefault();
          toggleAssociationOptions();
        });

        item.append(optionsWrap);
      }

      list.append(item);
    }

    section.append(headingWrap, list);
    container.append(section);
  }
}

function renderRequirementsInspectorView(options = {}) {
  if (!requirementsInspectorPanel) {
    return;
  }

  requirementsInspectorPanel.innerHTML = "";

  const filters = document.createElement("section");
  filters.className = "requirements-filters";

  const heading = document.createElement("div");
  heading.className = "requirements-filters-heading";
  heading.innerHTML = "<h3>Anforderungen filtern</h3><p>Alter im Jahr, Geburtsjahr oder Geburtsdatum eingeben. Optional mit W / M eingabe.</p>";

  const filterGrid = document.createElement("div");
  filterGrid.className = "requirements-filter-grid";

  const parsedInput = parseRequirementsInspectorInput(state.requirementsInspectorInput);
  const selectedGender = getAutomaticRequirementsInspectorGender(parsedInput.detectedGender);

  const ageFilter = document.createElement("div");
  ageFilter.className = "requirements-filter-block";
  ageFilter.innerHTML = "<h4>Eingabe</h4>";

  const ageInputWrap = document.createElement("div");
  ageInputWrap.className = "requirements-age-input-wrap";
  const ageInput = document.createElement("input");
  ageInput.type = "text";
  ageInput.className = "requirements-age-input";
  ageInput.placeholder = "z.B. 14, 2012, 12.04.2012 oder 2012-04-12";
  ageInput.value = normalizeText(state.requirementsInspectorInput);
  ageInput.addEventListener("input", () => {
    const selectionStart = ageInput.selectionStart;
    const selectionEnd = ageInput.selectionEnd;
    state.requirementsInspectorInput = ageInput.value;
    renderRequirementsInspectorView({
      focusInput: true,
      selectionStart,
      selectionEnd
    });
  });
  ageInputWrap.append(ageInput);

  const genderFilter = document.createElement("div");
  genderFilter.className = "requirements-filter-block";
  genderFilter.innerHTML = "<h4>Geschlecht</h4>";

  const genderToggle = document.createElement("div");
  genderToggle.className = "requirements-gender-toggle";

  for (const genderValue of ["W", "M"]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "requirements-gender-btn";
    if (selectedGender === genderValue) {
      button.classList.add("is-active");
    }
    button.textContent = genderValue;
    button.addEventListener("click", () => {
      state.requirementsInspectorGender = genderValue;
      renderRequirementsInspectorView();
    });
    genderToggle.append(button);
  }

  genderFilter.append(genderToggle);

  ageFilter.append(ageInputWrap);

  filterGrid.append(ageFilter, genderFilter);
  filters.append(heading, filterGrid);

  const results = document.createElement("div");
  results.className = "requirements-results";

  const resolved = resolveRequirementsInspectorTarget(parsedInput);

  if (resolved.info) {
    const info = document.createElement("p");
    info.className = "form-subnote";
    info.textContent = resolved.info;
    results.append(info);
  }

  if (!resolved.target) {
    const empty = document.createElement("p");
    empty.className = "group-empty-note";
    empty.textContent = resolved.message || "Keine Anforderungen gefunden.";
    results.append(empty);
  } else {
    const card = document.createElement("section");
    card.className = "requirements-result-card";

    const cardTitle = document.createElement("h3");
    cardTitle.textContent = resolved.target.label;

    card.append(cardTitle);
    renderRequirementsTargetDisciplines(card, resolved.target.profileAthlete, resolved.target.requirementGroup);
    results.append(card);
  }

  requirementsInspectorPanel.append(filters, results);

  if (options.focusInput) {
    requestAnimationFrame(() => {
      focusRequirementsInspectorInput(options.selectionStart, options.selectionEnd);
    });
  }
}

function groupDisciplinesByCategory(disciplines) {
  const groupedMap = new Map();

  for (const categoryName of CATEGORY_ORDER) {
    groupedMap.set(categoryName, []);
  }

  for (const discipline of disciplines) {
    const categoryName = discipline.category || "Weitere";
    if (!groupedMap.has(categoryName)) {
      groupedMap.set(categoryName, []);
    }

    groupedMap.get(categoryName).push(discipline);
  }

  const orderedCategories = [
    ...CATEGORY_ORDER,
    ...Array.from(groupedMap.keys()).filter((categoryName) => !CATEGORY_ORDER.includes(categoryName))
  ];

  return orderedCategories
    .map((categoryName) => ({
      category: categoryName,
      disciplines: (groupedMap.get(categoryName) || []).slice().sort((left, right) => left.disciplineName.localeCompare(right.disciplineName, "de"))
    }))
    .filter((group) => group.disciplines.length > 0);
}

function getRuleByStorageKey(group, ruleStorageKey) {
  if (!group || !Array.isArray(group.disciplines)) {
    return null;
  }

  return group.disciplines.find((discipline) => getRuleStorageKey(discipline) === ruleStorageKey) || null;
}

function renderDisciplineInfoCard(message) {
  const card = document.createElement("div");
  card.className = "placeholder-card";

  const title = document.createElement("h2");
  title.textContent = "Disziplinen";

  const text = document.createElement("p");
  text.textContent = message;

  card.append(title, text);
  disciplineGroups.append(card);
}

function splitDisciplineDisplay(rule) {
  const name = normalizeText(rule.disciplineName);
  if (!name) {
    return {
      title: "Unbekannte Disziplin",
      detail: ""
    };
  }

  let separatorCommaIndex = -1;
  for (let index = 0; index < name.length; index += 1) {
    if (name[index] !== ",") {
      continue;
    }

    const previousChar = name[index - 1] || "";
    const nextChar = name[index + 1] || "";
    const isDecimalComma = /\d/.test(previousChar) && /\d/.test(nextChar);

    if (isDecimalComma) {
      continue;
    }

    separatorCommaIndex = index;
    break;
  }

  if (separatorCommaIndex > 0) {
    return {
      title: name.slice(0, separatorCommaIndex).trim(),
      detail: name.slice(separatorCommaIndex + 1).trim()
    };
  }

  const metricMatch = name.match(/^(.*?)(\b\d+[\d,.]*\s?(?:m|km|gr|kg|s)\b.*)$/i);
  if (metricMatch && normalizeText(metricMatch[1])) {
    return {
      title: normalizeText(metricMatch[1]),
      detail: normalizeText(metricMatch[2])
    };
  }

  return {
    title: name,
    detail: ""
  };
}

function getLevelCssSuffix(level) {
  if (level === "Bronze") {
    return "bronze";
  }

  if (level === "Silber") {
    return "silber";
  }

  if (level === "Gold") {
    return "gold";
  }

  return "none";
}

function setAthleteDetailHeaderLevel(level) {
  if (!athleteDetailTitleWrap) {
    return;
  }

  athleteDetailTitleWrap.classList.remove("detail-title-wrap--none", "detail-title-wrap--bronze", "detail-title-wrap--silber", "detail-title-wrap--gold");
  athleteDetailTitleWrap.classList.add(`detail-title-wrap--${getLevelCssSuffix(level)}`);
}

function getAssociationVirtualDisplayCategories() {
  return ["Ausdauer", "Koordination"];
}

function getRenderableDisciplineGroups(athlete, group) {
  const grouped = groupDisciplinesByCategory(group?.disciplines || []).map((categoryGroup) => ({
    category: categoryGroup.category,
    disciplines: categoryGroup.disciplines.map((rule) => ({
      ...rule,
      kind: "standard",
      storageKey: getRuleStorageKey(rule)
    }))
  }));

  const groupedMap = new Map(grouped.map((categoryGroup) => [categoryGroup.category, categoryGroup]));

  for (const categoryName of getAssociationVirtualDisplayCategories()) {
    const hasOptions = getAssociationBadgeEntriesForCategory(categoryName, athlete).length > 0;
    const hasHistory = getPerformanceEntries(athlete, getAssociationBadgeRuleStorageKey(categoryName)).length > 0;
    if (!hasOptions && !hasHistory) {
      continue;
    }

    if (!groupedMap.has(categoryName)) {
      const createdGroup = {
        category: categoryName,
        disciplines: []
      };
      grouped.push(createdGroup);
      groupedMap.set(categoryName, createdGroup);
    }

    groupedMap.get(categoryName).disciplines.push(createAssociationVirtualDiscipline(categoryName));
  }

  const hasSwimBand = !!getSwimProofBandForAthlete(athlete);
  const hasSwimHistory = getSwimProofManualEntries(athlete).length > 0;
  if (hasSwimBand || hasSwimHistory || !!state.requirements?.swimProofRequirements) {
    grouped.push({
      category: "Schwimmen",
      disciplines: [createSwimProofVirtualDiscipline()]
    });
  }

  const orderedCategories = [
    ...CATEGORY_ORDER,
    "Schwimmen",
    ...grouped.map((categoryGroup) => categoryGroup.category).filter((categoryName) => !CATEGORY_ORDER.includes(categoryName) && categoryName !== "Schwimmen")
  ];

  return orderedCategories
    .map((categoryName) => grouped.find((categoryGroup) => categoryGroup.category === categoryName) || null)
    .filter((categoryGroup) => !!categoryGroup && categoryGroup.disciplines.length > 0);
}

function getDisciplineListItemViewModel(athlete, group, disciplineDescriptor) {
  if (disciplineDescriptor.kind === "association") {
    const latestEntry = getAssociationBadgeLatestEntryForCategory(athlete, disciplineDescriptor.category);
    const status = getAssociationBadgeStatusForCategory(athlete, disciplineDescriptor.category);

    return {
      bestLevel: status?.valid ? status.recognizedLevel : "-",
      bestValue: status?.badgeName || latestEntry?.valueInput || "-",
      detailText: status?.valid ? `Stufe: ${status.badgeLevel || "-"}` : "Tippen fuer Abzeichen-Auswahl und Stufe"
    };
  }

  if (disciplineDescriptor.kind === "swimProof") {
    const swimProofStatus = resolveSwimProofStatus(athlete, group);
    const detailText = swimProofStatus.valid
      ? `Nachweis: ${swimProofStatus.proofName || "-"}`
      : swimProofStatus.reason || "Tippen fuer Nachweis-Auswahl";

    return {
      bestLevel: swimProofStatus.level,
      bestValue: swimProofStatus.performanceText || swimProofStatus.proofName || "-",
      detailText
    };
  }

  const performanceEntries = getPerformanceEntries(athlete, disciplineDescriptor.storageKey);
  const bestEntry = getBestPerformanceEntry(disciplineDescriptor, performanceEntries);
  const bestLevel = bestEntry ? evaluatePerformanceLevel(disciplineDescriptor, bestEntry.valueNormalized) : "-";

  return {
    bestLevel,
    bestValue: bestEntry ? formatNormalizedValue(disciplineDescriptor, bestEntry.valueNormalized, bestEntry.valueInput) : "-",
    detailText: ""
  };
}

function renderDisciplineGroups(athlete, group) {
  disciplineGroups.innerHTML = "";

  if (!state.requirements) {
    renderDisciplineInfoCard("Anforderungen konnten nicht geladen werden.");
    return;
  }

  if (!group) {
    renderDisciplineInfoCard("Keine passende Altersgruppe in den Anforderungen gefunden.");
    return;
  }

  const grouped = getRenderableDisciplineGroups(athlete, group);
  if (grouped.length === 0) {
    renderDisciplineInfoCard("Keine Disziplinen fuer diese Gruppe vorhanden.");
    return;
  }

  const categoryLevels = getAthleteCategoryLevels(athlete, group);

  for (const categoryGroup of grouped) {
    const section = document.createElement("section");
    section.className = "discipline-category";

    const headingWrap = document.createElement("div");
    headingWrap.className = "discipline-category-heading";

    const categoryLevel = categoryLevels[categoryGroup.category] || "-";
    const headingIcon = createStatusIconElement(categoryGroup.category, categoryLevel, "status-icon--heading");

    const heading = document.createElement("h3");
    heading.textContent = categoryGroup.category;

    const headingLevel = document.createElement("span");
    headingLevel.className = "discipline-category-level";
    headingLevel.textContent = categoryLevel === "-" ? "keine Stufe" : categoryLevel;

    headingWrap.append(headingIcon, heading, headingLevel);

    const list = document.createElement("ul");
    list.className = "discipline-list";

    for (const descriptor of categoryGroup.disciplines) {
      const ruleStorageKey = descriptor.storageKey;
      const { bestLevel, bestValue, detailText } = getDisciplineListItemViewModel(athlete, group, descriptor);
      const levelCssSuffix = getLevelCssSuffix(bestLevel);
      const labelParts = splitDisciplineDisplay(descriptor);

      const item = document.createElement("li");
      item.className = "discipline-item";

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = `discipline-btn discipline-btn--${levelCssSuffix}`;
      trigger.dataset.ruleKey = ruleStorageKey;

      if (ruleStorageKey === state.selectedDisciplineKey) {
        trigger.classList.add("is-selected");
      }

      const row = document.createElement("div");
      row.className = "discipline-row";

      const left = document.createElement("div");
      left.className = "discipline-left";

      const name = document.createElement("span");
      name.className = "discipline-name";
      name.textContent = labelParts.title;

      left.append(name);

      if (labelParts.detail) {
        const detail = document.createElement("span");
        detail.className = "discipline-detail";
        detail.textContent = labelParts.detail;
        left.append(detail);
      }

      if (descriptor.kind === "standard") {
        const thresholds = document.createElement("div");
        thresholds.className = "threshold-chip-row";

        const bronzeChip = document.createElement("span");
        bronzeChip.className = "threshold-chip threshold-chip--bronze";
        bronzeChip.textContent = descriptor.thresholdsRaw?.bronze || "-";

        const silberChip = document.createElement("span");
        silberChip.className = "threshold-chip threshold-chip--silber";
        silberChip.textContent = descriptor.thresholdsRaw?.silver || "-";

        const goldChip = document.createElement("span");
        goldChip.className = "threshold-chip threshold-chip--gold";
        goldChip.textContent = descriptor.thresholdsRaw?.gold || "-";

        thresholds.append(bronzeChip, silberChip, goldChip);
        left.append(thresholds);
      } else if (detailText) {
        const virtualHint = document.createElement("span");
        virtualHint.className = "discipline-detail";
        virtualHint.textContent = detailText;
        left.append(virtualHint);
      }

      const right = document.createElement("div");
      right.className = "discipline-right";

      const best = document.createElement("span");
      best.className = "discipline-best";
      best.textContent = bestValue;

      const bestLevelLabel = document.createElement("span");
      bestLevelLabel.className = "discipline-best-level";
      bestLevelLabel.textContent = bestLevel === "-" ? "keine Stufe" : bestLevel;

      right.append(best, bestLevelLabel);
      row.append(left, right);

      trigger.append(row);
      item.append(trigger);
      list.append(item);
    }

    section.append(headingWrap, list);
    disciplineGroups.append(section);
  }
}

function performanceValuePlaceholder(rule) {
  if (rule.unitType === "time_mm_ss") {
    return "mm:ss (z.B. 4:35, 435, 4m35s)";
  }

  if (rule.unitType === "time_seconds") {
    return "Sekunden (z.B. 12,4 oder 0:12,4)";
  }

  if (rule.unitType === "level") {
    return "Stufe (1/2/3 oder Bronze/Silber/Gold)";
  }

  return "Leistung eingeben";
}

function getSwimLinkedHistoryEntries(athlete, group) {
  if (!athlete) {
    return [];
  }

  const linkedEntries = [];

  if (group && Array.isArray(group.disciplines)) {
    for (const rule of group.disciplines) {
      if (!isSwimmingRule(rule) || !["Ausdauer", "Schnelligkeit"].includes(rule.category)) {
        continue;
      }

      const ruleStorageKey = getRuleStorageKey(rule);
      const ruleEntries = getPerformanceEntries(athlete, ruleStorageKey);
      for (const entry of ruleEntries) {
        linkedEntries.push({
          ...entry,
          id: `linked::${ruleStorageKey}::${entry.id}`,
          meta: {
            ...(entry.meta || {}),
            linkedRuleKey: ruleStorageKey,
            linkedEntryId: entry.id,
            linkedDisciplineName: rule.disciplineName,
            linked: true
          }
        });
      }
    }
  }

  const swimBand = getSwimProofBandForAthlete(athlete);
  if (swimBand) {
    const associationStorageKey = getAssociationBadgeRuleStorageKey("Ausdauer");
    const associationEntries = getPerformanceEntries(athlete, associationStorageKey);

    for (const entry of associationEntries) {
      const badgeName = normalizeText(entry.meta?.badgeName || entry.valueInput);
      const matchingProof = findSwimProofBadgeOptionByName(swimBand, badgeName);
      if (!matchingProof) {
        continue;
      }

      linkedEntries.push({
        ...entry,
        id: `linked::${associationStorageKey}::${entry.id}`,
        meta: {
          ...(entry.meta || {}),
          proofKey: normalizeText(entry.meta?.proofKey || matchingProof.proofKey),
          proofName: normalizeText(entry.meta?.proofName || matchingProof.proofName || badgeName),
          linkedRuleKey: associationStorageKey,
          linkedEntryId: entry.id,
          linkedDisciplineName: "Verbandsabzeichen (Ausdauer)",
          linked: true
        }
      });
    }
  }

  return linkedEntries;
}

function getDisciplineHistoryEntries(athlete, group, descriptor) {
  if (descriptor.kind === "association") {
    return getPerformanceEntries(athlete, descriptor.storageKey);
  }

  if (descriptor.kind === "swimProof") {
    const manualEntries = getSwimProofManualEntries(athlete).filter((entry) => !(entry.meta?.linkedRuleKey && entry.meta?.linkedEntryId));
    const linkedEntries = getSwimLinkedHistoryEntries(athlete, group);
    return [...manualEntries, ...linkedEntries];
  }

  return getPerformanceEntries(athlete, descriptor.storageKey);
}

function getPerformanceHistoryLevelLabel(descriptor, entry, athlete, group) {
  if (descriptor.kind === "association") {
    const recognizedLevel = normalizeText(entry.meta?.recognizedLevel);
    if (recognizedLevel) {
      return recognizedLevel;
    }

    const status = evaluateAssociationBadgeStatusForMeta(athlete, descriptor.category, entry.meta?.badgeId, entry.meta?.badgeLevel);
    return status?.valid ? status.recognizedLevel : "-";
  }

  if (descriptor.kind === "swimProof") {
    if (entry.meta?.linkedRuleKey) {
      const linkedDescriptor = getDisciplineDescriptorByStorageKey(athlete, group, entry.meta.linkedRuleKey);
      if (linkedDescriptor?.kind === "standard") {
        return evaluatePerformanceLevel(linkedDescriptor, entry.valueNormalized);
      }

      if (linkedDescriptor?.kind === "association") {
        const recognizedLevel = normalizeText(entry.meta?.recognizedLevel || entry.meta?.badgeLevel);
        if (recognizedLevel) {
          return recognizedLevel;
        }

        const status = evaluateAssociationBadgeStatusForMeta(
          athlete,
          linkedDescriptor.category,
          entry.meta?.badgeId,
          entry.meta?.badgeLevel || "Gold"
        );
        return status?.valid ? status.recognizedLevel : "-";
      }
    }

    if (entry.meta?.requiresTimedInput && Number.isFinite(Number(entry.meta?.maxTimeSec))) {
      const measuredSeconds = Number(entry.valueNormalized);
      return Number.isFinite(measuredSeconds) && measuredSeconds <= Number(entry.meta.maxTimeSec) ? "Gold" : "-";
    }

    const status = resolveSwimProofStatus(athlete, group);
    return status.level;
  }

  return evaluatePerformanceLevel(descriptor, entry.valueNormalized);
}

function formatPerformanceHistoryValue(descriptor, entry, athlete, group) {
  if (descriptor.kind === "association") {
    const badgeName = normalizeText(entry.meta?.badgeName) || normalizeText(entry.valueInput);
    const badgeLevel = normalizeText(entry.meta?.badgeLevel);
    return badgeLevel ? `${badgeName} | ${badgeLevel}` : badgeName || "-";
  }

  if (descriptor.kind === "swimProof") {
    if (entry.meta?.linkedRuleKey) {
      const linkedDescriptor = getDisciplineDescriptorByStorageKey(athlete, group, entry.meta.linkedRuleKey);
      if (linkedDescriptor?.kind === "standard") {
        return formatNormalizedValue(linkedDescriptor, entry.valueNormalized, entry.valueInput);
      }

      if (linkedDescriptor?.kind === "association") {
        const badgeName = normalizeText(entry.meta?.badgeName) || normalizeText(entry.valueInput) || normalizeText(entry.meta?.proofName);
        const badgeLevel = normalizeText(entry.meta?.badgeLevel);
        return badgeLevel ? `${badgeName} | ${badgeLevel}` : badgeName || "-";
      }
    }

    const fromMeta = normalizeText(entry.meta?.performanceText || entry.meta?.proofName);
    return fromMeta || normalizeText(entry.valueInput) || "-";
  }

  return formatNormalizedValue(descriptor, entry.valueNormalized, entry.valueInput);
}

function updateSpecialLevelPickerButtons(selectedLevel) {
  const normalizedLevel = normalizeBadgeMedalLevel(selectedLevel);
  for (const button of performanceSpecialLevelButtons) {
    const isActive = normalizeText(button.dataset.level) === normalizedLevel;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }
}

function setSpecialLevelPickerSelection(levelValue) {
  const normalizedLevel = normalizeBadgeMedalLevel(levelValue);
  if (performanceSpecialLevelInput) {
    performanceSpecialLevelInput.value = normalizedLevel;
  }

  updateSpecialLevelPickerButtons(normalizedLevel);
}

function setSpecialLevelInputMode(mode, selectedLevel = "") {
  if (!performanceSpecialLevelInput) {
    return;
  }

  if (mode === "picker") {
    performanceSpecialLevelInput.hidden = true;
    performanceSpecialLevelInput.readOnly = true;
    performanceSpecialLevelInput.placeholder = "";
    if (performanceSpecialLevelPicker) {
      performanceSpecialLevelPicker.hidden = false;
    }
    setSpecialLevelPickerSelection(selectedLevel || performanceSpecialLevelInput.value);
    return;
  }

  if (mode === "text") {
    performanceSpecialLevelInput.hidden = false;
    performanceSpecialLevelInput.readOnly = false;
    if (performanceSpecialLevelPicker) {
      performanceSpecialLevelPicker.hidden = true;
    }
    updateSpecialLevelPickerButtons("");
    return;
  }

  performanceSpecialLevelInput.hidden = true;
  performanceSpecialLevelInput.readOnly = false;
  performanceSpecialLevelInput.value = "";
  performanceSpecialLevelInput.placeholder = "";
  if (performanceSpecialLevelPicker) {
    performanceSpecialLevelPicker.hidden = true;
  }
  updateSpecialLevelPickerButtons("");
}

function updateAssociationSpecialInputState(athlete, descriptor, editingEntry = null) {
  if (!performanceSpecialLevelLabel || !performanceSpecialLevelInput || !performanceSpecialHint) {
    return;
  }

  const selectedBadgeId = normalizeText(performanceSpecialSelect?.value);
  const selectedBadge = getAssociationBadgeEntryById(selectedBadgeId);
  const requiresBadgeLevel = isAssociationBadgeLevelSelectionRequired(selectedBadge);

  performanceSpecialLevelLabel.hidden = !requiresBadgeLevel;
  performanceSpecialLevelInput.required = requiresBadgeLevel;

  if (requiresBadgeLevel) {
    performanceSpecialLevelText.textContent = "Stufe";
    const storedLevel = normalizeBadgeMedalLevel(editingEntry?.meta?.badgeLevel || performanceSpecialLevelInput.value);
    setSpecialLevelInputMode("picker", storedLevel);

    const hintParts = ["Stufe per Klick waehlen: Bronze, Silber oder Gold."];
    if (normalizeText(selectedBadge?.minLevel)) {
      hintParts.push(`Mindeststufe fuer Anerkennung: ${selectedBadge.minLevel}`);
    }
    if (allowsAssociationBadgeEvidenceOnly(descriptor.category, selectedBadge)) {
      hintParts.push("Als Schwimmnachweis bleibt das Abzeichen gueltig, in Ausdauer zaehlt es erst bei ausreichender Stufe.");
    }

    performanceSpecialHint.hidden = false;
    performanceSpecialHint.textContent = hintParts.join(" | ");
  } else {
    setSpecialLevelInputMode("none");
    performanceSpecialHint.hidden = false;
    performanceSpecialHint.textContent = "Wird in der Kategorie automatisch als Gold angerechnet.";
  }
}

function resetPerformanceSpecialFields() {
  if (!performanceSpecialFields) {
    return;
  }

  performanceSpecialFields.hidden = true;

  if (performanceSpecialSelectLabel) {
    performanceSpecialSelectLabel.hidden = true;
  }
  if (performanceSpecialLevelLabel) {
    performanceSpecialLevelLabel.hidden = true;
  }
  if (performanceSpecialHint) {
    performanceSpecialHint.hidden = true;
    performanceSpecialHint.textContent = "";
  }

  if (performanceSpecialSelect) {
    performanceSpecialSelect.innerHTML = "";
  }
  setSpecialLevelInputMode("none");
}

function configureSpecialFieldsForAssociation(athlete, descriptor, editingEntry = null) {
  if (!performanceSpecialFields || !performanceSpecialSelect || !performanceSpecialSelectLabel || !performanceSpecialSelectText || !performanceSpecialLevelLabel || !performanceSpecialLevelText) {
    return;
  }

  performanceSpecialFields.hidden = false;
  performanceSpecialSelectLabel.hidden = false;
  performanceSpecialLevelLabel.hidden = true;
  performanceSpecialSelectText.textContent = "Verbandsabzeichen";

  const options = getAssociationBadgeEntriesForCategory(descriptor.category, athlete).sort((left, right) => left.badgeName.localeCompare(right.badgeName, "de"));
  const selectedBadgeId = normalizeText(editingEntry?.meta?.badgeId);

  performanceSpecialSelect.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "Bitte auswaehlen";
  performanceSpecialSelect.append(placeholderOption);

  for (const badge of options) {
    const option = document.createElement("option");
    option.value = badge.badgeId;
    option.textContent = formatAssociationBadgeOptionLabel(badge);
    performanceSpecialSelect.append(option);
  }

  if (selectedBadgeId && !options.some((badge) => badge.badgeId === selectedBadgeId)) {
    const existingBadge = getAssociationBadgeEntryById(selectedBadgeId);
    if (existingBadge) {
      const option = document.createElement("option");
      option.value = existingBadge.badgeId;
      option.textContent = `${formatAssociationBadgeOptionLabel(existingBadge)} | gespeichert`;
      performanceSpecialSelect.append(option);
    }
  }

  performanceSpecialSelect.value = selectedBadgeId;
  performanceSpecialLevelInput.value = normalizeBadgeMedalLevel(editingEntry?.meta?.badgeLevel);
  performanceSpecialLevelInput.placeholder = "";
  performanceSpecialLevelInput.required = false;

  updateAssociationSpecialInputState(athlete, descriptor, editingEntry);
}

function findSwimReferenceRuleForProof(group, proof) {
  if (!group || !Array.isArray(group.disciplines) || !proof) {
    return null;
  }

  const preferredCategory = getPreferredCategoryForSwimProof(proof);
  const requiredDistance = Number(proof.distanceM);
  const candidates = [];

  for (const rule of group.disciplines) {
    if (!isSwimmingRule(rule)) {
      continue;
    }

    if (preferredCategory && rule.category !== preferredCategory) {
      continue;
    }

    const disciplineDistance = extractDistanceMetersFromRule(rule);
    if (Number.isFinite(requiredDistance) && Number.isFinite(disciplineDistance)) {
      const isSpeedProof = normalizeText(proof.proofKey).startsWith("speed_");
      if (isSpeedProof && Math.abs(disciplineDistance - requiredDistance) > 0.5) {
        continue;
      }
      if (!isSpeedProof && disciplineDistance < requiredDistance) {
        continue;
      }
    }

    const distanceDelta = Number.isFinite(requiredDistance) && Number.isFinite(disciplineDistance) ? Math.abs(disciplineDistance - requiredDistance) : 9999;
    candidates.push({ rule, distanceDelta });
  }

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((left, right) => left.distanceDelta - right.distanceDelta || left.rule.disciplineName.localeCompare(right.rule.disciplineName, "de"));
  return candidates[0].rule;
}

function updateSwimProofSpecialInputState(athlete, group) {
  if (!performanceSpecialSelect || !performanceSpecialLevelLabel || !performanceSpecialLevelInput || !performanceSpecialHint) {
    return;
  }

  const selectionKey = normalizeText(performanceSpecialSelect.value);
  const swimBand = getSwimProofBandForAthlete(athlete);
  const proof = getSwimProofOptionByKey(swimBand, selectionKey) || getAllSwimProofOptions().find((entry) => entry.proofKey === selectionKey) || null;
  const isPerformanceProof = normalizeText(proof?.proofType) === "performance";
  const requiresBadgeLevel = isSwimProofBadgeLevelRequired(proof);
  const requiresTimedInput = Number.isFinite(Number(proof?.maxTimeSec));
  const requiresPerformanceInput = isPerformanceProof || requiresTimedInput || requiresBadgeLevel;

  performanceSpecialLevelLabel.hidden = !requiresPerformanceInput;
  performanceSpecialLevelInput.required = requiresPerformanceInput;

  const referenceRule = proof ? findSwimReferenceRuleForProof(group, proof) : null;

  if (requiresPerformanceInput) {
    if (isPerformanceProof) {
      performanceSpecialLevelText.textContent = "Leistung";
      setSpecialLevelInputMode("text");
      performanceSpecialLevelInput.placeholder = referenceRule ? performanceValuePlaceholder(referenceRule) : "Leistung eingeben";
    } else if (requiresBadgeLevel) {
      performanceSpecialLevelText.textContent = "Stufe";
      const selectedLevel = normalizeBadgeMedalLevel(performanceSpecialLevelInput.value);
      setSpecialLevelInputMode("picker", selectedLevel);
    } else {
      performanceSpecialLevelText.textContent = "Zeitnachweis";
      setSpecialLevelInputMode("text");
      performanceSpecialLevelInput.placeholder = "mm:ss oder Sekunden";
    }
  } else {
    setSpecialLevelInputMode("none");
  }

  const hintParts = [];
  if (proof) {
    hintParts.push(proof.proofName);

    if (!requiresPerformanceInput) {
      hintParts.push("Keine Leistungseingabe erforderlich");
    }

    if (requiresTimedInput) {
      hintParts.push(`Zeit erforderlich: max ${formatMinutesSecondsInput(Number(proof.maxTimeSec))}`);
    }

    if (normalizeText(proof.minLevel)) {
      hintParts.push(`Mindeststufe: ${proof.minLevel}`);
    }

    if (requiresBadgeLevel) {
      hintParts.push("Stufe erforderlich: Bronze, Silber oder Gold");
      hintParts.push("Fuer Ausdauer gilt Deutsches Schwimmabzeichen erst ab Gold");
    }

    if (referenceRule && requiresPerformanceInput) {
      hintParts.push(
        `Disziplinwerte: Bronze ${referenceRule.thresholdsRaw?.bronze || "-"} | Silber ${referenceRule.thresholdsRaw?.silver || "-"} | Gold ${referenceRule.thresholdsRaw?.gold || "-"}`
      );
    }
  } else {
    hintParts.push("Automatisch verknuepfte Schwimmleistungen aus Ausdauer/Schnelligkeit werden immer beruecksichtigt.");
    hintParts.push("Bitte Nachweis auswaehlen.");
  }

  performanceSpecialHint.hidden = false;
  performanceSpecialHint.textContent = hintParts.join(" | ");
}

function configureSpecialFieldsForSwimProof(athlete, group, editingEntry = null) {
  if (!performanceSpecialFields || !performanceSpecialSelect || !performanceSpecialSelectLabel || !performanceSpecialSelectText || !performanceSpecialLevelLabel || !performanceSpecialLevelText) {
    return;
  }

  performanceSpecialFields.hidden = false;
  performanceSpecialSelectLabel.hidden = false;
  performanceSpecialLevelLabel.hidden = false;
  performanceSpecialSelectText.textContent = "Schwimmnachweis";
  performanceSpecialLevelText.textContent = "Leistung (optional)";

  const swimBand = getSwimProofBandForAthlete(athlete);
  let selectedProofKey = normalizeText(
    editingEntry?.meta?.selectionKey || editingEntry?.meta?.proofKey || resolveSwimProofStatus(athlete, getRequirementGroupForAthlete(athlete)).selectionKey
  );
  if (selectedProofKey === AUTO_SWIM_PROOF_OPTION) {
    selectedProofKey = "";
  }

  const proofOptions = getSwimProofOptionsForBand(swimBand);

  performanceSpecialSelect.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "Bitte auswaehlen";
  performanceSpecialSelect.append(placeholderOption);

  for (const proof of proofOptions) {
    const option = document.createElement("option");
    option.value = proof.proofKey;
    option.textContent = formatSwimProofOptionLabel(proof);
    performanceSpecialSelect.append(option);
  }

  const availableProofKeys = Array.from(performanceSpecialSelect.options).map((option) => option.value);
  if (selectedProofKey && !availableProofKeys.includes(selectedProofKey)) {
    const storedProof = getAllSwimProofOptions().find((proof) => proof.proofKey === selectedProofKey);
    if (storedProof) {
      const option = document.createElement("option");
      option.value = storedProof.proofKey;
      option.textContent = `${formatSwimProofOptionLabel(storedProof)} | gespeichert`;
      performanceSpecialSelect.append(option);
    }
  }

  performanceSpecialSelect.value = selectedProofKey;
  const editingProofType = normalizeText(editingEntry?.meta?.proofType).toLowerCase();
  const editingBadgeLevel = normalizeBadgeMedalLevel(editingEntry?.meta?.badgeLevel);
  if (editingProofType === "badge") {
    setSpecialLevelPickerSelection(editingBadgeLevel);
  } else {
    performanceSpecialLevelInput.value = normalizeText(editingEntry?.meta?.performanceText || editingEntry?.valueInput);
    updateSpecialLevelPickerButtons("");
  }

  updateSwimProofSpecialInputState(athlete, group);
}

function setPerformanceFormDefaults(descriptor, athlete, group, editingEntry = null) {
  resetPerformanceSpecialFields();

  performanceValueInput.value = "";
  performanceValueInput.placeholder = performanceValuePlaceholder(descriptor);
  performanceValueInput.required = true;
  if (performanceValueLabel) {
    performanceValueLabel.hidden = false;
  }
  if (performanceDateTimeLabel) {
    performanceDateTimeLabel.hidden = false;
  }

  if (descriptor.kind === "association" || descriptor.kind === "swimProof") {
    if (performanceValueLabel) {
      performanceValueLabel.hidden = true;
    }
    performanceValueInput.required = false;

    if (descriptor.kind === "association") {
      configureSpecialFieldsForAssociation(athlete, descriptor, editingEntry);
    } else {
      configureSpecialFieldsForSwimProof(athlete, group, editingEntry);
    }
  }

  performanceDateTimeInput.value = toDateTimeLocalValue(new Date().toISOString());
  savePerformanceButton.textContent = "Speichern";
  cancelPerformanceEditButton.hidden = false;
  if (deletePerformanceButton) {
    deletePerformanceButton.hidden = true;
  }
}

function renderPerformanceHistory(descriptor, entries, athlete, group) {
  performanceHistory.innerHTML = "";

  const sortedEntries = entries.slice().sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime());

  if (sortedEntries.length === 0) {
    const item = document.createElement("li");
    item.className = "history-item";
    item.textContent = "Noch keine Leistung erfasst.";
    performanceHistory.append(item);
    return;
  }

  for (const entry of sortedEntries) {
    const level = getPerformanceHistoryLevelLabel(descriptor, entry, athlete, group);

    const item = document.createElement("li");
    item.className = "history-item";
    if (state.editPerformanceId === entry.id) {
      item.classList.add("is-active");
    }

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "history-item-btn";
    trigger.dataset.entryId = entry.id;

    const main = document.createElement("div");
    main.className = "history-main";

    const valueLine = document.createElement("strong");
    valueLine.textContent = `${formatPerformanceHistoryValue(descriptor, entry, athlete, group)} (${level})`;

    const meta = document.createElement("p");
    meta.className = "history-meta";
    const linkedHint = entry.meta?.linkedRuleKey ? ` | verknuepft: ${entry.meta?.linkedDisciplineName || "Schwimmleistung"}` : "";
    meta.textContent = `${formatDateTime(entry.measuredAt)}${linkedHint}${state.editPerformanceId === entry.id ? " | Bearbeitung aktiv" : ""}`;

    main.append(valueLine, meta);
    trigger.append(main);
    item.append(trigger);
    performanceHistory.append(item);
  }
}

function focusPerformanceInput() {
  if (!performanceModal || performanceModal.hidden || typeof performanceValueInput.focus !== "function") {
    return;
  }

  requestAnimationFrame(() => {
    const preferSpecialSelect = performanceSpecialFields && !performanceSpecialFields.hidden && performanceSpecialSelect && !performanceSpecialSelectLabel?.hidden;

    if (preferSpecialSelect) {
      try {
        performanceSpecialSelect.focus({ preventScroll: true });
      } catch (_error) {
        performanceSpecialSelect.focus();
      }
    } else {
      try {
        performanceValueInput.focus({ preventScroll: true });
        performanceValueInput.select();
      } catch (_error) {
        performanceValueInput.focus();
      }
    }

    updatePerformanceModalKeyboardOffset();
    const focusTarget = preferSpecialSelect ? performanceSpecialSelect : performanceValueInput;
    focusTarget.scrollIntoView({ block: "center", inline: "nearest" });
  });
}

function renderPerformanceModal() {
  if (!performanceModal || performanceModal.hidden) {
    return;
  }

  const athlete = getSelectedAthlete();
  if (!athlete) {
    closePerformanceModal();
    return;
  }

  const group = getRequirementGroupForAthlete(athlete);
  const descriptor = getDisciplineDescriptorByStorageKey(athlete, group, state.selectedDisciplineKey);
  if (!descriptor) {
    closePerformanceModal();
    return;
  }

  const entries = getDisciplineHistoryEntries(athlete, group, descriptor);
  const athleteName = athleteDisplayName(athlete) || "Athlet";

  performanceModalTitle.textContent = descriptor.disciplineName;

  let baseMeta = `Athlet: ${athleteName}`;
  if (descriptor.kind === "standard") {
    baseMeta = `${baseMeta} | Bronze: ${descriptor.thresholdsRaw?.bronze || "-"} | Silber: ${descriptor.thresholdsRaw?.silver || "-"} | Gold: ${descriptor.thresholdsRaw?.gold || "-"}`;
  } else if (descriptor.kind === "association") {
    baseMeta = `${baseMeta} | Kategorie: ${descriptor.category} | Verbandsabzeichen`;
  } else {
    baseMeta = `${baseMeta} | Schwimmnachweis`;
  }

  let editingEntry = null;
  if (state.editPerformanceId) {
    editingEntry = entries.find((entry) => entry.id === state.editPerformanceId) || null;
    if (!editingEntry) {
      state.editPerformanceId = "";
    }
  }

  setPerformanceFormDefaults(descriptor, athlete, group, editingEntry);

  let isEditing = false;
  if (editingEntry) {
    isEditing = true;
    if (descriptor.kind === "standard") {
      performanceValueInput.value = editingEntry.valueInput || formatNormalizedValue(descriptor, editingEntry.valueNormalized);
    }
    performanceDateTimeInput.value = toDateTimeLocalValue(editingEntry.measuredAt);
  }

  performanceModalMeta.textContent = isEditing ? `${baseMeta} | Bearbeitung aktiv` : baseMeta;
  if (deletePerformanceButton) {
    deletePerformanceButton.hidden = !isEditing || !!editingEntry?.meta?.linkedRuleKey;
  }

  renderPerformanceHistory(descriptor, entries, athlete, group);
}

function openPerformanceModal(entryId = "") {
  const athlete = getSelectedAthlete();
  if (!athlete) {
    showToast("Bitte zuerst einen Athleten waehlen.");
    return;
  }

  const group = getRequirementGroupForAthlete(athlete);
  const descriptor = getDisciplineDescriptorByStorageKey(athlete, group, state.selectedDisciplineKey);
  if (!descriptor) {
    showToast("Bitte zuerst eine Disziplin auswaehlen.");
    return;
  }

  state.editPerformanceId = entryId;
  performanceModal.hidden = false;
  updateBodyScrollLock();
  updatePerformanceModalKeyboardOffset();
  renderPerformanceModal();
  focusPerformanceInput();
}

function renderDisciplineDetailPanel(athlete, group) {
  if (disciplineDetailPanel) {
    disciplineDetailPanel.hidden = true;
  }

  if (!group || !state.selectedDisciplineKey) {
    state.editPerformanceId = "";
    closePerformanceModal();
    return;
  }

  const descriptor = getDisciplineDescriptorByStorageKey(athlete, group, state.selectedDisciplineKey);
  if (!descriptor) {
    state.selectedDisciplineKey = "";
    state.editPerformanceId = "";
    closePerformanceModal();
    return;
  }

  if (openPerformanceModalButton) {
    openPerformanceModalButton.textContent = "Leistung erfassen";
  }

  renderPerformanceModal();
}

function focusDisciplinePanel() {
  if (!disciplineDetailPanel || disciplineDetailPanel.hidden) {
    return;
  }

  const compactPortrait =
    window.matchMedia("(max-width: 859px)").matches &&
    !window.matchMedia("(orientation: landscape) and (min-width: 700px)").matches;

  if (compactPortrait) {
    disciplineDetailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderAthleteDetail() {
  const athlete = getSelectedAthlete();
  updateAthleteLayoutSelectionState();

  if (state.requirementsInspectorOpen) {
    if (athleteDetailPane) {
      athleteDetailPane.classList.remove("detail-placeholder");
    }

    athleteDetailPlaceholder.hidden = true;
    athleteDetailContent.hidden = false;

    if (athleteDetailTitleWrap) {
      athleteDetailTitleWrap.hidden = true;
    }

    if (athleteDetailName) {
      athleteDetailName.textContent = "";
    } else if (athleteDetailTitle) {
      athleteDetailTitle.textContent = "";
    }

    if (athleteDetailCode) {
      athleteDetailCode.textContent = "";
      athleteDetailCode.hidden = true;
    }

    if (athleteDetailSubtitle) {
      athleteDetailSubtitle.textContent = "";
      athleteDetailSubtitle.hidden = true;
    }

    if (editAthleteButton) {
      editAthleteButton.hidden = true;
    }

    if (athleteCategoryStatusRow) {
      athleteCategoryStatusRow.innerHTML = "";
    }

    setAthleteDetailHeaderLevel("-");
    state.selectedDisciplineKey = "";
    state.editPerformanceId = "";
    closePerformanceModal();

    if (requirementsInspectorPanel) {
      requirementsInspectorPanel.hidden = false;
      renderRequirementsInspectorView();
    }

    if (disciplineGroups) {
      disciplineGroups.hidden = true;
      disciplineGroups.innerHTML = "";
    }

    if (disciplineDetailPanel) {
      disciplineDetailPanel.hidden = true;
    }

    return;
  }

  if (athleteDetailTitleWrap) {
    athleteDetailTitleWrap.hidden = false;
  }

  if (requirementsInspectorPanel) {
    requirementsInspectorPanel.hidden = true;
    requirementsInspectorPanel.innerHTML = "";
  }

  if (disciplineGroups) {
    disciplineGroups.hidden = false;
  }

  if (editAthleteButton) {
    editAthleteButton.hidden = !athlete;
  }

  if (!athlete) {
    if (athleteDetailPane) {
      athleteDetailPane.classList.add("detail-placeholder");
    }

    athleteDetailPlaceholder.hidden = false;
    athleteDetailContent.hidden = true;
    if (disciplineDetailPanel) {
      disciplineDetailPanel.hidden = true;
    }
    closePerformanceModal();
    if (athleteCategoryStatusRow) {
      athleteCategoryStatusRow.innerHTML = "";
    }

    if (athleteDetailName) {
      athleteDetailName.textContent = "Athlet";
    } else if (athleteDetailTitle) {
      athleteDetailTitle.textContent = "Athlet";
    }
    if (athleteDetailCode) {
      athleteDetailCode.textContent = "";
      athleteDetailCode.hidden = true;
    }
    if (athleteDetailSubtitle) {
      athleteDetailSubtitle.textContent = "";
      athleteDetailSubtitle.hidden = true;
    }
    setAthleteDetailHeaderLevel("-");
    return;
  }

  if (athleteDetailPane) {
    athleteDetailPane.classList.remove("detail-placeholder");
  }

  athleteDetailPlaceholder.hidden = true;
  athleteDetailContent.hidden = false;
  const displayName = athleteDisplayName(athlete) || "Athlet";
  const displayCode = athleteCode(athlete);
  if (athleteDetailName) {
    athleteDetailName.textContent = displayName;
  } else if (athleteDetailTitle) {
    athleteDetailTitle.textContent = displayName;
  }
  if (athleteDetailCode) {
    athleteDetailCode.textContent = displayCode ? ` ${displayCode}` : "";
    athleteDetailCode.hidden = !displayCode;
  }
  if (athleteDetailSubtitle) {
    athleteDetailSubtitle.textContent = "";
    athleteDetailSubtitle.hidden = true;
  }

  const requirementGroup = getRequirementGroupForAthlete(athlete);
  const categoryLevels = getAthleteCategoryLevels(athlete, requirementGroup);
  const overallLevel = getOverallAwardLevel(categoryLevels);
  setAthleteDetailHeaderLevel(overallLevel);
  renderAthleteCategoryStatusRow(categoryLevels);

  if (state.selectedDisciplineKey && !getDisciplineDescriptorByStorageKey(athlete, requirementGroup, state.selectedDisciplineKey)) {
    state.selectedDisciplineKey = "";
    state.editPerformanceId = "";
    closePerformanceModal();
  }

  renderDisciplineGroups(athlete, requirementGroup);
  renderDisciplineDetailPanel(athlete, requirementGroup);
}

function parseLocaleNumberSmart(rawValue) {
  const compact = normalizeText(rawValue).replace(/\s+/g, "");
  if (!compact) {
    return NaN;
  }

  let cleaned = compact.replace(/[^0-9,\.\-]/g, "");
  if (!cleaned) {
    return NaN;
  }

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      cleaned = cleaned.replace(/\./g, "").replace(/,/g, ".");
    } else {
      cleaned = cleaned.replace(/,/g, "");
    }
  } else if (lastComma !== -1) {
    const commaParts = cleaned.split(",");
    if (commaParts.length > 1 && commaParts[commaParts.length - 1].length === 3) {
      cleaned = cleaned.replace(/,/g, "");
    } else {
      cleaned = cleaned.replace(/,/g, ".");
    }
  } else if (lastDot !== -1) {
    const dotParts = cleaned.split(".");
    if (dotParts.length > 1 && dotParts[dotParts.length - 1].length === 3) {
      cleaned = cleaned.replace(/\./g, "");
    }
  }

  cleaned = cleaned.replace(/(?!^)-/g, "");
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : NaN;
}

function parseFlexibleClockToSeconds(rawValue) {
  const value = normalizeText(rawValue).toLowerCase();
  if (!value) {
    return NaN;
  }

  const compact = value.replace(/\s+/g, "");

  const clockMatch = compact.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  if (clockMatch) {
    if (clockMatch[3] !== undefined) {
      const hours = Number(clockMatch[1]);
      const minutes = Number(clockMatch[2]);
      const seconds = Number(clockMatch[3]);
      if (minutes < 60 && seconds < 60) {
        return hours * 3600 + minutes * 60 + seconds;
      }
    } else {
      const minutes = Number(clockMatch[1]);
      const seconds = Number(clockMatch[2]);
      if (seconds < 60) {
        return minutes * 60 + seconds;
      }
    }
  }

  const dotClockMatch = compact.match(/^(\d+)[\.,](\d{2})$/);
  if (dotClockMatch) {
    const minutes = Number(dotClockMatch[1]);
    const seconds = Number(dotClockMatch[2]);
    if (seconds < 60) {
      return minutes * 60 + seconds;
    }
  }

  const packedMatch = compact.match(/^\d{3,4}$/);
  if (packedMatch) {
    const seconds = Number(compact.slice(-2));
    const minutes = Number(compact.slice(0, -2));
    if (seconds < 60) {
      return minutes * 60 + seconds;
    }
  }

  const textualMatch = value.match(/^(?:(\d+)\s*h)?\s*(?:(\d+)\s*(?:m|min))?\s*(?:(\d+(?:[\.,]\d+)?)\s*(?:s|sek))?$/i);
  if (textualMatch && (textualMatch[1] || textualMatch[2] || textualMatch[3])) {
    const hours = Number(textualMatch[1] || 0);
    const minutes = Number(textualMatch[2] || 0);
    const seconds = parseLocaleNumberSmart(textualMatch[3] || "0");
    if (Number.isFinite(hours) && Number.isFinite(minutes) && Number.isFinite(seconds) && minutes < 60 && seconds < 60) {
      return hours * 3600 + minutes * 60 + seconds;
    }
  }

  return NaN;
}

function formatMinutesSecondsInput(totalSeconds) {
  const value = Number(totalSeconds);
  if (!Number.isFinite(value) || value < 0) {
    return "";
  }

  const rounded = Math.round(value * 100) / 100;
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded - minutes * 60;

  if (Number.isInteger(seconds)) {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  let secondText = seconds.toFixed(2).replace(".", ",");
  if (seconds < 10) {
    secondText = `0${secondText}`;
  }

  return `${minutes}:${secondText}`;
}

function formatNumberInputValue(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "";
  }

  return numeric.toLocaleString("de-DE", {
    minimumFractionDigits: Number.isInteger(numeric) ? 0 : 1,
    maximumFractionDigits: 2
  });
}

function parsePerformanceValue(rule, valueInput) {
  const rawValue = normalizeText(valueInput);
  if (!rawValue) {
    return {
      ok: false,
      message: "Bitte eine Leistung eintragen."
    };
  }

  const lowerRaw = rawValue.toLowerCase();

  if (rule.unitType === "time_mm_ss") {
    let totalSeconds = parseFlexibleClockToSeconds(rawValue);
    if (!Number.isFinite(totalSeconds)) {
      totalSeconds = parseLocaleNumberSmart(rawValue);
    }

    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
      return {
        ok: false,
        message: "Zeit bitte als mm:ss, gepackte Zeit (z.B. 435) oder Sekunden eingeben."
      };
    }

    return {
      ok: true,
      normalizedValue: totalSeconds,
      valueInput: formatMinutesSecondsInput(totalSeconds)
    };
  }

  if (rule.unitType === "time_seconds") {
    let totalSeconds = parseFlexibleClockToSeconds(rawValue);
    if (!Number.isFinite(totalSeconds)) {
      totalSeconds = parseLocaleNumberSmart(rawValue);
    }

    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
      return {
        ok: false,
        message: "Sekunden bitte als Zahl oder Zeitformat eingeben."
      };
    }

    return {
      ok: true,
      normalizedValue: totalSeconds,
      valueInput: `${formatNumberInputValue(totalSeconds)} s`
    };
  }

  if (rule.unitType === "level") {
    let levelValue = NaN;

    if (/(^|\b)gold(\b|$)/.test(lowerRaw)) {
      levelValue = 3;
    } else if (/(^|\b)silber(\b|$)/.test(lowerRaw)) {
      levelValue = 2;
    } else if (/(^|\b)bronze(\b|$)/.test(lowerRaw)) {
      levelValue = 1;
    } else if (lowerRaw === "g") {
      levelValue = 3;
    } else if (lowerRaw === "s") {
      levelValue = 2;
    } else if (lowerRaw === "b") {
      levelValue = 1;
    } else {
      levelValue = parseLocaleNumberSmart(rawValue);
    }

    if (!Number.isFinite(levelValue) || !Number.isInteger(levelValue) || levelValue < 0) {
      return {
        ok: false,
        message: "Bei Level bitte 1/2/3 oder Bronze/Silber/Gold angeben."
      };
    }

    return {
      ok: true,
      normalizedValue: levelValue,
      valueInput: String(levelValue)
    };
  }

  const numericValue = parseLocaleNumberSmart(rawValue);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return {
      ok: false,
      message: "Leistung ist ungueltig."
    };
  }

  return {
    ok: true,
    normalizedValue: numericValue,
    valueInput: formatNumberInputValue(numericValue)
  };
}

function handlePerformanceSubmit(event) {
  event.preventDefault();

  const athlete = getSelectedAthlete();
  if (!athlete) {
    return;
  }

  const group = getRequirementGroupForAthlete(athlete);
  const descriptor = getDisciplineDescriptorByStorageKey(athlete, group, state.selectedDisciplineKey);
  if (!descriptor) {
    showToast("Bitte zuerst eine Disziplin auswaehlen.");
    return;
  }

  const measuredAtIso = parseDateTimeLocalToIso(performanceDateTimeInput.value);
  if (!measuredAtIso) {
    showToast("Bitte Datum und Uhrzeit angeben.");
    return;
  }

  const entries = getPerformanceEntries(athlete, descriptor.storageKey).slice();
  const now = new Date().toISOString();
  const isEditing = !!state.editPerformanceId;

  let draftEntry = null;
  if (descriptor.kind === "association") {
    const selectedBadgeId = normalizeText(performanceSpecialSelect?.value);
    if (!selectedBadgeId) {
      showToast("Bitte ein Verbandsabzeichen auswaehlen.");
      return;
    }

    const badge = getAssociationBadgeEntryById(selectedBadgeId);
    if (!badge) {
      showToast("Das gewaehlte Verbandsabzeichen ist nicht gueltig.");
      return;
    }

    const requiresBadgeLevelSelection = isAssociationBadgeLevelSelectionRequired(badge);
    const selectedBadgeLevel = requiresBadgeLevelSelection ? normalizeBadgeMedalLevel(performanceSpecialLevelInput?.value) : "Gold";
    if (requiresBadgeLevelSelection && !selectedBadgeLevel) {
      showToast("Bitte Stufe als Bronze, Silber oder Gold auswaehlen.");
      return;
    }

    const status = evaluateAssociationBadgeStatusForMeta(athlete, descriptor.category, selectedBadgeId, selectedBadgeLevel);
    const canSaveAsEvidenceOnly =
      allowsAssociationBadgeEvidenceOnly(descriptor.category, badge) &&
      !!requiresBadgeLevelSelection &&
      !!status &&
      !status.valid &&
      /erfordert mindestens/i.test(normalizeText(status.message));

    if (!status || (!status.valid && !canSaveAsEvidenceOnly)) {
      showToast(status?.message || "Verbandsabzeichen passt nicht zur Kategorie oder Stufe.");
      return;
    }

    const recognizedLevel = status.valid ? status.recognizedLevel : "";

    draftEntry = {
      valueInput: badge.badgeName,
      valueNormalized: getLevelRank(recognizedLevel || selectedBadgeLevel || "Gold"),
      measuredAt: measuredAtIso,
      meta: {
        badgeId: selectedBadgeId,
        badgeName: badge.badgeName,
        badgeLevel: selectedBadgeLevel,
        category: descriptor.category,
        recognizedLevel
      }
    };
  } else if (descriptor.kind === "swimProof") {
    const selectionKey = normalizeText(performanceSpecialSelect?.value);
    if (!selectionKey) {
      showToast("Bitte einen Schwimmnachweis auswaehlen.");
      return;
    }

    const performanceRawText = normalizeText(performanceSpecialLevelInput?.value);
    const swimBand = getSwimProofBandForAthlete(athlete);
    const selectedProof =
      getSwimProofOptionByKey(swimBand, selectionKey) || getAllSwimProofOptions().find((proof) => proof.proofKey === selectionKey) || null;
    if (!selectedProof) {
      showToast("Der gewaehlte Schwimmnachweis ist nicht gueltig.");
      return;
    }

    const isAutoSelection = selectionKey === AUTO_SWIM_PROOF_OPTION;
    const isPerformanceProof = !isAutoSelection && normalizeText(selectedProof?.proofType) === "performance";
    const isBadgeProof = !isAutoSelection && isSwimProofBadge(selectedProof);
    const requiresBadgeLevel = !isAutoSelection && isSwimProofBadgeLevelRequired(selectedProof);
    const requiresTimedInput = selectionKey !== AUTO_SWIM_PROOF_OPTION && Number.isFinite(Number(selectedProof?.maxTimeSec));
    const requiresPerformanceInput = isPerformanceProof || requiresTimedInput || requiresBadgeLevel;

    let normalizedSwimValue = 1;
    let displaySwimValue = selectedProof?.proofName || "Schwimmnachweis";
    let performanceText = "";
    let selectedBadgeLevel = "";
    let linkedRuleKey = "";
    let linkedEntryId = "";

    if (requiresPerformanceInput && !performanceRawText) {
      showToast(requiresBadgeLevel ? "Bitte Stufe Bronze, Silber oder Gold angeben." : "Bitte die geforderte Leistung eintragen.");
      return;
    }

    if (isPerformanceProof) {
      const referenceRule = findSwimReferenceRuleForProof(group, selectedProof);
      if (!referenceRule) {
        showToast("Keine passende Schwimm-Disziplin in Ausdauer/Schnelligkeit gefunden.");
        return;
      }

      const parsedPerformance = parsePerformanceValue(referenceRule, performanceRawText);
      if (!parsedPerformance.ok) {
        showToast(parsedPerformance.message);
        return;
      }

      const achievedLevel = evaluatePerformanceLevel(referenceRule, parsedPerformance.normalizedValue);
      if (normalizeText(selectedProof?.minLevel) && getLevelRank(achievedLevel) < getLevelRank(selectedProof.minLevel)) {
        showToast(`Mindeststufe ${selectedProof.minLevel} nicht erreicht.`);
        return;
      }

      const disciplineStorageKey = getRuleStorageKey(referenceRule);
      const disciplineEntries = getPerformanceEntries(athlete, disciplineStorageKey).slice();
      const existingLinkedEntry =
        state.editPerformanceId &&
        entries.find((entry) => entry.id === state.editPerformanceId && entry.meta?.linkedRuleKey === disciplineStorageKey)
          ? entries.find((entry) => entry.id === state.editPerformanceId && entry.meta?.linkedRuleKey === disciplineStorageKey)
          : null;

      const existingDisciplineIndex = existingLinkedEntry
        ? disciplineEntries.findIndex((entry) => entry.id === existingLinkedEntry.meta?.linkedEntryId)
        : -1;

      if (existingDisciplineIndex >= 0) {
        disciplineEntries[existingDisciplineIndex] = {
          ...disciplineEntries[existingDisciplineIndex],
          valueInput: parsedPerformance.valueInput,
          valueNormalized: parsedPerformance.normalizedValue,
          measuredAt: measuredAtIso,
          updatedAt: now
        };
        linkedEntryId = disciplineEntries[existingDisciplineIndex].id;
      } else {
        const newLinkedId = createId();
        disciplineEntries.push({
          id: newLinkedId,
          valueInput: parsedPerformance.valueInput,
          valueNormalized: parsedPerformance.normalizedValue,
          measuredAt: measuredAtIso,
          meta: {},
          createdAt: now,
          updatedAt: now
        });
        linkedEntryId = newLinkedId;
      }

      disciplineEntries.sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime());
      setPerformanceEntries(athlete, disciplineStorageKey, disciplineEntries);

      linkedRuleKey = disciplineStorageKey;
      normalizedSwimValue = parsedPerformance.normalizedValue;
      displaySwimValue = parsedPerformance.valueInput;
      performanceText = parsedPerformance.valueInput;
    } else if (isBadgeProof) {
      const badgeCategory = "Ausdauer";
      const matchingBadge = findAssociationBadgeEntryForSwimProof(athlete, badgeCategory, selectedProof);

      selectedBadgeLevel = requiresBadgeLevel ? normalizeBadgeMedalLevel(performanceRawText) : "Gold";
      if (requiresBadgeLevel && !selectedBadgeLevel) {
        showToast("Bitte Stufe als Bronze, Silber oder Gold angeben.");
        return;
      }

      normalizedSwimValue = getLevelRank(selectedBadgeLevel || "Gold");
      displaySwimValue = selectedProof?.proofName || "Schwimmnachweis";
      performanceText = requiresBadgeLevel && selectedBadgeLevel ? `${displaySwimValue} (${selectedBadgeLevel})` : displaySwimValue;

      if (matchingBadge) {
        const associationStorageKey = getAssociationBadgeRuleStorageKey(badgeCategory);
        const associationEntries = getPerformanceEntries(athlete, associationStorageKey).slice();
        const existingLinkedEntry =
          state.editPerformanceId &&
          entries.find((entry) => entry.id === state.editPerformanceId && entry.meta?.linkedRuleKey === associationStorageKey)
            ? entries.find((entry) => entry.id === state.editPerformanceId && entry.meta?.linkedRuleKey === associationStorageKey)
            : null;

        const existingAssociationIndex = existingLinkedEntry
          ? associationEntries.findIndex((entry) => entry.id === existingLinkedEntry.meta?.linkedEntryId)
          : -1;

        const status = evaluateAssociationBadgeStatusForMeta(athlete, badgeCategory, matchingBadge.badgeId, selectedBadgeLevel || "Gold");
        const recognizedLevel = status?.valid ? status.recognizedLevel : "";
        const normalizedAssociationValue = status?.valid
          ? getLevelRank(status.recognizedLevel)
          : getLevelRank(selectedBadgeLevel || "Gold");

        if (existingAssociationIndex >= 0) {
          associationEntries[existingAssociationIndex] = {
            ...associationEntries[existingAssociationIndex],
            valueInput: matchingBadge.badgeName,
            valueNormalized: normalizedAssociationValue,
            measuredAt: measuredAtIso,
            meta: {
              ...(associationEntries[existingAssociationIndex].meta || {}),
              badgeId: matchingBadge.badgeId,
              badgeName: matchingBadge.badgeName,
              badgeLevel: selectedBadgeLevel || "Gold",
              category: badgeCategory,
              recognizedLevel,
              proofKey: selectedProof?.proofKey || "",
              proofName: selectedProof?.proofName || matchingBadge.badgeName
            },
            updatedAt: now
          };
          linkedEntryId = associationEntries[existingAssociationIndex].id;
        } else {
          const newLinkedId = createId();
          associationEntries.push({
            id: newLinkedId,
            valueInput: matchingBadge.badgeName,
            valueNormalized: normalizedAssociationValue,
            measuredAt: measuredAtIso,
            meta: {
              badgeId: matchingBadge.badgeId,
              badgeName: matchingBadge.badgeName,
              badgeLevel: selectedBadgeLevel || "Gold",
              category: badgeCategory,
              recognizedLevel,
              proofKey: selectedProof?.proofKey || "",
              proofName: selectedProof?.proofName || matchingBadge.badgeName
            },
            createdAt: now,
            updatedAt: now
          });
          linkedEntryId = newLinkedId;
        }

        associationEntries.sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime());
        setPerformanceEntries(athlete, associationStorageKey, associationEntries);

        linkedRuleKey = associationStorageKey;
        normalizedSwimValue = getLevelRank(selectedBadgeLevel || "Gold");
        displaySwimValue = matchingBadge.badgeName;
        performanceText = requiresBadgeLevel && selectedBadgeLevel ? `${matchingBadge.badgeName} (${selectedBadgeLevel})` : matchingBadge.badgeName;
      }
    } else if (requiresTimedInput) {
      let timedSeconds = parseFlexibleClockToSeconds(performanceRawText);
      if (!Number.isFinite(timedSeconds)) {
        timedSeconds = parseLocaleNumberSmart(performanceRawText);
      }

      if (!Number.isFinite(timedSeconds) || timedSeconds <= 0) {
        showToast("Bitte Zeit fuer den Nachweis als mm:ss oder Sekunden angeben.");
        return;
      }

      const maxTimeSec = Number(selectedProof.maxTimeSec);
      if (timedSeconds > maxTimeSec) {
        showToast(`Zeit ist zu langsam. Maximal erlaubt: ${formatMinutesSecondsInput(maxTimeSec)}.`);
        return;
      }

      normalizedSwimValue = timedSeconds;
      displaySwimValue = formatMinutesSecondsInput(timedSeconds);
      performanceText = displaySwimValue;
    }

    athlete.swimProofSelection = selectionKey;
    athlete.swimProofYear = String(new Date(measuredAtIso).getFullYear());
    athlete.swimProofPerformance = performanceText;

    draftEntry = {
      valueInput: displaySwimValue,
      valueNormalized: normalizedSwimValue,
      measuredAt: measuredAtIso,
      meta: {
        selectionKey,
        proofKey: selectionKey,
        proofName: selectedProof?.proofName || "Automatisch aus Leistungen",
        proofType: selectedProof?.proofType || "linked",
        badgeLevel: selectedBadgeLevel,
        linkedRuleKey,
        linkedEntryId,
        requiresTimedInput,
        maxTimeSec: Number.isFinite(Number(selectedProof?.maxTimeSec)) ? Number(selectedProof.maxTimeSec) : null,
        performanceText
      }
    };
  } else {
    const parsedValue = parsePerformanceValue(descriptor, performanceValueInput.value);
    if (!parsedValue.ok) {
      showToast(parsedValue.message);
      return;
    }

    draftEntry = {
      valueInput: parsedValue.valueInput,
      valueNormalized: parsedValue.normalizedValue,
      measuredAt: measuredAtIso,
      meta: {}
    };
  }

  if (isEditing) {
    const index = entries.findIndex((entry) => entry.id === state.editPerformanceId);
    if (index >= 0) {
      entries[index] = {
        ...entries[index],
        ...draftEntry,
        updatedAt: now
      };
    }
  } else {
    entries.push({
      id: createId(),
      ...draftEntry,
      createdAt: now,
      updatedAt: now
    });
  }

  entries.sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime());
  setPerformanceEntries(athlete, descriptor.storageKey, entries);

  state.editPerformanceId = "";
  saveAthletes();
  refreshAthleteViews();
  renderPerformanceModal();
  focusPerformanceInput();
  showToast(isEditing ? "Leistung aktualisiert." : "Leistung gespeichert.");
}

function parseLinkedHistoryEntryId(entryId) {
  const normalized = normalizeText(entryId);
  if (!normalized.startsWith("linked::")) {
    return null;
  }

  const parts = normalized.split("::");
  if (parts.length < 4) {
    return null;
  }

  return {
    ruleStorageKey: `${parts[1]}::${parts[2]}`,
    entryId: parts.slice(3).join("::")
  };
}

function startPerformanceEdit(entryId) {
  const athlete = getSelectedAthlete();
  if (!athlete) {
    return;
  }

  const group = getRequirementGroupForAthlete(athlete);
  const descriptor = getDisciplineDescriptorByStorageKey(athlete, group, state.selectedDisciplineKey);
  if (!descriptor) {
    return;
  }

  const linkedTarget = parseLinkedHistoryEntryId(entryId);
  if (linkedTarget) {
    const linkedRule = getDisciplineDescriptorByStorageKey(athlete, group, linkedTarget.ruleStorageKey);
    if (!linkedRule || !["standard", "association"].includes(linkedRule.kind)) {
      return;
    }

    state.selectedDisciplineKey = linkedTarget.ruleStorageKey;
    state.editPerformanceId = linkedTarget.entryId;
    renderAthleteDetail();
    openPerformanceModal(linkedTarget.entryId);
    return;
  }

  const entries = getPerformanceEntries(athlete, descriptor.storageKey);
  const exists = entries.some((entry) => entry.id === entryId);
  if (!exists) {
    return;
  }

  openPerformanceModal(entryId);
}

function deletePerformanceEntry(entryId) {
  const athlete = getSelectedAthlete();
  if (!athlete) {
    return;
  }

  const group = getRequirementGroupForAthlete(athlete);
  const descriptor = getDisciplineDescriptorByStorageKey(athlete, group, state.selectedDisciplineKey);
  if (!descriptor) {
    return;
  }

  if (parseLinkedHistoryEntryId(entryId)) {
    showToast("Verknuepfte Leistung bitte in der Original-Disziplin bearbeiten.");
    return;
  }

  const confirmed = window.confirm("Diese Leistung wirklich loeschen?");
  if (!confirmed) {
    return;
  }

  const filtered = getPerformanceEntries(athlete, descriptor.storageKey).filter((entry) => entry.id !== entryId);
  setPerformanceEntries(athlete, descriptor.storageKey, filtered);

  if (descriptor.kind === "swimProof") {
    const latestRemainingEntry = filtered
      .filter((entry) => !isOrphanedLinkedSwimProofEntry(athlete, entry))
      .slice()
      .sort((left, right) => new Date(right.measuredAt).getTime() - new Date(left.measuredAt).getTime())[0];

    if (latestRemainingEntry) {
      athlete.swimProofSelection = normalizeText(latestRemainingEntry.meta?.selectionKey || latestRemainingEntry.meta?.proofKey);
      athlete.swimProofYear = normalizeYearValue(new Date(latestRemainingEntry.measuredAt).getFullYear());
      athlete.swimProofPerformance = normalizeText(latestRemainingEntry.meta?.performanceText || latestRemainingEntry.valueInput);
    } else {
      athlete.swimProofSelection = "";
      athlete.swimProofYear = "";
      athlete.swimProofPerformance = "";
    }
  }

  if (state.editPerformanceId === entryId) {
    state.editPerformanceId = "";
  }

  saveAthletes();
  refreshAthleteViews();
  renderPerformanceModal();
  focusPerformanceInput();
  showToast("Leistung geloescht.");
}

function deleteEditedPerformance() {
  if (!state.editPerformanceId) {
    return;
  }

  deletePerformanceEntry(state.editPerformanceId);
}

function switchView(targetView) {
  if (targetView !== "athletes") {
    closePerformanceModal();
  }

  if (targetView !== "training") {
    clearTrainingAbortConfirmState({ render: false });
    clearTrainingExamGlobalControls();
  }

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === targetView);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    const isCurrent = item.dataset.targetView === targetView;
    item.classList.toggle("is-active", isCurrent);

    if (isCurrent) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  if (targetView === "training") {
    renderTrainingView();
  }

  updateTrainingExamTicker();
  updateTrainingExamSurfaceState();
}

function isStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function installFallbackHint() {
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!window.isSecureContext && !isLocalhost) {
    return "PWA-Installation geht nur mit https:// oder auf localhost.";
  }

  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("ipad")) {
    return "Auf iOS: Teilen > Zum Home-Bildschirm.";
  }

  return "Im Browser-Menue auf Installieren oder Zum Startbildschirm hinzufuegen tippen.";
}

function updateInstallButtonState() {
  installAppButton.hidden = isStandaloneMode();
}

function wireEvents() {
  wireAthleteGenderSelection();

  if (exportDigitalFormatSelect) {
    exportDigitalFormatSelect.addEventListener("change", () => {
      state.digitalExportFormat = normalizeText(exportDigitalFormatSelect.value) || "groupPerformanceXlsx";
    });
  }

  if (exportDigitalScopeSelect) {
    exportDigitalScopeSelect.addEventListener("change", () => {
      state.digitalExportScope = normalizeText(exportDigitalScopeSelect.value) || "all";
      updateDigitalExportScopeVisibility();
    });
  }

  if (exportDigitalGroupSelect) {
    exportDigitalGroupSelect.addEventListener("change", () => {
      state.digitalExportGroupId = normalizeText(exportDigitalGroupSelect.value);
    });
  }

  if (exportDigitalAthletesAllButton) {
    exportDigitalAthletesAllButton.addEventListener("click", () => {
      selectAllDigitalExportAthletes();
    });
  }

  if (exportDigitalAthletesNoneButton) {
    exportDigitalAthletesNoneButton.addEventListener("click", () => {
      clearDigitalExportAthletesSelection();
    });
  }

  if (exportFullButton) {
    exportFullButton.addEventListener("click", exportFullDataset);
  }

  if (exportDigitalButton) {
    exportDigitalButton.addEventListener("click", exportSportabzeichenDigitalCsv);
  }

  if (importCreateGroupCheckbox) {
    importCreateGroupCheckbox.addEventListener("change", updateImportGroupInputState);
  }

  if (importFileInput) {
    importFileInput.addEventListener("change", () => {
      previewSelectedImportFile();
    });
  }

  if (importRunButton) {
    importRunButton.addEventListener("click", () => {
      runImportFromSelectedFile();
    });
  }

  addAthleteButton.addEventListener("click", () => openAthleteModal("create"));
  editAthleteButton.addEventListener("click", () => {
    const selectedAthlete = getSelectedAthlete();
    if (!selectedAthlete) {
      showToast("Bitte zuerst einen Athleten waehlen.");
      return;
    }

    openAthleteModal("edit", selectedAthlete);
  });

  if (athletesTitle) {
    athletesTitle.addEventListener("click", () => {
      openGroupModal("selector");
    });
  }

  if (trainingTitle) {
    trainingTitle.addEventListener("click", () => {
      openGroupModal("selector");
    });
  }

  if (trainingModeToggleButton) {
    trainingModeToggleButton.addEventListener("click", () => {
      state.trainingViewMode = state.trainingViewMode === "requirements" ? "exam" : "requirements";
      if (!isTrainingSplitLayout()) {
        state.trainingCompactPane = "content";
      }
      saveTrainingState();
      renderTrainingView();
    });
  }

  if (trainingBackButton) {
    trainingBackButton.addEventListener("click", () => {
      state.trainingCompactPane = "list";
      saveTrainingState();
      renderTrainingView();
    });
  }

  if (trainingDisciplineList) {
    trainingDisciplineList.addEventListener("click", (event) => {
      const button = event.target.closest('[data-training-action="select-discipline"]');
      if (!button) {
        return;
      }

      setTrainingSelectedDiscipline(button.dataset.disciplineId || "");
    });
  }

  if (requirementsViewButton) {
    requirementsViewButton.addEventListener("click", () => {
      openRequirementsInspectorView();
    });
  }

  athleteBackButton.addEventListener("click", clearSelectedAthlete);

  closeModalButton.addEventListener("click", closeAthleteModal);
  cancelModalButton.addEventListener("click", closeAthleteModal);
  if (cancelGroupModalButton) {
    cancelGroupModalButton.addEventListener("click", () => {
      if (isGroupEditorVisible()) {
        state.groupFormMode = "create";
        state.editGroupId = "";
        setGroupEditorVisibility(false);
        resetGroupForm();
        updateGroupModalState();
        renderGroupModalFilterList();
        return;
      }

      closeGroupModal();
    });
  }
  if (closeGroupModalButton) {
    closeGroupModalButton.addEventListener("click", closeGroupModal);
  }
  if (createGroupButton) {
    createGroupButton.addEventListener("click", () => {
      openGroupModal("create");
    });
  }

  deleteAthleteButton.addEventListener("click", deleteCurrentAthleteFromModal);
  athleteForm.addEventListener("submit", handleAthleteSubmit);
  if (groupForm) {
    groupForm.addEventListener("submit", handleGroupSubmit);
  }
  if (deleteGroupButton) {
    deleteGroupButton.addEventListener("click", deleteCurrentGroupFromModal);
  }
  if (addTrainingSlotButton) {
    addTrainingSlotButton.addEventListener("click", () => {
      addGroupTrainingSlotRow();
      updateGroupTrainingSlotsEmptyState();
    });
  }

  athleteModal.addEventListener("click", (event) => {
    if (event.target === athleteModal) {
      closeAthleteModal();
    }
  });

  if (groupModal) {
    groupModal.addEventListener("click", (event) => {
      if (event.target === groupModal) {
        closeGroupModal();
      }
    });
  }

  if (performanceModal) {
    performanceModal.addEventListener("click", (event) => {
      if (event.target === performanceModal) {
        closePerformanceModal();
      }
    });

    performanceModal.addEventListener("focusin", (event) => {
      updatePerformanceModalKeyboardOffset();

      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ block: "center", inline: "nearest" });
        });
      }
    });
  }

  if (ackDisclaimerButton) {
    ackDisclaimerButton.addEventListener("click", acknowledgeDisclaimer);
  }

  if (window.visualViewport) {
    const syncPerformanceModalPosition = () => {
      updatePerformanceModalKeyboardOffset();
    };

    window.visualViewport.addEventListener("resize", syncPerformanceModalPosition);
    window.visualViewport.addEventListener("scroll", syncPerformanceModalPosition);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (disclaimerModal && !disclaimerModal.hidden) {
      return;
    }

    if (performanceModal && !performanceModal.hidden) {
      closePerformanceModal();
      return;
    }

    if (!athleteModal.hidden) {
      closeAthleteModal();
      return;
    }

    if (groupModal && !groupModal.hidden) {
      if (isGroupEditorVisible()) {
        state.groupFormMode = "create";
        state.editGroupId = "";
        setGroupEditorVisibility(false);
        resetGroupForm();
        updateGroupModalState();
        renderGroupModalFilterList();
        return;
      }

      closeGroupModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    handleTrainingExamHotkeys(event);
  });

  athleteList.addEventListener("click", (event) => {
    const button = event.target.closest(".athlete-card-btn");
    if (!button) {
      return;
    }

    setSelectedAthlete(button.dataset.athleteId || "");
  });

  if (trainingExamPane) {
    trainingExamPane.addEventListener("click", (event) => {
      const actionElement = event.target.closest("[data-training-action]");
      if (!actionElement) {
        return;
      }

      const action = normalizeText(actionElement.dataset.trainingAction);
      const athleteId = normalizeText(actionElement.dataset.athleteId);

      if (action === "start-all-timing") {
        startTrainingGlobalTiming();
        return;
      }

      if (action === "stop-all-timing") {
        stopTrainingGlobalTiming();
        return;
      }

      if (action === "abort-all-timing") {
        abortTrainingGlobalTiming();
        return;
      }

      if (action === "start-marked-timing") {
        startTrainingMarkedTiming();
        return;
      }

      if (action === "stop-marked-timing") {
        stopTrainingMarkedTiming();
        return;
      }

      if (action === "abort-marked-timing") {
        abortTrainingMarkedTiming();
        return;
      }

      if (action === "mark-all-visible") {
        markAllVisibleTrainingAthletes();
        return;
      }

      if (action === "mark-running-visible") {
        markRunningVisibleTrainingAthletes();
        return;
      }

      if (action === "mark-none-visible") {
        clearVisibleTrainingAthleteMarks();
        return;
      }

      if (action === "toggle-athlete-mark" && athleteId) {
        toggleTrainingAthleteMarked(athleteId);
        return;
      }

      if (action === "start-athlete-timing" && athleteId) {
        startTrainingAthleteTiming(athleteId);
        return;
      }

      if (action === "stop-athlete-timing" && athleteId) {
        stopTrainingAthleteTiming(athleteId);
        return;
      }

      if (action === "abort-athlete-timing" && athleteId) {
        abortTrainingAthleteTiming(athleteId);
        return;
      }

      if (action === "save-quick-performance" && athleteId) {
        saveTrainingQuickPerformance(athleteId);
        return;
      }

      if (action === "quick-level" && athleteId) {
        const selectedDiscipline = getSelectedTrainingDiscipline();
        if (!selectedDiscipline) {
          return;
        }

        setTrainingInputDraftValue(selectedDiscipline.id, athleteId, actionElement.dataset.level || "");
        renderTrainingExamPane(selectedDiscipline);
      }
    });

    trainingExamPane.addEventListener("input", (event) => {
      const quickInput = event.target.closest('[data-training-action="quick-input"]');
      const attemptInput = event.target.closest('[data-training-action="quick-attempt-input"]');
      if (!quickInput && !attemptInput) {
        return;
      }

      const selectedDiscipline = getSelectedTrainingDiscipline();
      const athleteId = normalizeText((quickInput || attemptInput).dataset.athleteId);
      if (!selectedDiscipline || !athleteId) {
        return;
      }

      if (quickInput) {
        setTrainingInputDraftValue(selectedDiscipline.id, athleteId, quickInput.value);
        return;
      }

      const attemptIndex = Number(attemptInput.dataset.attemptIndex);
      if (!Number.isInteger(attemptIndex) || attemptIndex < 1 || attemptIndex > 4) {
        return;
      }

      setTrainingAttemptDraftValue(selectedDiscipline.id, athleteId, attemptIndex, attemptInput.value);
    });

    trainingExamPane.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && event.target instanceof HTMLElement) {
        const markableItem = event.target.closest('.training-athlete-item[data-training-action="toggle-athlete-mark"]');
        if (markableItem && event.target === markableItem) {
          const athleteId = normalizeText(markableItem.dataset.athleteId);
          if (athleteId) {
            event.preventDefault();
            toggleTrainingAthleteMarked(athleteId);
            return;
          }
        }
      }

      if (event.key !== "Enter") {
        return;
      }

      const input = event.target.closest('[data-training-action="quick-input"], [data-training-action="quick-attempt-input"]');
      if (!input) {
        return;
      }

      const athleteId = normalizeText(input.dataset.athleteId);
      if (!athleteId) {
        return;
      }

      event.preventDefault();
      saveTrainingQuickPerformance(athleteId);
    });
  }

  disciplineGroups.addEventListener("click", (event) => {
    if (state.requirementsInspectorOpen) {
      return;
    }

    const button = event.target.closest(".discipline-btn");
    if (!button) {
      return;
    }

    state.selectedDisciplineKey = button.dataset.ruleKey || "";
    state.editPerformanceId = "";
    renderAthleteDetail();
    openPerformanceModal();
  });

  performanceForm.addEventListener("submit", handlePerformanceSubmit);

  if (openPerformanceModalButton) {
    openPerformanceModalButton.addEventListener("click", () => {
      openPerformanceModal();
    });
  }

  if (closePerformanceModalButton) {
    closePerformanceModalButton.addEventListener("click", closePerformanceModal);
  }

  if (performanceSpecialSelect) {
    performanceSpecialSelect.addEventListener("change", () => {
      if (!performanceModal || performanceModal.hidden) {
        return;
      }

      const athlete = getSelectedAthlete();
      if (!athlete) {
        return;
      }

      const group = getRequirementGroupForAthlete(athlete);
      const descriptor = getDisciplineDescriptorByStorageKey(athlete, group, state.selectedDisciplineKey);
      if (descriptor?.kind === "swimProof") {
        updateSwimProofSpecialInputState(athlete, group);
        return;
      }

      if (descriptor?.kind === "association") {
        updateAssociationSpecialInputState(athlete, descriptor);
      }
    });
  }

  if (performanceSpecialLevelPicker) {
    performanceSpecialLevelPicker.addEventListener("click", (event) => {
      const button = event.target.closest(".medal-level-btn[data-level]");
      if (!button || !performanceModal || performanceModal.hidden) {
        return;
      }

      setSpecialLevelPickerSelection(button.dataset.level || "");
    });
  }

  cancelPerformanceEditButton.addEventListener("click", () => {
    if (state.editPerformanceId) {
      state.editPerformanceId = "";
      renderPerformanceModal();
      focusPerformanceInput();
      return;
    }

    closePerformanceModal();
  });
  if (deletePerformanceButton) {
    deletePerformanceButton.addEventListener("click", deleteEditedPerformance);
  }

  performanceHistory.addEventListener("click", (event) => {
    const entryButton = event.target.closest(".history-item-btn");
    if (!entryButton) {
      return;
    }

    const entryId = entryButton.dataset.entryId || "";
    if (!entryId) {
      return;
    }

    startPerformanceEdit(entryId);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      switchView(item.dataset.targetView);
    });
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallButtonState();
  });

  installAppButton.addEventListener("click", async () => {
    if (isStandaloneMode()) {
      showToast("App ist bereits installiert.");
      return;
    }

    if (!deferredInstallPrompt) {
      showToast(installFallbackHint());
      return;
    }

    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;

    if (choice.outcome !== "accepted") {
      showToast("Installation abgebrochen.");
    }

    updateInstallButtonState();
  });

  window.addEventListener("appinstalled", () => {
    updateInstallButtonState();
    showToast("App installiert.");
  });

  const displayModeMedia = window.matchMedia("(display-mode: standalone)");
  if (typeof displayModeMedia.addEventListener === "function") {
    displayModeMedia.addEventListener("change", updateInstallButtonState);
  } else if (typeof displayModeMedia.addListener === "function") {
    displayModeMedia.addListener(updateInstallButtonState);
  }

  window.addEventListener("resize", () => {
    updateTrainingLayoutSelectionState();
  });
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register("./sw.js");
  } catch (_error) {
    showToast("Service Worker konnte nicht registriert werden.");
  }
}

async function init() {
  loadAthletes();
  loadGroups();
  loadTrainingState();
  if (pruneGroupAthleteAssignments()) {
    saveGroups();
  }
  ensureDefaultGroupFilterSelection();

  wireEvents();
  updateImportGroupInputState();
  refreshAthleteViews();
  updateInstallButtonState();
  registerServiceWorker();

  await loadRequirementsData();
  if (pruneTrainingExamSessions()) {
    saveTrainingState();
  }

  const pendingTrainingDisciplineId = getFirstRunningTrainingDisciplineId();
  if (pendingTrainingDisciplineId) {
    state.trainingViewMode = "exam";
    state.trainingSelectedDisciplineId = pendingTrainingDisciplineId;
    state.trainingCompactPane = "content";
    saveTrainingState();
  }

  refreshAthleteViews();

  if (pendingTrainingDisciplineId) {
    switchView("training");
    showToast("Laufende Zeitmessung wiederhergestellt.");
  }

  if (!hasAcceptedDisclaimer()) {
    openDisclaimerModal();
  }
}

init();
