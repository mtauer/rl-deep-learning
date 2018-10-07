import { retry, map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const defaultOptions = {
  baseUrl: 'https://pandemic-216120.appspot.com/',
};

class ApiClient {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  getAllIterations$(version) {
    return this.request$(
      `versions/${version}/iterations`,
      { method: 'GET' },
    );
  }

  getMatchDetails$(matchId) {
    return this.request$(
      `matches/${matchId}/details`,
      { method: 'GET' },
    );
  }

  request$(urlPostfix, options, body) {
    const url = this.options.baseUrl + urlPostfix;
    const headers = {
      'Content-Type': 'application/json',
    };
    return ajax({
      ...options,
      crossDomain: true,
      headers,
      url,
      body,
      responseType: 'json',
    }).pipe(
      retry(2),
      map(res => (res.responseType === 'json' ? res.response : null)),
    );
  }
}

export default ApiClient;
