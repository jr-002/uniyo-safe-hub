
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchMatch {
  id: string;
  score: number;
  reasoning: string;
  highlights: string[];
}

interface SemanticSearchResult {
  matches: SearchMatch[];
  suggestions: string[];
  summary: string;
}

export const useSemanticSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SemanticSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performSemanticSearch = async (
    searchQuery: string, 
    items: any[], 
    searchType: 'lost' | 'found' | 'both' = 'both'
  ) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      console.log('Performing semantic search for:', searchQuery);

      const { data, error: functionError } = await supabase.functions.invoke('ai-semantic-search', {
        body: {
          searchQuery: searchQuery.trim(),
          items,
          searchType
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      console.log('Semantic search results:', data);
      setSearchResults(data);

    } catch (err) {
      console.error('Semantic search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults({
        matches: [],
        suggestions: ['Try a different search term', 'Check your spelling'],
        summary: 'Search encountered an error'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setError(null);
  };

  return {
    isSearching,
    searchResults,
    error,
    performSemanticSearch,
    clearSearch
  };
};
