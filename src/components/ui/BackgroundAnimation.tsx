export const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <div className="absolute -left-4 top-0 w-96 h-96 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
    <div className="absolute -right-4 top-0 w-96 h-96 bg-indigo-900/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute left-1/4 -bottom-8 w-96 h-96 bg-violet-900/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
  </div>
);
