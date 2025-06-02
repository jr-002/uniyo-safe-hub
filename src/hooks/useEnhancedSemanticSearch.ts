
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedSearchResult {
  matches: Array<{
    id: string;
    score: number;
    reasoning: string;
    highlights: string[];
    vectorScore: number;
  }>;
  suggestions: string[];
  summary: string;
  vectorAnalysis: string;
}

export const useEnhancedSemanticSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<EnhancedSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performEnhancedSearch = async (
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
      console.log('Performing enhanced semantic search with vectors...');

      const { data, error: functionError } = await supabase.functions.invoke('ai-enhanced-semantic-search', {
        body: {
          searchQuery: searchQuery.trim(),
          items,
          searchType
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      console.log('Enhanced search results:', data);
      setSearchResults(data);

    } catch (err) {
      console.error('Enhanced semantic search error:', err);
      setError(err instanceof Error ? err.message : 'Enhanced search failed');
      setSearchResults({
        matches: [],
        suggestions: ['Try using different keywords', 'Include more descriptive terms'],
        summary: 'Enhanced search encountered an error',
        vectorAnalysis: 'Vector search unavailable'
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
    performEnhancedSearch,
    clearSearch
  };
};
