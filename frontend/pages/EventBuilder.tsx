import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useSearchParams, Navigate } from '../context/AppContext';
import { Save, Eye, Layout, Palette, Type, CheckCircle, Calendar, Plus, Trash2, MapPin, Clock, Trophy, BarChart2, Megaphone, Image, Bell, AlertCircle, List, QrCode, Users, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DEFAULT_THEME, CATEGORIES, THEME_TEMPLATES } from '../constants';
import { Event, ThemeConfig, ScheduleItem, LeaderboardEntry, VotingPoll, VotingOption, Announcement, RegistrationFormField, TeamFormationData, Team } from '../types';

// Mock IDs generator
const generateId = () => Math.random().toString(36).substr(2, 9);

export const EventBuilder: React.FC = () => {
    const { addEvent, getEvent, user } = useApp();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    const [activeStep, setActiveStep] = useState<'DETAILS' | 'THEME' | 'MODULES'>('DETAILS');

    // Form State
    const [formData, setFormData] = useState<Partial<Event>>({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Tech',
        bannerImage: 'https://picsum.photos/1200/600',
        theme: DEFAULT_THEME,
        modules: [
            { id: '1', type: 'REGISTRATION', isEnabled: true, data: [] },
            { id: '2', type: 'SCHEDULE', isEnabled: false, data: [] },
            { id: '3', type: 'LEADERBOARD', isEnabled: false, data: [] },
            { id: '4', type: 'VOTING', isEnabled: false, data: [] },
            { id: '5', type: 'GALLERY', isEnabled: false, data: [] },
            { id: '6', type: 'ANNOUNCEMENTS', isEnabled: false, data: [] },
            { id: '7', type: 'QR_CHECKIN', isEnabled: false },
            { id: '8', type: 'TEAM_FORMATION', isEnabled: false, data: { maxTeamSize: 4, teams: [] } },
        ],
    });

    useEffect(() => {
        if (editId) {
            const existing = getEvent(editId);
            if (existing) {
                setFormData(existing);
            }
        }
    }, [editId, getEvent]);

    // Auth check: Ensure user is logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Ownership check: If editing, ensure the current user is the creator
    if (editId && formData.id && formData.createdBy && formData.createdBy !== user.id) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Unauthorized Access</h2>
                <p className="text-surface-300">You do not have permission to edit this event.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">Back to Dashboard</Button>
            </div>
        );
    }

    const handleThemeChange = (key: keyof ThemeConfig, value: string) => {
        setFormData(prev => ({
            ...prev,
            theme: { ...prev.theme!, [key]: value }
        }));
    };

    const applyTemplate = (template: ThemeConfig) => {
        setFormData(prev => ({
            ...prev,
            theme: { ...template }
        }));
    };

    const handlePublish = async () => {
        const newEvent: Event = {
            ...formData as Event,
            id: editId || generateId(),
            organization: user?.department || 'General',
            status: 'PUBLISHED',
            attendeeCount: editId ? (formData.attendeeCount || 0) : 0,
            createdBy: editId ? (formData.createdBy || user.id) : user.id // Ensure creator is set
        };
        if (!editId) await addEvent(newEvent);
        else {
            // Mock update
            await addEvent(newEvent); // In real app, call updateEvent
        }
        navigate('/dashboard');
    };

    // --- Module Data Helpers ---
    const updateModuleData = (moduleId: string, newData: any) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules?.map(m => m.id === moduleId ? { ...m, data: newData } : m)
        }));
    };

    // Registration Form Builder Helpers
    const addRegistrationField = (moduleId: string, type: RegistrationFormField['type']) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: RegistrationFormField[] = module?.data || [];
        const newField: RegistrationFormField = {
            id: generateId(),
            type,
            label: type === 'text' ? 'Full Name' : type === 'email' ? 'Email Address' : 'New Field',
            required: true,
            options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
        };
        updateModuleData(moduleId, [...currentData, newField]);
    };

    const updateRegistrationField = (moduleId: string, fieldId: string, key: keyof RegistrationFormField, value: any) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: RegistrationFormField[] = module?.data || [];
        updateModuleData(moduleId, currentData.map(f => f.id === fieldId ? { ...f, [key]: value } : f));
    };

    const removeRegistrationField = (moduleId: string, fieldId: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: RegistrationFormField[] = module?.data || [];
        updateModuleData(moduleId, currentData.filter(f => f.id !== fieldId));
    };

    // Schedule Helpers
    const addScheduleItem = (moduleId: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: ScheduleItem[] = module?.data || [];
        const newItem: ScheduleItem = {
            id: generateId(),
            time: '09:00',
            title: 'New Session',
            location: 'TBA'
        };
        updateModuleData(moduleId, [...currentData, newItem]);
    };

    const removeScheduleItem = (moduleId: string, itemId: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: ScheduleItem[] = module?.data || [];
        updateModuleData(moduleId, currentData.filter(i => i.id !== itemId));
    };

    const updateScheduleItem = (moduleId: string, itemId: string, field: keyof ScheduleItem, value: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: ScheduleItem[] = module?.data || [];
        updateModuleData(moduleId, currentData.map(i => i.id === itemId ? { ...i, [field]: value } : i));
    };

    // Leaderboard Helpers
    const addLeaderboardEntry = (moduleId: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: LeaderboardEntry[] = module?.data || [];
        const newEntry: LeaderboardEntry = {
            id: generateId(),
            team: 'New Team',
            points: 0
        };
        updateModuleData(moduleId, [...currentData, newEntry]);
    };

    const removeLeaderboardEntry = (moduleId: string, entryId: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: LeaderboardEntry[] = module?.data || [];
        updateModuleData(moduleId, currentData.filter(i => i.id !== entryId));
    };

    const updateLeaderboardEntry = (moduleId: string, entryId: string, field: keyof LeaderboardEntry, value: any) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: LeaderboardEntry[] = module?.data || [];
        updateModuleData(moduleId, currentData.map(i => i.id === entryId ? { ...i, [field]: value } : i));
    };

    // Voting Helpers
    const addVotingPoll = (moduleId: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: VotingPoll[] = module?.data || [];
        const newPoll: VotingPoll = {
            id: generateId(),
            question: 'New Question?',
            options: [
                { id: generateId(), text: 'Option A', votes: 0 },
                { id: generateId(), text: 'Option B', votes: 0 }
            ]
        };
        updateModuleData(moduleId, [...currentData, newPoll]);
    };

    const removeVotingPoll = (moduleId: string, pollId: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: VotingPoll[] = module?.data || [];
        updateModuleData(moduleId, currentData.filter(p => p.id !== pollId));
    };

    const updateVotingPoll = (moduleId: string, pollId: string, field: keyof VotingPoll, value: any) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: VotingPoll[] = module?.data || [];
        updateModuleData(moduleId, currentData.map(p => p.id === pollId ? { ...p, [field]: value } : p));
    };

    const updateVotingOption = (moduleId: string, pollId: string, optionId: string, text: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: VotingPoll[] = module?.data || [];
        updateModuleData(moduleId, currentData.map(p => {
            if (p.id !== pollId) return p;
            return {
                ...p,
                options: p.options.map(o => o.id === optionId ? { ...o, text } : o)
            };
        }));
    };

    // Announcements Helpers
    const addAnnouncement = (moduleId: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: Announcement[] = module?.data || [];
        const newAnnouncement: Announcement = {
            id: generateId(),
            title: 'Update',
            message: 'Details here...',
            priority: 'INFO',
            timestamp: new Date().toISOString()
        };
        updateModuleData(moduleId, [newAnnouncement, ...currentData]);
    };

    const removeAnnouncement = (moduleId: string, id: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: Announcement[] = module?.data || [];
        updateModuleData(moduleId, currentData.filter(a => a.id !== id));
    };

    const updateAnnouncement = (moduleId: string, id: string, field: keyof Announcement, value: any) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: Announcement[] = module?.data || [];
        updateModuleData(moduleId, currentData.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    // Gallery Helpers
    const addGalleryImage = (moduleId: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: string[] = module?.data || [];
        updateModuleData(moduleId, [...currentData, 'https://picsum.photos/400/300']);
    };

    const removeGalleryImage = (moduleId: string, index: number) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: string[] = module?.data || [];
        const newData = [...currentData];
        newData.splice(index, 1);
        updateModuleData(moduleId, newData);
    };

    const updateGalleryImage = (moduleId: string, index: number, value: string) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: string[] = module?.data || [];
        const newData = [...currentData];
        newData[index] = value;
        updateModuleData(moduleId, newData);
    };

    // Team Formation Helpers
    const updateTeamConfig = (moduleId: string, key: keyof TeamFormationData, value: any) => {
        const module = formData.modules?.find(m => m.id === moduleId);
        const currentData: TeamFormationData = module?.data || { maxTeamSize: 4, teams: [] };
        updateModuleData(moduleId, { ...currentData, [key]: value });
    };


    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">

            {/* LEFT PANEL - CONTROLS */}
            <div className="w-1/3 bg-surface-800 border-r border-white/10 overflow-y-auto flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold text-white mb-4">{editId ? 'Edit Event' : 'Create Event'}</h1>
                    <div className="flex space-x-2 bg-[var(--bg)] p-1 rounded-lg">
                        {['DETAILS', 'THEME', 'MODULES'].map((step) => (
                            <button
                                key={step}
                                onClick={() => setActiveStep(step as any)}
                                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${activeStep === step ? 'bg-surface-800 shadow text-brand-400' : 'text-surface-300 hover:text-surface-200'
                                    }`}
                            >
                                {step}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 flex-1 space-y-6">
                    {activeStep === 'DETAILS' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-200 mb-1">Event Title</label>
                                <input
                                    className="w-full border rounded-md p-2 bg-surface-950 text-white placeholder-surface-500 border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Annual Tech Symposium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-200 mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded-md p-2 bg-surface-950 text-white placeholder-surface-500 border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-surface-200 mb-1">Date</label>
                                    <input type="datetime-local" className="w-full border rounded-md p-2 bg-surface-950 text-white placeholder-surface-500 border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-200 mb-1">Category</label>
                                    <select
                                        className="w-full border rounded-md p-2 bg-surface-950 text-white placeholder-surface-500 border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                    >
                                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-200 mb-1">Banner URL</label>
                                <input className="w-full border rounded-md p-2 bg-surface-950 text-white placeholder-surface-500 border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                    value={formData.bannerImage}
                                    onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {activeStep === 'THEME' && (
                        <div className="space-y-6">
                            <div className="bg-brand-900/20 p-4 rounded-lg text-sm text-brand-300 mb-4">
                                <p>Select a preset or customize individual elements. Changes update the preview instantly.</p>
                            </div>

                            {/* Theme Templates Section */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-surface-200 mb-3">
                                    <Sparkles size={16} /> Theme Templates
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {THEME_TEMPLATES.map(template => (
                                        <button
                                            key={template.id}
                                            onClick={() => applyTemplate(template.config)}
                                            className="p-3 border rounded-lg text-left hover:border-brand-500 hover:shadow-sm transition-all group"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.config.primaryColor }}></div>
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.config.secondaryColor }}></div>
                                            </div>
                                            <div className="text-xs font-semibold text-white group-hover:text-brand-400">{template.name}</div>
                                            <div className="text-[10px] text-surface-300 capitalize">{template.config.layout} • {template.config.fontFamily}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-4">
                                <label className="flex items-center gap-2 text-sm font-medium text-surface-200 mb-3">
                                    <Palette size={16} /> Fine-tune Colors
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-surface-300">Primary</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input type="color" className="h-8 w-8 rounded cursor-pointer border-0"
                                                value={formData.theme?.primaryColor}
                                                onChange={e => handleThemeChange('primaryColor', e.target.value)}
                                            />
                                            <span className="text-xs font-mono">{formData.theme?.primaryColor}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-surface-300">Secondary</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input type="color" className="h-8 w-8 rounded cursor-pointer border-0"
                                                value={formData.theme?.secondaryColor}
                                                onChange={e => handleThemeChange('secondaryColor', e.target.value)}
                                            />
                                            <span className="text-xs font-mono">{formData.theme?.secondaryColor}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-surface-300">Background</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input type="color" className="h-8 w-8 rounded cursor-pointer border-0"
                                                value={formData.theme?.backgroundColor}
                                                onChange={e => handleThemeChange('backgroundColor', e.target.value)}
                                            />
                                            <span className="text-xs font-mono">{formData.theme?.backgroundColor}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-surface-300">Text</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input type="color" className="h-8 w-8 rounded cursor-pointer border-0"
                                                value={formData.theme?.textColor}
                                                onChange={e => handleThemeChange('textColor', e.target.value)}
                                            />
                                            <span className="text-xs font-mono">{formData.theme?.textColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-surface-200 mb-3">
                                    <Type size={16} /> Typography
                                </label>
                                <select
                                    className="w-full border rounded-md p-2 bg-surface-950 text-white placeholder-surface-500 border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                    value={formData.theme?.fontFamily}
                                    onChange={e => handleThemeChange('fontFamily', e.target.value)}
                                >
                                    <option value="sans">Sans-Serif (Inter)</option>
                                    <option value="serif">Serif (Playfair Display)</option>
                                    <option value="mono">Monospace (Roboto Mono)</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-surface-200 mb-3">
                                    <Layout size={16} /> Page Layout
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['hero', 'grid', 'minimal'].map(l => (
                                        <button
                                            key={l}
                                            onClick={() => handleThemeChange('layout', l)}
                                            className={`p-3 border rounded-lg text-sm capitalize ${formData.theme?.layout === l ? 'border-brand-500 bg-brand-900/30 text-brand-300' : 'hover:bg-surface-900'}`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeStep === 'MODULES' && (
                        <div className="space-y-4">
                            <p className="text-sm text-surface-300 mb-4">Configure features for your event page.</p>
                            {formData.modules?.map((module, index) => (
                                <div key={module.id} className="border rounded-lg overflow-hidden mb-4">
                                    <div className="flex items-center justify-between p-4 bg-surface-900 hover:bg-[var(--bg)] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${module.isEnabled ? 'bg-brand-100 text-brand-400' : 'bg-surface-700 text-surface-400'}`}>
                                                {module.type === 'REGISTRATION' && <CheckCircle size={20} />}
                                                {module.type === 'SCHEDULE' && <Calendar size={20} />}
                                                {module.type === 'LEADERBOARD' && <Trophy size={20} />}
                                                {module.type === 'VOTING' && <BarChart2 size={20} />}
                                                {module.type === 'GALLERY' && <Image size={20} />}
                                                {module.type === 'ANNOUNCEMENTS' && <Megaphone size={20} />}
                                                {module.type === 'QR_CHECKIN' && <QrCode size={20} />}
                                                {module.type === 'TEAM_FORMATION' && <Users size={20} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white capitalize">{module.type.toLowerCase().replace('_', ' ')}</span>
                                                {module.type === 'REGISTRATION' && <span className="text-[10px] text-surface-300">Configure signup form</span>}
                                                {module.type === 'QR_CHECKIN' && <span className="text-[10px] text-surface-300">Enable ticket generation</span>}
                                                {module.type === 'TEAM_FORMATION' && <span className="text-[10px] text-surface-300">Group management</span>}
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={module.isEnabled}
                                                onChange={() => {
                                                    const newModules = [...formData.modules!];
                                                    newModules[index].isEnabled = !newModules[index].isEnabled;
                                                    setFormData({ ...formData, modules: newModules });
                                                }}
                                            />
                                            <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-800 after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                        </label>
                                    </div>

                                    {/* MODULE SPECIFIC CONFIGURATION */}
                                    {module.isEnabled && module.type === 'REGISTRATION' && (
                                        <div className="p-4 border-t border-white/10 bg-surface-800">
                                            <h4 className="text-xs font-bold text-surface-300 uppercase mb-3">Form Builder</h4>
                                            <div className="space-y-3">
                                                {(module.data as RegistrationFormField[])?.map((field) => (
                                                    <div key={field.id} className="bg-surface-900 p-2 rounded border border-white/10">
                                                        <div className="flex gap-2 mb-2">
                                                            <input
                                                                className="w-full text-sm font-semibold bg-transparent border-b border-white/20 focus:border-brand-500 outline-none pb-1"
                                                                value={field.label}
                                                                onChange={e => updateRegistrationField(module.id, field.id, 'label', e.target.value)}
                                                                placeholder="Field Label"
                                                            />
                                                            <select
                                                                className="text-xs border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10 bg-surface-800"
                                                                value={field.type}
                                                                onChange={e => updateRegistrationField(module.id, field.id, 'type', e.target.value)}
                                                            >
                                                                <option value="text">Text</option>
                                                                <option value="email">Email</option>
                                                                <option value="select">Dropdown</option>
                                                                <option value="checkbox">Checkbox</option>
                                                            </select>
                                                            <button onClick={() => removeRegistrationField(module.id, field.id)} className="text-red-500 hover:text-red-700">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center gap-4 text-xs text-surface-300">
                                                            <label className="flex items-center gap-1">
                                                                <input type="checkbox" checked={field.required} onChange={e => updateRegistrationField(module.id, field.id, 'required', e.target.checked)} />
                                                                Required
                                                            </label>
                                                            {field.type === 'select' && (
                                                                <input
                                                                    className="flex-1 border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10 bg-surface-800"
                                                                    placeholder="Options (comma separated)"
                                                                    value={field.options?.join(', ')}
                                                                    onChange={e => updateRegistrationField(module.id, field.id, 'options', e.target.value.split(',').map(s => s.trim()))}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => addRegistrationField(module.id, 'text')} className="text-xs border-dashed">
                                                        <Plus size={14} className="mr-1" /> Add Text
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => addRegistrationField(module.id, 'select')} className="text-xs border-dashed">
                                                        <List size={14} className="mr-1" /> Add Select
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {module.isEnabled && module.type === 'SCHEDULE' && (
                                        <div className="p-4 border-t border-white/10 bg-surface-800">
                                            <h4 className="text-xs font-bold text-surface-300 uppercase mb-3">Schedule Items</h4>
                                            <div className="space-y-3">
                                                {(module.data as ScheduleItem[])?.map(item => (
                                                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-surface-900 p-2 rounded">
                                                        <div className="col-span-3">
                                                            <input className="w-full text-xs border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10" type="time" value={item.time}
                                                                onChange={e => updateScheduleItem(module.id, item.id, 'time', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-4">
                                                            <input className="w-full text-xs border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10" placeholder="Title" value={item.title}
                                                                onChange={e => updateScheduleItem(module.id, item.id, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-4">
                                                            <input className="w-full text-xs border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10" placeholder="Loc" value={item.location}
                                                                onChange={e => updateScheduleItem(module.id, item.id, 'location', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-1 flex justify-end">
                                                            <button onClick={() => removeScheduleItem(module.id, item.id)} className="text-red-500 hover:text-red-700">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button size="sm" variant="outline" onClick={() => addScheduleItem(module.id)} className="w-full mt-2 text-xs border-dashed">
                                                    <Plus size={14} className="mr-1" /> Add Session
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {module.isEnabled && module.type === 'LEADERBOARD' && (
                                        <div className="p-4 border-t border-white/10 bg-surface-800">
                                            <h4 className="text-xs font-bold text-surface-300 uppercase mb-3">Teams & Scores</h4>
                                            <div className="space-y-3">
                                                {(module.data as LeaderboardEntry[])?.map((item, idx) => (
                                                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-surface-900 p-2 rounded">
                                                        <div className="col-span-1 text-xs font-mono text-surface-300 text-center">
                                                            #{idx + 1}
                                                        </div>
                                                        <div className="col-span-7">
                                                            <input className="w-full text-xs border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10" placeholder="Team Name" value={item.team}
                                                                onChange={e => updateLeaderboardEntry(module.id, item.id, 'team', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <input className="w-full text-xs border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10" type="number" placeholder="Pts" value={item.points}
                                                                onChange={e => updateLeaderboardEntry(module.id, item.id, 'points', parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="col-span-1 flex justify-end">
                                                            <button onClick={() => removeLeaderboardEntry(module.id, item.id)} className="text-red-500 hover:text-red-700">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button size="sm" variant="outline" onClick={() => addLeaderboardEntry(module.id)} className="w-full mt-2 text-xs border-dashed">
                                                    <Plus size={14} className="mr-1" /> Add Entry
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {module.isEnabled && module.type === 'VOTING' && (
                                        <div className="p-4 border-t border-white/10 bg-surface-800">
                                            <h4 className="text-xs font-bold text-surface-300 uppercase mb-3">Live Polls</h4>
                                            <div className="space-y-4">
                                                {(module.data as VotingPoll[])?.map((poll, idx) => (
                                                    <div key={poll.id} className="bg-surface-900 p-3 rounded border border-white/10">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <input
                                                                className="w-full text-sm font-medium bg-transparent border-b border-white/20 focus:border-brand-500 outline-none pb-1 mr-2"
                                                                value={poll.question}
                                                                onChange={e => updateVotingPoll(module.id, poll.id, 'question', e.target.value)}
                                                                placeholder="Poll Question"
                                                            />
                                                            <button onClick={() => removeVotingPoll(module.id, poll.id)} className="text-red-500 hover:text-red-700">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                        <div className="pl-2 space-y-2 border-l-2 border-white/10 ml-1">
                                                            {poll.options.map(opt => (
                                                                <div key={opt.id} className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                                    <input
                                                                        className="w-full text-xs bg-surface-800 border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10"
                                                                        value={opt.text}
                                                                        onChange={e => updateVotingOption(module.id, poll.id, opt.id, e.target.value)}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button size="sm" variant="outline" onClick={() => addVotingPoll(module.id)} className="w-full mt-2 text-xs border-dashed">
                                                    <Plus size={14} className="mr-1" /> Add Poll
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {module.isEnabled && module.type === 'ANNOUNCEMENTS' && (
                                        <div className="p-4 border-t border-white/10 bg-surface-800">
                                            <h4 className="text-xs font-bold text-surface-300 uppercase mb-3">Feed Updates</h4>
                                            <div className="space-y-3">
                                                {(module.data as Announcement[])?.map((item) => (
                                                    <div key={item.id} className="bg-surface-900 p-2 rounded border border-white/10 space-y-2">
                                                        <div className="flex justify-between">
                                                            <input
                                                                className="text-sm font-semibold bg-transparent border-b border-white/20 focus:border-brand-500 outline-none w-2/3"
                                                                value={item.title}
                                                                onChange={e => updateAnnouncement(module.id, item.id, 'title', e.target.value)}
                                                                placeholder="Title"
                                                            />
                                                            <select
                                                                className="text-xs border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10"
                                                                value={item.priority}
                                                                onChange={e => updateAnnouncement(module.id, item.id, 'priority', e.target.value)}
                                                            >
                                                                <option value="INFO">Info</option>
                                                                <option value="IMPORTANT">Important</option>
                                                                <option value="URGENT">Urgent</option>
                                                            </select>
                                                        </div>
                                                        <textarea
                                                            className="w-full text-xs bg-surface-800 border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10 h-16"
                                                            value={item.message}
                                                            onChange={e => updateAnnouncement(module.id, item.id, 'message', e.target.value)}
                                                            placeholder="Announcement message..."
                                                        />
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[10px] text-surface-400">{new Date(item.timestamp).toLocaleString()}</span>
                                                            <button onClick={() => removeAnnouncement(module.id, item.id)} className="text-red-500 hover:text-red-700">
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button size="sm" variant="outline" onClick={() => addAnnouncement(module.id)} className="w-full mt-2 text-xs border-dashed">
                                                    <Plus size={14} className="mr-1" /> Add Announcement
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {module.isEnabled && module.type === 'GALLERY' && (
                                        <div className="p-4 border-t border-white/10 bg-surface-800">
                                            <h4 className="text-xs font-bold text-surface-300 uppercase mb-3">Image URLs</h4>
                                            <div className="space-y-2">
                                                {(module.data as string[])?.map((url, idx) => (
                                                    <div key={idx} className="flex gap-2 items-center">
                                                        <div className="h-8 w-8 rounded bg-[var(--bg)] overflow-hidden flex-shrink-0">
                                                            <img src={url} alt="" className="h-full w-full object-cover" />
                                                        </div>
                                                        <input
                                                            className="w-full text-xs border rounded p-1 bg-surface-950 text-white placeholder-surface-500 border-white/10"
                                                            value={url}
                                                            onChange={e => updateGalleryImage(module.id, idx, e.target.value)}
                                                        />
                                                        <button onClick={() => removeGalleryImage(module.id, idx)} className="text-red-500 hover:text-red-700">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <Button size="sm" variant="outline" onClick={() => addGalleryImage(module.id)} className="w-full mt-2 text-xs border-dashed">
                                                    <Plus size={14} className="mr-1" /> Add Image
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {module.isEnabled && module.type === 'TEAM_FORMATION' && (
                                        <div className="p-4 border-t border-white/10 bg-surface-800">
                                            <h4 className="text-xs font-bold text-surface-300 uppercase mb-3">Team Rules</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-surface-200 mb-1">Max Team Size</label>
                                                    <input
                                                        type="number"
                                                        className="w-full border rounded p-2 bg-surface-950 text-white placeholder-surface-500 border-white/10 text-sm"
                                                        value={(module.data as TeamFormationData).maxTeamSize}
                                                        onChange={e => updateTeamConfig(module.id, 'maxTeamSize', parseInt(e.target.value))}
                                                        min={1}
                                                        max={20}
                                                    />
                                                </div>
                                                <div className="p-3 bg-brand-900/20 text-brand-300 rounded text-xs">
                                                    Enable this module to allow participants to form teams, invite members, and manage their roster directly on the event page.
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 bg-surface-900">
                    <Button className="w-full gap-2" onClick={handlePublish}>
                        <Save size={18} />
                        {editId ? 'Save Changes' : 'Publish Event'}
                    </Button>
                </div>
            </div>

            {/* RIGHT PANEL - PREVIEW */}
            <div className="w-2/3 bg-[var(--bg)] p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-surface-300 uppercase tracking-wide">Live Preview</h2>
                        <div className="flex gap-2">
                            <span className="h-3 w-3 rounded-full bg-red-400"></span>
                            <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                            <span className="h-3 w-3 rounded-full bg-green-400"></span>
                        </div>
                    </div>

                    {/* PREVIEW IFRAME SIMULATION */}
                    <div className="bg-surface-800 rounded-xl shadow-2xl overflow-hidden border border-white/10 min-h-[800px] transform scale-95 origin-top">
                        <PreviewContent data={formData as Event} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Preview Component 
const PreviewContent: React.FC<{ data: Event }> = ({ data }) => {
    const theme = data.theme || DEFAULT_THEME;
    const style = {
        '--primary': theme.primaryColor,
        '--secondary': theme.secondaryColor,
        '--bg': theme.backgroundColor,
        '--text': theme.textColor,
        fontFamily: theme.fontFamily === 'serif' ? 'Playfair Display' : theme.fontFamily === 'mono' ? 'Roboto Mono' : 'Inter',
    } as React.CSSProperties;

    // Helper to get module data safely
    const getModuleData = (type: string) => data.modules?.find(m => m.type === type)?.data || [];

    return (
        <div style={style} className="bg-[var(--bg)] text-[var(--text)] h-full p-0 transition-colors duration-300">
            <div className={`relative ${theme.layout === 'hero' ? 'h-64' : 'h-48'} w-full overflow-hidden`}>
                <img src={data.bannerImage} className="w-full h-full object-cover" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold mb-2 uppercase tracking-widest">
                        {data.category}
                    </span>
                    <h1 className={`${theme.layout === 'hero' ? 'text-4xl' : 'text-2xl'} font-bold`}>{data.title || 'Event Title'}</h1>
                </div>
            </div>
            <div className={`p-8 ${theme.layout === 'grid' ? 'grid grid-cols-2 gap-8' : ''}`}>
                <div className={theme.layout === 'grid' ? 'col-span-1' : ''}>
                    <p className="opacity-80 mb-6">{data.description || 'Event description goes here...'}</p>

                    <div className="space-y-2 mb-6 opacity-70 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{new Date(data.date || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>{data.location || 'Location TBA'}</span>
                        </div>
                    </div>
                </div>

                {/* Visualizer for dynamic modules in Preview */}
                <div className={`${theme.layout === 'grid' ? 'col-span-1' : ''} space-y-6`}>

                    {/* Announcements Preview */}
                    {data.modules?.find(m => m.type === 'ANNOUNCEMENTS' && m.isEnabled) && getModuleData('ANNOUNCEMENTS').length > 0 && (
                        <div className="border border-l-4 border-l-[var(--primary)] border-[var(--text)]/20 rounded p-4 bg-[var(--primary)]/5">
                            <h3 className="font-bold border-b border-[var(--text)]/10 pb-2 mb-2 flex items-center gap-2"><Megaphone size={16} /> Latest Updates</h3>
                            <div className="space-y-3">
                                {getModuleData('ANNOUNCEMENTS').slice(0, 2).map((item: Announcement) => (
                                    <div key={item.id}>
                                        <div className="flex items-center gap-2 mb-1">
                                            {item.priority === 'URGENT' && <AlertCircle size={12} className="text-red-500" />}
                                            <span className="font-bold text-sm">{item.title}</span>
                                            <span className="text-[10px] opacity-60 ml-auto">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm opacity-80">{item.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Schedule Preview */}
                    {data.modules?.find(m => m.type === 'SCHEDULE' && m.isEnabled) && (
                        <div className="border border-[var(--text)]/20 rounded p-4">
                            <h3 className="font-bold border-b border-[var(--text)]/10 pb-2 mb-2 flex items-center gap-2"><Clock size={16} /> Schedule</h3>
                            <div className="space-y-2">
                                {getModuleData('SCHEDULE').length > 0 ? getModuleData('SCHEDULE').map((item: any) => (
                                    <div key={item.id} className="flex gap-2 text-sm">
                                        <span className="font-mono opacity-70">{item.time}</span>
                                        <span className="font-bold">{item.title}</span>
                                    </div>
                                )) : <span className="text-sm opacity-50 italic">No sessions added yet</span>}
                            </div>
                        </div>
                    )}

                    {/* Registration Preview (Simple) */}
                    {data.modules?.find(m => m.type === 'REGISTRATION' && m.isEnabled) && (
                        <div className="border border-[var(--text)]/20 rounded p-4">
                            <h3 className="font-bold border-b border-[var(--text)]/10 pb-2 mb-2 flex items-center gap-2"><CheckCircle size={16} /> Registration Form</h3>
                            <div className="space-y-2 opacity-60">
                                {(getModuleData('REGISTRATION') as RegistrationFormField[]).length > 0 ?
                                    (getModuleData('REGISTRATION') as RegistrationFormField[]).map(f => (
                                        <div key={f.id} className="text-xs bg-[var(--bg)] p-1 rounded border border-white/20 inline-block mr-1">
                                            {f.label} {f.required && '*'}
                                        </div>
                                    ))
                                    : <span className="text-xs text-brand-300 italic">Default registration form</span>}
                            </div>
                        </div>
                    )}


                    {/* Leaderboard Preview */}
                    {data.modules?.find(m => m.type === 'LEADERBOARD' && m.isEnabled) && (
                        <div className="border border-[var(--text)]/20 rounded p-4">
                            <h3 className="font-bold border-b border-[var(--text)]/10 pb-2 mb-2 flex items-center gap-2"><Trophy size={16} /> Leaderboard</h3>
                            <div className="space-y-1">
                                {getModuleData('LEADERBOARD').length > 0 ? getModuleData('LEADERBOARD').map((item: any, idx: number) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>#{idx + 1} {item.team}</span>
                                        <span className="font-bold">{item.points} pts</span>
                                    </div>
                                )) : <span className="text-sm opacity-50 italic">No entries added yet</span>}
                            </div>
                        </div>
                    )}

                    {/* Team Formation Preview */}
                    {data.modules?.find(m => m.type === 'TEAM_FORMATION' && m.isEnabled) && (
                        <div className="border border-[var(--text)]/20 rounded p-4">
                            <h3 className="font-bold border-b border-[var(--text)]/10 pb-2 mb-2 flex items-center gap-2"><Users size={16} /> Teams</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="border border-[var(--text)]/10 p-2 rounded bg-surface-900/50">
                                    <div className="font-bold text-xs">Rocket Team</div>
                                    <div className="text-[10px] opacity-60">3 / {(getModuleData('TEAM_FORMATION') as TeamFormationData).maxTeamSize} members</div>
                                </div>
                                <div className="border border-[var(--text)]/10 p-2 rounded bg-surface-900/50">
                                    <div className="font-bold text-xs">Code Ninjas</div>
                                    <div className="text-[10px] opacity-60">2 / {(getModuleData('TEAM_FORMATION') as TeamFormationData).maxTeamSize} members</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Voting Preview */}
                    {data.modules?.find(m => m.type === 'VOTING' && m.isEnabled) && (
                        <div className="border border-[var(--text)]/20 rounded p-4">
                            <h3 className="font-bold border-b border-[var(--text)]/10 pb-2 mb-2 flex items-center gap-2"><BarChart2 size={16} /> Live Polls</h3>
                            <div className="space-y-4">
                                {getModuleData('VOTING').length > 0 ? getModuleData('VOTING').map((poll: VotingPoll) => (
                                    <div key={poll.id} className="text-sm">
                                        <p className="font-bold mb-1">{poll.question}</p>
                                        <div className="pl-2 border-l border-[var(--text)]/20 space-y-1">
                                            {poll.options.map(opt => (
                                                <div key={opt.id} className="opacity-70">• {opt.text}</div>
                                            ))}
                                        </div>
                                    </div>
                                )) : <span className="text-sm opacity-50 italic">No polls active</span>}
                            </div>
                        </div>
                    )}

                    {/* Gallery Preview */}
                    {data.modules?.find(m => m.type === 'GALLERY' && m.isEnabled) && (
                        <div className="border border-[var(--text)]/20 rounded p-4">
                            <h3 className="font-bold border-b border-[var(--text)]/10 pb-2 mb-2 flex items-center gap-2"><Image size={16} /> Gallery</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {getModuleData('GALLERY').length > 0 ? getModuleData('GALLERY').slice(0, 3).map((url: string, i: number) => (
                                    <div key={i} className="aspect-square bg-[var(--bg)] rounded overflow-hidden">
                                        <img src={url} className="w-full h-full object-cover" />
                                    </div>
                                )) : <span className="col-span-3 text-sm opacity-50 italic">No images</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}