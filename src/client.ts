import {
  CommandClient,
  CommandClientOptions,
  CommandClientRunOptions,
} from 'detritus-client';

import { ApiClient } from './rest';


export interface NotSoClientOptions extends CommandClientOptions {
  directory: string, 
  directoryIsAbsolute?: boolean,
}

export interface NotSoClientRunOptions extends CommandClientRunOptions {
  directory?: string,
  directoryIsAbsolute?: boolean,
}

export class NotSoClient extends CommandClient {
  readonly api: ApiClient;

  directory?: string;
  directoryIsAbsolute: boolean = false;

  constructor(
    options: NotSoClientOptions,
    token?: string,
  ) {
    super(token || '', options);

    if (options.directory) {
      this.directory = options.directory;
      this.directoryIsAbsolute = !!options.directoryIsAbsolute;
    }

    this.api = new ApiClient(this.rest, 'https://beta.notsobot.com/api');
  }

  async resetCommands(): Promise<void> {
    this.clear();
    if (this.directory) {
      await this.addMultipleIn(this.directory, this.directoryIsAbsolute);
    }
  }

  async run(options: NotSoClientRunOptions = {}) {
    this.directory = options.directory || this.directory;
    if (options.directoryIsAbsolute !== undefined) {
      this.directoryIsAbsolute = !!options.directoryIsAbsolute;
    }
    if (this.directory) {
      await this.addMultipleIn(this.directory, this.directoryIsAbsolute);
    }
    return super.run(options);
  }
}
