import PropTypes from 'prop-types';

export const AuthFormError = ({ message }) => {
  if (!message) return null;

  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{
        border: '1px solid var(--error-border, #fecaca)',
        backgroundColor: 'var(--error-subtle, #fef2f2)',
        color: 'var(--error, #dc2626)',
      }}
    >
      {message}
    </div>
  );
};

AuthFormError.propTypes = {
  message: PropTypes.string,
};
