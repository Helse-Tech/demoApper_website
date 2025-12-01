import React, { useState, useEffect } from "react";
import {
  FileText,
  Printer,
  Plus,
  Edit2,
  Trash2,
  Save,
  Search,
  Check,
  X,
  Image as ImageIcon,
  File,
  Eye,
  LayoutGrid,
  CheckSquare,
  Square,
  CheckCircle,
} from "lucide-react";
import qrDemo from "../assets/qrDemoapper.png";

import { Button, Modal, ConfirmModal } from "./Components";

// =========================================================================
// --- DATA MODEL ----------------------------------------------------------
// =========================================================================

// Initial patient information data
const initialPatientInfo = [
  {
    id: "1",
    category: "Generell informasjon",
    title: "Hjernerystelse",
    images: ["/placeholder-image.png"],
  },
  {
    id: "2",
    category: "Generell informasjon",
    title: "Sårstell",
    images: ["/placeholder-image.png", "/placeholder-image.png"],
  },
  {
    id: "3",
    category: "Generell informasjon",
    title: "Sting og strips",
    images: ["/placeholder-image.png"],
  },
  {
    id: "4",
    category: "Generell informasjon",
    title: "Smertelindring",
    images: ["/placeholder-image.png"],
  },
  {
    id: "5",
    category: "Generell informasjon",
    title: "Krystallsyke",
    images: ["/placeholder-image.png"],
  },
];

// Categories for grouping
const CATEGORIES = [
  "Fysioterapi",
  "Brudd/Røntgen",
  "Sårseksjon",
  "Generell informasjon",
  "Andre skader",
];

// =========================================================================
// --- MAIN COMPONENT ------------------------------------------------------
// =========================================================================

const PasientInfoAdmin = () => {
  const [activeView, setActiveView] = useState("manage"); // 'manage' | 'print'
  const [toast, setToast] = useState(null);

  // Patient info management states
  const [patientInfos, setPatientInfos] = useState(initialPatientInfo);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Edit modal states
  const [editModal, setEditModal] = useState({
    open: false,
    isEditing: false,
    currentItem: null as any,
  });

  const [newItem, setNewItem] = useState({
    title: "",
    category: "",
    images: [] as string[],
  });

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Print view states
  const [selectedForPrint, setSelectedForPrint] = useState<Set<string>>(
    new Set()
  );
  const [printAll, setPrintAll] = useState(false);

  // Image preview modal
  const [imagePreview, setImagePreview] = useState({
    open: false,
    images: [] as string[],
    currentIndex: 0,
  });

  // Validation modal state
  const [validationModal, setValidationModal] = useState({
    open: false,
    message: "",
  });

  // Load data on mount (simulating async load)
  useEffect(() => {
    setPatientInfos(initialPatientInfo);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const saveDataToApi = () => {
    // Simulerer API-kallet
    // console.log("SENDER DATA TIL API:", JSON.stringify(data, null, 2));
    showToast("Data lagret og sendt til appene!");
  };

  // Filter and group patient infos
  const filteredInfos = patientInfos.filter((info) => {
    const matchesSearch =
      info.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || info.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedInfos = filteredInfos.reduce((groups, info) => {
    const category = info.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(info);
    return groups;
  }, {} as Record<string, typeof patientInfos>);

  // Categories for filter
  const availableCategories = ["all", ...CATEGORIES];

  // Handle add/edit patient info
  const handleSaveItem = () => {
    if (!newItem.title || !newItem.category) {
      setValidationModal({
        open: true,
        message: "Vennligst fyll ut tittel og kategori",
      });
      return;
    }

    if (editModal.isEditing && editModal.currentItem) {
      // Update existing
      setPatientInfos((prev) =>
        prev.map((item) =>
          item.id === editModal.currentItem.id
            ? { ...item, ...newItem, id: editModal.currentItem.id }
            : item
        )
      );
    } else {
      // Add new
      const newId = (patientInfos.length + 1).toString();
      setPatientInfos((prev) => [
        ...prev,
        {
          ...newItem,
          id: newId,
          images:
            newItem.images.length > 0
              ? newItem.images
              : ["/placeholder-image.png"],
        },
      ]);
    }

    setEditModal({ ...editModal, open: false });
    setNewItem({ title: "", category: "", images: [] });
  };

  // Handle delete patient info
  const handleDeleteItem = (id: string, title: string) => {
    setConfirmModal({
      open: true,
      title: "Slett pasientinformasjon",
      message: `Er du sikker på at du vil slette "${title}"?`,
      onConfirm: () => {
        setPatientInfos((prev) => prev.filter((item) => item.id !== id));
        setConfirmModal({ ...confirmModal, open: false });
      },
    });
  };

  // Open edit modal
  const openEditModal = (item: any = null) => {
    if (item) {
      setEditModal({
        open: true,
        isEditing: true,
        currentItem: item,
      });
      setNewItem({
        title: item.title,
        category: item.category,
        images: item.images,
      });
    } else {
      setEditModal({
        open: true,
        isEditing: false,
        currentItem: null,
      });
      setNewItem({
        title: "",
        category: "",
        images: [],
      });
    }
  };

  // Handle image upload (simulated)
  const handleImageUpload = () => {
    // In a real app, this would handle file upload
    const newImage = "/placeholder-image.png";
    setNewItem((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }));
  };

  // Handle print selection
  const togglePrintSelection = (id: string) => {
    const newSelected = new Set(selectedForPrint);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedForPrint(newSelected);
  };

  const handleSelectAll = () => {
    if (printAll) {
      setSelectedForPrint(new Set());
    } else {
      const allIds = new Set(patientInfos.map((item) => item.id));
      setSelectedForPrint(allIds);
    }
    setPrintAll(!printAll);
  };

  // Generate printable slip (now with 3 slips per page in landscape)
  const generatePrintSlip = () => {
    if (selectedForPrint.size === 0) {
      setValidationModal({
        open: true,
        message: "Velg minst ett informasjonsskriv for å generere slip",
      });
      return;
    }

    const selectedItems = patientInfos
      .filter((item) => selectedForPrint.has(item.id))
      .map((item) => item.title);

    // Create print window with landscape orientation and 3 slips per page
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Note: In production, replace "/qr-code-placeholder.png" with your actual QR code image path
      const qrImagePath = "/qr-code-placeholder.png";

      printWindow.document.write(`
      <html>
        <head>
          <title>Pasientinformasjon Skriv</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 0;
              background: white;
              width: 297mm;
              height: 210mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .print-page {
              width: 287mm;
              height: 200mm;
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              justify-content: space-between;
              padding: 5mm 10mm;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            .slip {
              width: 85mm;
              height: 190mm;
              border: 1px dashed #ccc;
              padding: 10mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              box-sizing: border-box;
              position: relative;
              page-break-inside: avoid;
              break-inside: avoid;
              background: white;
            }
            .slip:nth-child(2) {
              margin: 0 5mm;
            }
            .qr-container {
              width: 50mm;
              height: 50mm;
              margin-bottom: 5mm;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .qr-container img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            .qr-placeholder {
              width: 50mm;
              height: 50mm;
              border: 1px solid #ccc;
              background: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: #666;
            }
            .qr-placeholder::before {
              content: "[QR-kode]";
            }
            .slip-title {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 5mm;
              text-align: center;
              width: 100%;
            }
            .info-list {
              width: 100%;
              margin-top: 3mm;
              flex: 1;
              overflow: hidden;
            }
            .info-item {
              margin-bottom: 2mm;
              display: flex;
              align-items: flex-start;
              page-break-inside: avoid;
              width: 100%;
            }
            .checkbox {
              width: 5mm;
              height: 5mm;
              min-width: 5mm;
              min-height: 5mm;
              border: 1px solid #000;
              margin-right: 3mm;
              margin-top: 1px;
              flex-shrink: 0;
            }
            .info-text {
              font-size: 10pt;
              line-height: 1.2;
              word-break: break-word;
            }
            .cutting-line {
              position: absolute;
              background: red;
              opacity: 0.3;
              z-index: 10;
            }
            .cutting-line.top {
              top: -2.5mm;
              left: 0;
              right: 0;
              height: 1px;
            }
            .cutting-line.bottom {
              bottom: -2.5mm;
              left: 0;
              right: 0;
              height: 1px;
            }
            .cutting-line.left {
              left: -2.5mm;
              top: 0;
              bottom: 0;
              width: 1px;
            }
            .cutting-line.right {
              right: -2.5mm;
              top: 0;
              bottom: 0;
              width: 1px;
            }
            .print-controls {
              position: fixed;
              top: 10px;
              right: 10px;
              z-index: 1000;
              display: flex;
              gap: 10px;
            }
            .print-btn {
              padding: 10px 20px;
              background: #4f46e5;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            }
            .close-btn {
              padding: 10px 20px;
              background: #6b7280;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            }
            @media print {
              .print-controls {
                display: none;
              }
              body {
                margin: 0;
                padding: 0;
                background: white;
              }
              .print-page {
                width: 287mm;
                height: 200mm;
                padding: 5mm 10mm;
              }
              .slip {
                border: 1px solid #000;
              }
              .cutting-line {
                display: none;
              }
              .qr-placeholder {
                border: 1px solid #ccc;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-controls">
            <button class="print-btn" onclick="window.print()">Skriv ut</button>
            <button class="close-btn" onclick="window.close()">Lukk</button>
          </div>
          
          <div class="print-page">
            <!-- First slip -->
            <div class="slip">
              <div class="cutting-line top"></div>
              <div class="cutting-line bottom"></div>
              <div class="cutting-line left"></div>
              <div class="qr-container">
                 <img src="${qrDemo}" alt="QR-kode for HelseAppen" /> 
              </div>
              <div class="slip-title">Velg informasjon du trenger:</div>
              <div class="info-list">
                ${selectedItems
                  .map(
                    (title, index) => `
                              <div class="info-item" style="display: flex;  align-items: center;">
                    <div class="checkbox"></div>
                    <div class="info-text">${index + 1}. ${title}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            
            <!-- Second slip -->
            <div class="slip">
              <div class="cutting-line top"></div>
              <div class="cutting-line bottom"></div>
              <div class="qr-container">
            <img src="${qrDemo}" alt="QR-kode for HelseAppen" /> 
              </div>
              <div class="slip-title">Velg informasjon du trenger:</div>
              <div class="info-list">
                ${selectedItems
                  .map(
                    (title, index) => `
                            <div class="info-item" style="display: flex;  align-items: center;">
                    <div class="checkbox"></div>
                    <div class="info-text">${index + 1}. ${title}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            
            <!-- Third slip -->
            <div class="slip">
              <div class="cutting-line top"></div>
              <div class="cutting-line bottom"></div>
              <div class="cutting-line right"></div>
              <div class="qr-container">
              <img src="${qrDemo}" alt="QR-kode for HelseAppen" /> 
              </div>
              <div class="slip-title">Velg informasjon du trenger:</div>
              <div class="info-list">
                ${selectedItems
                  .map(
                    (title, index) => `
                  <div class="info-item" style="display: flex;  align-items: center;">
                    <div class="checkbox"></div>
                    <div class="info-text">${index + 1}. ${title}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              // Auto-focus for better print experience
              setTimeout(() => {
                const printBtn = document.querySelector('.print-btn');
                if (printBtn) {
                  printBtn.focus();
                }
              }, 100);
              
              // Add click functionality to checkboxes for easier testing
              const checkboxes = document.querySelectorAll('.checkbox');
              checkboxes.forEach(cb => {
                cb.addEventListener('click', function() {
                  this.style.backgroundColor = this.style.backgroundColor ? '' : '#4f46e5';
                });
              });
            };
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();

      // Auto-focus for printing
      setTimeout(() => {
        printWindow.focus();
      }, 100);
    }
  };

  // Render manage view
  const renderManageView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-600" />
            Pasientinformasjon Admin
          </h1>
          <p className="text-gray-500 mt-1">
            Administrer informasjonsmateriell for pasienter
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => openEditModal()}>
          Nytt Informasjonsskriv
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Søk i informasjon
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Søk etter tittel eller kategori..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer på kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Alle kategorier" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patient Info List */}
      <div className="space-y-6">
        {Object.keys(groupedInfos).length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Ingen informasjon funnet
            </h3>
            <p className="text-gray-400">
              {searchQuery
                ? "Ingen resultater for søket ditt. Prøv et annet søkeord."
                : "Det er ingen informasjonsskriv enda. Legg til et nytt."}
            </p>
          </div>
        ) : (
          Object.entries(groupedInfos).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                {category} ({items.length})
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                              {item.category}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {item.images.length} bilde
                              {item.images.length !== 1 ? "r" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteItem(item.id, item.title)
                            }
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Image thumbnails */}
                      <div className="flex gap-2 mt-4">
                        {item.images.slice(0, 3).map((img, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              setImagePreview({
                                open: true,
                                images: item.images,
                                currentIndex: index,
                              })
                            }
                            className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-300 transition-colors group"
                          >
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              {img.includes(".pdf") ? (
                                <File className="w-8 h-8 text-gray-400" />
                              ) : (
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                        {item.images.length > 3 && (
                          <div className="w-16 h-16 rounded-lg border border-gray-200 flex items-center justify-center text-sm text-gray-500">
                            +{item.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Render print view
  const renderPrintView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8  mt-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Printer className="w-8 h-8 text-indigo-600" />
          Skriv ut
        </h1>
        <p className="text-gray-500">
          Velg informasjon som skal inkluderes på skrivet. Skrivet vil inneholde
          4 kopier med QR-kode og sjekkbokser.
        </p>
      </div>

      {/* Selection Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">
            Velg informasjon for skrivet ({selectedForPrint.size} valgt)
          </h3>
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          >
            {printAll ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {printAll ? "Fjern alle" : "Velg alle"}
          </button>
        </div>

        {/* Preview of what will be printed */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3">
            Forhåndsvisning av skriv:
          </h4>
          <div>
            {[1].map((num) => (
              <div
                key={num}
                className="border-2 border-dashed border-gray-300 p-4 rounded-lg"
              >
                <div className="flex flex-col items-center">
                  <img className="w-24 h-24 mb-3" src={qrDemo} alt="QR demo" />

                  <div className="text-sm font-medium text-gray-700 mb-2">
                    QR-kode for app
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    Scan QR-koden for å laste ned HelseAppen
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info List with Checkboxes */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {patientInfos.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedForPrint.has(item.id)
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start pt-1">
                <input
                  type="checkbox"
                  checked={selectedForPrint.has(item.id)}
                  onChange={() => togglePrintSelection(item.id)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{item.category}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {item.images.length}
                  </span>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedForPrint.has(item.id)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Check className="w-3 h-3" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Print Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col justify-between sm:flex-row gap-4">
          <Button
            variant="secondary"
            icon={LayoutGrid}
            onClick={() => setActiveView("manage")}
            className="flex-1 saveButton"
          >
            Tilbake til administrasjon
          </Button>
          <Button
            variant="primary"
            icon={Printer}
            onClick={generatePrintSlip}
            disabled={selectedForPrint.size === 0}
            className="flex-1 saveButton"
          >
            Skriv ut ({selectedForPrint.size} valgt)
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">
            📋 Instruksjoner for bruk:
          </h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Skrivet vil åpnes i et nytt vindu med 3 kopier på en side</li>
            <li>• QR-koden vil være plassert på toppen av hvert skriv</li>
            <li>
              • Hvert skriv vil ha en liste med de valgte informasjonspunktene
            </li>
            <li>• Skriv ut og klipp den i 3 like stykker</li>
            <li>
              • Legen kan deretter sette kryss med penn ved relevant informasjon
            </li>
            <li>• Pasienten scanner QR-koden for å laste ned appen</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Edit Modal
  const renderEditModal = () => (
    <Modal
      isOpen={editModal.open}
      onClose={() => setEditModal({ ...editModal, open: false })}
      title={
        editModal.isEditing
          ? "Rediger Informasjonsskriv"
          : "Nytt Informasjonsskriv"
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tittel på skrivet *
          </label>
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Eks: Informasjon ved sår"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori *
          </label>
          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Velg kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bilder ({newItem.images.length})
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {newItem.images.map((img, index) => (
              <div key={index} className="relative group">
                <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {img.includes(".pdf") ? (
                    <File className="w-8 h-8 text-gray-400" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => {
                    const newImages = [...newItem.images];
                    newImages.splice(index, 1);
                    setNewItem({ ...newItem, images: newImages });
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <Button
            variant="secondary"
            icon={Plus}
            onClick={handleImageUpload}
            className="w-full"
          >
            Legg til bilde / PDF
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            I denne demoen legges det til et placeholder-bilde. I produksjon vil
            dette håndtere ekte filopplastinger.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => setEditModal({ ...editModal, open: false })}
          >
            Avbryt
          </Button>
          <Button variant="primary" icon={Save} onClick={handleSaveItem}>
            {editModal.isEditing ? "Lagre endringer" : "Legg til skriv"}
          </Button>
        </div>
      </div>
    </Modal>
  );

  // Image Preview Modal
  const renderImagePreview = () => (
    <Modal
      isOpen={imagePreview.open}
      onClose={() => setImagePreview({ ...imagePreview, open: false })}
      title="Bildeforhåndsvisning"
    >
      <div className="space-y-4">
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          {imagePreview.images[imagePreview.currentIndex]?.includes(".pdf") ? (
            <div className="text-center p-8">
              <File className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">PDF-dokument</p>
              <p className="text-sm text-gray-500 mt-2">
                Dette er en PDF-fil. Last den ned for å se innholdet.
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-gray-400" />
              <p className="text-gray-600 ml-4">Bildeforhåndsvisning</p>
            </div>
          )}
        </div>

        {imagePreview.images.length > 1 && (
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={() =>
                setImagePreview({
                  ...imagePreview,
                  currentIndex: Math.max(0, imagePreview.currentIndex - 1),
                })
              }
              disabled={imagePreview.currentIndex === 0}
            >
              Forrige
            </Button>

            <span className="text-gray-600">
              {imagePreview.currentIndex + 1} / {imagePreview.images.length}
            </span>

            <Button
              variant="secondary"
              onClick={() =>
                setImagePreview({
                  ...imagePreview,
                  currentIndex: Math.min(
                    imagePreview.images.length - 1,
                    imagePreview.currentIndex + 1
                  ),
                })
              }
              disabled={
                imagePreview.currentIndex === imagePreview.images.length - 1
              }
            >
              Neste
            </Button>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            variant="secondary"
            onClick={() => setImagePreview({ ...imagePreview, open: false })}
          >
            Lukk
          </Button>
        </div>
      </div>
    </Modal>
  );

  // Validation Modal
  const renderValidationModal = () => (
    <ConfirmModal
      isOpen={validationModal.open}
      onClose={() => setValidationModal({ ...validationModal, open: false })}
      onConfirm={() => setValidationModal({ ...validationModal, open: false })}
      title="Mangler informasjon"
      message={validationModal.message}
      confirmText="Forstått"
      showCancel={false}
    />
  );

  return (
    <>
      {/* View Switcher */}
      <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex  py-4 justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView("manage")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeView === "manage"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-4 h-4" />
                Administrer Informasjon
              </button>
              <button
                onClick={() => setActiveView("print")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeView === "print"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Printer className="w-4 h-4" />
                Skriv ut
              </button>
            </div>
            <Button
              variant="success"
              icon={Save}
              onClick={saveDataToApi}
              className="shadow-lg shadow-green-200 saveButton2"
            >
              Lagre alle endringer
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeView === "manage" ? renderManageView() : renderPrintView()}

      {/* Modals */}
      {renderEditModal()}
      {renderImagePreview()}
      {renderValidationModal()}

      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl animate-in slide-in-from-bottom-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          {toast}
        </div>
      )}
    </>
  );
};

export default PasientInfoAdmin;
