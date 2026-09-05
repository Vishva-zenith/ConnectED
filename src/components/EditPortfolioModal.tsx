import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentSkill } from '../types';
import { User, X, Save, Plus, Trash2, Link as LinkIcon, Cpu, Briefcase, Award, Globe, Code, Shield } from 'lucide-react';

export const EditPortfolioModal: React.FC = () => {
  const {
    user,
    isEditPortfolioOpen,
    setIsEditPortfolioOpen,
    updateUserProfile,
    addSkill,
    removeSkill,
    addCustomProject,
    removeCustomProject
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'skills' | 'projects'>('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [college, setCollege] = useState(user.college);
  const [branch, setBranch] = useState(user.branch);
  const [year, setYear] = useState(user.year);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);
  const [careerGoal, setCareerGoal] = useState(user.careerGoal);
  const [anonymousAlias, setAnonymousAlias] = useState(user.anonymousAlias);

  // Social state
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(user.websiteUrl || '');

  // Add Skill state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Programming');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [newSkillScore, setNewSkillScore] = useState(75);

  // Add Project state
  const [projTitle, setProjTitle] = useState('');
  const [projRole, setProjRole] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projRepo, setProjRepo] = useState('');
  const [projSkills, setProjSkills] = useState('');

  if (!isEditPortfolioOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      college,
      branch,
      year,
      avatar,
      bio,
      careerGoal,
      anonymousAlias,
      githubUrl,
      linkedinUrl,
      websiteUrl
    });
    setIsEditPortfolioOpen(false);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      score: Number(newSkillScore),
      verified: true,
      projectsCount: 1,
      challengesCount: 1
    });
    setNewSkillName('');
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;
    addCustomProject({
      title: projTitle.trim(),
      role: projRole.trim() || 'Lead Developer',
      description: projDesc.trim(),
      repoUrl: projRepo.trim() || undefined,
      skillsUsed: projSkills ? projSkills.split(',').map(s => s.trim()) : []
    });
    setProjTitle('');
    setProjRole('');
    setProjDesc('');
    setProjRepo('');
    setProjSkills('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-slate-900">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edit Profile & Portfolio</h3>
              <p className="text-xs text-blue-100">Update your background, skills, and project links</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditPortfolioOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 px-4 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Basic Info</span>
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-3.5 px-4 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'social' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Social & Links</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3.5 px-4 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'skills' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Skill Graph ({user.skills.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3.5 px-4 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'projects' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Portfolio Projects</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">College / Institution</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Branch / Discipline</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    placeholder="e.g. 3rd Year"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Career Goal</label>
                <input
                  type="text"
                  required
                  list="career-options"
                  value={careerGoal}
                  onChange={e => setCareerGoal(e.target.value)}
                  placeholder="e.g. Robotics & Embedded AI Architect"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-blue-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <datalist id="career-options">
                  <option value="Software Engineer" />
                  <option value="Frontend Developer" />
                  <option value="Backend Developer" />
                  <option value="Full Stack Developer" />
                  <option value="Mobile App Developer" />
                  <option value="UI/UX Designer" />
                  <option value="Data Scientist" />
                  <option value="Data Analyst" />
                  <option value="Machine Learning Engineer" />
                  <option value="AI Researcher" />
                  <option value="DevOps Engineer" />
                  <option value="Cloud Architect" />
                  <option value="Cybersecurity Analyst" />
                  <option value="Systems Administrator" />
                  <option value="Database Administrator" />
                  <option value="Robotics Engineer" />
                  <option value="Embedded Systems Engineer" />
                  <option value="Hardware Engineer" />
                  <option value="Game Developer" />
                  <option value="Blockchain Developer" />
                  <option value="Product Manager" />
                </datalist>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Personal Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share a short bio..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Anonymous Hub Alias</label>
                <input
                  type="text"
                  value={anonymousAlias}
                  onChange={e => setAnonymousAlias(e.target.value)}
                  placeholder="e.g. CyberFalcon #4829"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Basic Profile Changes</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'social' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">GitHub Profile URL</label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Personal Website / Portfolio URL</label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Social Links</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Add New Skill Form */}
              <form onSubmit={handleAddSkillSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Add Skill to Your Graph</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Skill name (e.g. ROS 2, PyTorch)"
                    value={newSkillName}
                    onChange={e => setNewSkillName(e.target.value)}
                    className="bg-white border border-slate-300 focus:border-blue-500 rounded-xl p-2 text-slate-900 focus:outline-none"
                  />
                  <select
                    value={newSkillCategory}
                    onChange={e => setNewSkillCategory(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl p-2 text-slate-800 font-medium"
                  >
                    <option>Programming</option>
                    <option>Frontend Development</option>
                    <option>Backend Development</option>
                    <option>Mobile Development</option>
                    <option>UI/UX Design</option>
                    <option>Data Science & Analytics</option>
                    <option>Machine Learning & AI</option>
                    <option>Cloud & DevOps</option>
                    <option>Cybersecurity</option>
                    <option>Database Management</option>
                    <option>Embedded Systems</option>
                    <option>Robotics</option>
                    <option>Hardware Design</option>
                    <option>Blockchain</option>
                    <option>Game Development</option>
                    <option>Networking</option>
                    <option>Testing & QA</option>
                  </select>
                  <select
                    value={newSkillLevel}
                    onChange={e => setNewSkillLevel(e.target.value as any)}
                    className="bg-white border border-slate-300 rounded-xl p-2 text-slate-800 font-medium"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl p-2 transition-colors flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>
              </form>

              {/* Skills List */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 text-xs">Current Active Skills:</h4>
                <div className="space-y-2">
                  {user.skills.map((s, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{s.name}</span>{' '}
                        <span className="text-[10px] text-slate-500 font-medium">({s.category} • {s.level})</span>
                      </div>
                      <button
                        onClick={() => removeSkill(s.name)}
                        className="text-rose-600 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Add Custom Project Form */}
              <form onSubmit={handleAddProjectSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Add Personal Project Evidence</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Project Title"
                    value={projTitle}
                    onChange={e => setProjTitle(e.target.value)}
                    className="bg-white border border-slate-300 focus:border-blue-500 rounded-xl p-2 text-slate-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Your Role (e.g. Lead Firmware Engineer)"
                    value={projRole}
                    onChange={e => setProjRole(e.target.value)}
                    className="bg-white border border-slate-300 focus:border-blue-500 rounded-xl p-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Project Description..."
                  value={projDesc}
                  onChange={e => setProjDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-xl p-2 text-slate-900 focus:outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Repository or CAD Link (Optional)"
                    value={projRepo}
                    onChange={e => setProjRepo(e.target.value)}
                    className="bg-white border border-slate-300 focus:border-blue-500 rounded-xl p-2 text-slate-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Skills Used (Comma separated: ESP32, C++)"
                    value={projSkills}
                    onChange={e => setProjSkills(e.target.value)}
                    className="bg-white border border-slate-300 focus:border-blue-500 rounded-xl p-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    Add Project Evidence
                  </button>
                </div>
              </form>

              {/* Custom Projects List */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 text-xs">Added Custom Projects:</h4>
                {user.customProjects && user.customProjects.length > 0 ? (
                  <div className="space-y-2">
                    {user.customProjects.map((cp) => (
                      <div key={cp.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{cp.title}</p>
                          <p className="text-slate-500 text-[11px]">{cp.role} • {cp.description}</p>
                        </div>
                        <button
                          onClick={() => removeCustomProject(cp.id)}
                          className="text-rose-600 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg shrink-0 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-[11px] italic">No custom projects added yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
