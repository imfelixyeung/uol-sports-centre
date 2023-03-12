import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';

interface IHttpClient {
  get<TResponse>(url: string): Promise<TResponse>;

  post<TResponse, TRequestBody>(
    url: string,
    data: TRequestBody
  ): Promise<TResponse>;

  put<TResponse, TRequestBody>(
    url: string,
    data: TRequestBody
  ): Promise<TResponse>;

  delete<TResponse>(url: string): Promise<TResponse>;
}

class AxiosHttpClient implements IHttpClient {
  private instance: AxiosInstance | null = null;

  private get axiosClient(): AxiosInstance {
    return this.instance ?? this.initAxiosClient();
  }

  private initAxiosClient() {
    return axios.create();
  }

  get<TResponse>(url: string): Promise<TResponse> {
    return new Promise<TResponse>((resolve, reject) => {
      this.axiosClient
        .get<TResponse, AxiosResponse<TResponse>>(url)
        .then(result => {
          resolve(result.data);
        })
        .catch((error: Error | AxiosError) => {
          reject(error);
        });
    });
  }

  post<TResponse, TRequestBody>(
    url: string,
    data: TRequestBody
  ): Promise<TResponse> {
    return new Promise<TResponse>((resolve, reject) =>
      resolve({} as TResponse)
    );
  }

  put<TResponse, TRequestBody>(
    url: string,
    data: TRequestBody
  ): Promise<TResponse> {
    return new Promise<TResponse>((resolve, reject) =>
      resolve({} as TResponse)
    );
  }

  delete<TResponse, TRequestBody>(url: string): Promise<TResponse> {
    return new Promise<TResponse>((resolve, reject) =>
      resolve({} as TResponse)
    );
  }
}

const httpClient: IHttpClient = new AxiosHttpClient();
export default httpClient;
