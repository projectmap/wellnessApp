import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { setLoading } from '~/state/services/loader/globalLoaderSlice';
import { storeFriends, storeSuggestedFriends } from '~/state/services/friends/friendsSlice';
import { IUser } from '@newstart-online/sdk';

interface WithFriendsProps {
  userId: string;
}
export const withFriends =
  <P extends object>(Component: React.ComponentType<P>): React.FC<P & WithFriendsProps> =>
  (props: WithFriendsProps) => {
    const router = useRouter();

    const _userId = router.query.userId as string;

    const [friendsWithRequests, setFriendsWithRequests] = useState(null);

    const dispatch = useAppDispatch();
    const currentLoggedInuserId = useAppSelector((state) => state?.user?.user?._id);

    const userId = _userId || currentLoggedInuserId;

    const suggestation = useAppSelector((state) => state?.friends?.suggested);

    useEffect(() => {
      if (userId) {
        !suggestation.length && friendsWithRequests && fetchSuggestedUsers(userId, friendsWithRequests);
        fetchFriends(userId);
      }
      async function fetchSuggestedUsers(userId: string, friends: IUser[]) {
        dispatch(setLoading(true));

        const _notContainsFriends = friends.map((friend) => ({
          id: {
            ne: friend._id,
          },
        }));

        const notContains = [
          ..._notContainsFriends,
          {
            id: {
              ne: userId,
            },
          },
        ];

        //TODO: fetch friend suggestation

        const suggestation: IUser[] = [];
        dispatch(setLoading(false));
        dispatch(storeSuggestedFriends(suggestation));
      }
      async function fetchFriends(userId: string) {
        dispatch(setLoading(true));

        // TODO: Fetch friends

        const friends: IUser[] = [];
        dispatch(setLoading(false));
        dispatch(storeFriends(friends));
      }
    }, []);

    return <Component {...(props as P)} />;
  };
