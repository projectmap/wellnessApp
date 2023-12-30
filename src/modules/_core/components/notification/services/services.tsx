import { useEffect, useMemo, useState } from 'react';

import { useDispatch } from 'react-redux';

import {
  useCheckAllNotificationAsReadMutation,
  useGetUnReadNotificationsQuery,
  useListPaginatedNotificationsQuery,
  useMarkAsReadNoificationMutation,
} from '@newstart-online/sdk';

import { useAppSelector } from '~/state/app/hooks';
import { removeDuplicates } from '~/utils/helpers';
import { updateNotificationCount } from '~/state/services/persist/persistSlice';
import { storeNotifications } from '~/state/services/notification/notificationSlice';
import { UseInfiniteListNotificationProps } from '~/modules/_core/components/notification/NotificationTypes';

const useInfiniteListNotification = ({ apiItemCount }: UseInfiniteListNotificationProps) => {
  const dispatch = useDispatch();
  const notificationState = useAppSelector((state) => state.notifications);
  const [page, setPage] = useState<number>(1);

  const {
    data: notificationListApiData,
    isLoading: notificationListDataApiLoading,
    isSuccess,
  } = useListPaginatedNotificationsQuery({ page, perPage: apiItemCount });

  const fetchNextPage = () => {
    setPage((prev) => prev + 1);
  };
  const notificationData = useMemo(() => notificationListApiData?.data || [], [notificationListApiData]); // api response
  const notificationStateData = notificationState.notifications; // initial state notiifacation ko = []
  const hasApiNextPage = notificationListApiData?.totalPage !== page;

  useEffect(() => {
    if (isSuccess) {
      const finalStateData = removeDuplicates([...notificationState.notifications, ...notificationData]);
      dispatch(storeNotifications(finalStateData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isSuccess, notificationData]);

  return {
    notificationListDataApiLoading,
    notificationStateData,
    hasApiNextPage,
    fetchNextPage,
  };
};

const useMarkAsReadNotification = () => {
  const [readNotification, { data: readNotificationData }] = useMarkAsReadNoificationMutation();
  const onSubmit = ({ notificationId }: { notificationId: string }) => {
    readNotification(notificationId);
  };

  return { readNotificationData, onSubmit };
};

const useMarkAllReadNotification = () => {
  const dispatch = useDispatch();

  const notificationState = useAppSelector((state) => state.notifications);

  const [readAllNotification, { data: readAllNotificationData }] = useCheckAllNotificationAsReadMutation();
  const onSubmit = () => {
    readAllNotification()
      .unwrap()
      .then(() =>
        dispatch(
          storeNotifications(
            notificationState.notifications.map((notification) => {
              return { ...notification, seenStatus: true };
            }),
          ),
        ),
      );
  };

  return { readAllNotificationData, onSubmit };
};

const useGetUnSeenNotificationCount = () => {
  const dispatch = useDispatch();
  const unSeenNotificationCount = useAppSelector((state) => state.persist.notificationCount);
  const {
    data: unSeenNotificationCountApiData,
    isFetching: unSeenNotificationCountLoading,
    isSuccess: unSeenNotificationCountSuccess,
  } = useGetUnReadNotificationsQuery();

  const unSeenNotificationCountData = useMemo(
    () => unSeenNotificationCountApiData?.data,
    [unSeenNotificationCountApiData],
  ); // api response

  useEffect(() => {
    if (unSeenNotificationCountSuccess) {
      dispatch(updateNotificationCount(unSeenNotificationCountData));
    }
  }, [dispatch, unSeenNotificationCountData, unSeenNotificationCountSuccess]);

  return { unSeenNotificationCount, unSeenNotificationCountLoading, unSeenNotificationCountSuccess };
};

export {
  useInfiniteListNotification,
  useMarkAsReadNotification,
  useMarkAllReadNotification,
  useGetUnSeenNotificationCount,
};
