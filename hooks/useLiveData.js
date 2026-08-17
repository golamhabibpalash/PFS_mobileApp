import {useEffect, useRef, useCallback} from 'react';
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

export function useLiveData() {
  const dispatch = useDispatch();
  const parkingData = useSelector(
    state => state.securityParkingAccess?.parkingData,
  );
  const cafeData = useSelector(state => state.CafeteriaSliderData?.cafeData);
  const prevParkingRef = useRef(parkingData);
  const prevCafeRef = useRef(cafeData);
  const dataLoaded = useRef(false);

  const fetchAndDispatch = useCallback(() => {
    dispatch(fetchCafeSlideData());
    dispatch(FetchParkingData());
  }, [dispatch]);

  useEffect(() => {
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

    fetchAndDispatch();

    return () => {
      webSocketManager.disconnect();
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

    const processedCafeteriaData = cafeData
      ? [
          {
            id: 3,
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

    let sliderId = 0;
    const processedParkingData = (parkingData || []).map(parkingLocation => {
      sliderId++;
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
        id: sliderId,
        sliderType: 'parking',
        title: parkingLocation.ParkingLocation,
        icon: '',
        color: '#000',
        data: uniqueParkingSpaces,
      };
    });

    if (processedParkingData.length > 0 || processedCafeteriaData.length > 0) {
      dispatch(loadSliderData({processedParkingData, processedCafeteriaData}));
    }
  }, [parkingData, cafeData, dispatch]);
}
