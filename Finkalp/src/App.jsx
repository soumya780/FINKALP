import "./App.css";
import { ThemeProvider } from './context/ThemeContext';

import MapSection from "./components/MapSection";

function App() {
  return (
    <ThemeProvider>
      <MapSection />
    </ThemeProvider>
  );
}

export default App;
