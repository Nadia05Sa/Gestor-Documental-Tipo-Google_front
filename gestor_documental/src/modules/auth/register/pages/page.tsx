import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { INTER_STYLE, REGISTER_PAGE_GRADIENT, setupAuthPage } from '@shared/utils/authTheme';
import {
  arePasswordRequirementsMet,
  evaluatePasswordRequirements,
  hasRegisterRequiredFields,
  validateRegisterForm,
} from '../validations/registerSchema';
import type { RegisterFormData, RegisterFormErrors } from '../types/register.types';
import { RegisterForm } from '../components/RegisterForm';
import { RegisterSuccess } from '../components/RegisterSuccess';

const INITIAL_FORM_DATA: RegisterFormData = {
  name: '',
  surname: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});
  const [accountCreated, setAccountCreated] = useState(false);
  const [createdEmail, setCreatedEmail] = useState('');
  const { loading, error, setError, registerUser } = useRegister();

  useEffect(() => {
    setupAuthPage();
  }, []);

  const requirements = useMemo(
    () => evaluatePasswordRequirements({ newPassword: formData.password }),
    [formData.password],
  );

  const areRequirementsMet = arePasswordRequirementsMet(requirements);
  const doesConfirmationMatch =
    formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password;

  const isSubmitEnabled =
    hasRegisterRequiredFields(formData)
    && areRequirementsMet
    && doesConfirmationMatch
    && !loading;

  const handleFieldChange = (fieldName) => (event) => {
    const value = fieldName === 'termsAccepted' ? event.target.checked : event.target.value;

    setFormData((previous) => ({ ...previous, [fieldName]: value }));
    setFormErrors((previous) => ({ ...previous, [fieldName]: null }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateRegisterForm(formData, { areRequirementsMet, doesConfirmationMatch });
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const result = await registerUser(formData);
    if (!result.success) {
      setFormErrors((previous) => ({ ...previous, ...(result.fieldErrors || {}) }));
      return;
    }

    setAccountCreated(true);
    setCreatedEmail(result?.data?.email || formData.email);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ ...INTER_STYLE, background: REGISTER_PAGE_GRADIENT }}
    >
      <div className="w-full max-w-[560px]">
        {accountCreated ? (
          <RegisterSuccess email={createdEmail} onGoToLogin={() => navigate('/login')} />
        ) : (
          <RegisterForm
            formData={formData}
            formErrors={formErrors}
            requirements={requirements}
            error={error}
            loading={loading}
            isSubmitEnabled={isSubmitEnabled}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};
