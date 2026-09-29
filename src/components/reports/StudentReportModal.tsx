import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2, Bus, Info } from 'lucide-react';
import { ReportIssueType } from '../../types';
import { store } from '../../services/store';

interface StudentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBus?: string;
  defaultDestination?: string;
}

export const StudentReportModal: React.FC<StudentReportModalProps> = ({
  isOpen,
  onClose,
  defaultBus = '',
  defaultDestination = '',
}) => {
  const [issueType, setIssueType] = useState<ReportIssueType>("Bus delayed");
  const [busNumber, setBusNumber] = useState(defaultBus);
  const [destination, setDestination] = useState(defaultDestination);
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    store.addReport({
      issueType,
      busOrTrainNumber: busNumber || undefined,
      destination: destination || undefined,
      description: description.trim(),
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setDescription('');
      onClose();
    }, 1500);
  };

  const issueOptions: ReportIssueType[] = [
    "Bus didn't arrive",
    "Bus delayed",
    "Incorrect timetable",
    "Crowded bus",
    "Incorrect vehicle location",
    "Route problem",
    "Other",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg vesper-card rounded-3xl p-6 sm:p-8 border border-white/15 overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] text-white flex items-center justify-center border border-white/15">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Peer Transport Feedback
              </span>
              <h2 className="text-xl font-bold font-heading text-white">
                Submit Student Report
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-white mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Report Submitted Successfully</h3>
            <p className="text-xs text-gray-300 max-w-sm mx-auto">
              Your feedback is filed with status <span className="text-white font-semibold">"Pending"</span> for campus transport administrator review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Issue Category
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as ReportIssueType)}
                className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/50"
              >
                {issueOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-black text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Bus / Train Number
                </label>
                <input
                  type="text"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  placeholder="e.g. 15, 17D, 16382"
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Destination / Stop
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Nagercoil, Mathaganeri"
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what occurred (e.g. departure delay, heavy crowd, route obstacle)..."
                className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                required
              />
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
              <span>
                Submitted reports are directly routed to the Joy University Campus Transport Operations Dashboard.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl vesper-btn-solid flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#111111]" />
              <span>SUBMIT REPORT</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
