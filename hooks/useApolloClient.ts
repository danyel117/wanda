import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';

const useApolloClient = () => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(
    new ApolloClient({
      uri: '/api/graphql',
      credentials: 'same-origin',
      cache: new InMemoryCache(),
    })
  );

  const [persistor, setPersistor] = useState<
    CachePersistor<NormalizedCacheObject>
  >();

  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache();
      const newPersistor = new CachePersistor({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
        trigger: 'write',
        maxSize: 1048576 * 50, // 50MB
      });
      await newPersistor.restore();
      setPersistor(newPersistor);
      setClient(
        new ApolloClient({
          uri: '/api/graphql',
          credentials: 'same-origin',
          cache,
        })
      );
    }

    // eslint-disable-next-line no-console
    init().catch(console.error);
  }, []);

  const clearCache = useCallback(() => {
    if (!persistor) {
      return;
    }
    persistor.purge();
  }, [persistor]);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  return { client, clearCache, reload };
};

export default useApolloClient;
