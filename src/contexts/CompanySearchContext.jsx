import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { listCompanies, searchCompanies } from "../api/auth";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [feed, setFeed] = useState([]);
  const [feedTotal, setFeedTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listCompanies({ limit: 50, skip: 0 });
      setFeed(res.data.items || []);
      setFeedTotal(res.data.total || 0);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setTotal(0);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    const handle = setTimeout(async () => {
      try {
        const res = await searchCompanies({ q: term, limit: 20, skip: 0 });
        if (cancelled) return;
        setResults(res.data.items || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.detail || err.message || "Search failed");
        setResults([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      results,
      total,
      feed,
      feedTotal,
      loading,
      error,
      reloadFeed: loadFeed,
      isSearching: query.trim().length > 0,
    }),
    [query, results, total, feed, feedTotal, loading, error, loadFeed],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useCompanySearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useCompanySearch must be used within a SearchProvider");
  }
  return ctx;
}