import { useRouteError, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string };
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center p-6">
        <div className="text-9xl font-bold text-blue-600">404</div>
        <h1 className="text-3xl font-bold text-gray-900">Oops!</h1>
        <p className="text-gray-600">
          {error?.statusText || error?.message || 'Sorry, an unexpected error has occurred.'}
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
