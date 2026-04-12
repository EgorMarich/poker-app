import { BrowserRouter, Routes, Route } from 'react-router';
import { useState, Suspense } from 'react';
import { useTelegramInit } from '$/features/auth/ui/TelegramAuthInit';
import Home from '$/pages/home/ui/Home';
import { RootLayout } from '$/shared/layouts/RootLayout';
import { RangeEditor } from '$/pages/range-editor';
import { Calculator } from '$/pages/calculator';
import { GtoHelper } from '$/pages/gto-helper';
import { Profile } from '$/pages/profile';
import { Training } from '$/pages/profile/training/ui/Training';
import { Tariff } from '$/pages/tariff';
import { Admin } from '$/pages/admin/ui/Admin';
import { ModalProvider } from '$/shared/modal/ModalProvider';

function App() {
  const [isReady, setIsReady] = useState(false);
  const { init, isPending } = useTelegramInit();

  if (!isReady && !isPending) {
    init().finally(() => setIsReady(true));
  }

  if (!isReady || isPending) return <div>Загрузка</div>;

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="calculator" element={<Calculator />} />
              <Route path="range-editor" element={<RangeEditor />} />
              <Route path="gto-helper" element={<GtoHelper />} />
              <Route path="profile" element={<Profile />} />
              <Route path="training" element={<Training />} />
              <Route path="tariff" element={<Tariff />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </ModalProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
