import type {Icon} from '@phosphor-icons/react'
import {BellIcon} from '@phosphor-icons/react/dist/csr/Bell'
import {CameraIcon} from '@phosphor-icons/react/dist/csr/Camera'
import {ConfettiIcon} from '@phosphor-icons/react/dist/csr/Confetti'
import {CrownIcon} from '@phosphor-icons/react/dist/csr/Crown'
import {FlaskIcon} from '@phosphor-icons/react/dist/csr/Flask'
import {IslandIcon} from '@phosphor-icons/react/dist/csr/Island'
import {MonitorIcon} from '@phosphor-icons/react/dist/csr/Monitor'
import {PlugsIcon} from '@phosphor-icons/react/dist/csr/Plugs'
import {StrategyIcon} from '@phosphor-icons/react/dist/csr/Strategy'
import {TargetIcon} from '@phosphor-icons/react/dist/csr/Target'
import {TrophyIcon} from '@phosphor-icons/react/dist/csr/Trophy'
import {WarningIcon} from '@phosphor-icons/react/dist/csr/Warning'

interface FeedIconOption {
  value: string
  title: string
  /** A Phosphor icon, or a text glyph when `Icon` is absent */
  Icon?: Icon
  glyph?: string
}

// Values match src/features/home/feed/FeedIcon.tsx
export const FEED_ICONS: FeedIconOption[] = [
  {value: 'alert', title: 'Alerte', Icon: WarningIcon},
  {value: 'game', title: 'Match', Icon: StrategyIcon},
  {value: 'club', title: 'Club', glyph: '(•̪●)'},
  {value: 'event', title: 'Événement', Icon: BellIcon},
  {value: 'crown', title: 'Couronne', Icon: CrownIcon},
  {value: 'party', title: 'Fiesta', Icon: ConfettiIcon},
  {value: 'holiday', title: 'Vacances', Icon: IslandIcon},
  {value: 'target', title: 'Objectif', Icon: TargetIcon},
  {value: 'trophy', title: 'Trophée', Icon: TrophyIcon},
  {value: 'experiment', title: 'Expérience', Icon: FlaskIcon},
  {value: 'connect', title: 'Connexion', Icon: PlugsIcon},
  {value: 'camera', title: 'Photo', Icon: CameraIcon},
  {value: 'screen', title: 'Écran', Icon: MonitorIcon},
]
