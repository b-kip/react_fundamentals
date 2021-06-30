import { useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (scrollRef, callback) => {
  const scrollObserver = useCallback((node) => {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          callback();
        }
      });
    }).observe(node);
  }, [callback]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  },[scrollRef, scrollObserver])
}
