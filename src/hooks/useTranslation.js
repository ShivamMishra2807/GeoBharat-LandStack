import useAppStore from '../store';
import { translations, getTranslation, SUPPORTED_LANGUAGES } from '../utils/translations';

export const useTranslation = () => {
  const currentLanguage = useAppStore((state) => state.currentLanguage || 'en');
  const setLanguage = useAppStore((state) => state.setLanguage);

  const t = (key) => getTranslation(key, currentLanguage);

  return {
    t,
    currentLanguage,
    setLanguage,
    languages: SUPPORTED_LANGUAGES,
  };
};

export default useTranslation;
