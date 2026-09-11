import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center space-y-4 p-6 text-center">
      <h1 className="font-display text-primary text-6xl font-extrabold">404</h1>
      <h2 className="font-display text-2xl font-bold">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm text-sm">
        The coffee route you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
