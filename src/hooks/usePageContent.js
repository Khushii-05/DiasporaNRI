import { useState, useEffect } from 'react';
import { getPageContent, mapBlocksToValues } from '../services/contentService';
import { useContentUpdate } from '../context/ContentUpdateContext';

export function usePageContent(page, refreshInterval = null) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { contentUpdated } = useContentUpdate();

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const blocks = await getPageContent(page);
      setContent(mapBlocksToValues(blocks));
    } catch (err) {
      console.error(`Error loading content for ${page}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();

    // Set up periodic refresh if interval is specified
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(loadContent, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [page, refreshInterval, contentUpdated]);

  return {
    content,
    loading,
    error,
    refresh: loadContent,
    getValue: (key, fallback) => content[key] || fallback
  };
}
