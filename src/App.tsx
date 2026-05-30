import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Theme } from './settings/types';
import { ExploreScreen } from './components/generated/ExploreScreen';
import { SearchResultsScreen } from './components/generated/SearchResultsScreen';
import { DiscoverMapScreen } from './components/generated/DiscoverMapScreen';
import { ProfileScreen } from './components/generated/ProfileScreen';
import { ListingDetailScreen } from './components/generated/ListingDetailScreen';
import { BookingScreen } from './components/generated/BookingScreen';
import { BecomeAHostStep1 } from './components/generated/BecomeAHostStep1';
import { ConnectedAuthScreen } from './components/auth/ConnectedAuthScreen';
import { useAuth } from './context/AuthContext';

// ── Routes ──────────────────────────────────────────────────────────────────
type RouteName =
  | 'explore'
  | 'search'
  | 'discover'
  | 'profile'
  | 'property'
  | 'booking'
  | 'host'
  | 'auth';

/** Routes that require the user to be authenticated */
const PROTECTED_ROUTES: RouteName[] = ['booking', 'profile'];

let theme: Theme = 'light';

const getRouteFromHash = (): RouteName => {
  const route = window.location.hash.replace(/^#\/?/, '').split('/')[0];
  switch (route) {
    case 'search':
    case 'discover':
    case 'profile':
    case 'property':
    case 'booking':
    case 'host':
    case 'auth':
      return route;
    default:
      return 'explore';
  }
};

// ── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [route, setRoute] = useState<RouteName>(() => getRouteFromHash());
  const { session, loading, setIntendedRoute, intendedRoute } = useAuth();

  // ── Theme ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  // ── Hash-change listener ───────────────────────────────────────────────────
  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ── Guard: redirect protected routes to #/auth when unauthenticated ────────
  useEffect(() => {
    if (loading) return; // wait until session is resolved
    if (!session && PROTECTED_ROUTES.includes(route)) {
      // Remember where the user was trying to go
      setIntendedRoute(window.location.hash.replace(/^#\/?/, '') || route);
      window.location.hash = '/auth';
      setRoute('auth');
    }
  }, [route, session, loading, setIntendedRoute]);

  // ── Navigate helper ────────────────────────────────────────────────────────
  const navigate = useCallback((nextRoute: string) => {
    window.location.hash = nextRoute;
    setRoute(getRouteFromHash());
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // ── Global click-capture (unchanged from original) ─────────────────────────
  const handleAppClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const interactive = target.closest('button, [role="button"], a, img, h3');
      if (!interactive) return;

      const label = (
        interactive.textContent ||
        interactive.getAttribute('aria-label') ||
        target.getAttribute('alt') ||
        ''
      ).toLowerCase();

      if (label.includes('explore') || label.includes('back to explore')) navigate('/');
      else if (
        label.includes('search') ||
        label.includes('where to') ||
        label.includes('filter') ||
        label.includes('see all')
      )
        navigate('/search');
      else if (label.includes('discover') || label.includes('map')) navigate('/discover');
      else if (
        label.includes('profile') ||
        label.includes('login') ||
        label.includes('sign')
      ) {
        // If user is not authenticated and clicks login/sign, go to auth screen
        if (!session) {
          setIntendedRoute('profile');
          navigate('/auth');
        } else {
          navigate('/profile');
        }
      } else if (label.includes('host')) navigate('/host');
      else if (label.includes('book') || label.includes('reserve')) {
        // Guard: unauthenticated users who tap Book Now → auth first
        if (!session) {
          setIntendedRoute('booking/alpine-woodhouse');
          navigate('/auth');
        } else {
          navigate('/booking/alpine-woodhouse');
        }
      } else if (interactive.tagName === 'IMG' || interactive.tagName === 'H3')
        navigate('/property/alpine-woodhouse');
    },
    [navigate, session, setIntendedRoute],
  );

  // ── After successful auth: return to intended destination ──────────────────
  const handleAuthenticated = useCallback(() => {
    const dest = intendedRoute ?? '/';
    setIntendedRoute(null);
    navigate(dest.startsWith('/') ? dest : `/${dest}`);
  }, [intendedRoute, navigate, setIntendedRoute]);

  // ── Route renderer ─────────────────────────────────────────────────────────
  const renderRoute = () => {
    // While resolving session, render nothing (avoids flash of protected content)
    if (loading) return null;

    // If trying to access a protected route without a session, render nothing
    // (the useEffect above will redirect to #/auth)
    if (!session && PROTECTED_ROUTES.includes(route)) return null;

    switch (route) {
      case 'auth':
        return <ConnectedAuthScreen onAuthenticated={handleAuthenticated} />;
      case 'search':
        return <SearchResultsScreen />;
      case 'discover':
        return <DiscoverMapScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'property':
        return <ListingDetailScreen />;
      case 'booking':
        return <BookingScreen />;
      case 'host':
        return <BecomeAHostStep1 />;
      case 'explore':
      default:
        return <ExploreScreen />;
    }
  };

  return (
    <div
      onClickCapture={handleAppClick}
      style={{
        minHeight: '100vh',
        background: '#F6FAF8',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          minHeight: '100vh',
          background: '#FAFFFE',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(0,0,0,0.08)',
        }}
      >
        {renderRoute()}
      </div>
    </div>
  );
}

export default App;
