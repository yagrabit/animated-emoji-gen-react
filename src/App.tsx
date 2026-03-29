import { MainPage } from "@/pages/MainPage";
import { Footer } from "@/components/Footer";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Animated Emoji Generator</h1>
      </header>
      <main>
        <MainPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
