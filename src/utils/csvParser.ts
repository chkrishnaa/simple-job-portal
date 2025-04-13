export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  experience: string;
  description: string;
}

export function parseCSV(csv: string): Job[] {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    const skills = values[4].replace(/"/g, '').split(' ');
    
    return {
      id: (index + 1).toString(),
      title: values[0],
      company: values[1],
      location: values[2],
      salary: values[3],
      skills: skills.map(skill => skill.replace(/-/g, ' ')),
      experience: values[5],
      description: values[6]
    };
  });
}

export function getMissingSkills(userSkills: string[], jobSkills: string[]): string[] {
  return jobSkills.filter(skill => !userSkills.includes(skill));
}

export function getSkillMatchPercentage(userSkills: string[], jobSkills: string[]): number {
  const matchingSkills = jobSkills.filter(skill => userSkills.includes(skill));
  return (matchingSkills.length / jobSkills.length) * 100;
}