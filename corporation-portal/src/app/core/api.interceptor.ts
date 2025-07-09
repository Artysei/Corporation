import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from './environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const url =
    req.url.startsWith('/api')
      ? `${environment.apiUrl}${req.url.substring(4)}`
      : req.url;

  return next(req.clone({ url }));
};
