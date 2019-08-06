import { Command, Structures } from 'detritus-client';

import {
  PresenceStatusColors,
  PresenceStatusTexts,
} from '../constants';
import { Parameters } from '../utils';


export default (<Command.CommandOptions> {
  name: 'user',
  aliases: ['member'],
  label: 'user',
  type: Parameters.memberOrUser,
  onBefore: (context) => {
    const channel = context.channel;
    return (channel) ? channel.canEmbedLinks : false;
  },
  onCancel: (context) => context.reply('⚠ Unable to embed information in this channel.'),
  onBeforeRun: (context, args) => !!args.user,
  onCancelRun: (context) => context.reply('⚠ Unable to find that guy.'),
  run: async (context, args) => {
    const isMember = (args.user instanceof Structures.Member);
    const member = <Structures.Member> args.user;
    const user = <Structures.User> args.user;

    const fields: Array<{
      inline?: boolean,
      name: string,
      value: string,
    }> = [];

    fields.push({
      inline: true,
      name: 'Information',
      value: [
        `**Id**: \`${user.id}\``,
        `**Bot**: ${(user.bot) ? 'Yes' : 'No'}`,
      ].join('\n'),
    });

    const dateOptions = {
      hour12: false,
      timeZone: 'America/New_York',
    };
    fields.push({
      inline: true,
      name: 'Joined',
      value: [
        `**Discord**: ${user.createdAt.toLocaleString('en-US', dateOptions)}`,
        (isMember) ? `**Guild**: ${member.joinedAt.toLocaleString('en-US', dateOptions)}` : null,
      ].filter((v) => v).join('\n'),
    });

    if (isMember) {
      const roles = member.roles.map((role, roleId) => {
        return (role) ? `\`${role.name}\`` : `<@${roleId}>`;
      });
      const voiceChannel = member.voiceChannel;
      fields.push({
        name: 'Guild Specific',
        value: [
          `**Boosting**: ${(member.premiumSince) ? 'Yes' : 'No'}`,
          (member.nick) ? `**Nickname**: ${member.nick}` : null,
          (member.isOwner) ? '**Owner**: Yes' : null,
          `**Roles (${member.roles.length})**: ${roles.join(', ')}`,
          (voiceChannel) ? `**Voice**: ${voiceChannel.toString()}` : null,
        ].filter((v) => v).join('\n'),
      });
    }

    let color: number | undefined;
    const presence = user.presence;
    if (presence) {
      let text = presence.status;
      if (presence.status in PresenceStatusTexts) {
        text = PresenceStatusTexts[presence.status];
      }

      const activity = presence.activity;
      if (activity) {
        text += ` while ${activity.typeText.toLowerCase()} ${activity.name}`;
      }
      fields.push({
        name: 'Activity',
        value: text,
      });

      if (presence.status in PresenceStatusColors) {
        color = PresenceStatusColors[presence.status];
      }
    }

    await context.reply({
      embed: {
        author: {
          name: user.toString(),
          url: user.jumpLink,
        },
        color,
        fields,
        thumbnail: {
          url: user.avatarUrlFormat(null, {size: 1024}),
        },
      },
    });
  },
  onError: (context, args, error) => {
    console.error(error);
  },
});
