import { Link } from 'react-router-dom';

export default function AuthFooter({ text, linkText, linkTo }) {
  return (
    <p className="mt-8 text-center text-sm text-muted dark:text-dark-muted">
      {text}{' '}
      <Link
        to={linkTo}
        className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
      >
        {linkText}
      </Link>
    </p>
  );
}