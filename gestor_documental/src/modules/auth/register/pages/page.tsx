import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterTemplate } from '@shared/components/templates/RegisterTemplate';
import { setupAuthPage } from '@shared/utils/authTheme';
import { useRegister } from '../hooks/useRegister';
import {
  arePasswordRequirementsMet,
  evaluatePasswordRequirements,
  hasRegisterRequiredFields,
  validateRegisterForm,
} from '../validations/registerSchema';
import type { RegisterFormData, RegisterFormErrors } from '../types/register.types';
import { RegisterForm } from '../organisms/RegisterForm';
import { RegisterSuccess } from '../organisms/RegisterSuccess';

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

  const handleFieldChange = (fieldName: keyof RegisterFormData) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = fieldName === 'termsAccepted' ? event.target.checked : event.target.value;

    setFormData((previous) => ({ ...previous, [fieldName]: value }));
    setFormErrors((previous) => ({ ...previous, [fieldName]: null }));
    if (error) setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    <RegisterTemplate>
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
    </RegisterTemplate>
  );
};
