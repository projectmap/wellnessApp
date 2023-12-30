import { ROUTE } from '~/config/routes';
import { SvgIconName } from '~/utils/enums';
import { getNotificationLinkProps } from '../NotificationTypes';

export const getNotificationLink = ({ icon, metaData }: getNotificationLinkProps) => {
  let link = `/`;

  switch (icon) {
    case SvgIconName.ADMIN:
      if (metaData.resource) {
        return ROUTE.RESOURCE_DETAILS + metaData?.resource?._id;
      }

      if (metaData.recipe) {
        return ROUTE.RECIPE_DETAILS + metaData?.recipe?._id;
      }

      return ROUTE.RECORD;
    case SvgIconName.COMMENT:
    case SvgIconName.LIKE: {
      link = `${ROUTE.COMMUNITY}${metaData?.post?._id}`;

      return link;
    }
    case SvgIconName.FRIEND: {
      link = ROUTE.FRIEND;

      return link;
    }
    case SvgIconName.REQUEST_ACCEPTED: {
      link = `${ROUTE.PROFILE}${metaData?.friend?.approver}`;

      return link;
    }
    case SvgIconName.MESSAGE: {
      link = ROUTE.CHAT;

      return link;
    }
    case SvgIconName.POST_IMAGE: {
      link = `${ROUTE.COMMUNITY}${metaData?.post?._id}`;

      return link;
    }
    default:
      return link;
  }
};
