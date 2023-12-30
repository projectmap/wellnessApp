import Link from 'next/link';
import { Dayjs } from 'dayjs';
import Image from 'next/image';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  Modal,
} from '@mui/material';

import Popover from '@mui/material/Popover';

import {
  ENUM_ROLE_ACCESS_FOR,
  RECIPE_CATEGORY,
  useCreateUserMealPlanMutation,
  useGetUserMealPlanQuery,
} from '@newstart-online/sdk';
import AddMealModal from './modals/AddMealModal';
import { getNewDate } from '~/utils/getNewDate';
import { MEAL_TYPE_FOR_MEALPLAN, RESOURCES_LOADING_THUMBNAIL } from '~/state/constants';
import UserMealPlanModal from './modals/UserMealPlanModal';
import ChevronDownAccordian from '~/icons/downArrowIcon.svg';
import AddServeGuideModal from './modals/AddServeGuideModal';
import MealDeleteViewModal from './modals/MealDeleteViewModal';
import SwitchMealPlanModal from './modals/SwitchMealPlanModal';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { UserMealPlanStyles } from '~/modules/_core/styles/UserMealPlanStyles';
import { MealPlanMenuIcon, PlusIcon, TickIconBlue, TickIconDisabled } from '~/icons';
import { GenericModal } from '../../bits/modals/DragableModal';
import UpgradeSubscriptions from '../../bits/modals/UpgradeSubscriptions';
import { useGetUser } from '~/utils/useGetUser';
import { FREE_TRIAL_ROLE } from '~/utils/enums';

interface IUserMealPlan {
  status: boolean;
  setStatus: (status: boolean) => void;
}

const UserMealPlan = ({ status, setStatus }: IUserMealPlan) => {
  const matchesSmallScreen = useMediaQuery('(max-width:1200px)');

  let d1 = new Date();
  let today = getNewDate(d1, 0);

  const user = useGetUser();

  const [MealPlanArray, setMealPlanArray] = React.useState<any>();
  const [MealType, setMealType] = React.useState<string>();
  const [updatePlanModal, setUpdatePlanModal] = React.useState(false);

  const [openAddItemModal, setOpenAddItemModal] = React.useState<boolean>(false);
  const [showUserLocationModal, setShowUserLocationModal] = React.useState(true);

  const [openSwitchMealPlanModal, setOpenSwitchMealPlanModal] = React.useState<boolean>(false);
  const [openMealDeleteViewModal, setOpenMealDeleteViewModal] = React.useState<boolean>(false);
  const [openAddMealModal, setOpenAddMealModal] = React.useState<boolean>(false);
  const [selectedMealPlanDayId, setSelectedMealPlanDayId] = React.useState<string>();
  const [openAddServeGuideModal, setOpenAddServeGuideModal] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [debounceState, setDebounceState] = React.useState<boolean>(true);
  const [mealMaxDate, setMealMaxDate] = React.useState<any>(null);
  const [mealCycleStartDate, setMealCycleStartDate] = React.useState<any>(null);
  const [recipeDetailsForDeleteMenu, setRecipeDetailsForDeleteMenu] = React.useState<any>({
    id: '',
    name: '',
    mealType: '',
  });
  const [todayDietDayId, setTodayDietDayId] = useState('');
  const [isCalendarClickedForDiet, setIsCalendarClickedForDiet] = useState(false);
  const handleChange = (newvalue: any) => {
    setIsCalendarClickedForDiet(true);
    setValue(newvalue);
  };

  //Accordion
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [addMealPlans] = useCreateUserMealPlanMutation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleChangeAccordion = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { data } = useGetUserMealPlanQuery();

  const [breakfastsForToday, setBreakfastsForToday] = React.useState<any>(null);
  const [lunchForToday, setLunchForToday] = React.useState<any>(null);
  const [nextDietDate, setNextDietDate] = React.useState<any>(null);

  React.useEffect(() => {
    if (data?.data?.mealplan) {
      const sortedMealPlan = [...(data?.data?.mealplan || [])]?.sort((a: any, b: any) => a.order - b.order);
      setMealPlanArray({ ...data?.data, mealplan: sortedMealPlan });
    }
  }, [data]);

  const addToUserMealPlan = () => {
    addMealPlans({
      title: `Day ${MealPlanArray?.mealplan.length + 1}`,
      order: MealPlanArray?.mealplan.length + 1,
    })
      .unwrap()
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error));
  };

  useEffect(() => {
    if (data?.data) {
      const mealCount = data?.data?.mealplan?.length;
      const daysDifferenceWithStartDate = Math.floor(
        (d1?.getTime() - new Date(data?.data?.startDate).getTime()) / 86400000,
      );
      const cyclesExtraDays = daysDifferenceWithStartDate % mealCount;

      // Find out if meal plan cycle should start from today,at past or in the future.
      if (daysDifferenceWithStartDate < 0) {
        const newStartDate = getNewDate(today, Math.abs(cyclesExtraDays));
        setMealCycleStartDate(newStartDate);
        setMealMaxDate(getNewDate(newStartDate, mealCount - 1));
      } else {
        if (cyclesExtraDays === 0) {
          setMealCycleStartDate(today);
          setMealMaxDate(getNewDate(today, mealCount - 1));
        } else {
          const newStartDate = getNewDate(today, -cyclesExtraDays);
          setMealCycleStartDate(newStartDate);
          setMealMaxDate(getNewDate(newStartDate, mealCount - 1));
        }
      }
    }
  }, [data?.data]);

  useEffect(() => {
    MealPlanArray?.mealplan &&
      MealPlanArray?.mealplan?.map((mealItem: any, idx: number) => {
        const breakfasts = mealItem?.breakfasts;
        const lunchs = mealItem?.lunch;
        const { _id } = mealItem;

        const date = getNewDate(mealCycleStartDate, idx);

        if (today === date) {
          setBreakfastsForToday(breakfasts);
          setLunchForToday(lunchs);
          setTodayDietDayId(_id);
          setNextDietDate(getNewDate(date, 0));
        }
      });
  }, [MealPlanArray?.mealplan]);

  useEffect(() => {
    let startDateSec = new Date(data?.data?.startDate)?.getTime();
    if (MealPlanArray?.mealplan && d1.getTime() < startDateSec) {
      setBreakfastsForToday(MealPlanArray?.mealplan[0]?.breakfasts);
      setTodayDietDayId(MealPlanArray?.mealplan[0]?._id);
      setLunchForToday(MealPlanArray?.mealplan[0]?.lunch);
      setNextDietDate(getNewDate(mealCycleStartDate, 0));
    }
  }, [MealPlanArray?.mealplan]);

  const [clickedDateDietOrder, setClickedDateDietOrder] = useState(1);
  useEffect(() => {
    let clickedDateDiet: any;
    if (isCalendarClickedForDiet && MealPlanArray?.mealplan) {
      clickedDateDiet = MealPlanArray?.mealplan?.find(
        (item: any, idx: number) => getNewDate(value, 0) === getNewDate(mealCycleStartDate, idx),
      );
    }
    if (clickedDateDiet !== undefined) {
      setClickedDateDietOrder(clickedDateDiet.order);
      setBreakfastsForToday(clickedDateDiet?.breakfasts);
      setTodayDietDayId(clickedDateDiet?._id);
      setLunchForToday(clickedDateDiet.lunch);
      setNextDietDate(getNewDate(mealCycleStartDate, clickedDateDiet.order - 1));
    }
  }, [MealPlanArray?.mealplan, value]);

  return (
    <Box
      sx={{
        flexDirection: matchesSmallScreen ? 'column' : 'row',
        display: 'flex',
        color: 'common.white',
        background: 'background.paper',
        bottom: 0,
        top: '124px',
        width: '100%',
        height: 'fit-content',
        m: '0 16px 84px 16px',
      }}
      className="mealplancontainer"
    >
      <AddMealModal status={openAddMealModal} setStatus={setOpenAddMealModal} />
      <AddServeGuideModal status={openAddServeGuideModal} setStatus={setOpenAddServeGuideModal} />
      {openAddItemModal && (
        <UserMealPlanModal
          status={openAddItemModal}
          setStatus={setOpenAddItemModal}
          selectedMealPlanDayId={selectedMealPlanDayId}
          mealType={MealType}
        />
      )}

      <SwitchMealPlanModal
        openSwitchMealPlanModal={openSwitchMealPlanModal}
        setOpenSwitchMealPlanModal={setOpenSwitchMealPlanModal}
      />

      <Paper elevation={0} sx={UserMealPlanStyles.todayDietAndCalenderContainer}>
        <Box>
          <Box>
            <Box sx={UserMealPlanStyles.todayDietHeader}>
              <Box>
                <Typography variant="h5" sx={UserMealPlanStyles.todayDietTitle}>
                  {nextDietDate === today ? `Today's Diet` : `Diet For Day ${clickedDateDietOrder}`}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#147AE9' }}>
                  {data?.data?.isCustom ? 'Custom meal plan' : 'NEWSTART meal plan'}
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={UserMealPlanStyles.todayDietDate}>
                {nextDietDate}
              </Typography>
            </Box>
            <Box sx={UserMealPlanStyles.todayBreakFastLunch}>
              <Box sx={UserMealPlanStyles.todayBreakfastContainer}>
                <Typography variant="subtitle1" sx={UserMealPlanStyles.todayBreakfastTitle}>
                  Breakfasts
                </Typography>
                {breakfastsForToday?.map((item: any) => {
                  const { title, _id } = item;

                  return (
                    <Box key={_id} sx={UserMealPlanStyles.todayBreakfastItem}>
                      <Link href={`/user/learn/recipe/${_id}/`}>
                        <Box sx={UserMealPlanStyles.todayBreakfastImageTitle}>
                          <Box sx={{ position: 'relative', height: '48px', width: '48px', borderRadius: '50%' }}>
                            <Image
                              src={
                                item?.vimeoDetails?.thumbNailImage ||
                                item?.featuredImage[0]?.completedUrl ||
                                RESOURCES_LOADING_THUMBNAIL
                              }
                              width="100%"
                              height="100%"
                              alt="foodimg"
                              className="round-meal-image"
                              objectFit="cover"
                              layout="fill"
                            />
                          </Box>

                          <Typography variant="body1" sx={UserMealPlanStyles.todayBreakfastItemTitle}>
                            {title}
                          </Typography>
                        </Box>
                      </Link>
                      {data?.data?.isCustom && (
                        <Box sx={{ position: 'relative' }}>
                          <MealPlanMenuIcon
                            onClick={() => {
                              setOpenMealDeleteViewModal(!openMealDeleteViewModal);
                              setSelectedMealPlanDayId(todayDietDayId);
                              setMealType(RECIPE_CATEGORY.BREAKFAST);
                              setRecipeDetailsForDeleteMenu({
                                id: _id,
                                name: title,
                                mealType: MEAL_TYPE_FOR_MEALPLAN.BREAKFASTS,
                              });
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: openMealDeleteViewModal ? '27px' : '-50px',
                              right: '-1px',
                              zIndex: '99',
                              opacity: openMealDeleteViewModal ? '1' : 0,
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            {openMealDeleteViewModal &&
                            recipeDetailsForDeleteMenu?.id === _id &&
                            recipeDetailsForDeleteMenu?.mealType === MEAL_TYPE_FOR_MEALPLAN.BREAKFASTS ? (
                              <>
                                <MealDeleteViewModal
                                  status={openMealDeleteViewModal}
                                  setStatus={setOpenMealDeleteViewModal}
                                  selectedMealPlanDayId={selectedMealPlanDayId}
                                  mealType={MealType}
                                  recipeIdForDeleteMenu={recipeDetailsForDeleteMenu?.id}
                                  recipeNameForDeleteMenu={recipeDetailsForDeleteMenu?.name}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '-9px',
                                    right: '4px',
                                    background: 'white',
                                    height: '18px',
                                    width: '18px',
                                    transform: 'rotate(45deg)',
                                  }}
                                ></Box>
                                <Box
                                  onClick={() => setOpenMealDeleteViewModal(false)}
                                  sx={{
                                    position: 'fixed',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    background: 'black',
                                    zIndex: '-1',
                                    opacity: '0',
                                  }}
                                />
                              </>
                            ) : null}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  );
                })}
                {data?.data?.isCustom && (
                  <PrimaryButton
                    onClick={() => {
                      setOpenAddItemModal(true);
                      setSelectedMealPlanDayId(todayDietDayId);
                      setMealType(RECIPE_CATEGORY.BREAKFAST);
                    }}
                    sx={UserMealPlanStyles.addMoreItemsButton}
                  >
                    + Add Items
                  </PrimaryButton>
                )}
              </Box>
              <Box sx={UserMealPlanStyles.todayBreakfastContainer}>
                <Typography variant="subtitle1" sx={UserMealPlanStyles.todayBreakfastTitle}>
                  Lunch
                </Typography>
                {lunchForToday?.map((item: any) => {
                  const { title, _id } = item;

                  return (
                    <Box key={_id} sx={UserMealPlanStyles.todayBreakfastItem}>
                      <Link href={`/user/learn/recipe/${_id}/`}>
                        <Box sx={UserMealPlanStyles.todayBreakfastImageTitle}>
                          <Box sx={{ position: 'relative', height: '48px', width: '48px', borderRadius: '50%' }}>
                            <Image
                              src={
                                item?.vimeoDetails?.thumbNailImage ||
                                item?.featuredImage[0]?.completedUrl ||
                                RESOURCES_LOADING_THUMBNAIL
                              }
                              width="100%"
                              height="100%"
                              alt="foodimg"
                              className="round-meal-image"
                              objectFit="cover"
                              layout="fill"
                            />
                          </Box>

                          <Typography variant="body1" sx={UserMealPlanStyles.todayBreakfastItemTitle}>
                            {title}
                          </Typography>
                        </Box>
                      </Link>
                      {data?.data?.isCustom && (
                        <Box sx={{ position: 'relative' }}>
                          <MealPlanMenuIcon
                            onClick={() => {
                              setOpenMealDeleteViewModal(!openMealDeleteViewModal);
                              setSelectedMealPlanDayId(todayDietDayId);
                              setMealType(RECIPE_CATEGORY.LUNCH);
                              setRecipeDetailsForDeleteMenu({
                                id: _id,
                                name: title,
                                mealType: MEAL_TYPE_FOR_MEALPLAN.LUNCH,
                              });
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: openMealDeleteViewModal ? '27px' : '-50px',
                              right: '-1px',
                              zIndex: '99',
                              opacity: openMealDeleteViewModal ? '1' : 0,
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            {openMealDeleteViewModal &&
                            recipeDetailsForDeleteMenu?.id === _id &&
                            recipeDetailsForDeleteMenu?.mealType === MEAL_TYPE_FOR_MEALPLAN.LUNCH ? (
                              <>
                                <MealDeleteViewModal
                                  status={openMealDeleteViewModal}
                                  setStatus={setOpenMealDeleteViewModal}
                                  selectedMealPlanDayId={selectedMealPlanDayId}
                                  mealType={MealType}
                                  recipeIdForDeleteMenu={recipeDetailsForDeleteMenu?.id}
                                  recipeNameForDeleteMenu={recipeDetailsForDeleteMenu?.name}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '-9px',
                                    right: '4px',
                                    background: 'white',
                                    height: '18px',
                                    width: '18px',
                                    transform: 'rotate(45deg)',
                                  }}
                                ></Box>
                                <Box
                                  onClick={() => setOpenMealDeleteViewModal(false)}
                                  sx={{
                                    position: 'fixed',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    background: 'black',
                                    zIndex: '-1',
                                    opacity: '0',
                                  }}
                                />
                              </>
                            ) : null}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  );
                })}
                {data?.data?.isCustom && (
                  <PrimaryButton
                    onClick={() => {
                      setOpenAddItemModal(true);
                      setSelectedMealPlanDayId(todayDietDayId);
                      setMealType(RECIPE_CATEGORY.LUNCH);
                    }}
                    sx={UserMealPlanStyles.addMoreItemsButton}
                  >
                    + Add Items
                  </PrimaryButton>
                )}
              </Box>
            </Box>
          </Box>

          <Modal
            onClose={() => {
              setUpdatePlanModal(false);
            }}
            open={updatePlanModal}
            onBackdropClick={() => {
              setUpdatePlanModal(false);
            }}
            sx={{
              outline: 'none',
              backgroundColor: 'rgba(19, 19, 54, 0.1)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <UpgradeSubscriptions
              showUserLocationModal={showUserLocationModal}
              setShowUserLocationModal={(value) => {
                setShowUserLocationModal(value);
                setUpdatePlanModal(false);
              }}
            />
          </Modal>

          <Box sx={UserMealPlanStyles.switchButtonContainer}>
            <PrimaryButton
              onClick={(e) => {
                if (
                  user?.role.accessFor === FREE_TRIAL_ROLE ||
                  user?.role.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER
                ) {
                  setUpdatePlanModal(true);
                  setShowUserLocationModal(true);
                } else {
                  setOpenSwitchMealPlanModal(true);
                }
              }}
              disabled={user?.role.accessFor === FREE_TRIAL_ROLE}
              sx={{ ...UserMealPlanStyles.addMoreItemsButton, m: '0 auto 0 auto' }}
            >
              {user?.role.accessFor === FREE_TRIAL_ROLE || user?.role.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER ? (
                <>Upgrade to Access</>
              ) : (
                <>Switch to {data?.data?.isCustom ? 'Suggested' : 'Custom'} Meal Plan</>
              )}
            </PrimaryButton>
            {/* <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>Update from free trial to Premuim</Typography>
      </Popover> */}
          </Box>
        </Box>
        <Box sx={UserMealPlanStyles.calendarContainer}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              label="Basic example"
              value={value}
              onChange={handleChange}
              renderInput={(params: any) => <TextField {...params} />}
              showToolbar={false}
              displayStaticWrapperAs="desktop"
              minDate={mealCycleStartDate}
              maxDate={mealMaxDate}
            />
          </LocalizationProvider>
        </Box>
      </Paper>
      <Paper elevation={0} className="mealPlanAccordion hide-scrollbar" sx={UserMealPlanStyles.accordionContainer}>
        {MealPlanArray?.mealplan &&
          MealPlanArray?.mealplan?.map((mealItem: any, idx: number) => {
            const breakfasts = mealItem?.breakfasts;
            const lunchs = mealItem?.lunch;
            const { _id } = mealItem;
            const date = getNewDate(mealCycleStartDate, idx);

            return (
              <Accordion
                elevation={0}
                expanded={expanded === `panel${idx + 1}`}
                onChange={handleChangeAccordion(`panel${idx + 1}`)}
                key={idx}
                sx={{
                  ...UserMealPlanStyles.accordion,
                  border: selectedMealPlanDayId === _id ? '1px solid #8DC4FF' : '1px solid #EFEFEF',
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDownAccordian />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  onClick={() => {
                    setSelectedMealPlanDayId(_id);
                  }}
                  sx={UserMealPlanStyles.accordionSummary}
                >
                  <Box sx={UserMealPlanStyles.accordionSummaryItem}>
                    {selectedMealPlanDayId === _id ? <TickIconBlue /> : <TickIconDisabled />}

                    <Box sx={UserMealPlanStyles.accordionSummaryTitleDate}>
                      <Typography sx={UserMealPlanStyles.accordionSummaryTitle} variant="h6">
                        {mealItem.title}
                      </Typography>
                      <Typography variant="body2">{date}</Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={UserMealPlanStyles.accordionDetailsContainer}>
                    <Box sx={UserMealPlanStyles.accordionDetailsHeader}>
                      <Typography variant="subtitle1" sx={UserMealPlanStyles.accordionDetailsTitle}>
                        Breakfast
                      </Typography>
                      {data?.data?.isCustom && (
                        <PlusIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setOpenAddItemModal(true);
                            setSelectedMealPlanDayId(mealItem?._id);
                            setMealType(RECIPE_CATEGORY.BREAKFAST);
                          }}
                        />
                      )}
                    </Box>
                    {breakfasts?.map((item: any) => {
                      const { title, _id } = item;

                      return (
                        <Box key={_id} sx={UserMealPlanStyles.accordionDietItems}>
                          <Box sx={{ position: 'relative', height: '48px', width: '48px' }}>
                            <Image
                              src={
                                item?.vimeoDetails?.thumbNailImage ||
                                item?.featuredImage[0]?.completedUrl ||
                                RESOURCES_LOADING_THUMBNAIL
                              }
                              alt={item?.title}
                              width="100%"
                              height="100%"
                              objectFit="cover"
                              style={{ borderRadius: '50%' }}
                            />
                          </Box>
                          <Link href={`/user/learn/recipe/${_id}/`}>
                            <Typography variant="body1" sx={UserMealPlanStyles.accordionDietItemTitle}>
                              {title}
                            </Typography>
                          </Link>
                        </Box>
                      );
                    })}
                    {data?.data?.isCustom && breakfasts?.length === 0 && (
                      <PrimaryButton
                        onClick={() => {
                          setOpenAddItemModal(true);
                          setSelectedMealPlanDayId(mealItem?._id);
                          setMealType(RECIPE_CATEGORY.BREAKFAST);
                        }}
                        sx={UserMealPlanStyles.addMoreItemsButton}
                      >
                        + Add Items
                      </PrimaryButton>
                    )}
                  </Box>
                  <Box sx={UserMealPlanStyles.accordionDetailsContainer}>
                    <Box sx={UserMealPlanStyles.accordionDetailsHeader}>
                      <Typography variant="subtitle1" sx={UserMealPlanStyles.accordionDetailsTitle}>
                        Lunch
                      </Typography>
                      {data?.data?.isCustom && (
                        <PlusIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setOpenAddItemModal(true);
                            setSelectedMealPlanDayId(mealItem?._id);
                            setMealType(RECIPE_CATEGORY.LUNCH);
                          }}
                        />
                      )}
                    </Box>

                    {lunchs?.map((item: any) => {
                      const { _id, title } = item;

                      return (
                        <Box key={_id} sx={UserMealPlanStyles.accordionDietItems}>
                          <Box sx={{ position: 'relative', height: '48px', width: '48px' }}>
                            <Image
                              src={
                                item?.vimeoDetails?.thumbNailImage ||
                                item?.featuredImage[0]?.completedUrl ||
                                RESOURCES_LOADING_THUMBNAIL
                              }
                              alt={item?.title}
                              width="100%"
                              height="100%"
                              objectFit="cover"
                              style={{ borderRadius: '50%' }}
                            />
                          </Box>
                          <Link href={`/user/learn/recipe/${_id}/`}>
                            <Typography variant="body1" sx={UserMealPlanStyles.accordionDietItemTitle}>
                              {title}
                            </Typography>
                          </Link>
                        </Box>
                      );
                    })}

                    {data?.data?.isCustom && lunchs?.length === 0 && (
                      <PrimaryButton
                        onClick={() => {
                          setMealType(RECIPE_CATEGORY.LUNCH);
                          setOpenAddItemModal(true);
                        }}
                        sx={UserMealPlanStyles.addMoreItemsButton}
                      >
                        + Add Items
                      </PrimaryButton>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        <Box sx={UserMealPlanStyles.addMoreButtonContainer}>
          {data?.data?.isCustom && (
            <PrimaryButton
              onClick={() => {
                if (debounceState) {
                  addToUserMealPlan();
                  setDebounceState(false);
                  setTimeout(() => setDebounceState(true), 3000);
                }
              }}
              sx={UserMealPlanStyles.addMoreItemsButton}
            >
              + Add More
            </PrimaryButton>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserMealPlan;
