import React, { useState, useEffect, useContext } from 'react';
import { 
  Users, 
  Sparkles, 
  Star, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  Filter, 
  ArrowRight, 
  Award, 
  Briefcase, 
  Globe, 
  ShieldCheck, 
  ExternalLink,
  X,
  UserCheck
} from 'lucide-react';
import { mockMentors } from '../data/mockData';
import { Mentor, MentorshipBooking, Language, ThemeMode } from '../types';
import { AuthContext } from '../context/AuthContext';
import { bookMentorshipSession, fetchMyMentorshipBookings } from '../services/api';

interface MentorHubProps {
  language: Language;
  theme?: ThemeMode;
  onNavigateTab?: (tab: string) => void;
}

export const MentorHub: React.FC<MentorHubProps> = ({
  language,
  theme = 'dark',
  onNavigateTab
}) => {
  const { user } = useContext(AuthContext);
  const [mentors, setMentors] = useState<Mentor[]>(mockMentors);
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  
  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [bookingNote, setBookingNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MentorshipBooking | null>(null);
  const [myBookings, setMyBookings] = useState<MentorshipBooking[]>([]);
  const [activeView, setActiveView] = useState<'explore' | 'my-bookings'>('explore');

  const isDark = theme === 'dark';

  useEffect(() => {
    let mounted = true;
    fetchMyMentorshipBookings().then(bookings => {
      if (mounted && bookings.length > 0) {
        setMyBookings(bookings);
      }
    });
    return () => { mounted = false; };
  }, []);

  const allExpertiseTags = [
    'all',
    'Generative AI',
    'System Design',
    'EV Powertrains',
    'Solar Rooftop MPPT',
    'React & Node.js',
    'GSoC Proposal Writing',
    'Campus Hiring Prep'
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesTag = selectedExpertise === 'all' || 
      mentor.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase()));
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      mentor.name.toLowerCase().includes(query) ||
      mentor.company.toLowerCase().includes(query) ||
      mentor.role.toLowerCase().includes(query) ||
      mentor.bio.toLowerCase().includes(query) ||
      mentor.expertise.some(e => e.toLowerCase().includes(query));

    return matchesTag && matchesSearch;
  });

  const handleOpenBooking = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setSelectedSlot(mentor.availableSlots[0] || 'Tomorrow at 6:00 PM');
    setSelectedTopic(mentor.topTopic);
    setConfirmedBooking(null);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    setIsSubmitting(true);
    const bookingPayload: Partial<MentorshipBooking> = {
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      mentorCompany: selectedMentor.company,
      dateSlot: selectedSlot,
      topic: selectedTopic || selectedMentor.topTopic,
      studentName: user?.name || 'Aarav Patel',
      studentEmail: user?.email || 'student@careergrowth.edu'
    };

    const res = await bookMentorshipSession(bookingPayload);
    setIsSubmitting(false);

    if (res?.success && res.booking) {
      setConfirmedBooking(res.booking);
      setMyBookings(prev => [res.booking!, ...prev]);
    } else {
      // Local fallback
      const fallbackBooking: MentorshipBooking = {
        id: `local-book-${Date.now()}`,
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        mentorCompany: selectedMentor.company,
        dateSlot: selectedSlot,
        topic: selectedTopic || selectedMentor.topTopic,
        studentName: user?.name || 'Aarav Patel',
        studentEmail: user?.email || 'student@careergrowth.edu',
        meetLink: `https://meet.google.com/sb-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      setConfirmedBooking(fallbackBooking);
      setMyBookings(prev => [fallbackBooking, ...prev]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Hero Header (Minimalist Style) */}
      <div className={`relative overflow-hidden rounded-2xl p-6 lg:p-10 border ${
        isDark 
          ? 'bg-slate-900/40 border-slate-800/80' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Verified Industry Mentors
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Free 1:1 Sessions Available
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1.5">
              📊 Sample data
            </span>
          </div>

          <h1 className={`text-2xl md:text-4xl font-bold tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Accelerate Your Career with 1-on-1 Industry Mentors
          </h1>

          <p className={`text-xs md:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Book personalized 1:1 guidance with Senior Engineers, Scientists, and Recruiters from Google DeepMind, Microsoft, ISRO, Zerodha, and CleanTech leaders.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-1 flex flex-wrap items-center gap-5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>4.96 ★ Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>1,200+ Guided</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-slate-400" />
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Direct Google Meet Sync</span>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <div className="pt-3 flex items-center gap-2.5">
            <button
              onClick={() => setActiveView('explore')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition ${
                activeView === 'explore'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDark ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              Browse All Mentors ({mentors.length})
            </button>
            <button
              onClick={() => setActiveView('my-bookings')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeView === 'my-bookings'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDark ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>My Booked Sessions ({myBookings.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeView === 'explore' && (
        <>
          {/* Search & Domain Filter Bar */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search mentors by name, company (Google, Microsoft), or topic (RAG, System Design, EV)..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            {/* Expertise Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className={`text-[11px] font-semibold mr-1 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Filter className="w-3 h-3" />
                Domain:
              </span>
              {allExpertiseTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedExpertise(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedExpertise === tag
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isDark ? 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tag === 'all' ? 'All Specializations' : tag}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                  isDark ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-md'
                }`}
              >
                <div>
                  {/* Top: Avatar, Name, Company */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="relative">
                      <img
                        src={mentor.avatarUrl}
                        alt={mentor.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Available for 1:1 Booking" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-base font-bold font-outfit truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {mentor.name}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{mentor.rating}</span>
                        </div>
                      </div>
                      <p className={`text-xs font-semibold truncate ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {mentor.role}
                      </p>
                      <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {mentor.company}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className={`text-xs line-clamp-3 leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {mentor.bio}
                  </p>

                  {/* Expertise Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {mentor.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-4">
                    <Globe className="w-3 h-3 text-indigo-400" />
                    <span>Languages: {mentor.languages.join(', ')}</span>
                  </div>
                </div>

                {/* Bottom: Pricing & Action Button */}
                <div className="pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {mentor.sessionPrice}
                    </span>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {mentor.sessionsCount}+ Sessions Completed
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(mentor)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book 1:1</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* My Bookings View */}
      {activeView === 'my-bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Your Scheduled 1:1 Mentorship Sessions ({myBookings.length})
            </h2>
            <button
              onClick={() => setActiveView('explore')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>+ Book Another Mentor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Sessions Booked Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                Get individualized feedback on your resume, hackathon projects, system design concepts, or AI study questions.
              </p>
              <button
                onClick={() => setActiveView('explore')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Explore Verified Mentors
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Session Confirmed
                    </span>
                    <span className="text-[11px] text-slate-400">{b.dateSlot}</span>
                  </div>

                  <div>
                    <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {b.topic}
                    </h4>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                      With {b.mentorName} • {b.mentorCompany}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Attendee: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{b.studentName}</strong>
                    </div>

                    <a
                      href={b.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Google Meet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {isBookingOpen && selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl border p-6 space-y-5 relative max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
          }`}>
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {confirmedBooking ? (
              // Confirmation View
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black font-outfit">
                  1:1 Session Confirmed!
                </h3>
                <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Your 1:1 mentorship appointment with <strong>{selectedMentor.name}</strong> ({selectedMentor.company}) is scheduled.
                </p>

                <div className={`p-4 rounded-xl border text-left space-y-2 text-xs ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p><strong>Scheduled Slot:</strong> {confirmedBooking.dateSlot}</p>
                  <p><strong>Discussion Topic:</strong> {confirmedBooking.topic}</p>
                  <p><strong>Meeting Room:</strong> <span className="text-indigo-400 underline">{confirmedBooking.meetLink}</span></p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <a
                    href={confirmedBooking.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Video className="w-4 h-4" />
                    <span>Open Google Meet</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsBookingOpen(false);
                      setActiveView('my-bookings');
                    }}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold"
                  >
                    View My Bookings
                  </button>
                </div>
              </div>
            ) : (
              // Booking Form View
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMentor.avatarUrl}
                    alt={selectedMentor.name}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h3 className="text-lg font-bold font-outfit">Book 1:1 with {selectedMentor.name}</h3>
                    <p className="text-xs text-indigo-400">{selectedMentor.role} • {selectedMentor.company}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">Select Preferred Time Slot</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {selectedMentor.availableSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">Focus Area / Agenda</label>
                  <input
                    type="text"
                    required
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    placeholder="e.g. AI Systems Architecture & Mock Interview Drill"
                    className={`w-full px-3 py-2.5 rounded-xl text-xs border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">Your Question / Goal for the Mentor (Optional)</label>
                  <textarea
                    rows={2}
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    placeholder="Describe your current project, target role, or specific challenges..."
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className="font-bold text-emerald-400">{selectedMentor.sessionPrice}</span>
                    <p className="text-[10px] text-slate-400">100% Verified CareerGrowth Guarantee</p>
                  </div>
                  <span className="text-[11px] text-slate-400">45 Minutes Session</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm 1:1 Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
