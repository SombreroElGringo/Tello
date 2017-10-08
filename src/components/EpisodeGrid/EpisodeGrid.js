import React, { PureComponent } from 'react';
import styled from 'emotion/react';

import { COLORS, UNIT, UNITS_IN_PX } from '../../constants';
import {
  getHumanizedEpisodeAirDate,
  getEpisodeNumString
} from '../../helpers/show.helpers';
import { isEmpty } from '../../utils';

import Clearfix from '../Clearfix';
import EpisodeDot from '../EpisodeDot';
import Scrollable from '../Scrollable';


const EPISODE_DOT_SIZE = 10;
const EPISODE_MARGIN = 1;
const EPISODE_ROW_HEIGHT = EPISODE_DOT_SIZE + EPISODE_MARGIN * 2;
const MAX_EPISODE_ROWS = 10;
const GRID_MAX_HEIGHT = UNIT * 2 + MAX_EPISODE_ROWS * EPISODE_ROW_HEIGHT;
const GRID_MAX_HEIGHT_PX = GRID_MAX_HEIGHT + 'px';

const HIGHLIGHT_FADE_DURATION = 500;

class EpisodeGrid extends PureComponent {
  render() {
    const {
      seasons,
      handleHoverEpisode,
      handleLeaveEpisodeGrid,
      handleClickEpisode
    } = this.props;

    if (!seasons || isEmpty(seasons)) {
      // TODO: loading
      return null;
    }

    const episodesBySeason = Object.keys(seasons).map(id => seasons[id]);

    return (
      <Wrapper onMouseLeave={handleLeaveEpisodeGrid}>
        <Scrollable maxHeight={GRID_MAX_HEIGHT_PX}>
          <EpisodeGridContents>
            {episodesBySeason.map((season, index) => (
              <Season key={index}>
                {season.map(episode => (
                  <EpisodeDot
                    key={episode.id}
                    size={EPISODE_DOT_SIZE}
                    isSeen={episode.isSeen}
                    onMouseEnter={() => handleHoverEpisode(episode)}
                    onClick={() => handleClickEpisode(episode)}
                  />
                ))}
              </Season>
            ))}

          </EpisodeGridContents>
        </Scrollable>
        <EpisodeOverflowGradient />
      </Wrapper>
    );
  }
}


const Wrapper = styled.div`
  position: relative;
  max-height: ${GRID_MAX_HEIGHT_PX};
  box-shadow: inset 0 5px 6px -5px rgba(0, 0, 0, 0.2);
`;

const EpisodeGridContents = styled.div`
  padding: ${UNITS_IN_PX[1]};
`;

const Season = styled(Clearfix)`
  margin-bottom: ${EPISODE_DOT_SIZE + 'px'};

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const EpisodeOverflowGradient = styled.div`
  position: absolute;
  z-index: 10;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${UNITS_IN_PX[1]};
  background: linear-gradient(
    to top,
    rgba(255,255,255,1),
    rgba(255,255,255,0)
  );
  pointer-events: none;
`;

export default EpisodeGrid;
