import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const useActiveRoute = (href: string) => {
  const [active, setActive] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (href === '/app') {
      if (router.pathname === '/app') {
        setActive(true);
      }
    } else if (router.pathname.includes(href)) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [router, href]);
  return active;
};

export default useActiveRoute;
