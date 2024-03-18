import BlurredBackground from "../components/homepage/BlurredBackground";
import LitestoreContentAuth from "../components/homepage/LitestoreContentAuth";
import LitestoreBarEmpty from "../components/homepage/LitestoreBarEmpty";
import LitestoreFooter from "../components/homepage/LitestoreFooter";

export default function Auth() {
  return (
    <div>
      <BlurredBackground />

      <LitestoreBarEmpty />

      <LitestoreContentAuth />

      <LitestoreFooter />
    </div>
  );
}
