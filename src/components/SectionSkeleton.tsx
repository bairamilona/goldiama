/**
 * Skeleton компонент для lazy-loaded секций
 * Показывается пока компонент загружается
 */

export function SectionSkeleton() {
  return (
    <div className="w-full py-16 md:py-24 lg:py-32 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title Skeleton */}
        <div className="h-12 bg-gray-200/50 rounded-lg w-2/3 mx-auto mb-8" />
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100/50 rounded-2xl h-64" />
          ))}
        </div>
      </div>
    </div>
  );
}
