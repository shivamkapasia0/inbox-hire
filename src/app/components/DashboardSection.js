export default function DashboardSection({ title, children, className = '', variant }) {
  const baseClasses = "rounded-lg shadow p-6";
  const variantClasses = {
    default: "rounded-lg shadow p-6 rounded-lg shadow p-6 bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-white/18 dark:border-white/10  ",
    applications: "bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-white/18 dark:border-white/10"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      {children}
    </div>
  );
} 