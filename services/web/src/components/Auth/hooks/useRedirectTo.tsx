import {useRouter} from 'next/router';
import {useMemo} from 'react';

/**
 * Resolves where to redirect after user authentication.
 * @returns the url to redirect to
 */
const useRedirectTo = () => {
  const router = useRouter();
  const redirectTo = useMemo(() => {
    const redirectTo = router.query.redirect;

    if (redirectTo === undefined) return null;
    if (typeof redirectTo === 'string') return redirectTo;

    if (!redirectTo.length) return null;
    return redirectTo[0];
  }, [router.query.redirect]);

  return redirectTo ?? '/';
};

export default useRedirectTo;
