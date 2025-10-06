// Predefined subjects with aliases for smart search
export const SUBJECTS = {
  'Mathematics': {
    aliases: ['math', 'maths', 'mathematics', 'calc', 'calculus', 'algebra', 'geometry'],
    category: 'STEM',
    icon: '🔢'
  },
  'Science': {
    aliases: ['science', 'general science', 'scientific method'],
    category: 'STEM', 
    icon: '🔬'
  },
  'Physics': {
    aliases: ['physics', 'phys', 'mechanics', 'thermodynamics', 'quantum'],
    category: 'STEM',
    icon: '⚛️'
  },
  'Chemistry': {
    aliases: ['chemistry', 'chem', 'organic chemistry', 'inorganic chemistry', 'biochemistry'],
    category: 'STEM',
    icon: '⚗️'
  },
  'Biology': {
    aliases: ['biology', 'bio', 'life science', 'genetics', 'ecology', 'anatomy'],
    category: 'STEM',
    icon: '🧬'
  },
  'Computer Science': {
    aliases: ['computer science', 'cs', 'programming', 'coding', 'software', 'programming languages'],
    category: 'STEM',
    icon: '💻'
  },
  'English': {
    aliases: ['english', 'language arts', 'literature', 'writing', 'composition'],
    category: 'Languages',
    icon: '📚'
  },
  'History': {
    aliases: ['history', 'world history', 'american history', 'social studies', 'civics'],
    category: 'Social Studies',
    icon: '🏛️'
  },
  'Geography': {
    aliases: ['geography', 'geo', 'world geography', 'physical geography'],
    category: 'Social Studies',
    icon: '🌍'
  },
  'Economics': {
    aliases: ['economics', 'econ', 'business studies', 'finance'],
    category: 'Social Studies',
    icon: '💰'
  },
  'Philosophy': {
    aliases: ['philosophy', 'ethics', 'logic', 'critical thinking'],
    category: 'Humanities',
    icon: '🤔'
  },
  'Art': {
    aliases: ['art', 'arts', 'visual arts', 'drawing', 'painting', 'design'],
    category: 'Creative Arts',
    icon: '🎨'
  },
  'Music': {
    aliases: ['music', 'musical', 'instrument', 'theory', 'composition'],
    category: 'Creative Arts',
    icon: '🎵'
  },
  'Physical Education': {
    aliases: ['pe', 'pt', 'physical education', 'sports', 'fitness', 'health'],
    category: 'Health & Wellness',
    icon: '⚽'
  },
  'Psychology': {
    aliases: ['psychology', 'psych', 'mental health', 'behavior', 'cognitive'],
    category: 'Social Sciences',
    icon: '🧠'
  },
  'Foreign Languages': {
    aliases: ['languages', 'foreign language', 'linguistics', 'translation'],
    category: 'Languages',
    icon: '🗣️'
  }
};

// Get all subject names
export const getSubjectNames = () => Object.keys(SUBJECTS);

// Get subjects by category
export const getSubjectsByCategory = () => {
  const categories = {};
  Object.entries(SUBJECTS).forEach(([name, data]) => {
    if (!categories[data.category]) {
      categories[data.category] = [];
    }
    categories[data.category].push({
      name,
      icon: data.icon,
      aliases: data.aliases
    });
  });
  return categories;
};

// Fuzzy search function for subjects
export const findMatchingSubject = (searchTerm) => {
  if (!searchTerm) return [];
  
  const term = searchTerm.toLowerCase().trim();
  const matches = [];
  
  Object.entries(SUBJECTS).forEach(([name, data]) => {
    const nameMatch = name.toLowerCase();
    const aliasMatches = data.aliases.some(alias => 
      alias.toLowerCase().includes(term) || term.includes(alias.toLowerCase())
    );
    
    // Exact match gets highest score
    if (nameMatch === term) {
      matches.unshift({ name, icon: data.icon, score: 100 });
    }
    // Name contains search term
    else if (nameMatch.includes(term)) {
      matches.push({ name, icon: data.icon, score: 80 });
    }
    // Aliases match
    else if (aliasMatches) {
      const aliasScore = data.aliases.findIndex(alias => 
        alias.toLowerCase().includes(term)
      ) + 60;
      matches.push({ name, icon: data.icon, score: aliasScore });
    }
  });
  
  // Sort by score and return top matches
  return matches.sort((a, b) => b.score - a.score);
};

// Check if a subject string matches our predefined subjects
export const normalizeSubject = (subjectInput) => {
  const matches = findMatchingSubject(subjectInput);
  return matches.length > 0 ? matches[0].name : subjectInput;
};

