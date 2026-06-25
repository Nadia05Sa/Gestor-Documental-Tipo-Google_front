import PropTypes from 'prop-types';

export function Switch({ checked, onCheckedChange, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] ${
        checked ? 'bg-[var(--accent)]' : 'bg-[var(--border-strong)]'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-[var(--bg-elevated)] shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

Switch.propTypes = {
  checked: PropTypes.bool,
  onCheckedChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Switch;
