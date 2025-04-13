import React, { createContext, useContext, useState } from 'react';

// Define the allowed types
type SearchResultType = 'course' | 'lesson' | 'service';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  path: string;
  keywords: string[];
  relevance: number;
}

interface SearchContextType {
  searchResults: SearchResult[];
  isSearching: boolean;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchData: {
    courses: Omit<SearchResult, 'relevance'>[];
    lessons: Omit<SearchResult, 'relevance'>[];
    services: Omit<SearchResult, 'relevance'>[];
  } = {
    courses: [
      {
        id: 'html',
        type: 'course',
        title: 'HTML',
        description: 'Learn the fundamentals of web development with HTML5',
        path: '/courses/html',
        keywords: ['html', 'web', 'development', 'markup', 'frontend']
      },
      // Add more courses...
    ],
    lessons: [
      {
        id: 'html-1',
        type: 'lesson',
        title: 'Introduction to HTML',
        description: 'Learn the basics of HTML structure',
        path: '/courses/html/lessons/html-1',
        keywords: ['html', 'basics', 'structure', 'elements', 'tags']
      },
      // Add more lessons...
    ],
    services: [
      {
        id: 'tutoring',
        type: 'service',
        title: '1-on-1 Tutoring',
        description: 'Get personalized help from expert tutors',
        path: '/services/tutoring',
        keywords: ['tutoring', 'help', 'personal', 'one-on-one']
      },
      // Add more services...
    ]
  };

  const calculateRelevance = (item: any, query: string): number => {
    const queryWords = query.toLowerCase().split(' ');
    let relevance = 0;

    // Check title match
    if (item.title.toLowerCase().includes(query.toLowerCase())) {
      relevance += 3;
    }

    // Check keyword matches
    queryWords.forEach(word => {
      if (item.keywords.includes(word)) {
        relevance += 2;
      }
    });

    // Check description match
    if (item.description.toLowerCase().includes(query.toLowerCase())) {
      relevance += 1;
    }

    return relevance;
  };

  const search = async (query: string) => {
    setIsSearching(true);
    try {
      // Combine all searchable items
      const allItems = [
        ...searchData.courses,
        ...searchData.lessons,
        ...searchData.services
      ];

      // Filter and sort results
      const results = allItems
        .map(item => ({
          ...item,
          relevance: calculateRelevance(item, query),
          // Ensure type is correctly typed as SearchResultType
          type: item.type as SearchResultType
        }))
        .filter(item => item.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance) as SearchResult[];

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider value={{
      searchResults,
      isSearching,
      search,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};

// Mock search function
const mockSearch = (query: string): SearchResult[] => {
  // Your mock search implementation
  return [
    {
      id: '1',
      type: 'course' as SearchResultType,
      title: 'Python Basics',
      description: 'Learn Python programming',
      path: '/course/python-basics',
      keywords: ['python', 'programming'],
      relevance: 1
    },
    // ... more results
  ];
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}; 