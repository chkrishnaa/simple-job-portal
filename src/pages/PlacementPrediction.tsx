import React, { useState } from 'react';
import { GraduationCap, Book, Award, Briefcase, Plus, X } from 'lucide-react';
import type { StudentDetails, PredictionResult } from '../types/student';
import { availableJobs } from '../data/jobs';
import { getMissingSkills, getSkillMatchPercentage } from '../utils/csvParser';

export function PlacementPrediction() {
  const [formData, setFormData] = useState<StudentDetails>({
    name: '',
    tenthMarks: '',
    twelfthMarks: '',
    cgpa: '',
    branch: '',
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    internships: []
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [showJobs, setShowJobs] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<typeof availableJobs>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [newCertification, setNewCertification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newInternship, setNewInternship] = useState({
    company: '',
    role: '',
    duration: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Match jobs based on skills and required match percentage
      const filteredJobs = availableJobs
        .map(job => ({
          job,
          matchPercentage: getSkillMatchPercentage(formData.skills, job.skills)
        }))
        .filter(({ job, matchPercentage }) => {
          const requiredPercentage = job.skills.length <= 10 ? 70 : 85;
          return matchPercentage >= requiredPercentage;
        })
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .map(({ job }) => job);

      setMatchedJobs(filteredJobs);
      setShowJobs(true);

      if (filteredJobs.length > 0) {
        const bestMatch = filteredJobs[0];
        const skillMatchPercentage = getSkillMatchPercentage(formData.skills, bestMatch.skills) / 100;

        setPrediction({
          predictedRole: bestMatch.title,
          predictedSalary: bestMatch.salary,
          predictedCompanies: [bestMatch.company, ...filteredJobs.slice(1, 3).map(j => j.company)],
          confidence: Math.min(0.95, skillMatchPercentage + 0.3)
        });
      } else {
        setPrediction({
          predictedRole: "Entry Level Position",
          predictedSalary: "₹4,00,000 - ₹6,00,000",
          predictedCompanies: ["Consider adding more relevant skills"],
          confidence: 0.3
        });
      }
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...newProject }]
      }));
      setNewProject({ title: '', description: '' });
    }
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addInternship = () => {
    if (newInternship.company.trim() && newInternship.role.trim()) {
      setFormData(prev => ({
        ...prev,
        internships: [...prev.internships, { ...newInternship }]
      }));
      setNewInternship({
        company: '',
        role: '',
        duration: '',
        description: ''
      });
    }
  };

  const removeInternship = (index: number) => {
    setFormData(prev => ({
      ...prev,
      internships: prev.internships.filter((_, i) => i !== index)
    }));
  };

  const cancelInternship = () => {
    setNewInternship({
      company: '',
      role: '',
      duration: '',
      description: ''
    });
  };

  const cancelProject = () => {
    setNewProject({ title: '', description: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Placement Prediction</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">10th Marks (%)</label>
              <input
                type="number"
                value={formData.tenthMarks}
                onChange={(e) => setFormData(prev => ({ ...prev, tenthMarks: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                max="100"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">12th Marks (%)</label>
              <input
                type="number"
                value={formData.twelfthMarks}
                onChange={(e) => setFormData(prev => ({ ...prev, twelfthMarks: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                max="100"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CGPA</label>
              <input
                type="number"
                value={formData.cgpa}
                onChange={(e) => setFormData(prev => ({ ...prev, cgpa: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                max="10"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch</label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select Branch</option>
                <option value="CS">Computer Science</option>
                <option value="IT">Information Technology</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EEE">Electrical & Electronics</option>
                <option value="MECH">Mechanical</option>
              </select>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 inline-flex items-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Projects</label>
            <div className="space-y-4">
              {formData.projects.map((project, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <h3 className="font-medium text-gray-900 dark:text-white">{project.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Project Title"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Project Description"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Project
                </button>
                <button
                  type="button"
                  onClick={cancelProject}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Certifications Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Certifications</label>
            <div className="space-y-2">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white">{cert}</span>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add a certification"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={addCertification}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Achievements</label>
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add an achievement"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={addAchievement}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
          </div>

          {/* Internships Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Internships</label>
            <div className="space-y-4">
              {formData.internships.map((internship, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeInternship(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <h4 className="font-medium text-gray-900 dark:text-white">{internship.role} at {internship.company}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{internship.duration}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{internship.description}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newInternship.company}
                  onChange={(e) => setNewInternship(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company Name"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  value={newInternship.role}
                  onChange={(e) => setNewInternship(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Role"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  value={newInternship.duration}
                  onChange={(e) => setNewInternship(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Duration (e.g., 3 months)"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <textarea
                value={newInternship.description}
                onChange={(e) => setNewInternship(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description of responsibilities"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addInternship}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Internship
                </button>
                <button
                  type="button"
                  onClick={cancelInternship}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Predict Placement
            </button>
          </div>
        </form>

        {/* Prediction Results */}
        {prediction && (
          <div className="mt-8 space-y-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Prediction Results</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Predicted Role</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{prediction.predictedRole}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Salary Range</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{prediction.predictedSalary}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommended Companies</h3>
                  <ul className="mt-1 space-y-1">
                    {prediction.predictedCompanies.map((company, index) => (
                      <li key={index} className="text-gray-900 dark:text-white">{company}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prediction Confidence</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matched Jobs */}
        {showJobs && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {matchedJobs.length > 0 ? 'Matching Job Opportunities' : 'No Matching Jobs Found'}
            </h2>
            <div className="space-y-4">
              {matchedJobs.length > 0 ? (
                matchedJobs.map((job) => {
                  const missingSkills = getMissingSkills(formData.skills, job.skills);
                  return (
                    <div key={job.id} className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{job.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{job.company} • {job.location}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{job.salary}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{job.description}</p>
                      </div>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        {missingSkills.length > 0 && (
                          <>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills to Learn:</h4>
                            <div className="flex flex-wrap gap-2">
                              {missingSkills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No jobs match your current skills. Try adding more relevant skills or adjusting your profile.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}