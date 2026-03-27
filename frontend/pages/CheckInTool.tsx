import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Search, CheckCircle, QrCode, Camera, User, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CheckInTool: React.FC = () => {
  const { id } = useParams() as { id?: string };
  const { getEvent, getEventRegistrations, checkInUser, user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  if (!user || user.role !== 'ORGANIZER') {
    return <Navigate to="/login" />;
  }

  const event = getEvent(id || '');
  if (!event) return <div>Event not found</div>;

  const registrations = getEventRegistrations(event.id);

  // Filter logic
  const filteredParticipants = registrations.filter(r => 
    r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = (userId: string) => {
    checkInUser(event.id, userId);
  };

  // Simulate scanning
  useEffect(() => {
    let timer: any;
    if (isScanning) {
        // Mock scan delay
        timer = setTimeout(() => {
             // Randomly pick a user to "scan"
             const randomUser = registrations[Math.floor(Math.random() * registrations.length)];
             if (randomUser) {
                setScanResult(randomUser.user.name);
                checkInUser(event.id, randomUser.user.id);
             }
             setIsScanning(false);
        }, 2500);
    }
    return () => clearTimeout(timer);
  }, [isScanning, registrations, event.id, checkInUser]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/8 pb-4">
            <Link to="/dashboard" className="p-2 hover:bg-surface-700 rounded-full transition-colors text-surface-400">
                <ArrowLeft size={24} />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Check-in Terminal</h1>
                <p className="text-sm text-surface-400">{event.title}</p>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-800 p-4 rounded-xl border border-white/8 text-center">
                <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{registrations.filter(r => r.status === 'CHECKED_IN').length}</div>
                <div className="text-xs text-surface-400 uppercase tracking-wide mt-1">Checked In</div>
            </div>
            <div className="bg-surface-800 p-4 rounded-xl border border-white/8 text-center">
                <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{registrations.length}</div>
                <div className="text-xs text-surface-400 uppercase tracking-wide mt-1">Total Registered</div>
            </div>
        </div>

        {/* Action Area */}
        <div className="flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input
                    type="text"
                    placeholder="Search participant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/8 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-surface-800 text-white placeholder-surface-400"
                />
            </div>
            <Button className="px-6 gap-2" onClick={() => setIsScanning(true)}>
                <QrCode size={20} />
                Scan Ticket
            </Button>
        </div>

        {/* Participant List */}
        <div className="bg-surface-800 rounded-xl border border-white/8 overflow-hidden">
            <div className="divide-y divide-white/6">
                {filteredParticipants.length > 0 ? (
                    filteredParticipants.map((record) => (
                        <div key={record.user.id} className="p-4 flex items-center justify-between hover:bg-surface-700/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${record.status === 'CHECKED_IN' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-surface-700 text-surface-300'}`}>
                                    {record.status === 'CHECKED_IN' ? <CheckCircle size={20} /> : record.user.name.substring(0,2)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{record.user.name}</h4>
                                    <p className="text-xs text-surface-400">{record.user.email} • {record.user.department}</p>
                                </div>
                            </div>
                            {record.status === 'CHECKED_IN' ? (
                                <span className="px-3 py-1 bg-emerald-900/40 text-emerald-400 text-xs font-bold rounded-full border border-emerald-700/30">
                                    Checked In
                                </span>
                            ) : (
                                <Button size="sm" variant="outline" onClick={() => handleCheckIn(record.user.id)}>
                                    Check In
                                </Button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-surface-400">
                        No participants found.
                    </div>
                )}
            </div>
        </div>

        {/* Scan Overlay Mock */}
        {isScanning && (
            <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
                <button onClick={() => setIsScanning(false)} className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <X size={24} />
                </button>
                <div className="relative w-72 h-72 border-2 border-white/20 rounded-3xl overflow-hidden mb-8">
                    <div className="absolute inset-0 border-[3px] border-brand-500/80 rounded-3xl animate-pulse"></div>
                    <div className="w-full h-full bg-surface-800 flex items-center justify-center text-surface-500">
                        <Camera size={48} />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 shadow-[0_0_15px_rgba(225,29,72,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-white text-lg font-medium">Point camera at QR code</p>
                <p className="text-white/40 text-sm mt-2">Simulating scan...</p>
            </div>
        )}

        {/* Scan Result Toast */}
        {scanResult && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-700 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
                <CheckCircle size={20} />
                <span>Checked in <strong>{scanResult}</strong></span>
                <button onClick={() => setScanResult(null)} className="ml-2 hover:bg-white/20 rounded-full p-1"><X size={14} /></button>
            </div>
        )}
    </div>
  );
};