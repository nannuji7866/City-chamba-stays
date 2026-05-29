import { useCallback, useEffect, useState } from 'react';
import { Theme } from './settings/types';
import { ExploreScreen } from './components/generated/ExploreScreen';
import { SearchResultsScreen } from './components/generated/SearchResultsScreen';
import { DiscoverMapScreen } from './components/generated/DiscoverMapScreen';
import { ProfileScreen } from './components/generated/ProfileScreen';
import { ListingDetailScreen } from './components/generated/ListingDetailScreen';
import { BookingScreen } from './components/generated/BookingScreen';
import { TravelAuthScreen } from './components/generated/TravelAuthScreen';
import { BecomeAHostStep1 } from './components/generated/BecomeAHostStep1';

type RouteName = 'explore' | 'search' | 'discover' | 'profile' | 'property' | 'booking' | 'auth' | 'host';

let theme: Theme = 'light';

const getRouteFromHash = (): RouteName => {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const route = hash.split('/')[0];

  switch (route) {
    case 'search':
    case 'discover':
    case 'profile':
    case 'property':
    case 'booking':
    case 'auth':
    case 'host':
      return route;
    default:
      return 'explore';
  }
};

function App() {
  const [route, setRoute] = useState<RouteName>(() => getRouteFromHash());

  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  useEffect(() => {
    setTheme(theme);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((nextRoute: string) => {
    window.location.hash = nextRoute;
    setRoute(getRouteFromHash());
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleAppClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const interactive = target.closest('button, [role="button"], a, img, h3');
    if (!interactive) return;

    const label = (
      interactive.textContent ||
      interactive.getAttribute('aria-label') ||
      target.getAttribute('alt') ||
      ''
    ).toLowerCase();

    if (label.includes('explore')) navigate('/');
    else if (label.includes('search') || label.includes('where to') || label.includes('filter') || label.includes('see all')) navigate('/search');
    else if (label.includes('discover') || label.includes('map')) navigate('/discover');
    else if (label.includes('profile')) navigate('/profile');
    else if (label.includes('host')) navigate('/host');
    else if (label.includes('login') || label.includes('sign')) navigate('/auth');
    else if (label.includes('book') || label.includes('reserve')) navigate('/booking/alpine-woodhouse');
    else if (interactive.tagName === 'IMG' || interactive.tagName === 'H3') navigate('/property/alpine-woodhouse');
  }, [navigate]);

  const renderRoute = () => {
    switch (route) {
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
      case 'auth':
        return <TravelAuthScreen />;
      case 'host':
        return <BecomeAHostStep1 />;
      case 'explore':
      default:
