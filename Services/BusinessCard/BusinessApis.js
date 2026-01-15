import axios from 'axios';
import appConfig from '../../app.json';

const baseUrl = appConfig.apiBaseURL;
const BusinessCardDataApi = 'pfs/api/BusinessCardApi/BusinessCardRequest';
const BusinessCardCreate = 'pfs/api/BusinessCardApi/Create';
const CreateBusinessCardApi = 'pfs/api/BusinessCardApi/CreateApp';

export const getBusinessCardData = async (pageNumber, searchQuery = '', sortDirection = '') => {
    const response = await axios.post(`${baseUrl}${BusinessCardDataApi}`, {
        Page: pageNumber,
        SearchQuery: searchQuery,
        SortDirection: sortDirection,
    });

    return response;
};

export const getBusinessCardCreateData = async () => {
    const response = await axios.get(`${baseUrl}${BusinessCardCreate}`);
    return response;
};
export const CreateBusinessCard = async (model) => {
    const response = await axios.post(`${baseUrl}${CreateBusinessCardApi}`, model);
    return response;
};