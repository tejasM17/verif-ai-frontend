export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div className="border-b border-[var(--border-soft)] mb-6 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive
                  ? "text-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
