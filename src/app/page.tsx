import Link from "next/link";
import TopBar from './components/TopBar';
import ImageGenerator from './components/ImageGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <TopBar />
      <ImageGenerator />
    </main>
  );
}
