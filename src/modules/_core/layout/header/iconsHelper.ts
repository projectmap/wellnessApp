import {
  HomeIcon,
  UserIcon,
  LearnIcon,
  RecordIcon,
  CommunityIcon,
  UserActiveIcon,
  HomeActiveIcon,
  LogoHeaderIcon,
  LearnActiveIcon,
  NotificationIcon,
  RecordActiveIcon,
  CommunityActiveIcon,
  NotificationActiveIcon,
  NavArrowIcon,
} from '~/icons';

export const iconHelper = (iconRef: string) => {
  switch (iconRef) {
    case 'home':
      return {
        icon: HomeIcon,
        activeIcon: HomeActiveIcon,
      };
    case 'record':
      return {
        icon: RecordIcon,
        activeIcon: RecordActiveIcon,
      };
    case 'learn':
      return {
        icon: LearnIcon,
        activeIcon: LearnActiveIcon,
      };
    case 'community':
      return {
        icon: CommunityIcon,
        activeIcon: CommunityActiveIcon,
      };

    case 'me':
      return {
        icon: UserIcon,
        activeIcon: UserActiveIcon,
      };
    case 'user':
      return {
        icon: UserIcon,
        activeIcon: UserActiveIcon,
      };
    case 'notification':
      return {
        icon: NotificationIcon,
        activeIcon: NotificationActiveIcon,
      };

    case 'more':
      return {
        icon: NavArrowIcon,
        activeIcon: NavArrowIcon,
      };
    default:
      return {
        icon: LogoHeaderIcon,
        activeIcon: LogoHeaderIcon,
      };
  }
};
