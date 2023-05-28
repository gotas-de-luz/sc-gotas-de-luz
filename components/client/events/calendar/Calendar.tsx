import { Flex, Spinner, useDisclosure } from '@chakra-ui/react'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import { es } from 'date-fns/locale'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { useState } from 'react'
import { Calendar, CalendarProps, dateFnsLocalizer } from 'react-big-calendar'
import useSWR from 'swr'
import { useFetcher, useFetcherParams } from '~/hooks/fetcher'
import { DateRange } from '~/lib/models/common'
import { EventI } from '~/lib/models/event'
import UiFeedback from '../../../common/feedback/UiFeedback'
import EventModal from './EventModal'
const locales = {
  es: es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
interface Props extends Omit<CalendarProps, 'localizer' | 'events' | 'onSelectEvent'> {}

const lang = {
  week: 'Semana',
  work_week: 'Semana de trabajo',
  day: 'Día',
  month: 'Mes',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  agenda: 'Resumen',
}
const MyCalendar = ({ views = { month: true }, defaultView = 'month', ...rest }: Props) => {
  const [event, setEvent] = useState<EventI | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [range, setRange] = useState<DateRange | undefined>(undefined)

  const { fetcher } = useFetcher<EventI[]>()
  const {
    data: events,
    error,
    isLoading,
  } = useSWR<EventI[]>(
    [
      `/api/events`,
      {
        query: { start: range?.start, end: range?.end },
        dates: ['start', 'end'],
      },
    ],
    ([url, dto]: useFetcherParams<EventI[]>) => fetcher(url, dto)
  )

  const handleEvent = (event: EventI) => {
    setEvent(event)
    onOpen()
  }

  const handleRange = (range: DateRange | Date[]) => {
    if ('start' in range) {
      setRange({ start: new Date(range.start), end: new Date(range.end) })
    }
  }

  return (
    <UiFeedback isError={!!error}>
      {event && <EventModal event={event} visible={isOpen} onClose={onClose} />}
      <Flex direction="column" justify="center" marginX={['0.5rem', '2rem']}>
        {isLoading && <Spinner marginBottom="3" marginX="auto" />}
        <Calendar
          culture="es"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => handleEvent(event as EventI)}
          messages={lang}
          defaultView={defaultView}
          views={views}
          onRangeChange={handleRange}
          {...rest}
        />
      </Flex>
    </UiFeedback>
  )
}
export default MyCalendar
