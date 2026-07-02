import { useEffect } from 'react';
import { AuthTopBar } from '@shared/components/organisms/AuthTopBar';
import { LandingTemplate } from '@shared/components/templates/LandingTemplate';
import { setupAuthPage } from '@shared/utils/authTheme';
import { useLanding } from '../hooks/useLanding';
import { LandingBenefitsSection } from '../organisms/LandingBenefitsSection';
import { LandingCtaSection } from '../organisms/LandingCtaSection';
import { LandingFeaturesSection } from '../organisms/LandingFeaturesSection';
import { LandingFooter } from '../organisms/LandingFooter';
import { LandingHeroSection } from '../organisms/LandingHeroSection';

export const Landing = () => {
  const {
    goToLogin,
    goToRegister,
    isBusy,
    isLoginLoading,
    isRegisterLoading,
  } = useLanding();

  useEffect(() => {
    setupAuthPage();
  }, []);

  return (
    <LandingTemplate
      topBar={(
        <AuthTopBar
          showActionButton
          showNavigation
          logoClickable={false}
          isActionLoading={isLoginLoading}
          actionDisabled={isBusy}
          onActionClick={goToLogin}
        />
      )}
      hero={(
        <LandingHeroSection
          onRegister={goToRegister}
          onLogin={goToLogin}
          isBusy={isBusy}
          isLoginLoading={isLoginLoading}
          isRegisterLoading={isRegisterLoading}
        />
      )}
      features={<LandingFeaturesSection />}
      benefits={<LandingBenefitsSection />}
      cta={(
        <LandingCtaSection
          onRegister={goToRegister}
          isBusy={isBusy}
          isRegisterLoading={isRegisterLoading}
        />
      )}
      footer={<LandingFooter />}
    />
  );
};
