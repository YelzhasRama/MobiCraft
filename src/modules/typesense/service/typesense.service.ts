import { Injectable } from '@nestjs/common';
import { Client as TypesenseClient } from 'typesense';

@Injectable()
export class TypesenseService {
  private client: TypesenseClient;

  constructor() {
    this.client = new TypesenseClient({
      nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
      apiKey: 'typesense',
    });
  }

  getClient(): TypesenseClient {
    return this.client;
  }
}
