import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Article Not Found
        </h2>
        <p className="text-foreground-secondary mb-8">
          The article you are looking for does not exist or has been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/news"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            View All News
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-background-secondary border border-border text-foreground rounded-lg hover:bg-background-muted transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
