import React, { useState } from "react";
import {
  LogIn,
  User,
  Lock,
  Loader2,
  LayoutGrid,
  ClipboardList,
  Activity,
  Pill,
} from "lucide-react";

import ChecklistAdmin from "./components/ChecklistAdmin";
import ForordningAdmin from "./components/ForordningAdmin";
import PasientInfoAdmin from "./components/PasientInfoAdmin";

// const App = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [activeApp, setActiveApp] = useState("sjekklister");

//   const handleLogin = () => {
//     setIsLoading(true);
//     // Simple mock login validation
//     if (username.length > 0 && password.length > 0) {
//       setTimeout(() => {
//         setIsLoading(false);
//         setIsLoggedIn(true);
//       }, 1000);
//     } else {
//       setTimeout(() => {
//         setIsLoading(false);
//         alert("Skriv inn brukernavn og passord for å logge inn.");
//       }, 500);
//     }
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUsername("");
//     setPassword("");
//     setActiveApp("sjekklister");
//   };

//   const renderActiveApp = () => {
//     switch (activeApp) {
//       case "sjekklister":
//         return <ChecklistAdmin />;
//       case "forordning":
//         return <ForordningAdmin />;
//       case "pasient":
//         return <PasientInfoAdmin />;
//       default:
//         return <ChecklistAdmin />;
//     }
//   };

// // --- Login View ---
// if (!isLoggedIn) {
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
//         <div className="flex flex-col space-y-6">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
//             <LayoutGrid className="w-7 h-7 mr-2 text-indigo-600" />
//             HelseAdmin
//           </h1>
//           <p className="text-center text-gray-500">
//             {isLoading
//               ? "Logger inn..."
//               : "Skriv inn detaljer for å fortsette."}
//           </p>
//           <div className="space-y-4">
//             <div className="space-y-1">
//               {username.length > 0 && (
//                 <label className="text-sm font-medium text-gray-700 block">
//                   Brukernavn
//                 </label>
//               )}
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
//                 <input
//                   placeholder="Brukernavn"
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>
//             <div className="space-y-1">
//               {password.length > 0 && (
//                 <label className="text-sm font-medium text-gray-700 block">
//                   Passord
//                 </label>
//               )}
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
//                 <input
//                   placeholder="Passord"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={handleLogin}
//             disabled={isLoading}
//             className="w-full py-3 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 loginBtn"
//           >
//             {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
//             {isLoading ? "Behandler..." : "Logg inn"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

//   // --- Dashboard View (Multi-App Switcher) ---
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Top Navbar */}
//       <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
//         <div className="flex items-center gap-3">
//           <div className="bg-indigo-600 text-white p-2 rounded-lg">
//             <LayoutGrid className="w-6 h-6" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 leading-none">
//               HelseAdmin
//             </h1>
//             <span className="text-xs text-gray-500">
//               Logget inn som: {username || "Admin"}
//             </span>
//           </div>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="text-sm text-red-500 font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
//         >
//           Logg ut
//         </button>
//       </nav>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar Navigation */}
//         <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky">
//           <div className="p-4 space-y-2">
//             <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
//               Mine Apper
//             </p>
//             <button
//               onClick={() => setActiveApp("sjekklister")}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
//                 activeApp === "sjekklister"
//                   ? "bg-indigo-50 text-indigo-600 font-semibold"
//                   : "text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               <ClipboardList className="w-5 h-5" />
//               Sjekklister
//             </button>
//             <button
//               onClick={() => setActiveApp("forordning")}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
//                 activeApp === "forordning"
//                   ? "bg-indigo-50 text-indigo-600 font-semibold"
//                   : "text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               <Pill className="w-5 h-5" />
//               Forordningslister
//             </button>
//             <button
//               onClick={() => setActiveApp("pasient")}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
//                 activeApp === "pasient"
//                   ? "bg-indigo-50 text-indigo-600 font-semibold"
//                   : "text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               <Activity className="w-5 h-5" />
//               Pasientinfo
//             </button>
//           </div>
//         </aside>

//         {/* Main Content Area */}
//         <main className="flex-1 overflow-y-auto">{renderActiveApp()}</main>
//       </div>
//     </div>
//   );
// };

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeApp, setActiveApp] = useState("sjekklister");

  const handleLogin = () => {
    setIsLoading(true);
    // Simple mock login validation
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setActiveApp("sjekklister");
  };

  const renderActiveApp = () => {
    switch (activeApp) {
      case "sjekklister":
        return <ChecklistAdmin />;
      case "forordning":
        return <ForordningAdmin />;
      case "pasient":
        return <PasientInfoAdmin />;
      default:
        return <ChecklistAdmin />;
    }
  };

  // --- Login View ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 pt-10 rounded-3xl shadow-2xl border border-gray-100 mb-10">
          <div className="flex flex-col space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
              <LayoutGrid className="w-7 h-7 mr-2 text-indigo-600" />
              HelseAdmin
            </h1>
            <p className="text-center text-gray-500">
              {isLoading
                ? "Logger inn..."
                : "Skriv inn detaljer for å fortsette."}
            </p>
            <div className="space-y-4">
              <div className="space-y-1">
                {username.length > 0 && (
                  <label className="text-sm font-medium text-gray-700 block">
                    Brukernavn
                  </label>
                )}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                  <input
                    placeholder="Brukernavn"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-1">
                {password.length > 0 && (
                  <label className="text-sm font-medium text-gray-700 block">
                    Passord
                  </label>
                )}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                  <input
                    placeholder="Passord"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 loginBtn"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
              {isLoading ? "Behandler..." : "Logg inn"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Dashboard View (Multi-App Switcher) ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col container">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40 mb-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">
              HelseAdmin
            </h1>
            <span className="text-xs text-gray-500">
              Logget inn som: {username || "Admin"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          Logg ut
        </button>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar Navigation - Fixed/Sticky */}
        <aside className="w-64 bg-white border-r rounded-xl border-gray-200 hidden md:flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-4">
              Mine Apper
            </p>
            <button
              onClick={() => setActiveApp("sjekklister")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeApp === "sjekklister"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              Sjekklister
            </button>
            <button
              onClick={() => setActiveApp("forordning")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeApp === "forordning"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Pill className="w-5 h-5" />
              Forordningslister
            </button>
            <button
              onClick={() => setActiveApp("pasient")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeApp === "pasient"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Activity className="w-5 h-5" />
              Pasientinfo
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">{renderActiveApp()}</main>
      </div>
    </div>
  );
};

export default App;
