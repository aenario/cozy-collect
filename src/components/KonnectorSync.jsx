import styles from '../styles/KonnectorSync'

import React from 'react'
import classNames from 'classnames'
import DateFns from 'date-fns'
import { translate } from 'cozy-ui/react/I18n'

import DescriptionContent from './DescriptionContent'

function getDateLabel({ date, t, f }) {
  return f(DateFns.parse(date), t('account.message.synced.date_format'))
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
const dows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const humanCron = cronSpec => {
  try {
    const [, minute, hour, day, month, dayOfWeek] = cronSpec.split(' ')
    const timePart =
      hour !== '*' && minute !== '*'
        ? `at ${hour}:${minute}`
        : hour !== '*' ? `${hour}h` : `Any hour on ${minute}minute`
    const monthPart = month !== '*' ? `during ${months[month]}` : null
    const dowPart = dayOfWeek !== '*' ? `on ${dows[dayOfWeek]}` : null
    const dayPart = day !== '*' ? `on ${day}th of the month` : null
    return [timePart, monthPart, dowPart, dayPart].filter(Boolean).join(' ')
  } catch (e) {
    return JSON.stringify(e)
  }
}

export const KonnectorSync = ({
  t,
  f,
  frequency,
  lastSuccessDate,
  maintenance,
  submitting,
  onForceConnection,
  trigger
}) => {
  const lastSyncMessage =
    (submitting && t('account.message.synced.syncing')) ||
    (!lastSuccessDate && t('account.message.synced.unknown')) ||
    (lastSuccessDate && getDateLabel({ date: lastSuccessDate, t, f })) ||
    null
  console.log('Scheduled execution :', humanCron(trigger.arguments))
  return (
    <div>
      {
        <DescriptionContent
          title={t('account.message.synced.title')}
          messages={[
            `${t('account.message.synced.cron')} ${t(
              `account.message.synced.cron_${frequency}`
            )}.`,
            lastSyncMessage
              ? t('account.message.synced.last_sync', { date: lastSyncMessage })
              : ''
          ]}
        />
      }
      {!maintenance && (
        <div className={styles['account-forceConnection']}>
          <button
            className={
              submitting
                ? classNames('coz-btn', styles['submitting'])
                : classNames('coz-btn')
            }
            disabled={submitting}
            aria-busy={submitting}
            onClick={onForceConnection}
          >
            {t('account.forceConnection')}
          </button>
        </div>
      )}
    </div>
  )
}

export default translate()(KonnectorSync)
