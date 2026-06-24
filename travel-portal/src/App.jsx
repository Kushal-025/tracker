import { TravelProvider, useTravel } from './context/TravelContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Trips from './pages/Trips';
import Packing from './pages/Packing';
import Budget from './pages/Budget';
import Saved from './pages/Saved';

function AppContent() {
  const { page } = useTravel();

  const pages = {
    home: Home,
    explore: Explore,
    trips: Trips,
    packing: Packing,
    budget: Budget,
    saved: Saved,
  };

  const Page = pages[page] || Home;

  return (
    <div className="min-h-screen relative">
      <div className="aurora" />
      <div className="particles">
        <div className="particles-layer" />
        <div className="particles-layer-2" />
      </div>
      <Navbar />
      <main className="relative z-10 pt-20">
        <Page />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TravelProvider>
      <AppContent />
    </TravelProvider>
  );
}
