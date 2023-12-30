import React from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps, NextPage } from 'next';

import { useAppSelector } from '~/state/app/hooks';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import { ENUM_ROLE_ACCESS_FOR, useGetUserSubscriptionsQuery } from '@newstart-online/sdk';
import RecordReport from '~/modules/record/RecordReport/RecordReport';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import { RecordCategory } from '~/modules/record/recordCategory/RecordCategory';
import GenericUpgradeModal from '~/modules/_core/bits/modals/GenericUpgradeModal';
import { useGetUser } from '~/utils/useGetUser';

const Record: NextPage<{ id: string | undefined }> = ({ id }) => {
  const recordSubScreens = useAppSelector((state) => state?.screens?.currentScreen?.subScreens);
  const user = useGetUser();
  const [updatePlanModal, setUpdatePlanModal] = React.useState(false);

  const router = useRouter();
  const currentSubScreen = recordSubScreens?.find((subScreen: any) => router.asPath.includes(subScreen.path));

  React.useEffect(() => {
    if (user) {
      setUpdatePlanModal(user?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER);
    }
  }, [user]);

  if (!user) {
    return <LoaderArea />;
  }

  switch (currentSubScreen?.section) {
    case 'RECORD_REPORT' as any:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.RECORD_REPORT}>
          <LayoutArea>
            <GenericUpgradeModal setModalStatus={setUpdatePlanModal} modalStatus={updatePlanModal} />
            <RecordReport />
          </LayoutArea>
        </GoogleAnalytics>
      );
    case 'RECORD' as any:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.RECORD_NEW_DATA}>
          <LayoutArea>
            <RecordCategory />
          </LayoutArea>
        </GoogleAnalytics>
      );
    default:
      return (
        <LayoutArea>
          <RecordCategory />
        </LayoutArea>
      );
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const value = query.props?.[0];
  const id = query.props?.[1] ?? null;

  return {
    props: {
      value,
      id,
    },
  };
};

export default Record;
