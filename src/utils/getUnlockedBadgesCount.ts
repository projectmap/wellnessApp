export const badgesAchievedCounter = (badgesData: any) => {
  let badgesCount = badgesData?.reduce((acc: any, item: any) => {
    if (item?.isUnLocked) {
      return (acc = acc + 1);
    } else {
      return acc;
    }
  }, 0);

  return badgesCount;
};
