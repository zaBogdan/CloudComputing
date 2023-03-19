import httpService from "src/services/http-service";

export const authenticatedGetRequest = async (url, headers, options) => {
    const { data } = await httpService.get(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    return data;
}

export const authenticatedPostRequest = async (url, payload, headers, options) => {
    const { data } = await httpService.post(url, payload, {
        ...options,
        headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    return data;
}

export const authenticatedPutRequest = async (url, payload, headers, options) => {
    const { data } = await httpService.put(url, payload, {
        ...options,
        headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    return data;
}

export const authenticatedDeleteRequest = async (url, headers, options) => {
    const { data } = await httpService.delete(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    return data;
}