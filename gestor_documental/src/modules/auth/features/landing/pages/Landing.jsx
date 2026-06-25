import { useEffect } from 'react';
import { AuthTopBar } from '../../../components/AuthTopBar';
import { INTER_STYLE } from '../../../constants/theme';
import { useLandingNavigation } from '../../../hooks/useLandingNavigation';
import { setupAuthPage } from '../../../utils/authTheme';
import { LandingBenefitsSection } from '../components/LandingBenefitsSection';
import { LandingCtaSection } from '../components/LandingCtaSection';
import { LandingFeaturesSection } from '../components/LandingFeaturesSection';
import { LandingFooter } from '../components/LandingFooter';
import { LandingHeroSection } from '../components/LandingHeroSection';

export const Landing = () => {
  const {
    goToLogin,
    goToRegister,
    isBusy,
    isLoginLoading,
    isRegisterLoading,
  } = useLandingNavigation();

  useEffect(() => {
    setupAuthPage();
  }, []);

  return (
    <div
      id="inicio"
      className="overflow-x-hidden bg-[var(--bg-base)] text-[var(--text-primary)]"
      style={{ ...INTER_STYLE, minHeight: 'max(884px, 100dvh)' }}
    >
      <AuthTopBar
        showActionButton
        showNavigation
        logoClickable={false}
        isActionLoading={isLoginLoading}
        actionDisabled={isBusy}
        onActionClick={goToLogin}
      />

      <main className="pt-20">
        <LandingHeroSection
          onRegister={goToRegister}
          onLogin={goToLogin}
          isBusy={isBusy}
          isLoginLoading={isLoginLoading}
          isRegisterLoading={isRegisterLoading}
        />
        <LandingFeaturesSection />
        <LandingBenefitsSection />
        <LandingCtaSection
          onRegister={goToRegister}
          isBusy={isBusy}
          isRegisterLoading={isRegisterLoading}
        />
      </main>

      <LandingFooter />
    </div>
  );
};
