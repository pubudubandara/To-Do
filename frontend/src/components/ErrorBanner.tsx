type Props = { message: string };

export default function ErrorBanner({ message }: Props) {
  if (!message) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 mt-4">
      <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3">
        {message}
      </div>
    </div>
  );
}
