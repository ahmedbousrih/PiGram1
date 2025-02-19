import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';

const SearchContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 80px auto 0;
`;

const SearchHeader = styled.div`
  margin-bottom: 2rem;
`;

const ResultsCount = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const SearchResults = styled.div`
  display: grid;
  gap: 1rem;
`;

const ResultCard = styled.div`
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'tutorial' | 'article';
}

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Handle scroll direction
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  const handleLogout = () => {
    // Handle logout logic if needed
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Replace this with your actual search API call
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div>
      <Navbar 
        setShowLoginModal={setShowLoginModal}
        setShowSignupModal={setShowSignupModal}
        isScrolled={isScrolled}
        scrollDirection={scrollDirection}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <SearchContainer>
        <SearchHeader>
          <h1>Search Results for "{query}"</h1>
          <ResultsCount>{results.length} results found</ResultsCount>
        </SearchHeader>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <SearchResults>
            {results.map((result) => (
              <ResultCard 
                key={result.id}
                onClick={() => navigate(`/courses/${result.id}`)}
              >
                <h3>{result.title}</h3>
                <p>{result.description}</p>
                <span>{result.type}</span>
              </ResultCard>
            ))}
          </SearchResults>
        )}
      </SearchContainer>
      <Footer />
    </div>
  );
};

export default SearchResultsPage; 