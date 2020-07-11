import { Command } from 'detritus-client';

import { CommandTypes } from '../../constants';

import { BaseCommand } from '../basecommand';


export interface CommandArgs {
  text: string,
}

export class MilkSayCommand extends BaseCommand {
  name = 'milksay';

  label = 'text';
  metadata = {
    description: '',
    examples: [
      'milksay lol',
    ],
    type: CommandTypes.SAY,
    usage: 'milksay <text>',
  };

  onBefore(context: Command.Context) {
    return context.user.isClientOwner;
  }

  async run(context: Command.Context) {

  }
}
