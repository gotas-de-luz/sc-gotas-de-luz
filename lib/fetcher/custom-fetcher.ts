import { ApiError } from '../api/errors/api-error'
export interface FetcherConfig extends Pick<RequestInit, 'headers' | 'credentials'> {}

export class CustomFetcher {
  private config?: FetcherConfig

  constructor(config?: FetcherConfig) {
    this.config = config
  }

  private async customFetch<R>(url: string, init: RequestInit) {
    // TODO: probably add auth  token here
    const res = await fetch(url, { ...this.config, ...init, headers: { ...this.config?.headers, ...init.headers } })
    if (!res.ok) {
      throw new ApiError(`Request failed`, res.status)
    }
    const data: R = await res.json()
    return data
  }

  async post<R = void>(url: string, body: Object, config?: FetcherConfig) {
    return await this.customFetch<R>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async put<R = void>(url: string, body: Object, config?: FetcherConfig) {
    return await this.customFetch<R>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async get<R = any>(url: string, config?: FetcherConfig) {
    return await this.customFetch<R>(url, {
      ...config,
      method: 'GET',
    })
  }

  async delete<R = void>(url: string, config?: FetcherConfig) {
    return await this.customFetch<R>(url, {
      ...config,
      method: 'DELETE',
    })
  }
}