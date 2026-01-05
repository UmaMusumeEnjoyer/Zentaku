import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  commonEn,
  homePageEn,
  commonJp,
  homePageJp,
  LANGUAGES,
  newsDetailPageEn, newsDetailPageJp,
  characterPageEn, characterPageJp,
  RankingSectionEn, RankingSectionJp,
  charactersSectionEn, charactersSectionJp,
  staffSectionEn, staffSectionJp,
  statisticsSectionJp, statisticsSectionEn,
  AnimeModalEn, AnimeModalJp,
  MainContentAreaEn, MainContentAreaJp,
  AnimeDetailEn, AnimeDetailJp,
  HeaderEn, HeaderJp,
  GlobalSearchEn, GlobalSearchJp,
  AuthEn, AuthJp,
  StaffPageEn, StaffPageJp,
  AnimeSearchEN, AnimeSearchJP,
  AnimeSectionEN, AnimeSectionJP,
  HomePageLoginEN, HomePageLoginJP,
  AnimeListSearchEN, AnimeListSearchJP,
  ProfilePageEN, ProfilePageJP

} from '@umamusumeenjoyer/shared-logic';

export { LANGUAGES };

const DEFAULT_LANG = 'en';
const DEFAULT_NS = 'common';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEn,
        HomePage: homePageEn,
        NewsDetailPage: newsDetailPageEn,
        CharacterPage: characterPageEn,
        RankingSection: RankingSectionEn,
        CharactersSection: charactersSectionEn,
        StaffSection: staffSectionEn,
        StatisticsSection: statisticsSectionEn,
        AnimeModal: AnimeModalEn,
        MainContentArea: MainContentAreaEn,
        AnimeDetail: AnimeDetailEn,
        Header: HeaderEn,
        GlobalSearch: GlobalSearchEn,
        Auth: AuthEn,
        StaffPage: StaffPageEn,
        AnimeSearch: AnimeSearchEN,
        AnimeSection: AnimeSectionEN,
        HomePageLogin: HomePageLoginEN,
        AnimeListSearch: AnimeListSearchEN,
        ProfilePage: ProfilePageEN
      },
      jp: {
        common: commonJp,
        HomePage: homePageJp,
        NewsDetailPage: newsDetailPageJp,
        CharacterPage: characterPageJp,
        RankingSection: RankingSectionJp,
        CharactersSection: charactersSectionJp,
        StaffSection: staffSectionJp,
        StatisticsSection: statisticsSectionJp,
        AnimeModal: AnimeModalJp,
        MainContentArea: MainContentAreaJp,
        AnimeDetail: AnimeDetailJp,
        Header: HeaderJp,
        GlobalSearch: GlobalSearchJp,
        Auth: AuthJp,
        StaffPage: StaffPageJp,
        AnimeSearch: AnimeSearchJP,
        AnimeSection: AnimeSectionJP,
        HomePageLogin: HomePageLoginJP,
        AnimeListSearch: AnimeListSearchJP,
        ProfilePage: ProfilePageJP
      },
    },
    lng: localStorage.getItem('language') || DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    defaultNS: DEFAULT_NS,
    ns: ['common', 'HomePage', 'NewsDetailPage', 'CharacterPage'
      , 'RankingSection', 'CharactersSection', 'StaffSection', 'StatisticsSection'
      , 'AnimeModal', 'MainContentArea', 'AnimeDetail', 'Header'
      , 'GlobalSearch', 'Auth', 'StaffPage', 'AnimeSearch', 'AnimeSection'
      , 'HomePageLogin', 'AnimeListSearch', 'ProfilePage'
    ],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
