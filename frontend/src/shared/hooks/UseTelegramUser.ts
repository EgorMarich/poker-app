import { useState, useEffect } from 'react';


interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;  
  canBeMessaged?: boolean;
}

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState<boolean>(false);
  const [initDataRaw, setInitDataRaw] = useState<string>('');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (!tg || !tg.initDataUnsafe?.user) {
      // eslint-disable-next-line
      setIsInTelegram(false);
      return;
    }

    setIsInTelegram(true);
    setInitDataRaw(tg.initData);
    
    const telegramUser = tg.initDataUnsafe.user;
    
    setUser({
      id: telegramUser.id,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
      languageCode: telegramUser.language_code,
      isPremium: telegramUser.is_premium ?? false,
      photoUrl: telegramUser.photo_url,  
      canBeMessaged: telegramUser.allows_write_to_pm ?? false,
    });
    
    tg.expand?.();

    tg.ready();
    
  }, []);

  return {
    user,
    isInTelegram,
    initDataRaw,
    isAuthenticated: !!user,  
  };
}