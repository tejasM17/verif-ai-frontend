export default function Divider({ text = 'or continue with' }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-border dark:border-dark-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-surface px-3 text-xs font-medium text-muted dark:bg-dark-surface dark:text-dark-muted">
          {text}
        </span>
      </div>
    </div>
  );
}