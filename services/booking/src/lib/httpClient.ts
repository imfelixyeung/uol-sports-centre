import axios, {AxiosError, AxiosResponse} from 'axios';
import {
  AxiosCacheInstance,
  CacheRequestConfig,
  setupCache,
} from 'axios-cache-interceptor';

import logger from './logger';

interface IHttpClient {
  get<TRes>(url: string, cacheOptions?: CacheOptions): Promise<TRes>;
  post<TRes, TReq>(url: string, data: TReq): Promise<TRes>;
  put<TRes, TReq>(url: string, data: TReq): Promise<TRes>;
  delete<TRes>(url: string): Promise<TRes>;
}

interface CacheOptions {
  cache: boolean;
  ttl?: number;
  cacheId: string;
}

class AxiosHttpClient implements IHttpClient {
  private instance: AxiosCacheInstance | null = null;

  private get axiosClient(): AxiosCacheInstance {
    return this.instance ?? this.initAxiosClient();
  }

  private initAxiosClient() {
    const axiosInstance = axios.create();

    // apply the caching interceptor to the axios instance
    // this applies a default 5 minute TTL using an in memory cache store
    return setupCache(axiosInstance);
  }

  get<TRes>(url: string, cacheOptions?: CacheOptions): Promise<TRes> {
    return new Promise<TRes>((resolve, reject) => {
      this.axiosClient
        .get<TRes, AxiosResponse<TRes>>(
          url,
          cacheOptions?.cache
            ? {
                cache: {
                  ttl: cacheOptions.ttl || 1000 * 60 * 5,
                },
                id: cacheOptions.cacheId,
              }
            : undefined
        )
        .then(result => {
          logger.debug(
            `Made GET request to ${url}. Cached response: ${result.cached}`
          );
          resolve(result.data);
        })
        .catch((error: Error | AxiosError) => {
          reject(error);
        });
    });
  }

  post<TRes, TReq>(url: string, data: TReq): Promise<TRes> {
    return new Promise<TRes>((resolve, reject) => reject({url, data}));
  }

  put<TRes, TReq>(url: string, data: TReq): Promise<TRes> {
    return new Promise<TRes>((resolve, reject) => reject({url, data}));
  }

  delete<TRes>(url: string): Promise<TRes> {
    return new Promise<TRes>((resolve, reject) => reject(url));
  }
}

const httpClient: IHttpClient = new AxiosHttpClient();
export default httpClient;
