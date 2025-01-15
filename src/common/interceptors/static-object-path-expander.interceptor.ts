import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getS3Config } from 'src/configs/s3.config';
import { recursiveResourceTraversing } from './resource-resource-travesing.helper';

const s3Config = getS3Config();

@Injectable()
export class StaticObjectPathExpanderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((x) => {
        this.expandStaticObjectPath(x);
      }),
    );
  }

  private expandStaticObjectPath(resource: any) {
    recursiveResourceTraversing(resource, (resource, key) => {
      if (key !== 'staticObject' && !key.endsWith('StaticObject')) {
        return;
      }
      const staticObject = resource[key];

      if (staticObject === null) {
        return;
      }

      const bucket = s3Config.staticObject.bucketName;
      const endpoint = s3Config.s3.endPoint;
      const url = `https://${bucket}.${endpoint}/${staticObject.objectKey}`;
      staticObject.url = url;

      if (s3Config.staticObject.cloudFrontDomain) {
        const cloudFrontDomain = s3Config.staticObject.cloudFrontDomain;
        const cloudFrontUrl = `https://${cloudFrontDomain}/${staticObject.objectKey}`;
        staticObject.url = cloudFrontUrl;
      }
    });
  }
}
