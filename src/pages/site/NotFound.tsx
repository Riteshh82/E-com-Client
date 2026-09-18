import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <h1 className="font-display text-6xl text-copper-500">404</h1>
      <p className="mt-4 text-lg text-charcoal-950">Page not found</p>
      <p className="mt-2 text-stone-500">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="mt-8">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
