
import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  MapPin, 
  ListPlus, 
  Loader2, 
  Github, 
  Settings, 
  ExternalLink,
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { LOCATIONS, AMENITIES, MOCK_LISTINGS } from '../constants';
import { generateListingDescription } from '../services/geminiService';

interface LandlordPortalProps {
  onBack: () => void;
}

const LandlordPortal: React.FC<LandlordPortalProps> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [landlordKey, setLandlordKey] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // GitHub Sync State
  const [showGithubSettings, setShowGithubSettings] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [gistId, setGistId] = useState(localStorage.getItem('mesho_gist_id') || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    type: 'Hostel',
    amenities: [] as string[],
    rawNotes: '',
    description: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (landlordKey.toUpperCase() === 'BLANTYRE-HOST') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid Landlord Key. Please contact support if you are an authorized partner.');
    }
  };

  const handleMagicDescribe = async () => {
    if (!formData.rawNotes && !formData.title) return;
    setIsGenerating(true);
    const input = `Title: ${formData.title}. Notes: ${formData.rawNotes}. Amenities: ${formData.amenities.join(', ')}`;
    const result = await generateListingDescription(input);
    setFormData(prev => ({ ...prev, description: result }));
    setIsGenerating(false);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const syncToGitHub = async (currentData: any) => {
    if (!githubToken) return;
    setIsSyncing(true);
    setSyncStatus({ type: null, message: '' });

    try {
      const method = gistId ? 'PATCH' : 'POST';
      const url = gistId ? `https://api.github.com/gists/${gistId}` : 'https://api.github.com/gists';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: "Mesho Property Listings Backup",
          public: false,
          files: {
            "mesho-properties.json": {
              content: JSON.stringify(currentData, null, 2)
            }
          }
        })
      });

      if (!response.ok) throw new Error('GitHub API Error');
      
      const data = await response.json();
      if (!gistId) {
        setGistId(data.id);
        localStorage.setItem('mesho_gist_id', data.id);
      }
      setSyncStatus({ type: 'success', message: 'Successfully synced to GitHub!' });
    } catch (err) {
      setSyncStatus({ type: 'error', message: 'Sync failed. Check your token.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, we'd add this to a database
    const newListing = {
      ...formData,
      id: Date.now().toString(),
      price: parseInt(formData.price),
      imageUrl: 'https://picsum.photos/800/600?random=' + Date.now(),
      rating: 5.0,
      contact: '+265 000 000 000',
      distanceToCampus: 'Near ' + formData.location
    };

    // If GitHub token is present, sync the "database"
    if (githubToken) {
      await syncToGitHub([...MOCK_LISTINGS, newListing]);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-emerald-100 p-6 rounded-full mb-6">
          <CheckCircle2 size={64} className="text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Listing Submitted!</h2>
        <p className="text-slate-500 max-w-md mb-8">
          Your property has been sent for review. {githubToken && "Your data has also been backed up to GitHub."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onBack}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              Return to Marketplace
            </button>
            <button 
              onClick={() => setSubmitted(false)}
              className="bg-white border border-slate-200 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              List Another
            </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-emerald-600 p-8 text-white">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Building2 size={24} />
            </div>
            <h1 className="text-2xl font-bold">Landlord Portal</h1>
            <p className="text-emerald-100 text-sm">Authorized access for property owners</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Access Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Key size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="password"
                    placeholder="Enter your Landlord Key"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all uppercase tracking-widest font-mono"
                    value={landlordKey}
                    onChange={(e) => setLandlordKey(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                <p className="text-slate-400 text-xs mt-3">Demo Key: <code className="bg-slate-100 px-1 rounded">BLANTYRE-HOST</code></p>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-emerald-600/20"
              >
                Access Portal
              </button>

              <button 
                type="button"
                onClick={onBack}
                className="w-full text-slate-400 text-sm font-medium hover:text-emerald-600 transition-colors py-2 flex items-center justify-center"
              >
                <ArrowLeft size={14} className="mr-2" /> Back to Student Search
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ListPlus className="text-emerald-600" />
            List a New Property
          </h1>
          <p className="text-slate-500">Reach thousands of students studying in Blantyre.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowGithubSettings(!showGithubSettings)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                githubToken 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
                <Github size={18} />
                {githubToken ? 'GitHub Synced' : 'Save to GitHub'}
                <Settings size={14} className={showGithubSettings ? 'rotate-90 transition-transform' : ''} />
            </button>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors"
            >
              Logout
            </button>
        </div>
      </div>

      {/* GitHub Integration Panel */}
      {showGithubSettings && (
        <div className="mb-8 bg-slate-900 rounded-3xl p-6 text-white animate-in slide-in-from-top-4 duration-300 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Github className="text-white" />
                        GitHub Integration
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Back up your property database to a private Gist.</p>
                </div>
                <button onClick={() => setShowGithubSettings(false)} className="text-slate-500 hover:text-white transition-colors">
                    <ArrowLeft className="rotate-90" size={20} />
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Personal Access Token</label>
                        <input 
                          type="password"
                          placeholder="ghp_xxxxxxxxxxxx"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                        />
                        <a 
                          href="https://github.com/settings/tokens/new?scopes=gist&description=Mesho+Sync" 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] text-emerald-400 mt-2 inline-flex items-center gap-1 hover:underline"
                        >
                            Create a token with 'gist' scope <ExternalLink size={10} />
                        </a>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <RefreshCw size={14} /> Sync Status
                    </h4>
                    {gistId ? (
                        <div className="space-y-3">
                            <p className="text-xs text-slate-400">Connected to Gist: <span className="text-white font-mono">{gistId.substring(0, 8)}...</span></p>
                            <div className="flex gap-2">
                                <button 
                                  onClick={() => syncToGitHub(MOCK_LISTINGS)}
                                  disabled={isSyncing || !githubToken}
                                  className="flex-1 bg-white text-slate-900 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                >
                                    {isSyncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                                    Sync Now
                                </button>
                                <a 
                                  href={`https://gist.github.com/${gistId}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="px-3 bg-slate-700 text-white rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <AlertCircle size={24} className="mx-auto text-slate-600 mb-2" />
                            <p className="text-xs text-slate-500">Provide a token to start syncing your listings to GitHub.</p>
                        </div>
                    )}
                    
                    {syncStatus.type && (
                        <div className={`mt-3 p-2 rounded text-[10px] font-bold text-center ${
                            syncStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                            {syncStatus.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Listing Title</label>
                <input 
                  required
                  placeholder="e.g., Secure Hostels in Chitawira"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="">Select Location</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Rent (MWK)</label>
                <input 
                  required
                  type="number"
                  placeholder="85000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`text-left px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      formData.amenities.includes(amenity)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Rough Notes for AI (Magic Write)</label>
                <textarea 
                  placeholder="e.g. 5 mins walk from Poly, has backup generator, safe compound, strictly for students..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all h-24 resize-none"
                  value={formData.rawNotes}
                  onChange={e => setFormData({...formData, rawNotes: e.target.value})}
                />
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 relative">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-slate-700">Official Description</label>
                  <button
                    type="button"
                    onClick={handleMagicDescribe}
                    disabled={isGenerating || !formData.rawNotes}
                    className="flex items-center gap-2 text-xs font-bold bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Magic Write
                  </button>
                </div>
                <textarea 
                  required
                  placeholder="The description will appear here..."
                  className="w-full p-0 bg-transparent border-none focus:ring-0 text-slate-600 leading-relaxed text-sm h-32 resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center transition-all shadow-xl shadow-emerald-600/20 group"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : (
                <>
                  {githubToken ? 'Submit & Sync to GitHub' : 'Submit Listing'}
                  <Send size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              Listing Tips
            </h3>
            <ul className="text-sm text-slate-500 space-y-4">
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Use <b>Magic Write</b> to create a description that highlights safety and proximity.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Be honest about price. Students in Blantyre look for value for money.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Include landmarks like <b>"Near Chitawira Health Center"</b> in your notes.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-600/20">
            <h3 className="font-bold mb-2">Cloud Backup</h3>
            <p className="text-sm text-emerald-100 mb-4">Enable <b>GitHub Sync</b> to keep a permanent backup of your listings in the cloud.</p>
            <div className="flex items-center gap-2 text-xs font-bold bg-white/20 p-2 rounded-lg">
                <Github size={14} />
                Integration Supported
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordPortal;
