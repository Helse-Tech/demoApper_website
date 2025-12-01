import React, { useState } from "react";
import {
  Users,
  ClipboardList,
  BedDouble,
  FileCheck,
  Plus,
  Trash2,
  Save,
  X,
  CheckCircle,
} from "lucide-react";

import { Button, EditModal, ConfirmModal } from "./Components";
// =========================================================================
// --- 2. DATA MODEL -------------------------------------------------------
// =========================================================================

const seedDefaults = () => ({
  employees: [
    { id: 1, initials: "AN", name: "Anne Nordmann" },
    { id: 2, initials: "BL", name: "Bjørn Larsen" },
  ],
  rooms: [
    { id: 101, name: "101" },
    { id: 102, name: "102" },
  ],
  checklists: [
    {
      id: 1,
      roomId: 101,
      name: "Morgenstell standard",
      tasks: [
        { id: 1001, text: "Sjekk respirasjon og BT", done: false },
        { id: 1002, text: "Gi morgenmedisin PO", done: false },
        { id: 1003, text: "Hjelp til toalettbesøk", done: false },
      ],
    },
    {
      id: 2,
      roomId: 101,
      name: "Klargjøring operasjon",
      tasks: [
        { id: 2001, text: "Fjern smykker", done: false },
        { id: 2002, text: "Premedisin", done: false },
      ],
    },
    {
      id: 3,
      roomId: 102,
      name: "Kveldssjekk",
      tasks: [
        { id: 3001, text: "Sjekk kateter", done: false },
        { id: 3002, text: "Rapporter endringer", done: false },
      ],
    },
  ],
  signLog: [
    {
      roomId: 101,
      checklistId: 1,
      employeeId: 1,
      ts: Date.now() - 10000000,
      tasks: [
        { id: 1001, text: "Sjekk respirasjon og BT", done: true },
        { id: 1002, text: "Gi morgenmedisin PO", done: true },
      ],
    },
  ],
});

// =========================================================================
// --- 3. CHECKLIST ADMIN MODULE (The "Imported" Component) -----------------
// =========================================================================

const ChecklistAdmin = () => {
  const [data, setData] = useState(seedDefaults());
  const [activeTab, setActiveTab] = useState("checklists"); // 'employees', 'rooms', 'checklists', 'logs'
  const [toast, setToast] = useState(null);

  // Modal States
  const [editModal, setEditModal] = useState({
    open: false,
    target: null,
    field: "",
    title: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const saveDataToApi = () => {
    // Simulerer API-kallet
    console.log("SENDER DATA TIL API:", JSON.stringify(data, null, 2));
    showToast("Data lagret og sendt til appene!");
  };

  // --- CRUD Logic ---

  const updateItem = (collection, id, field, value) => {
    setData((prev) => ({
      ...prev,
      [collection]: prev[collection].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
    setEditModal({ ...editModal, open: false });
  };

  const addEmployee = () => {
    const newId = Math.max(0, ...data.employees.map((e) => e.id)) + 1;
    setData((prev) => ({
      ...prev,
      employees: [
        { id: newId, initials: "NY", name: "Ny ansatt" },
        ...prev.employees,
      ],
    }));
  };

  const deleteEmployee = (id) => {
    setConfirmModal({
      open: true,
      title: "Slett ansatt",
      message: "Er du sikker? Dette kan ikke angres.",
      onConfirm: () => {
        setData((prev) => ({
          ...prev,
          employees: prev.employees.filter((e) => e.id !== id),
        }));
        setConfirmModal({ ...confirmModal, open: false });
      },
    });
  };

  const addRoom = () => {
    const newId = Math.max(0, ...data.rooms.map((r) => r.id)) + 1;
    setData((prev) => ({
      ...prev,
      rooms: [{ id: newId, name: `Rom ${newId}` }, ...prev.rooms],
    }));
  };

  const deleteRoom = (id) => {
    setConfirmModal({
      open: true,
      title: "Slett rom",
      message: "Dette vil også slette sjekklister knyttet til rommet.",
      onConfirm: () => {
        setData((prev) => ({
          ...prev,
          rooms: prev.rooms.filter((r) => r.id !== id),
          checklists: prev.checklists.filter((c) => c.roomId !== id),
        }));
        setConfirmModal({ ...confirmModal, open: false });
      },
    });
  };

  const addChecklist = () => {
    const roomId = data.rooms[0]?.id;
    if (!roomId) return alert("Lag et rom først");

    const newId = Math.max(0, ...data.checklists.map((c) => c.id)) + 1;
    setData((prev) => ({
      ...prev,
      checklists: [
        {
          id: newId,
          roomId: roomId,
          name: "Ny sjekkliste",
          tasks: [{ id: Date.now(), text: "Ny oppgave", done: false }],
        },
        ...prev.checklists,
      ],
    }));
  };

  const updateChecklistTask = (checklistId, taskId, newText) => {
    setData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) =>
        c.id === checklistId
          ? {
              ...c,
              tasks: c.tasks.map((t) =>
                t.id === taskId ? { ...t, text: newText } : t
              ),
            }
          : c
      ),
    }));
    setEditModal({ ...editModal, open: false });
  };

  const addTask = (checklistId) => {
    setData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) =>
        c.id === checklistId
          ? {
              ...c,
              tasks: [
                ...c.tasks,
                { id: Date.now(), text: "Ny oppgave", done: false },
              ],
            }
          : c
      ),
    }));
  };

  const deleteTask = (checklistId, taskId) => {
    setData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) =>
        c.id === checklistId
          ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }
          : c
      ),
    }));
  };

  const deleteChecklist = (id) => {
    setConfirmModal({
      open: true,
      title: "Slett sjekkliste",
      message: "Er du sikker? Alle oppgaver forsvinner.",
      onConfirm: () => {
        setData((prev) => ({
          ...prev,
          checklists: prev.checklists.filter((c) => c.id !== id),
        }));
        setConfirmModal({ ...confirmModal, open: false });
      },
    });
  };

  const changeChecklistRoom = (checklistId, newRoomId) => {
    setData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) =>
        c.id === checklistId ? { ...c, roomId: parseInt(newRoomId) } : c
      ),
    }));
  };

  // --- RENDERERS ---

  //   const renderTabs = () => (
  //     <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-30 flex justify-between pb-4">
  //       <div className="flex">
  //         {[
  //           { id: "checklists", label: "Sjekklister", icon: ClipboardList },
  //           { id: "rooms", label: "Rom", icon: BedDouble },
  //           { id: "employees", label: "Ansatte", icon: Users },
  //           { id: "logs", label: "Logg", icon: FileCheck },
  //         ].map((tab) => (
  //           <button
  //             key={tab.id}
  //             onClick={() => setActiveTab(tab.id)}
  //             className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap
  //             ${
  //               activeTab === tab.id
  //                 ? "border-indigo-600 text-indigo-600 font-medium"
  //                 : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
  //             }`}
  //           >
  //             <tab.icon className="w-4 h-4" />
  //             <span>{tab.label}</span>
  //           </button>
  //         ))}
  //       </div>
  //       <Button
  //         variant="success"
  //         icon={Save}
  //         onClick={saveDataToApi}
  //         className="shadow-lg shadow-green-200"
  //       >
  //         Lagre alle endringer
  //       </Button>
  //     </div>
  //   );

  const renderTabs = () => (
    <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex py-4 justify-between">
          <div className="flex space-x-4">
            {[
              { id: "checklists", label: "Sjekklister", icon: ClipboardList },
              { id: "rooms", label: "Rom", icon: BedDouble },
              { id: "employees", label: "Ansatte", icon: Users },
              { id: "logs", label: "Logg", icon: FileCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <Button
            variant="success"
            icon={Save}
            onClick={saveDataToApi}
            className="shadow-lg shadow-green-200"
          >
            Lagre alle endringer
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Ansattoversikt</h2>
        <Button onClick={addEmployee} icon={Plus}>
          Ny ansatt
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.employees.map((e) => (
          <div
            key={e.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div
                onClick={() =>
                  setEditModal({
                    open: true,
                    target: e,
                    field: "initials",
                    title: "Endre initialer",
                    collection: "employees",
                  })
                }
                className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-indigo-200"
              >
                {e.initials}
              </div>
              <div>
                <p
                  onClick={() =>
                    setEditModal({
                      open: true,
                      target: e,
                      field: "name",
                      title: "Endre navn",
                      collection: "employees",
                    })
                  }
                  className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline  underline-offset-4"
                >
                  {e.name}
                </p>
                <p className="text-xs text-gray-400">ID: {e.id}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => deleteEmployee(e.id)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Romoversikt</h2>
        <Button onClick={addRoom} icon={Plus}>
          Nytt rom
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.rooms.map((r) => (
          <div
            key={r.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-3 group hover:shadow-md transition-shadow relative"
          >
            <Button
              variant="ghost"
              onClick={() => deleteRoom(r.id)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <BedDouble className="w-8 h-8 text-indigo-300" />
            <p
              onClick={() =>
                setEditModal({
                  open: true,
                  target: r,
                  field: "name",
                  title: "Endre romnavn",
                  collection: "rooms",
                })
              }
              className="font-bold text-gray-800 text-lg cursor-pointer hover:text-indigo-600 hover:underline underline-offset-4"
            >
              {r.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChecklists = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Sjekklister</h2>
        <Button onClick={addChecklist} icon={Plus}>
          Ny liste
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {data.checklists.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3
                    onClick={() =>
                      setEditModal({
                        open: true,
                        target: c,
                        field: "name",
                        title: "Endre listenavn",
                        collection: "checklists",
                      })
                    }
                    className="font-bold text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline "
                  >
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      Tilknyttet rom:
                    </span>
                    <select
                      value={c.roomId}
                      onChange={(e) =>
                        changeChecklistRoom(c.id, e.target.value)
                      }
                      className="text-xs bg-white border border-gray-300 rounded px-2 py-0.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      {data.rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => deleteChecklist(c.id)}
                className="text-xs px-2 py-1 h-8"
              >
                Slett liste
              </Button>
            </div>

            {/* Tasks */}
            <div className="p-4 bg-white">
              <div className="space-y-2">
                {c.tasks.map((t) => (
                  <div key={t.id} className="flex items-center group">
                    <div className="w-8 flex justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-indigo-400"></div>
                    </div>
                    <div
                      onClick={() =>
                        setEditModal({
                          open: true,
                          target: t,
                          field: "text",
                          title: "Endre oppgavetekst",
                          isTask: true,
                          checklistId: c.id,
                        })
                      }
                      className="flex-1 py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-700 text-sm border border-transparent hover:border-gray-200 transition-all"
                    >
                      {t.text}
                    </div>
                    <button
                      onClick={() => deleteTask(c.id, t.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addTask(c.id)}
                className="mt-4 flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800 px-3 py-2 hover:bg-indigo-50 rounded-lg transition-colors w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Legg til ny oppgave
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Fullførte Sjekklister
        </h2>
        <span className="text-sm text-gray-500">
          Loggføringer: {data.signLog.length}
        </span>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {data.signLog.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Ingen loggføringer funnet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Dato</th>
                <th className="p-4">Rom</th>
                <th className="p-4">Sjekkliste</th>
                <th className="p-4">Signert av</th>
                <th className="p-4 text-right">Handling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.signLog.map((log, idx) => {
                const roomName =
                  data.rooms.find((r) => r.id === log.roomId)?.name || "Ukjent";
                const checkName =
                  data.checklists.find((c) => c.id === log.checklistId)?.name ||
                  "Ukjent";
                const emp = data.employees.find((e) => e.id === log.employeeId);
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-gray-600">
                      {new Date(log.ts).toLocaleString("nb-NO")}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {roomName}
                    </td>
                    <td className="p-4 text-gray-600">{checkName}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {emp ? emp.initials : "??"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        className="text-red-400 hover:text-red-600 p-1"
                        onClick={() =>
                          setData((prev) => ({
                            ...prev,
                            signLog: prev.signLog.filter(
                              (l) => l.ts !== log.ts
                            ),
                          }))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <>
      {renderTabs()}

      <div className="max-w-6xl mx-auto p-6 pt-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-10 gap-4">
          <div>
            {activeTab === "checklists" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <ClipboardList className="w-8 h-8 text-indigo-600" />
                  Administrer Sjekklister
                </h1>
                <p className="text-gray-500 mt-1">
                  Legg til, fjern eller rediger sjekklister.
                </p>
              </div>
            )}
            {activeTab === "rooms" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <BedDouble className="w-8 h-8 text-indigo-600" />
                  Administrer Rom
                </h1>
                <p className="text-gray-500 mt-1">
                  Legg til, fjern eller rediger rommene i sjekklistene.
                </p>
              </div>
            )}
            {activeTab === "employees" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="w-8 h-8 text-indigo-600" />
                  Administrer Ansatte
                </h1>
                <p className="text-gray-500 mt-1">
                  Legg til, fjern eller rediger ansatte som kan signere
                  sjekklister.
                </p>
              </div>
            )}
            {activeTab === "logs" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FileCheck className="w-8 h-8 text-indigo-600" />
                  Logg
                </h1>
                <p className="text-gray-500 mt-1">
                  Oversikt over alle utførte sjekklister og signeringer.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="min-h-[400px]">
          {activeTab === "checklists" && renderChecklists()}
          {activeTab === "rooms" && renderRooms()}
          {activeTab === "employees" && renderEmployees()}
          {activeTab === "logs" && renderLogs()}
        </div>

        {/* Global Modals */}
        <EditModal
          isOpen={editModal.open}
          onClose={() => setEditModal({ ...editModal, open: false })}
          title={editModal.title}
          field={editModal.field}
          initialValue={
            editModal.isTask
              ? editModal.target?.text
              : editModal.target?.[editModal.field]
          }
          onSave={(val) => {
            if (editModal.isTask) {
              updateChecklistTask(
                editModal.checklistId,
                editModal.target.id,
                val
              );
            } else {
              updateItem(
                editModal.collection,
                editModal.target.id,
                editModal.field,
                val
              );
            }
          }}
        />

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
      </div>
    </>
  );
};

export default ChecklistAdmin;
