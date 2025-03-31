export default function DirectTest() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Test Page</h1>
        <p className="text-slate-600 mb-6">
          If you can see this page, the routing is working correctly!
        </p>
        <a 
          href="/auth" 
          className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}