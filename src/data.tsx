export const MEDIKAMENTER = [
  { id: "1", name: "Paracet", form: "tab", strength: "1g", route: "PO" },
  {
    id: "2",
    name: "Paracet mixtur",
    form: "mixtur",
    strength: "24 mg/ml",
    route: "PO",
  },
  { id: "3", name: "Ibux", form: "tab", strength: "600mg", route: "PO" },
  { id: "4", name: "Voltaren", form: "tab", strength: "50mg", route: "PO" },
  {
    id: "5",
    name: "Voltaren Inj",
    form: "inj",
    strength: "75mg",
    route: "I.M.",
  },
  { id: "6", name: "Morfin", form: "inj", strength: "1 mg/ml", route: "I.V." },
  {
    id: "7",
    name: "Nitroglycerin",
    form: "spray",
    strength: "",
    route: "Sublingual",
  },
  { id: "8", name: "Nexium", form: "tab", strength: "40 mg", route: "PO" },
  {
    id: "9",
    name: "Ventolin",
    form: "inh",
    strength: "5 mg",
    route: "Forstøver",
  },
  {
    id: "10",
    name: "Nurofen Mixtur",
    form: "mixtur",
    strength: "40 mg/ml",
    route: "PO",
  },
  { id: "11", name: "Buscopan", form: "inj", strength: "20 mg", route: "I.M." },
];

export const PAKKER = {
  MONA: [
    { name: "Morfin", dose: "5 mg", route: "I.V.", strength: "1 mg/ml" },
    { name: "Oksygen", dose: "Fri", route: "Inhalasjon", strength: "" },
    {
      name: "Nitroglycerin",
      dose: "1 spray",
      route: "Sublingual",
      strength: "",
    },
    {
      name: "Acetylsalisylsyre (ASA)",
      dose: "300 mg",
      route: "PO",
      strength: "",
    },
  ],
  Allergi: [
    { name: "Adrenalin", dose: "0.5 mg", route: "I.M.", strength: "" },
    { name: "Deksklorfeniramin", dose: "10 mg", route: "I.M.", strength: "" },
    {
      name: "Solu-cortef",
      dose: "250 mg",
      route: "I.M.",
      strength: "100mg/ml",
    },
  ],
  Inhalasjoner: [
    {
      name: "Atrovent",
      dose: "0.5 mg",
      route: "Forstøver inh.",
      strength: "0.25 mg/ml",
    },
    {
      name: "Ventolin",
      dose: "5 mg",
      route: "Forstøver inh.",
      strength: "5 mg/ml",
    },
  ],
  Gastritt: [
    { name: "Nexium", dose: "40 mg", route: "PO", strength: "" },
    { name: "Novaluzid", dose: "1 stk", route: "PO", strength: "" },
  ],
};

export const DEFAULT_SIGNATURES = [
  { code: "PDA", name: "Peter Alsen" },
  { code: "HHH", name: "Hans Hopland" },
];

export const VITALS = [
  "BT",
  "Puls",
  "Temp",
  "SpO2",
  "Resp",
  "CRP",
  "Glukose",
  "Hb",
  "Urin",
  "HCG",
  "Strep A",
];

export const ADM_FORMS = [
  "PO",
  "I.V.",
  "I.M.",
  "SUP",
  "Inhalasjon",
  "Sublingual",
];
