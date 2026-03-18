import { useMemo } from 'react';
import ReactWebChat from 'botframework-webchat-component';
import { DirectLine } from 'botframework-directlinejs';

function ChatBot() {
  const directLine = useMemo(() => new DirectLine({ token: 'YOUR_DIRECT_LINE_TOKEN' }), []);

  return <ReactWebChat directLine={directLine} userID="YOUR_USER_ID" />;
}

export default ChatBot;