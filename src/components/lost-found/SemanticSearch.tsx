import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Brain, Lightbulb, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';

interface SemanticSearchProps {
  items: any[];
  onSearchResults: (matchedItems: any[]) => void;
  searchType?: 'lost' | 'found' | 'both';
}

export const SemanticSearch = ({ items, onSearchResults, searchType = 'both' }: SemanticSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isSearching, searchResults, error, performSemanticSearch, clearSearch } = useSemanticSearch();

  const handleSearch = async () => {
    await performSemanticSearch(searchQuery, items, searchType);
  };

  const handleClear = () => {
    setSearchQuery('');
    clearSearch();
    onSearchResults(items); // Reset to show all items
  };

  // Apply search results to filter items
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>AI-Powered Search</span>
          <Sparkles className="h-4 w-4 text-uniuyo-gold" />
        </CardTitle>
        <CardDescription>
          Describe what you're looking for in natural language. Our AI understands context, synonyms, and can match similar items.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <label htmlFor="semantic-search-input" className="sr-only">
              AI Search Input
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="semantic-search-input"
              placeholder="Describe what you're looking for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={!searchQuery.trim() || isSearching}
            aria-label="Perform AI search"
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

        {/* Search Examples */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Try:</span>
          {searchExamples.slice(0, 3).map((example, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs text-primary hover:bg-primary/10"
              onClick={() => setSearchQuery(example)}
            >
              "{example}"
            </Button>
          ))}
        </div>

        {/* Search Results Summary */}
        {searchResults && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Brain className="h-3 w-3" />
                <span>{searchResults.matches.length} AI matches found</span>
              </Badge>
            </div>

            {searchResults.summary && (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {searchResults.summary}
              </p>
            )}

            {/* Search Suggestions */}
            {searchResults.suggestions.length > 0 && (
              <div className="bg-info/5 p-3 rounded-lg border border-info/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium text-foreground">Suggestions</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {searchResults.suggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Match Details */}
            {searchResults.matches.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Match Details:</h4>
                {searchResults.matches.slice(0, 3).map((match, index) => (
                  <div key={index} className="bg-success/5 p-3 rounded text-sm border border-success/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Match {index + 1}</span>
                      <Badge variant="outline" className="text-success border-success/50">
                        {match.score}% match
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{match.reasoning}</p>
                    {match.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
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
          <div className="text-destructive-foreground text-sm bg-destructive p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
