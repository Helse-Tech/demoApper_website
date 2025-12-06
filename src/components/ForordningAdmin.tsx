import React, { useState, useEffect } from "react";
import {
  Pill,
  Search,
  Clock,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Trash2,
  Save,
  Plus,
  Archive,
  AlertCircle,
  CheckCircle,
  Thermometer,
  Check,
} from "lucide-react";

import { Button, Modal, ConfirmModal } from "./Components";
import {
  MEDIKAMENTER,
  PAKKER,
  VITALS,
  DEFAULT_SIGNATURES,
  ADM_FORMS,
} from "../data";

// =========================================================================
// --- MAIN COMPONENT ------------------------------------------------------
// =========================================================================

const ForordningAdmin = () => {
  const [activeView, setActiveView] = useState("create"); // 'create' | 'archive'
  const [archiveFilter, setArchiveFilter] = useState("all"); // 'all' | 'pending' | 'completed'

  // Add these states near your other state declarations
  const [routeInputs, setRouteInputs] = useState<
    Record<
      string,
      {
        value: string;
        showSuggestions: boolean;
      }
    >
  >({});

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Form state
  const [patient, setPatient] = useState({
    name: "",
    dob: "",
    room: "",
    vitalia: {} as Record<string, boolean>,
  });

  const [meds, setMeds] = useState<Array<any>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [doctorSign, setDoctorSign] = useState("");
  const [showVitalia, setShowVitalia] = useState(false);
  const [showFrequent, setShowFrequent] = useState(false);

  const [signatureList, setSignatureList] = useState(DEFAULT_SIGNATURES);
  const [newSignature, setNewSignature] = useState({ code: "", name: "" });

  // Modal states
  const [modal, setModal] = useState({
    open: false,
    type: "", // 'error' | 'save' | 'newSignature'
    title: "",
    message: "",
  });

  const [prescriptions, setPrescriptions] = useState<Array<any>>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [vitaliaModalOpen, setVitaliaModalOpen] = useState(false);

  // Date/time
  const currentDate = new Date();
  const [orderDate, setOrderDate] = useState(
    currentDate.toLocaleDateString("nb-NO")
  );
  const [orderTime, setOrderTime] = useState(
    currentDate.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const [toast, setToast] = useState(null);

  // Load mock data on mount
  useEffect(() => {
    // Mock data for demonstration
    // const mockData = [
    //   {
    //     id: "1",
    //     patient: {
    //       name: "O.A.",
    //       dob: "150567",
    //       room: "101",
    //       vitalia: { Blodtrykk: "", Puls: "", Temp: "" },
    //     },
    //     medications: [
    //       {
    //         name: "Paracetamol",
    //         dose: "1 stk",
    //         route: "PO",
    //         strength: "500 mg",
    //       },
    //       { name: "Ibuprofen", dose: "1 stk", route: "PO", strength: "400 mg" },
    //     ],
    //     doctorSign: "KJ",
    //     doctorFullName: "Kari Johansen",
    //     orderDate: "01.12.2024",
    //     orderTime: "08:30",
    //     status: "pending",
    //     timestamp: new Date().toISOString(),
    //   },
    //   {
    //     id: "2",
    //     patient: {
    //       name: "K.H.",
    //       dob: "230889",
    //       room: "205",
    //       vitalia: { Puls: "68", SpO2: "98%", Smerte: "3" },
    //     },
    //     medications: [
    //       {
    //         name: "Morfin",
    //         dose: "1 ml",
    //         route: "IV",
    //         strength: "10 mg/ml",
    //         volume: "1 ml",
    //         timeGiven: "01.12.2025 Kl. 15:34",
    //       },
    //     ],
    //     doctorSign: "LT",
    //     doctorFullName: "Lars Thomassen",
    //     orderDate: "30.11.2024",
    //     orderTime: "14:15",
    //     status: "completed",
    //     dateGiven: "30.11.2024",
    //     timeGiven: "15:30",
    //     nurseSign: "AN",
    //     nurseFullName: "Anne Nordmann",
    //     timestamp: new Date(Date.now() - 86400000).toISOString(),
    //   },
    //   {
    //     id: "3",
    //     patient: {
    //       name: "P.O.",
    //       dob: "040195",
    //       room: "103",
    //       vitalia: { Blodtrykk: "", Respirasjon: "", Temp: "" },
    //     },
    //     medications: [
    //       { name: "Metoprolol", dose: "1 stk", route: "PO", strength: "50 mg" },
    //       { name: "Furosemid", dose: "1 stk", route: "PO", strength: "40 mg" },
    //     ],
    //     doctorSign: "ME",
    //     doctorFullName: "Mona Eriksen",
    //     orderDate: "29.11.2024",
    //     orderTime: "10:00",
    //     status: "pending",
    //     timestamp: new Date(Date.now() - 172800000).toISOString(),
    //   },
    // ];

    const mockData = [
      {
        id: "task-A1",
        status: "pending",
        orderDate: "05.12.2025",
        orderTime: "13:00",
        doctorSign: "PDA",
        doctorFullName: "Peter Alsen",
        timestamp: "2025-12-05T12:00:00.000Z",
        nurseSign: "",
        nurseFullName: "",
        patient: {
          name: "S.J.",
          dob: "190382",
          room: "103",
          // Endret til true/false: Dette er hva legen har bestilt
          vitalia: {
            BT: true,
            Puls: true,
            Temp: true,
            SpO2: false,
            Resp: false,
            CRP: true,
            Glukose: true,
            Hb: false,
            Urin: false,
            HCG: false,
            "Strep A": false,
          },
        },
        medications: [
          {
            name: "Morfin",
            dose: "5 mg",
            route: "I.V.",
            strength: "1 mg/ml",
            id: 1764935221550,
            volume: "",
          },
          {
            name: "Oksygen",
            dose: "Fri",
            route: "Inhalasjon",
            strength: "",
            id: 1764935221551,
            volume: "",
          },
          {
            name: "Nitroglycerin",
            dose: "1 spray",
            route: "Sublingual",
            strength: "",
            id: 1764935221552,
            volume: "",
          },
          {
            name: "Acetylsalisylsyre (ASA)",
            dose: "300 mg",
            route: "PO",
            strength: "",
            id: 1764935221553,
            volume: "",
          },
        ],
      },
      {
        id: "task-A3",
        status: "completed",
        orderDate: "05.12.2025",
        orderTime: "13:00",
        doctorSign: "HHH",
        doctorFullName: "Hans Hopland",
        timestamp: "2025-12-05T12:00:00.000Z",
        nurseSign: "SH",
        nurseFullName: "Stine Hansen",
        nurseSignDate: "06.12.2025",
        nurseSignTime: "13:40",
        patient: {
          name: "T.L.",
          dob: "021191",
          room: "107",
          // Endret til true/false: Dette er hva legen har bestilt
          vitalia: {
            BT: true,
            Puls: true,
            Temp: true,
            SpO2: false,
            Resp: false,
            CRP: true,
            Glukose: true,
            Hb: false,
            Urin: false,
            HCG: false,
            "Strep A": false,
          },
          reportedVitalia: {
            BT: {
              value: "130/85",
              date: "06.12.2025",
              time: "13:30",
            },
            Puls: {
              value: "77",
              date: "06.12.2025",
              time: "13:31",
            },
            Temp: {
              value: "37.2",
              date: "06.12.2025",
              time: "13:32",
            },
            CRP: {
              value: "5",
              date: "06.12.2025",
              time: "13:33",
            },
            Glukose: {
              value: "6.1",
              date: "06.12.2025",
              time: "13:34",
            },
          },
        },
        medications: [
          {
            name: "Nexium",
            dose: "40 mg",
            route: "PO",
            strength: "",
            id: 1764935221558,
            volume: "",
            administeredDate: "06.12.2025",
            administeredTime: "13:51",
          },
          {
            name: "Novaluzid",
            dose: "1 stk",
            route: "PO",
            strength: "",
            id: 1764935221559,
            volume: "",
            administeredDate: "06.12.2025",
            administeredTime: "13:52",
          },
        ],
      },
      {
        id: "task-A2",
        status: "pending",
        orderDate: "05.12.2025",
        orderTime: "13:00",
        doctorSign: "HHH",
        doctorFullName: "Hans Hopland",
        timestamp: "2025-12-05T12:00:00.000Z",
        nurseSign: "",
        nurseFullName: "",
        patient: {
          name: "A.S.",
          dob: "030952",
          room: "208",
          // Endret til true/false: Dette er hva legen har bestilt
          vitalia: {
            BT: false,
            Puls: true,
            Temp: true,
            SpO2: true,
            Resp: false,
            CRP: false,
            Glukose: false,
            Hb: false,
            Urin: true,
            HCG: false,
            "Strep A": false,
          },
        },
        medications: [
          {
            name: "Adrenalin",
            dose: "0.5 mg",
            route: "I.M.",
            strength: "",
            id: 1764935221554,
            volume: "",
          },
          {
            name: "Deksklorfeniramin",
            dose: "10 mg",
            route: "I.M.",
            strength: "",
            id: 1764935221555,
            volume: "",
          },
          {
            name: "Solu-cortef",
            dose: "250 mg",
            route: "I.M.",
            strength: "100mg/ml",
            id: 1764935221556,
            volume: "",
          },
        ],
      },
    ];

    setPrescriptions(mockData);
  }, []);

  // Filtered medications for search
  const filteredMeds = MEDIKAMENTER.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add medication
  const addMed = (med: any) => {
    setMeds([
      ...meds,
      {
        ...med,
        dose: med.strength || "",
        id: Date.now().toString(),
        strengthText: med.strength || "",
        volume: "",
      },
    ]);
    setSearchTerm("");
    setShowSuggestions(false);
    setShowFrequent(false);
  };

  // Add medication package
  const addPackage = (pkgName: string) => {
    const pkgMeds = PAKKER[pkgName as keyof typeof PAKKER].map((m, i) => ({
      ...m,
      id: Date.now() + i,
      form: m.route,
      strengthText: m.strength,
      dose: m.dose,
      volume: "",
    }));
    setMeds([...meds, ...pkgMeds]);
    setShowFrequent(false);
  };

  // Update medication field
  const updateMedField = (id: string, field: string, value: string) => {
    setMeds(meds.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  // Remove medication
  const removeMed = (id: string) => {
    setMeds(meds.filter((m) => m.id !== id));
  };

  // Toggle vital sign checkbox
  const toggleVital = (vital: string) => {
    setPatient({
      ...patient,
      vitalia: {
        ...patient.vitalia,
        [vital]: !patient.vitalia[vital],
      },
    });
  };

  // Add new signature
  const handleAddSignature = () => {
    if (!newSignature.code || !newSignature.name) {
      setModal({
        open: true,
        type: "error",
        title: "Mangler informasjon",
        message: "Du må fylle ut både initialer og navn.",
      });
      return;
    }

    const newSig = {
      code: newSignature.code.toUpperCase().substring(0, 3),
      name: newSignature.name,
    };

    setSignatureList([...signatureList, newSig]);
    setDoctorSign(newSig.code);
    setNewSignature({ code: "", name: "" });
    setModal({ ...modal, open: false });
  };

  // Save prescription
  const handleSave = () => {
    if (!patient.name || meds.length === 0 || !doctorSign) {
      setModal({
        open: true,
        type: "error",
        title: "Mangler nødvendig informasjon",
        message:
          "Vennligst fyll ut pasientnavn, legg til minst én medisin, og velg legesignatur.",
      });
      return;
    }

    setModal({
      open: true,
      type: "save",
      title: "Klar for publisering",
      message:
        "Er du sikker på at du vil lagre og publisere denne forordningen? Den blir da tilgjengelig for sykepleierteamet.",
    });
  };

  const confirmSave = () => {
    const currentDoc = signatureList.find((s) => s.code === doctorSign);

    const newPrescription = {
      id: Date.now().toString(),
      patient,
      medications: meds,
      doctorSign,
      doctorFullName: currentDoc?.name || "Ukjent Lege",
      orderDate: new Date().toLocaleDateString("nb-NO"),
      orderTime: new Date().toLocaleTimeString("nb-NO", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    setPrescriptions([newPrescription, ...prescriptions]);

    // Reset form
    setPatient({ name: "", dob: "", room: "", vitalia: {} });
    setMeds([]);
    setDoctorSign("");

    setModal({ ...modal, open: false });

    // Show success toast (simulated)

    const showToast = (msg) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
    };

    const saveDataToApi = () => {
      // Simulerer API-kallet
      //   console.log("SENDER DATA TIL API:", JSON.stringify(data, null, 2));
      showToast("Data lagret og sendt til appene!");
    };
    saveDataToApi();

    // setTimeout(() => {
    //   alert("Forordning lagret og publisert!");
    // }, 100);
  };

  // Filter prescriptions based on status
  const filteredPrescriptions = prescriptions.filter((p) => {
    if (archiveFilter === "all") return true;
    return p.status === archiveFilter;
  });

  const pendingCount = prescriptions.filter(
    (p) => p.status === "pending"
  ).length;
  const completedCount = prescriptions.filter(
    (p) => p.status === "completed"
  ).length;

  // Add these functions near your other functions
  const updateRouteInput = (medId: string, value: string) => {
    setRouteInputs((prev) => ({
      ...prev,
      [medId]: {
        value,
        showSuggestions: value.length > 0,
      },
    }));
  };

  const selectRoute = (medId: string, route: string) => {
    updateMedField(medId, "route", route);
    setRouteInputs((prev) => ({
      ...prev,
      [medId]: {
        value: route,
        showSuggestions: false,
      },
    }));
  };

  // Filter ADM_FORMS based on input
  const getFilteredRoutes = (input: string) => {
    if (!input) return ADM_FORMS;
    return ADM_FORMS.filter((form) =>
      form.toLowerCase().includes(input.toLowerCase())
    );
  };

  // Render create prescription view
  const renderCreateView = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Pill className="w-8 h-8 text-indigo-600" />
            Ny Forordning
          </h1>
          <p className="text-gray-500 mt-1">
            Opprett en ny medisinforordning for pasient
          </p>
        </div>
      </div>

      {/* Forordningsinfo */}
      {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Forordningsinfo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dato
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="01.12.2024"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Klokkeslett
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={orderTime}
                onChange={(e) => setOrderTime(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="08:00"
              />
            </div>
          </div>
        </div>
      </div> */}

      {/* Pasientdata */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          Pasientdata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initialer
            </label>
            <input
              type="text"
              value={patient.name}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="J.S."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fødselsdato
            </label>
            <input
              type="text"
              value={patient.dob}
              onChange={(e) => setPatient({ ...patient, dob: e.target.value })}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="150567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rom / Sengepost
            </label>
            <input
              type="text"
              value={patient.room}
              onChange={(e) => setPatient({ ...patient, room: e.target.value })}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="103"
            />
          </div>
        </div>

        {/* Vitalia - Checkboxes */}
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={() => setShowVitalia(!showVitalia)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showVitalia ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <Thermometer className="w-4 h-4" />
            VITALIA ({Object.values(patient.vitalia).filter((v) => v).length})
          </button>

          {showVitalia && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {VITALS.map((vital) => (
                <label
                  key={vital}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    patient.vitalia[vital]
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!patient.vitalia[vital]}
                    onChange={() => toggleVital(vital)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 border rounded flex items-center justify-center ${
                      patient.vitalia[vital]
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-gray-300"
                    }`}
                  >
                    {patient.vitalia[vital] && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {vital}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Medikamenter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Medikamenter ({meds.length})
        </h2>

        {/* Pakker og ofte brukte */}
        <div className="mb-6">
          <button
            onClick={() => setShowFrequent(!showFrequent)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-3"
          >
            {showFrequent ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Pakker & ofte brukte medisiner
          </button>

          {showFrequent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Hurtigpakker
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(PAKKER).map((pkg) => (
                    <button
                      key={pkg}
                      onClick={() => addPackage(pkg)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      {pkg}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Fritt valg
                </h3>
                <div className="flex flex-wrap gap-2">
                  {MEDIKAMENTER.slice(0, 5).map((med) => (
                    <button
                      key={med.id}
                      onClick={() => addMed(med)}
                      className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      {med.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Søk og leggetil */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Søk etter medikament..."
            />
          </div>

          {showSuggestions && searchTerm.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {filteredMeds.map((med) => (
                <button
                  key={med.id}
                  onClick={() => addMed(med)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-gray-900">{med.name}</div>
                    <div className="text-sm text-gray-500">
                      {med.strength} • {med.route}
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              ))}
              {filteredMeds.length === 0 && (
                <button
                  onClick={() =>
                    addMed({
                      name: searchTerm,
                      strength: "",
                      route: "Fri tekst",
                    })
                  }
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      Legg til som fritekst:
                    </div>
                    <div className="text-sm text-gray-500">{searchTerm}</div>
                  </div>
                  <Plus className="w-4 h-4 text-indigo-500" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Medikamentliste */}
        {meds.length > 0 ? (
          <div className="space-y-4">
            {meds.map((med) => (
              <div
                key={med.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900">{med.name}</h3>
                  <button
                    onClick={() => removeMed(med.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Administrasjonsform
                    </label>
                    <input
                      type="text"
                      value={med.route || ""}
                      onChange={(e) =>
                        updateMedField(med.id, "route", e.target.value)
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="PO / IV"
                    />
                  </div> */}

                  {/* Replace the entire Administrasjonsform section in renderCreateView() */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Administrasjonsform
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={routeInputs[med.id]?.value || med.route || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          updateRouteInput(med.id, value);
                          updateMedField(med.id, "route", value);
                        }}
                        onFocus={() => {
                          setRouteInputs((prev) => ({
                            ...prev,
                            [med.id]: {
                              value:
                                routeInputs[med.id]?.value || med.route || "",
                              showSuggestions: true,
                            },
                          }));
                        }}
                        onBlur={() => {
                          setTimeout(() => {
                            setRouteInputs((prev) => ({
                              ...prev,
                              [med.id]: {
                                ...prev[med.id],
                                showSuggestions: false,
                              },
                            }));
                          }, 200);
                        }}
                        className="w-full py-2 px-3 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                        placeholder="Søk eller skriv form..."
                      />

                      {routeInputs[med.id]?.showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {getFilteredRoutes(routeInputs[med.id].value).map(
                            (form) => (
                              <button
                                key={form}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  selectRoute(med.id, form);
                                }}
                                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-gray-700 hover:text-gray-900"
                              >
                                {form}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Dose
                    </label>
                    <input
                      type="text"
                      value={med.dose || ""}
                      onChange={(e) =>
                        updateMedField(med.id, "dose", e.target.value)
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="1 stk / 5 mg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Styrke (Inj.)
                    </label>
                    <input
                      type="text"
                      value={med.strengthText || ""}
                      onChange={(e) =>
                        updateMedField(med.id, "strengthText", e.target.value)
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="25 mg/ml"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Volum (ml)
                    </label>
                    <input
                      type="text"
                      value={med.volume || ""}
                      onChange={(e) =>
                        updateMedField(med.id, "volume", e.target.value)
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="5 ml"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>
              Ingen medikamenter lagt til. Søk og legg til medikamenter ovenfor.
            </p>
          </div>
        )}
      </div>

      {/* Signatur */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Signatur</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {signatureList.map((sig) => (
            <button
              key={sig.code}
              onClick={() => setDoctorSign(sig.code)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                doctorSign === sig.code
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              {sig.code}
            </button>
          ))}
          <button
            onClick={() =>
              setModal({
                open: true,
                type: "newSignature",
                title: "Ny signatur",
                message:
                  "Legg til dine initialer (maks 3 tegn) og fullt navn for signering.",
              })
            }
            className="px-4 py-2 rounded-lg border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Ny
          </button>
        </div>

        <div className="text-gray-600 mb-6">
          {doctorSign ? (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">
                {signatureList.find((s) => s.code === doctorSign)?.name ||
                  "Ukjent lege"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-4 h-4" />
              <span>Velg signatur for å signere forordningen</span>
            </div>
          )}
        </div>

        <Button
          variant="success"
          icon={Save}
          // onClick={handleSave}
          onClick={confirmSave}
          className="w-full py-3 text-lg shadow-lg shadow-green-200 saveButton"
        >
          Lagre forordning og publiser
        </Button>
      </div>
    </div>
  );

  // Render archive view
  const renderArchiveView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Archive className="w-8 h-8 text-indigo-600" />
            Forordningsarkiv
          </h1>
          <p className="text-gray-500 mt-1">
            Oversikt over ventende og fullførte forordninger
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {pendingCount} ventende • {completedCount} fullførte
          </span>
          <Button
            variant="danger"
            // onClick={() => {
            //   setConfirmModal({
            //     open: true,
            //     title: "Tøm arkivet",
            //     message: `Er du sikker på at du vil tømme arkivet (${completedCount} fullførte forordninger)? Dette kan ikke angres.`,
            //     onConfirm: () => {
            //       setPrescriptions(
            //         prescriptions.filter((p) => p.status === "pending")
            //       );
            //       setConfirmModal({ ...confirmModal, open: false });
            //     },
            //   });
            // }}
            onClick={() => {
              setPrescriptions(
                prescriptions.filter((p) => p.status === "pending")
              );
            }}
            disabled={completedCount === 0}
          >
            Tøm arkiv
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200 pb-1">
        {["all", "pending", "completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => setArchiveFilter(filter)}
            className={`px-4 py-2 border-b-2 transition-colors capitalize ${
              archiveFilter === filter
                ? "border-indigo-600 text-indigo-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {filter === "all"
              ? "Alle"
              : filter === "pending"
              ? "Ventende"
              : "Fullførte"}
          </button>
        ))}
      </div>

      {/* Prescription list */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Archive className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Ingen forordninger funnet
            </h3>
            <p className="text-gray-400">
              {archiveFilter === "all"
                ? "Det er ingen forordninger i systemet enda."
                : `Det er ingen ${
                    archiveFilter === "pending" ? "ventende" : "fullførte"
                  } forordninger.`}
            </p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <div className=" w-full">
                    <div className="flex items-center mb-4 justify-between">
                      <div className="flex gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            prescription.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {prescription.status === "pending"
                            ? "VENTENDE"
                            : "FULLFØRT"}
                        </div>
                        <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          ROM {prescription.patient.room}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                            {prescription.doctorSign}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {prescription.doctorFullName}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 legeDiv">
                          Lege
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">
                      {prescription.patient.name}
                    </h3>
                    <p className="text-gray-500">{prescription.patient.dob}</p>

                    {/* <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                        {prescription.doctorSign}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {prescription.doctorFullName}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 legeDiv">Lege</div> */}
                    {prescription.status === "completed" && (
                      <></>
                      // <div className="flex items-center justify-end gap-2 mt-2">
                      //   <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600 text-xs">
                      //     {prescription.nurseSign}
                      //   </div>
                      //   <div className="text-sm text-gray-500">
                      //     Signert: {prescription.dateGiven} kl.{" "}
                      //     {prescription.timeGiven}
                      //   </div>
                      // </div>
                    )}
                  </div>
                </div>
                {/* Medications */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Medikamenter ({prescription.medications.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {prescription.medications.map((med: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 flex justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {med.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {med.dose} • {med.route}
                            {med.strength && ` • ${med.strength}`}
                            {med.volume && ` • ${med.volume}`}
                          </div>
                        </div>

                        {med.administeredDate && (
                          <div
                            style={{ float: "right", textAlign: "right" }}
                            className="text-sm text-gray-600"
                          >
                            <div style={{ fontWeight: 600 }}>Administrert</div>
                            {med.administeredDate} kl. {med.administeredTime}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Vitalia */}
                {Object.keys(prescription.patient.vitalia).filter(
                  (k) => prescription.patient.vitalia[k]
                ).length > 0 && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <button
                      onClick={() => {
                        setSelectedPrescription(prescription);
                        setVitaliaModalOpen(true);
                      }}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <Thermometer className="w-4 h-4" />
                      Vis Vitalia (
                      {
                        Object.keys(prescription.patient.vitalia).filter(
                          (k) => prescription.patient.vitalia[k]
                        ).length
                      }
                      )
                    </button>
                  </div>
                )}
                {/* Actions */}
                <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between bg-red">
                  {prescription.status === "pending" ? (
                    <div className="flex items-center justify-end gap-2 mt-2 text-gray-500">
                      {prescription.orderDate} kl. {prescription.orderTime}
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600 text-xs">
                        {prescription.nurseSign}
                      </div>
                      <div className="font-medium text-gray-900">
                        {prescription.nurseFullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {prescription.nurseSignDate} kl.{" "}
                        {prescription.nurseSignTime}
                      </div>
                    </div>
                  )}
                  {prescription.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        variant="danger"
                        // onClick={() => {
                        //   setConfirmModal({
                        //     open: true,
                        //     title: "Slett forordning",
                        //     message:
                        //       "Er du sikker på at du vil slette denne ventende forordningen?",
                        //     onConfirm: () => {
                        //       setPrescriptions(
                        //         prescriptions.filter(
                        //           (p) => p.id !== prescription.id
                        //         )
                        //       );
                        //       setConfirmModal({ ...confirmModal, open: false });
                        //     },
                        //   });
                        // }}
                        onClick={() => {
                          setPrescriptions(
                            prescriptions.filter(
                              (p) => p.id !== prescription.id
                            )
                          );
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Kanseller forordning
                      </Button>
                      {/* <Button
                        variant="primary"
                        onClick={() => {
                          // Mark as completed (simulate nurse action)
                          const updated = prescriptions.map((p) =>
                            p.id === prescription.id
                              ? {
                                  ...p,
                                  status: "completed",
                                  dateGiven: new Date().toLocaleDateString(
                                    "nb-NO"
                                  ),
                                  timeGiven: new Date().toLocaleTimeString(
                                    "nb-NO",
                                    { hour: "2-digit", minute: "2-digit" }
                                  ),
                                  nurseSign: "AN",
                                  nurseFullName: "Anne Nordmann",
                                }
                              : p
                          );
                          setPrescriptions(updated);
                        }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marker som gitt
                      </Button> */}
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setConfirmModal({
                          open: true,
                          title: "Slett fra arkiv",
                          message:
                            "Er du sikker på at du vil slette denne fullførte forordningen?",
                          onConfirm: () => {
                            setPrescriptions(
                              prescriptions.filter(
                                (p) => p.id !== prescription.id
                              )
                            );
                            setConfirmModal({ ...confirmModal, open: false });
                          },
                        });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Slett fra arkiv
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* View Switcher */}
      <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-4 py-4">
            <button
              onClick={() => setActiveView("create")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeView === "create"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Plus className="w-4 h-4" />
              Opprett Forordning
            </button>
            <button
              onClick={() => setActiveView("archive")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 relative ${
                activeView === "archive"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Archive className="w-4 h-4" />
              Arkiv
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeView === "create" ? renderCreateView() : renderArchiveView()}

      {/* Modals */}
      {/* In your JSX, make sure this ConfirmModal is rendered with the other modals */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
      {/* Error Modal */}
      <ConfirmModal
        isOpen={modal.open && modal.type === "error"}
        onClose={() => setModal({ ...modal, open: false })}
        onConfirm={() => setModal({ ...modal, open: false })}
        title={modal.title}
        message={modal.message}
        confirmText="Forstått"
        showCancel={false}
      />

      {/* Save Confirmation Modal */}
      <ConfirmModal
        isOpen={modal.open && modal.type === "save"}
        onClose={() => setModal({ ...modal, open: false })}
        onConfirm={confirmSave}
        title={modal.title}
        message={modal.message}
        confirmText="Ja, publiser"
      />

      {/* New Signature Modal */}
      <Modal
        isOpen={modal.open && modal.type === "newSignature"}
        onClose={() => setModal({ ...modal, open: false })}
        title="Ny Signatur"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initialer (Maks 3)
            </label>
            <input
              type="text"
              value={newSignature.code}
              onChange={(e) =>
                setNewSignature({
                  ...newSignature,
                  code: e.target.value.toUpperCase().substring(0, 3),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="ABC"
              maxLength={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fullt Navn
            </label>
            <input
              type="text"
              value={newSignature.name}
              onChange={(e) =>
                setNewSignature({
                  ...newSignature,
                  name: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Navn Navnesen"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setModal({ ...modal, open: false })}
            >
              Avbryt
            </Button>
            <Button variant="primary" onClick={handleAddSignature}>
              Legg til
            </Button>
          </div>
        </div>
      </Modal>

      {/* Vitalia View Modal */}
      <Modal
        isOpen={vitaliaModalOpen}
        onClose={() => setVitaliaModalOpen(false)}
        title={`Vitalia for ${selectedPrescription?.patient.name || ""}`}
      >
        <div className="space-y-4">
          {selectedPrescription?.status === "pending" ? (
            <>
              <p className="text-gray-600">Målinger bestilt</p>
              <div className="grid grid-cols-2 gap-3">
                {selectedPrescription?.patient.vitalia &&
                  Object.entries(selectedPrescription.patient.vitalia)
                    .filter(([_, value]) => value)
                    .map(([vital, value]) => (
                      <div key={vital} className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-500">
                          {vital}
                        </div>
                        <div className="text-xl font-bold text-gray-900 mt-1">
                          {value}
                        </div>
                      </div>
                    ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600">Målinger registrert av sykepleier</p>
              <div className="grid grid-cols-2 gap-3">
                {selectedPrescription?.patient?.reportedVitalia &&
                  Object.entries(selectedPrescription.patient.reportedVitalia)
                    .filter(([_, vitalData]) => vitalData && vitalData.value)
                    .map(([vitalKey, vitalData]) => (
                      <div key={vitalKey} className="bg-gray-50 rounded-lg p-4">
                        {/* Vital name */}
                        <div className="text-sm font-medium text-gray-700">
                          {vitalKey}
                        </div>

                        {/* Value */}
                        <div className="text-xl font-semibold text-gray-900 mt-2 text-center">
                          {vitalData.value}
                        </div>

                        {/* Date */}
                        <div className="text-xs text-gray-500 mt-4 text-right">
                          {vitalData.date}
                        </div>

                        {/* Time */}
                        <div className="text-xs text-gray-500 -mt-1 text-right">
                          kl. {vitalData.time}
                        </div>
                      </div>
                    ))}
              </div>
            </>
          )}

          <div className="flex justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => setVitaliaModalOpen(false)}
            >
              Lukk
            </Button>
          </div>
        </div>
      </Modal>
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl animate-in slide-in-from-bottom-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          {toast}
        </div>
      )}
    </>
  );
};

export default ForordningAdmin;
