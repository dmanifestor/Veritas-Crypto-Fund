import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  ArrowDownRight, 
  Info, 
  HelpCircle,
  TrendingUp,
  FileText,
  Calendar,
  ExternalLink,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { JOSHUA_BERGIN_CLIENT_DATA } from '../data/clientDashboardData';
import { ClientInvestmentRecord } from '../types';

interface ClientDashboardProps {
  onOpenDepositModal?: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = () => {
  const data = JOSHUA_BERGIN_CLIENT_DATA;

  // Withdrawal form states
  const [walletAddress, setWalletAddress] = useState('0x003bB95cE0010Fa8e9F7d81884f506355387cA1A');
  const [network, setNetwork] = useState('ETH (Ethereum / ERC-20)');
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>(data.availableBalance.toString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeeNotification, setShowFeeNotification] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // History search filter
  const [historySearch, setHistorySearch] = useState('');

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowFeeNotification(true);
    }, 600);
  };

  const handleCopyNotification = () => {
    navigator.clipboard.writeText(
      `$${data.requiredWithdrawalFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} is to be paid before the available balance can be withdrawn, to meet the investment.`
    );
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Filter history records
  const filteredHistory = data.history.filter(item => 
    item.date.toLowerCase().includes(historySearch.toLowerCase()) ||
    item.notes?.toLowerCase().includes(historySearch.toLowerCase()) ||
    item.status.toLowerCase().includes(historySearch.toLowerCase())
  );

  const totalInvested = data.history.reduce((acc, curr) => acc + curr.investedAmount, 0);
  const totalWithdrawn = data.history.reduce((acc, curr) => acc + (curr.withdrawalAmount || 0), 0);
  const totalFeesPaid = data.history.reduce((acc, curr) => acc + (curr.feePaid || 0), 0);

  return (
    <div className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6 text-slate-200">
      {/* 1. Client Header & Scope Profile */}
      <div className="bg-[#090e1b] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-black text-white tracking-tight">{data.clientName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Client Dashboard Project
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Web App
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span className="font-mono text-slate-300">{data.email}</span>
              <span>•</span>
              <span className="text-slate-400">Timeline, Budget & Client Delivery</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 bg-[#0d1424] px-4 py-2.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Portfolio Status</div>
            <div className="text-xs font-bold text-white">Active Allocation Tier</div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics & Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-[#0c1527] to-[#090e1b] border-2 border-emerald-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
            <span>Available Balance</span>
            <Wallet className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight mt-1">
            ${data.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Liquid balance eligible for withdrawal</span>
          </div>
        </div>

        {/* Total Invested */}
        <div className="bg-[#090e1b] border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Cumulative Invested</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>8 investment cycles (2019–2022)</span>
          </div>
        </div>

        {/* Total Historical Withdrawals */}
        <div className="bg-[#090e1b] border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Historical Withdrawals</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            ${totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Successfully distributed to date</span>
          </div>
        </div>

        {/* Historical Fees Paid */}
        <div className="bg-[#090e1b] border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Recorded Protocol Fees</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            ${totalFeesPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span>Settlement fees on historical gains</span>
          </div>
        </div>
      </div>

      {/* 3. Withdrawal Section & Settlement Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Withdrawal Form */}
        <div className="lg:col-span-7 bg-[#090e1b] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Withdraw From Available Balance</h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              Max: ${data.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
            {/* Wallet Address Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Destination Crypto Wallet Address (ETH / ERC-20)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setWalletAddress('0x003bB95cE0010Fa8e9F7d81884f506355387cA1A');
                    setNetwork('ETH (Ethereum / ERC-20)');
                  }}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
                >
                  <span>Reset to Default ETH</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={walletAddress}
                  onChange={e => setWalletAddress(e.target.value)}
                  placeholder="0x003bB95cE0010Fa8e9F7d81884f506355387cA1A"
                  className="w-full bg-[#0d1424] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Destination ETH Wallet: <span className="font-mono text-emerald-400">0x003bB95cE0010Fa8e9F7d81884f506355387cA1A</span>
              </p>
            </div>

            {/* Network Selector & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Transfer Network</label>
                <select
                  value={network}
                  onChange={e => setNetwork(e.target.value)}
                  className="w-full bg-[#0d1424] border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="ETH (Ethereum / ERC-20)">ETH (Ethereum ERC-20)</option>
                  <option value="USDT (TRC-20)">USDT (TRC-20 Tron Network)</option>
                  <option value="USDT (ERC-20)">USDT (ERC-20 Ethereum)</option>
                  <option value="BTC (Native)">BTC (Bitcoin Network)</option>
                  <option value="USDC (Solana)">USDC (Solana Network)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Withdrawal Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  max={data.availableBalance}
                  required
                  value={withdrawalAmount}
                  onChange={e => setWithdrawalAmount(e.target.value)}
                  className="w-full bg-[#0d1424] border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Quick Select:</span>
              {[
                { label: '25%', factor: 0.25 },
                { label: '50%', factor: 0.5 },
                { label: '75%', factor: 0.75 },
                { label: '100% (All)', factor: 1.0 },
              ].map(item => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => setWithdrawalAmount((data.availableBalance * item.factor).toFixed(2))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Withdrawal Request...</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Request Withdrawal from Available Balance</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Processing Notice & Consumer Advisory */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Notification Alert Window */}
          {showFeeNotification ? (
            <div className="bg-[#120e17] border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-amber-300">Withdrawal Processing Notice</h3>
                    <button
                      onClick={handleCopyNotification}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded"
                    >
                      {hasCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{hasCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  
                  {/* Exact text from attached PDF */}
                  <div className="mt-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs font-semibold leading-relaxed shadow-sm">
                    "{data.requiredWithdrawalFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} is to be paid before the available balance can be withdrawn, to meet the investment."
                  </div>

                  <div className="mt-3 text-[11px] text-slate-300 leading-relaxed space-y-1.5 font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Requested Amount:</span> 
                      <span className="text-white font-bold">${parseFloat(withdrawalAmount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pt-1 border-t border-slate-800">
                      <span className="text-slate-400 font-sans">Destination Wallet:</span> 
                      <span className="text-emerald-400 text-[10px] break-all">{walletAddress || '0x003bB95cE0010Fa8e9F7d81884f506355387cA1A'}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400 font-sans">Network:</span> 
                      <span className="text-cyan-300">{network}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400 font-sans">Settlement Status:</span> 
                      <span className="text-amber-400 font-bold">Pending $5,960.00 Fee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#090e1b] border border-slate-800 rounded-2xl p-5 flex flex-col justify-center items-center text-center text-slate-400 h-full min-h-[240px]">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-2.5">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-200">Withdrawal Settlement System</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                Default Destination ETH Wallet:
              </p>
              <span className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 mt-1">
                0x003bB95cE0010Fa8e9F7d81884f506355387cA1A
              </span>
              <p className="text-[11px] text-slate-400 max-w-xs mt-2">
                Click <strong>"Request Withdrawal from Available Balance"</strong> to trigger the live settlement notice.
              </p>
            </div>
          )}

          {/* Consumer Financial Protection Advisory */}
          <div className="bg-[#0a1220] border border-cyan-500/30 rounded-2xl p-4 text-xs text-slate-300 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-cyan-400">
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Consumer Financial Advisory & Best Practice</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standard regulated cryptocurrency exchanges (Coinbase, Kraken, Binance) automatically deduct network transaction fees directly from the withdrawal payload. Never send external deposits or separate wire transfers to unlock account withdrawals.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Complete Investment & Withdrawal History Ledger (from PDF) */}
      <div className="bg-[#090e1b] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080d19]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Historical Investment & Settlement Ledger</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Detailed chronological record of investments, profit distributions, and fees (2019 – 2022).
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search ledger by date or notes..."
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-[#060a14] text-slate-400 text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Invested ($)</th>
                <th className="py-3 px-4">Withdrawal / Return ($)</th>
                <th className="py-3 px-4">Protocol Fee ($)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Ledger Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHistory.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap font-medium">{item.date}</td>
                  <td className="py-3 px-4 text-white font-bold">
                    ${item.investedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">
                    {item.withdrawalAmount && item.withdrawalAmount > 0 ? (
                      <span className="text-emerald-400 font-bold">
                        +${item.withdrawalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    ) : item.profitAmount ? (
                      <span className="text-cyan-400 font-bold">
                        Profit ${item.profitAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-amber-400/90">
                    {item.feePaid && item.feePaid > 0 ? (
                      `$${item.feePaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    ) : (
                      <span className="text-slate-500">$0.00</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded capitalize ${
                        item.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-400 text-[11px]">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
