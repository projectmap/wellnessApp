import React from 'react';
import Player from '@vimeo/player';

interface ILectureDurations {
  url: string;
  id: string;
}

const LectureDurations: React.FC<ILectureDurations> = ({ url, id }) => {
  const [durations, setDurations] = React.useState<number>();

  React.useEffect(() => {
    if (url) {
      const options = {
        url: url,
        loop: false,
      };
      const videoPlayer = new Player(id, options);

      videoPlayer
        ?.getDuration()
        .then(function (duration) {
          const num = duration.toString();
          setDurations(parseInt(num, 10));
        })
        .catch(function (error) {
          // an error occurred
        });
    }
  }, [url]);

  return (
    <p>
      <div id={id} className="embed-container" style={{ display: 'none' }}></div>
      {durations ? Math.floor(durations / 60) + ':' + (durations % 60 ? durations % 60 : '00') : '00:00'} min
    </p>
  );
};

export default React.memo(LectureDurations);
