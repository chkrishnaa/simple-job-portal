import React, { useState } from 'react';
import { FileText, Upload, AlertCircle, X, Plus } from 'lucide-react';
import type { StudentDetails } from '../types/student';
import { availableJobs, type Job } from '../data/jobs';
import { getMissingSkills } from '../utils/csvParser';

export function ResumeMatching() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedData, setExtractedData] = useState<StudentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const [showJobs, setShowJobs] = useState(false);
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
        handleFileProcess(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
        handleFileProcess(file);
      }
    }
  };

  const handleFileProcess = async (file: File) => {
    setIsLoading(true);
    try {
      // Simulated resume parsing - in a real app, this would call an API
      const extractedData: StudentDetails = {
        name: "John Doe",
        tenthMarks: "95",
        twelfthMarks: "92",
        cgpa: "8.5",
        branch: "CS",
        skills: ["JavaScript", "React", "Node.js", "Python"],
        projects: [
          {
            title: "E-commerce Website",
            description: "Built a full-stack e-commerce platform using MERN stack"
          }
        ],
        certifications: ["AWS Certified Developer"],
        achievements: ["First Prize in College Hackathon"],
        internships: [
          {
            company: "Tech Solutions",
            role: "Software Developer Intern",
            duration: "3 months",
            description: "Developed features for the company's main product"
          }
        ]
      };
      
      setExtractedData(extractedData);
      
      // Match jobs based on skills
      const matchedJobs = availableJobs.filter(job => 
        job.skills.some(skill => extractedData.skills.includes(skill))
      ).sort((a, b) => {
        const aMatches = a.skills.filter(skill => extractedData.skills.includes(skill)).length;
        const bMatches = b.skills.filter(skill => extractedData.skills.includes(skill)).length;
        return bMatches - aMatches;
      });
      
      setMatchedJobs(matchedJobs);
    } catch (error) {
      console.error('Error processing resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaClick = () => {
    document.getElementById('file-upload')?.click();
  };

  const addSkill = () => {
    if (newSkill.trim() && extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        skills: [...prev!.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    if (extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        skills: prev!.skills.filter((_, i) => i !== index)
      }));
    }
  };

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim() && extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        projects: [...prev!.projects, { ...newProject }]
      }));
      setNewProject({ title: '', description: '' });
    }
  };

  const removeProject = (index: number) => {
    if (extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        projects: prev!.projects.filter((_, i) => i !== index)
      }));
    }
  };

  const cancelProject = () => {
    setNewProject({ title: '', description: '' });
  };

  const addCertification = () => {
    if (newCertification.trim() && extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        certifications: [...prev!.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    if (extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        certifications: prev!.certifications.filter((_, i) => i !== index)
      }));
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim() && extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        achievements: [...prev!.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    if (extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        achievements: prev!.achievements.filter((_, i) => i !== index)
      }));
    }
  };

  const addInternship = () => {
    if (newInternship.company.trim() && newInternship.role.trim() && extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        internships: [...prev!.internships, { ...newInternship }]
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
    if (extractedData) {
      setExtractedData(prev => ({
        ...prev!,
        internships: prev!.internships.filter((_, i) => i !== index)
      }));
    }
  };

  const cancelInternship = () => {
    setNewInternship({
      company: '',
      role: '',
      duration: '',
      description: ''
    });
  };

  const analyzePlacement = () => {
    if (!extractedData) return;
    setShowJobs(true);

    // Match jobs based on updated skills
    const matchedJobs = availableJobs.filter(job => 
      job.skills.some(skill => extractedData.skills.includes(skill))
    ).sort((a, b) => {
      const aMatches = a.skills.filter(skill => extractedData.skills.includes(skill)).length;
      const bMatches = b.skills.filter(skill => extractedData.skills.includes(skill)).length;
      return bMatches - aMatches;
    });
    
    setMatchedJobs(matchedJobs);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Resume Matching</h1>
        </div>

        <div className="mb-8">
          <p className="text-gray-600">
            Upload your resume to find the best matching job opportunities. We'll analyze your skills and experience to recommend the most suitable positions.
          </p>
        </div>

        <div 
          className={`max-w-xl mx-auto border-2 border-dashed rounded-lg p-6 ${
            dragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
          } ${file ? 'bg-green-50' : ''} cursor-pointer`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleAreaClick}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                {file ? 'Change file' : 'Upload a file'}
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={handleChange}
              />
              <p className="pl-1 text-gray-600">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">PDF up to 10MB</p>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              <span>{file.name}</span>
            </div>
          )}
        </div>

        {/* Extracted Data Display */}
        {extractedData && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Extracted Information</h2>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-sm text-gray-900">{extractedData.name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Branch</h3>
                <p className="mt-1 text-sm text-gray-900">{extractedData.branch}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">10th Marks</h3>
                <p className="mt-1 text-sm text-gray-900">{extractedData.tenthMarks}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">12th Marks</h3>
                <p className="mt-1 text-sm text-gray-900">{extractedData.twelfthMarks}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">CGPA</h3>
                <p className="mt-1 text-sm text-gray-900">{extractedData.cgpa}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {extractedData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
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
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Projects</h3>
              <div className="space-y-4">
                {extractedData.projects.map((project, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Project Title"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project Description"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addProject}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Project
                  </button>
                  <button
                    type="button"
                    onClick={cancelProject}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Certifications</h3>
              <div className="space-y-2">
                {extractedData.certifications.map((cert, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span>{cert}</span>
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="text-gray-400 hover:text-gray-600"
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
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Achievements</h3>
              <div className="space-y-2">
                {extractedData.achievements.map((achievement, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span>{achievement}</span>
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="text-gray-400 hover:text-gray-600"
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
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
            </div>

            {/* Internships */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Internships</h3>
              <div className="space-y-4">
                {extractedData.internships.map((internship, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                    <button
                      type="button"
                      onClick={() => removeInternship(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <h4 className="font-medium">{internship.role} at {internship.company}</h4>
                    <p className="text-sm text-gray-500">{internship.duration}</p>
                    <p className="mt-1 text-sm text-gray-600">{internship.description}</p>
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
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    value={newInternship.role}
                    onChange={(e) => setNewInternship(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Role"
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    value={newInternship.duration}
                    onChange={(e) => setNewInternship(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="Duration (e.g., 3 months)"
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <textarea
                  value={newInternship.description}
                  onChange={(e) => setNewInternship(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description of responsibilities"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addInternship}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Internship
                  </button>
                  <button
                    type="button"
                    onClick={cancelInternship}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={analyzePlacement}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Analyze Placement
              </button>
            </div>
          </div>
        )}

        {/* Matched Jobs */}
        {showJobs && matchedJobs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Matching Job Opportunities</h2>
            <div className="space-y-4">
              {matchedJobs.map((job) => {
                const missingSkills = getMissingSkills(extractedData?.skills || [], job.skills);
                return (
                  <div key={job.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{job.salary}</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{job.description}</p>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      {missingSkills.length > 0 && (
                        <>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills to Learn:</h4>
                          <div className="flex flex-wrap gap-2">
                            {missingSkills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
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
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-start space-x-2 text-sm text-gray-500">
          <AlertCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <p>
            Your resume will be analyzed using AI to extract relevant skills and experience. 
            This information will be matched against our database of job requirements to find 
            the best opportunities for you.
          </p>
        </div>
      </div>
    </div>
  );
}