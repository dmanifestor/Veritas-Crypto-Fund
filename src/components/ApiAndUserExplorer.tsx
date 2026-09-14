import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Database, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Search, 
  RefreshCw, 
  UserCheck, 
  Copy, 
  Check, 
  FileCode, 
  Play, 
  Users, 
  MapPin, 
  ShieldAlert, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserAccount, ApiTestResult } from '../types';

interface ApiAndUserExplorerProps {
  currentUser: UserAccount | null;
  onSelectUserForLogin: (username: string) => void;
  onOpenRegisterModal: () => void;
}

interface EndpointPreset {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT';
  path: string;
  description: string;
  defaultBody?: string;
}

const PRESETS: EndpointPreset[] = [
  {
    id: 'get-register',
    name: '1. Get All Registered Users',
    method: 'GET',
    path: '/register',
    description: 'Queries SQLite userData.db: SELECT * FROM user',
  },
  {
    id: 'post-register',
    name: '2. Register New User',
    method: 'POST',
    path: '/register',
    description: 'Hashes password with bcrypt and inserts record into user table',
    defaultBody: JSON.stringify(
      {
        username: `trader_${Math.floor(Math.random() * 900 + 100)}`,
        name: 'Alex Vance',
        password: 'traderpass123',
        gender: 'male',
        location: 'Singapore',
      },
      null,
      2
    ),
  },
  {
    id: 'post-login-joshua',
    name: '3. User Login (Joshua James Bergin - PDF)',
    method: 'POST',
    path: '/login/',
    description: 'Validates credentials for Joshua James Bergin (Berginjoshua1@gmail.com / Thatguy12@)',
    defaultBody: JSON.stringify(
      {
        username: 'Berginjoshua1@gmail.com',
        password: 'Thatguy12@',
      },
      null,
      2
    ),
  },
  {
    id: 'post-login',
    name: '4. User Login (testing-test-2)',
    method: 'POST',
    path: '/login/',
    description: 'Finds user by username, validates bcrypt password match',
    defaultBody: JSON.stringify(
      {
        username: 'testing-test-2',
        password: 'testing-today',
      },
      null,
      2
    ),
  },
  {
    id: 'put-change-password',
    name: '5. Change Password',
    method: 'PUT',
    path: '/change-password/',
    description: 'Verifies old password match and updates new bcrypt hashed password',
    defaultBody: JSON.stringify(
      {
        username: 'Berginjoshua1@gmail.com',
        oldPassword: 'Thatguy12@',
        newPassword: 'Thatguy12@',
      },
      null,
      2
    ),
  },
];

export const ApiAndUserExplorer: React.FC<ApiAndUserExplorerProps> = ({
  currentUser,
  onSelectUserForLogin,
  onOpenRegisterModal,
}) => {
  const [activeTab, setActiveTab] = useState<'api-client' | 'database'>('api-client');
  const [selectedPreset, setSelectedPreset] = useState<EndpointPreset>(PRESETS[0]);
  const [requestMethod, setRequestMethod] = useState<'GET' | 'POST' | 'PUT'>('GET');
  const [requestPath, setRequestPath] = useState('/register');
  const [requestBody, setRequestBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState<ApiTestResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Database Explorer state
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [dbSearch, setDbSearch] = useState('');
  const [dbError, setDbError] = useState<string | null>(null);

  // Fetch users from SQLite DB
  const fetchDbUsers = async () => {
    setIsDbLoading(true);
    setDbError(null);
    try {
      const res = await fetch('/register');
      if (!res.ok) throw new Error('Failed to query SQLite database');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setDbError(err.message || 'Error querying database');
    } finally {
      setIsDbLoading(false);
    }
  };

  useEffect(() => {
    fetchDbUsers();
  }, []);

  const handleSelectPreset = (preset: EndpointPreset) => {
    setSelectedPreset(preset);
    setRequestMethod(preset.method);
    setRequestPath(preset.path);
    setRequestBody(preset.defaultBody || '');
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
      };

      if (requestMethod !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(requestPath, options);
      const durationMs = Math.round(performance.now() - startTime);
      const text = await res.text();

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      setApiResult({
        endpoint: requestPath,
        method: requestMethod,
        status: res.status,
        statusText: res.statusText || (res.status === 200 ? 'OK' : 'Error'),
        response: parsed,
        durationMs,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Refresh DB table if a mutating request succeeded
      if (res.ok && (requestMethod === 'POST' || requestMethod === 'PUT')) {
        fetchDbUsers();
      }
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      setApiResult({
        endpoint: requestPath,
        method: requestMethod,
        status: 500,
        statusText: 'Network Error',
        response: err.message,
        durationMs,
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!apiResult) return;
    const content = typeof apiResult.response === 'object'
      ? JSON.stringify(apiResult.response, null, 2)
      : String(apiResult.response);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter users
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(dbSearch.toLowerCase()) ||
    u.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
    u.location.toLowerCase().includes(dbSearch.toLowerCase())
  );

  // Unique locations count
  const locationsCount = new Set(users.map(u => u.location)).size;
  const maleCount = users.filter(u => u.gender.toLowerCase() === 'male').length;
  const femaleCount = users.filter(u => u.gender.toLowerCase() === 'female').length;

  return (
    <div className="flex-1 p-3 sm:p-5 max-w-7xl mx-auto w-full flex flex-col gap-4 text-slate-200">
      {/* Top Banner */}
      <div className="bg-[#090e1b] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">Attached Files Integration & API Console</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                app.js + app.http + userData.db
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live SQLite authentication backend with bcrypt encryption, REST endpoints, and database explorer.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-[#070b14] p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('api-client')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'api-client'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Interactive HTTP Tester</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'database'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQLite Database ({users.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'api-client' ? (
        /* HTTP CLIENT VIEW (mirrors app.http) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Preset Endpoints */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="bg-[#090e1b] border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Endpoints from app.http</span>
                <span className="text-[10px] font-mono text-slate-500">4 test suites</span>
              </div>

              <div className="space-y-2">
                {PRESETS.map(preset => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                        isSelected
                          ? 'bg-slate-800/80 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                          : 'bg-[#0d1424]/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-200">{preset.name}</span>
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            preset.method === 'GET'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : preset.method === 'POST'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {preset.method}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 truncate">{preset.path}</div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">{preset.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-[#090e1b] border border-slate-800/80 rounded-xl p-4 text-xs space-y-2 text-slate-400">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Backend Implementation</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Endpoints are served live by <code className="text-emerald-400 font-mono">server.ts</code> executing against the real SQLite <code className="text-emerald-400 font-mono">userData.db</code> database using bcrypt password hashing.
              </p>
            </div>
          </div>

          {/* Right Column: Request Runner & Response */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Request Builder */}
            <div className="bg-[#090e1b] border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={requestMethod}
                  onChange={e => setRequestMethod(e.target.value as any)}
                  className={`font-mono font-bold text-xs px-3 py-2 rounded-lg border focus:outline-none ${
                    requestMethod === 'GET'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : requestMethod === 'POST'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                </select>

                <input
                  type="text"
                  value={requestPath}
                  onChange={e => setRequestPath(e.target.value)}
                  className="flex-1 bg-[#0d1424] border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                />

                <button
                  onClick={handleExecuteRequest}
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>Send Request</span>
                </button>
              </div>

              {/* JSON Body editor for POST/PUT */}
              {requestMethod !== 'GET' && (
                <div>
                  <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                    <span>Request Body (JSON)</span>
                    <span className="text-[10px] text-slate-500">Content-Type: application/json</span>
                  </div>
                  <textarea
                    rows={6}
                    value={requestBody}
                    onChange={e => setRequestBody(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400 resize-y"
                  />
                </div>
              )}
            </div>

            {/* Response Viewer */}
            <div className="bg-[#090e1b] border border-slate-800/80 rounded-xl flex flex-col flex-1 overflow-hidden min-h-[350px]">
              <div className="h-10 border-b border-slate-800 px-4 flex items-center justify-between bg-[#080d19]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-200">Response</span>
                  {apiResult && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          apiResult.status >= 200 && apiResult.status < 300
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {apiResult.status} {apiResult.statusText}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {apiResult.durationMs}ms
                      </span>
                    </div>
                  )}
                </div>

                {apiResult && (
                  <button
                    onClick={handleCopyResponse}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div className="p-4 flex-1 bg-[#060a13] font-mono text-xs overflow-auto max-h-[450px]">
                {apiResult ? (
                  <pre className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed">
                    {typeof apiResult.response === 'object'
                      ? JSON.stringify(apiResult.response, null, 2)
                      : String(apiResult.response)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 gap-2">
                    <Send className="w-8 h-8 opacity-40 text-emerald-400" />
                    <p className="text-xs">Select an endpoint from the left or click "Send Request" to test live.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SQLITE DATABASE TABLE EXPLORER */
        <div className="flex flex-col gap-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#090e1b] border border-slate-800 rounded-xl p-3.5 flex flex-col">
              <span className="text-[11px] text-slate-400 font-mono">Total Users</span>
              <span className="text-xl font-extrabold text-white mt-1">{users.length}</span>
            </div>
            <div className="bg-[#090e1b] border border-slate-800 rounded-xl p-3.5 flex flex-col">
              <span className="text-[11px] text-slate-400 font-mono">Unique Locations</span>
              <span className="text-xl font-extrabold text-cyan-400 mt-1">{locationsCount}</span>
            </div>
            <div className="bg-[#090e1b] border border-slate-800 rounded-xl p-3.5 flex flex-col">
              <span className="text-[11px] text-slate-400 font-mono">Male Accounts</span>
              <span className="text-xl font-extrabold text-emerald-400 mt-1">{maleCount}</span>
            </div>
            <div className="bg-[#090e1b] border border-slate-800 rounded-xl p-3.5 flex flex-col">
              <span className="text-[11px] text-slate-400 font-mono">Female Accounts</span>
              <span className="text-xl font-extrabold text-purple-400 mt-1">{femaleCount}</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#090e1b] border border-slate-800/80 rounded-xl flex flex-col overflow-hidden">
            {/* Table Action Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#080d19]">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by username, name, or city..."
                  value={dbSearch}
                  onChange={e => setDbSearch(e.target.value)}
                  className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={fetchDbUsers}
                  disabled={isDbLoading}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDbLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh DB</span>
                </button>
                <button
                  onClick={onOpenRegisterModal}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>+ New User</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#070b14] text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-4">#</th>
                    <th className="py-2.5 px-4">Username</th>
                    <th className="py-2.5 px-4">Full Name</th>
                    <th className="py-2.5 px-4">Gender</th>
                    <th className="py-2.5 px-4">Location</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredUsers.map((u, idx) => (
                    <tr key={u.username + idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-4 text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{u.username}</span>
                          {currentUser?.username === u.username && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 rounded font-sans font-semibold">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-sans text-slate-200">{u.name}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded capitalize ${
                            u.gender.toLowerCase() === 'male'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : u.gender.toLowerCase() === 'female'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {u.gender}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-sans text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{u.location}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => onSelectUserForLogin(u.username)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold transition-colors inline-flex items-center gap-1 border border-slate-700/60"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Login As</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 font-sans">
                        No users found matching "{dbSearch}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
