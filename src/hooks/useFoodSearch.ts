import { useState, useEffect } from 'react';
import type { Food } from '../types/food';
import { searchFoods } from '../lib/foodService';

interface UseFoodSearchResult {
  results: Food[];
  isLoading: boolean;
}

/**
 * Hook de busca de alimentos com debounce de 250ms.
 * Dispara a busca apenas quando query tiver ≥ 2 caracteres.
 */
export function useFoodSearch(query: string): UseFoodSearchResult {
  const [results, setResults] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const found = await searchFoods(trimmed);
        setResults(found);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, isLoading };
}
