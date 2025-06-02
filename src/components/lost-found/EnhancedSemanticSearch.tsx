
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Brain, Lightbulb, Loader2, Sparkles, Zap } from 'lucide-react';
import { useEnhancedSemanticSearch } from '@/hooks/useEnhancedSemanticSearch';

interface EnhancedSemanticSearchProps {
  items: any[];
  onSearchResults: (matchedItems: any[]) => void;
  searchType?: 'lost' | 'found' | 'both';
}

export const EnhancedSemanticSearch = ({ items, onSearchResults, searchType = 'both' }: EnhancedSemanticSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isSearching, searchResults, error, performEnhancedSearch, clearSearch } = useEnhancedSemanticSearch();

  const handleSearch = async () => {
    await performEnhancedSearch(searchQuery, items, searchType);
  };

  const handleClear = () => {
    setSearchQuery('');
    clearSearch();
    onSearchResults(items);
  };

  useEffect(() => {
    if (searchResults?.matches) {
      const matchedItemIds = searchResults.matches.map(match => match.id);
      const filteredItems = items.filter(item => matchedItemIds.includes(item.id));
      onSearchResults(filteredItems);
    }
  }, [searchResults, items, onSearchResults]);

  const searchExamples = [
    "Blue iPhone with cracked screen",
    "Car keys with Toyota keychain", 
    "Laptop left in computer lab",
    "Student ID for John Doe",
    "Red backpack near cafeteria"
  ];

  return (
    <Card className="mb-6 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Enhanced AI Search</span>
          <Zap className="h-4 w-4 text-yellow-500" />
          <Badge variant="secondary" className="ml-2">Groq Semantic</Badge>
        </CardTitle>
        <CardDescription>
          Advanced semantic search powered by Groq's language understanding and intelligent reasoning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Describe what you're looking for in detail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={!searchQuery.trim() || isSearching}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
          </Button>
          {(searchResults || searchQuery) && (
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Try:</span>
          {searchExamples.slice(0, 3).map((example, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs text-purple-600 hover:bg-purple-50"
              onClick={() => setSearchQuery(example)}
            >
              "{example}"
            </Button>
          ))}
        </div>

        {searchResults && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Brain className="h-3 w-3" />
                <span>{searchResults.matches.length} semantic matches</span>
              </Badge>
              <Badge variant="outline" className="text-green-600">
                <Zap className="h-3 w-3 mr-1" />
                Groq Semantic Active
              </Badge>
            </div>

            {searchResults.summary && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-1">Analysis Summary</h4>
                <p className="text-sm text-purple-700">{searchResults.summary}</p>
              </div>
            )}

            {searchResults.semanticAnalysis && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Semantic Analysis</h4>
                <p className="text-sm text-blue-700">{searchResults.semanticAnalysis}</p>
              </div>
            )}

            {searchResults.suggestions.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">AI Suggestions</span>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {searchResults.suggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {searchResults.matches.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Semantic Match Details:</h4>
                {searchResults.matches.slice(0, 3).map((match, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded text-sm border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Match {index + 1}</span>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-green-700">
                          {match.score}% match
                        </Badge>
                        <Badge variant="outline" className="text-blue-700">
                          {(match.semanticScore * 100).toFixed(0)}% semantic
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{match.reasoning}</p>
                    {match.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {match.highlights.map((highlight, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            Error: {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
