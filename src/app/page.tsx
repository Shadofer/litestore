import BlurredBackground from "./components/homepage/BlurredBackground";
import LitestoreBar from "./components/homepage/LitestoreBar";
import LitestoreContent from "./components/homepage/LitestoreContent";
import LitestoreFooter from "./components/homepage/LitestoreFooter";

export default function Page() {
  return (
    <div>
      <BlurredBackground />

      <LitestoreBar />

      <LitestoreContent />

      <LitestoreFooter />
    </div>
  );
}
