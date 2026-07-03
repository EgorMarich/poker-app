import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TARIFF_PLAN } from '../model/config';
import { Card } from './card/Card';
import { useCreatePayment, useSubscription } from '$/entities/payments/model/payments.queries';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '$/shared/api/query-keys';
import s from './Tariff.module.scss';
import { useTranslation } from 'react-i18next';
import { BackButton } from '$/shared/ui/buttons/backButton/BackButton';
import RootInput from '$/shared/ui/inputs/rootInput/RootInput';

export const Tariff = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: subscription } = useSubscription();
  const { mutate: createPayment, isPending } = useCreatePayment();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  function handleSelect(plan: string) {
    setLoadingPlan(plan);

    setPromoError('');
    setLoadingPlan(plan);
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    createPayment(plan as any, {
      onSuccess: res => {
        setLoadingPlan(null);

        if (res.testMode) {
          setSuccessPlan(plan);
          qc.invalidateQueries({ queryKey: queryKeys.payments.subscription });
          qc.invalidateQueries({ queryKey: queryKeys.profile });
          setTimeout(() => navigate('/profile'), 2000);
          return;
        }

        if (res.confirmationUrl) {
          window.location.href = res.confirmationUrl;
        }
      },
      // eslint-disable-next-line
      onError: (error: any) => {
        setLoadingPlan(null);
        if (error.response?.data?.message?.includes('промокод')) {
          setPromoError(error.response.data.message);
        }
      },
    });
  }

  function handleBack() {
    navigate('/profile');
  }

  return (
    <div className={s.root}>
      <BackButton onClick={handleBack} classnames={s.backButton} />

      {successPlan && <div className={s.successBanner}>✅ {t('subscription.successBanner')}</div>}
      <div className={s.promoSection}>
        <RootInput
          label="Промокод (опционально)"
          placeholder="IVAN1A2B"
          value={promoCode}
          onChange={setPromoCode}
        />
        {promoError && <span className={s.promoError}>{promoError}</span>}
      </div>

      {TARIFF_PLAN.map(item => (
        <Card
          key={item.id}
          {...item}
          isActive={subscription?.plan === item.plan}
          isLoading={loadingPlan === item.plan}
          isSuccess={successPlan === item.plan}
          onSelect={() => handleSelect(item.plan)}
          disabled={isPending || subscription?.plan === item.plan}
        />
      ))}
    </div>
  );
};
