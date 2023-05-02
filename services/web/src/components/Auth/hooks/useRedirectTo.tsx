import {useRouter} from 'next/router';
import {useMemo} from 'react';

interface UseRedirectToOptions {
  /**
   * the default url to redirect to if unable to resolve from url query
   * @default '/'
   */
  defaultRedirectTo?: string;

  /**
   * indicates whether to allow cross origin redirects
   * @default false
   */
  allowCrossOriginRedirect?: boolean;
}

/**
 * Resolves where to redirect after user authentication.
 * @returns the url to redirect to
 */
const useRedirectTo = (options: UseRedirectToOptions = {}) => {
  const {allowCrossOriginRedirect = false, defaultRedirectTo = '/'} = options;

  const router = useRouter();
  const rawRedirectTo = useMemo(() => {
    const redirectTo = router.query.redirect;

    if (redirectTo === undefined) return null;
    if (typeof redirectTo === 'string') return redirectTo;

    if (!redirectTo.length) return null;
    return redirectTo[0];
  }, [router.query.redirect]);

  const sanitisedRedirectTo = useMemo(() => {
    if (allowCrossOriginRedirect) return rawRedirectTo;

    // running on server, abort
    if (typeof window === 'undefined') return null;

    const currentOrigin = window.location.origin;
    const redirectToOrigin = new URL(rawRedirectTo ?? '', currentOrigin).origin;

    if (redirectToOrigin !== currentOrigin) return null;

    return rawRedirectTo;
  }, [rawRedirectTo, allowCrossOriginRedirect]);

  return sanitisedRedirectTo ?? defaultRedirectTo;
};

export default useRedirectTo;
