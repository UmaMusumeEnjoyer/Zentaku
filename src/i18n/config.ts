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
  ProfilePageEN, ProfilePageJP,
  ActivityHistoryEN, ActivityHistoryJP,
  EditProfileModalEN, EditProfileModalJP,
  ProfilePagePageEN, ProfilePagePageJP,
  ActivityFeedEN, ActivityFeedJP,
  addAnimeModalEN, addAnimeModalJP,
  editListModalEN, editListModalJP,
  likersModalEN, likersModalJP,
  listHeaderEN, listHeaderJP,
  requestListEN, requestListJP,
  requestModalEN, requestModalJP,
  sidebarEN, sidebarJP,
  userAnimeGroupEN, userAnimeGroupJP,
  userItemEN, userItemJP,
  userSearchModalEN, userSearchModalJP,
  animeListPageEN, animeListPageJP,
  scheduleDashboardEN, scheduleDashboardJP,
  MangaReaderEn, MangaReaderJp,
  WatchPageEn, WatchPageJp,
  WatchAlongEn, WatchAlongJp,
  ChatAppEn, ChatAppJp,
  NovelReaderEn, NovelReaderJp,
  notificationEn, notificationJp
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
        ProfilePage: ProfilePageEN,
        ActivityHistory: ActivityHistoryEN,
        EditProfileModal: EditProfileModalEN,
        ProfilePagePage: ProfilePagePageEN,
        ActivityFeed: ActivityFeedEN,
        addAnimeModal: addAnimeModalEN,
        editListModal: editListModalEN,
        likersModal: likersModalEN,
        listHeader: listHeaderEN,
        requestList: requestListEN,
        requestModal : requestModalEN,
        sidebar: sidebarEN,
        userAnimeGroup: userAnimeGroupEN,
        userItem: userItemEN,
        userSearchModal: userSearchModalEN,
        animeListPage: animeListPageEN,
        ScheduleDashboard: scheduleDashboardEN,
        MangaReader: MangaReaderEn,
        WatchPage: WatchPageEn,
        WatchAlong: WatchAlongEn,
        ChatApp: ChatAppEn,
        NovelReader: NovelReaderEn,
        notification: notificationEn
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
        ProfilePage: ProfilePageJP,
        ActivityHistory: ActivityHistoryJP,
        EditProfileModal: EditProfileModalJP,
        ProfilePagePage: ProfilePagePageJP,
        ActivityFeed:ActivityFeedJP,
        addAnimeModal: addAnimeModalJP,
        editListModal: editListModalJP,
        likersModal: likersModalJP,
        listHeader: listHeaderJP,
        requestList: requestListJP,
        requestModal: requestModalJP,
        sidebar: sidebarJP,
        userAnimeGroup: userAnimeGroupJP,
        userItem: userItemJP,
        userSearchModal: userSearchModalJP,
        animeListPage: animeListPageJP,
        ScheduleDashboard: scheduleDashboardJP,
        MangaReader: MangaReaderJp,
        WatchPage: WatchPageJp,
        WatchAlong: WatchAlongJp,
        ChatApp: ChatAppJp,
        NovelReader: NovelReaderJp,
        notification: notificationJp
      },
    },
    lng: localStorage.getItem('language') || DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    defaultNS: DEFAULT_NS,
    ns: ['common', 'HomePage', 'NewsDetailPage', 'CharacterPage'
      , 'RankingSection', 'CharactersSection', 'StaffSection', 'StatisticsSection'
      , 'AnimeModal', 'MainContentArea', 'AnimeDetail', 'Header'
      , 'GlobalSearch', 'Auth', 'StaffPage', 'AnimeSearch', 'AnimeSection'
      , 'HomePageLogin', 'AnimeListSearch', 'ProfilePage', 'ActivityHistory'
      , 'EditProfileModal', 'ProfilePagePage', 'ActivityFeed'
      , 'addAnimeModal', 'editListModal', 'likersModal', 'listHeader', 'requestList', 'requestModal', 'sidebar'
      , 'userAnimeGroup', 'userItem', 'userSearchModal', 'animeListPage', 'ScheduleDashboard'
      , 'MangaReader', 'WatchPage', 'WatchAlong', 'ChatApp', 'NovelReader', 'notification'
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
