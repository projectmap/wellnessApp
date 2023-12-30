import React from 'react';
import Player from '@vimeo/player';

import { VimeoPlayerStyledComponents } from '../course/VimeoPlayerStyledComponent';

interface IVimeoPlayer {
  url: string;
}

const VideoPlayer: React.FC<IVimeoPlayer> = ({ url }) => {
  const [vimeoPlayer, setVimeoPlayer] = React.useState<any>();

  React.useEffect(() => {
    if (url) {
      const options = {
        url: url,
        loop: false,
        autoplay: false,
      };
      const videoPlayer = new Player('video-vimeo', options);

      videoPlayer
        .getDuration()
        .then(function (duration) {
          const num = duration.toString();
        })
        .catch(function (error) {
          // an error occurred
        });

      setVimeoPlayer(videoPlayer);
    }
  }, [url]);

  React.useEffect(() => {
    if (vimeoPlayer && url) {
      vimeoPlayer.loadVideo(url);
    }
  }, [vimeoPlayer, url]);

  return (
    <VimeoPlayerStyledComponents>
      <div id="video-vimeo" className="embed-container" style={{ border: '' }}></div>
    </VimeoPlayerStyledComponents>
  );
};

export default React.memo(VideoPlayer);
