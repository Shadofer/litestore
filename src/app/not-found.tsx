import BlurredBackground from "./components/homepage/BlurredBackground";
import LitestoreContentNotFound from "./components/homepage/LitestoreContentNotFound";
import LitestoreBar from "./components/homepage/LitestoreBar";
import LitestoreFooter from "./components/homepage/LitestoreFooter";

export default function Page() {
  return (
    <div>
      <BlurredBackground />

      <LitestoreBar />

      <LitestoreContentNotFound />

      <LitestoreFooter />
    </div>
  );
}
