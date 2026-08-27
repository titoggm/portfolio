import GrainBackground from "@/components/grain-background";
import { TitoOS } from "@/components/tito-os";

export default function Home() {
  return (
    <main className="h-dvh w-screen">
      <GrainBackground color="#0a0a0a" />
      <TitoOS />
    </main>
  );
}
