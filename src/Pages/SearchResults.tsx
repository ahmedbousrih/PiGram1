import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background: var(--bg-primary);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const SearchHeader = styled.div`
  margin-bottom: 32px;
`;

const SearchQuery = styled.h1`
  color: #333;
  margin-bottom: 8px;
`;

const ResultsCount = styled.p`
  color: #666;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ResultType = styled.div`
  display: inline-block;
  padding: 4px 8px;
  background: #f0f4ff;
  color: #6c63ff;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 12px;
`;

const ResultTitle = styled.h3`
  color: #333;
  margin: 0 0 8px 0;
  font-size: 18px;
`;

const ResultDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`;

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const { search, searchResults, isSearching } = useSearch();
  const { isLoggedIn } = useAuth();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  const groupedResults = searchResults.reduce((acc, result) => {
    const { type } = result;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(result);
    return acc;
  }, {} as Record<string, typeof searchResults>);

  return (
    <>
      <Navbar
        setShowLoginModal={() => {}}
        setShowSignupModal={() => {}}
        isScrolled={false}
        scrollDirection={null}
        isLoggedIn={isLoggedIn}
        onLogout={() => {}}
      />
      <Container>
        <Content>
          <SearchHeader>
            <SearchQuery>Search results for "{query}"</SearchQuery>
            <ResultsCount>
              {isSearching
                ? 'Searching...'
                : `Found ${searchResults.length} results`}
            </ResultsCount>
          </SearchHeader>

          {Object.entries(groupedResults).map(([type, results]) => (
            <div key={type}>
              <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </h2>
              <ResultsGrid>
                {results.map((result) => (
                  <ResultCard key={result.id}>
                    <ResultType>{result.type}</ResultType>
                    <ResultTitle>{result.title}</ResultTitle>
                    <ResultDescription>{result.description}</ResultDescription>
                  </ResultCard>
                ))}
              </ResultsGrid>
            </div>
          ))}

          {!isSearching && searchResults.length === 0 && (
            <NoResults>
              <h2>No results found</h2>
              <p>Try different keywords or check your spelling</p>
            </NoResults>
          )}
        </Content>
      </Container>
      <Footer />
    </>
  );
};

export default SearchResultsPage; 