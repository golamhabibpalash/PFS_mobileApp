import {useEffect, useRef, useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import appConfig from '../app.json';
import webSocketManager from '../Services/WebSocketService';
import {FetchParkingData} from '../Services/ParkingServices/SecurityParkingAccessSlice';
import {
  fetchCafeSlideData,
  loadSliderData,
} from '../Services/CommonServices/HomeScreenSliderSlice';

const baseUrl = appConfig.apiBaseURL;
const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
const fallbackInterval = appConfig.websocket.fallbackIntervalMs;

// webSocketManager is a process-wide singleton with a single config, so the
// first mounted consumer opens the connection and the last one closes it.
// Without this, navigating to a second screen that also syncs would reconnect
// over the first, and leaving it would disconnect the screen still on stack.
let subscriberCount = 0;

export function useLiveData() {
  const dispatch = useDispatch();
  const parkingData = useSelector(
    state => state.securityParkingAccess?.parkingData,
  );
  const parkingLoading = useSelector(
    state => !!state.securityParkingAccess?.isLoading,
  );
  const parkingError = useSelector(
    state => !!state.securityParkingAccess?.isError,
  );
  const cafeData = useSelector(state => state.CafeteriaSliderData?.cafeData);
  const cafeLoading = useSelector(
    state => !!state.CafeteriaSliderData?.isLoading,
  );
  const cafeError = useSelector(state => !!state.CafeteriaSliderData?.isError);
  const sliderData = useSelector(
    state => state.HomePageSliderData?.homeSliderData,
  );
  const prevParkingRef = useRef(parkingData);
  const prevCafeRef = useRef(cafeData);
  const dataLoaded = useRef(false);
  // The thunks have not reached `pending` on the very first render, so both
  // loading flags are false. Treat that as loading, not as an empty result.
  const [hasSettled, setHasSettled] = useState(false);
  const wasFetching = useRef(false);

  useEffect(() => {
    const fetching = parkingLoading || cafeLoading;
    if (fetching) {
      wasFetching.current = true;
    } else if (wasFetching.current) {
      setHasSettled(true);
    }
  }, [parkingLoading, cafeLoading]);

  const fetchAndDispatch = useCallback(() => {
    dispatch(fetchCafeSlideData());
    dispatch(FetchParkingData());
  }, [dispatch]);

  useEffect(() => {
    subscriberCount += 1;
    if (subscriberCount === 1) {
      webSocketManager.connect({
        wsUrl,
        fallbackPollingFn: fetchAndDispatch,
        fallbackIntervalMs: fallbackInterval,
        onMessage: () => {
          fetchAndDispatch();
        },
        onStatusChange: status => {
          if (status === 'fallback' || status === 'connected') {
            dataLoaded.current = true;
          }
        },
      });
    }

    // Always refetch on mount so a newly opened screen shows current numbers
    // rather than waiting out the poll interval.
    fetchAndDispatch();

    return () => {
      subscriberCount -= 1;
      if (subscriberCount === 0) {
        webSocketManager.disconnect();
      }
    };
  }, [fetchAndDispatch]);

  useEffect(() => {
    const parkingChanged =
      JSON.stringify(parkingData) !== JSON.stringify(prevParkingRef.current);
    const cafeChanged =
      JSON.stringify(cafeData) !== JSON.stringify(prevCafeRef.current);

    if (!parkingChanged && !cafeChanged) {
      return;
    }

    prevParkingRef.current = parkingData;
    prevCafeRef.current = cafeData;

    const hasCafeData = !!cafeData && Object.keys(cafeData).length > 0;
    const processedCafeteriaData = hasCafeData
      ? [
          {
            id: 'cafeteria',
            title: 'Cafeteria Lunch Status',
            sliderType: 'cafeteria',
            data: [
              {daysType: 'Today', status: cafeData.TodaysStatus},
              {
                daysType: 'Next Day (' + (cafeData.NextWorkingData || '') + ')',
                status: cafeData.NextDaysStatus,
              },
            ],
          },
        ]
      : [];

    const processedParkingData = (parkingData || []).map(
      (parkingLocation, i) => {
        const uniqueParkingSpaces = (
          parkingLocation.ParkingSpaceInfoLists || []
        ).reduce((acc, spaceInfo) => {
          const existingIndex = acc.findIndex(
            s => s.VehicleType === spaceInfo.VehicleType,
          );
          if (existingIndex !== -1) {
            acc[existingIndex].TotalParkingSpace += spaceInfo.TotalParkingSpace;
            acc[existingIndex].FreeParkingSpace += spaceInfo.FreeParkingSpace;
            acc[existingIndex].OcupiedParkingSpace +=
              spaceInfo.OcupiedParkingSpace;
          } else {
            acc.push({...spaceInfo});
          }
          return acc;
        }, []);

        return {
          id: `parking-${parkingLocation.ParkingLocation || i}`,
          sliderType: 'parking',
          title: parkingLocation.ParkingLocation,
          icon: '',
          color: '#000',
          data: uniqueParkingSpaces,
        };
      },
    );

    if (processedParkingData.length > 0 || processedCafeteriaData.length > 0) {
      dispatch(loadSliderData({processedParkingData, processedCafeteriaData}));
    }
  }, [parkingData, cafeData, dispatch]);

  const hasData = (sliderData?.length ?? 0) > 0;

  return {
    hasData,
    isLoading: !hasData && (parkingLoading || cafeLoading || !hasSettled),
    // Only a dead end once nothing is still in flight and there is nothing to show.
    isError:
      !hasData &&
      !parkingLoading &&
      !cafeLoading &&
      (parkingError || cafeError),
    retry: fetchAndDispatch,
  };
}
