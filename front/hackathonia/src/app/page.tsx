import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <Header 
          title="Evently-AI" 
          subtitle="Votre Assistant IA pour l'Organisation d'Événements" 
        />
        <ChatContainer />
        <Footer />
      </div>
    </div>
  );
}
