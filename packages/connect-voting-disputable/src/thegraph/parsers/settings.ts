import { QueryResult } from '@aragon/connect-thegraph'

import Setting from '../../models/Setting'
import { SettingData } from '../../types'

function buildSetting(setting: any, connector: any): Setting {
  const {
    id,
    settingId,
    supportRequiredPct,
    minimumAcceptanceQuorumPct,
    executionDelay,
    overruleWindow,
    quietEndingPeriod,
    quietEndingExtension,
    createdAt,
    voting
  } = setting

  const settingData: SettingData = {
    id,
    settingId,
    supportRequiredPct,
    minimumAcceptanceQuorumPct,
    executionDelay,
    overruleWindow,
    quietEndingPeriod,
    quietEndingExtension,
    createdAt,
    votingId: voting.id
  }

  return new Setting(settingData, connector)
}

export function parseCurrentSetting(result: QueryResult, connector: any): Setting {
  const disputableVoting = result.data.disputableVoting

  if (!disputableVoting || !disputableVoting.setting) {
    throw new Error('Unable to parse current setting.')
  }

  return buildSetting(disputableVoting.setting, connector)
}

export function parseSetting(result: QueryResult, connector: any): Setting {
  const setting = result.data.setting

  if (!setting) {
    throw new Error('Unable to parse setting.')
  }

  return buildSetting(setting, connector)
}

export function parseSettings(result: QueryResult, connector: any): Setting[] {
  const settings = result.data.settings

  if (!settings) {
    throw new Error('Unable to parse settings.')
  }

  return settings.map((setting: any) => buildSetting(setting, connector))
}
