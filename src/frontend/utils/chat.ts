import { config } from '~/config'
import { logger } from '~/helpers'

export const showChat = (firstName: string) => {
  try {
    const divChatButton = document.getElementById('icChatButton');
    if (!divChatButton) {
      window['icPatronChat'].init(
        {
          serverHost: config.incontact.serverHost,
          bus_no: config.incontact.bus_no,
          poc: config.incontact.poc,
          params: [firstName, '', '', 0]
        });
    }
  } catch (e) {
    logger('Chat not available: ', e)
  }
}
export const removeChat = () => {
  const divChatButton = document.getElementById('icChatButton');
  const divBadge = document.getElementById('chat-div-wrap');
  if (divChatButton)
    divChatButton.remove();
  if (divBadge)
    divBadge.remove();
}

