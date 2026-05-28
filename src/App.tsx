import { Theme } from './settings/types';
import { ExploreScreen } from './components/generated/ExploreScreen';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <ExploreScreen />;
}

export default App;
