import PropTypes from 'prop-types';
import { MANROPE_STYLE } from '../../../constants/theme';

export const SectionHeading = ({ title, description, className = 'text-center' }) => (
  <div className={`space-y-4 ${className}`}>
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={MANROPE_STYLE}>
      {title}
    </h2>
    {description && (
      <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">{description}</p>
    )}
  </div>
);

SectionHeading.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  className: PropTypes.string,
};
