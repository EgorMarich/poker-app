import { useTelegramAuth } from "$/entities/user/model/auth.queries";


declare global {
  interface Window {
    Telegram?: { WebApp?: { initData: string; ready: () => void; expand?: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            allows_write_to_pm?: boolean;
            photo_url?: string;
          } 
        }
      }
    }
  }
}

export function useTelegramInit() {
  const { mutateAsync: telegramAuth, isPending, isSuccess, isError } = useTelegramAuth()

  const tg = window.Telegram?.WebApp
  const hasToken = !!localStorage.getItem('access_token')
  const hasInitData = !!tg?.initData

  async function init() {
    if (hasToken || !hasInitData) return
    tg!.ready()
    await telegramAuth(tg!.initData)
  }

  return { init, isPending, isSuccess, isError, hasToken }
}