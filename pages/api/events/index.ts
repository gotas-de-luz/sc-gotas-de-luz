// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { endOfMonth, startOfMonth } from 'date-fns'
import type { NextApiRequest, NextApiResponse } from 'next'
import { EventI } from '~/lib/models/event'
import prisma from '~/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse<EventI[]>) {
  let { start, end } = req.query
  const now = new Date()
  const startDate = typeof start == 'string' ? new Date(start) : startOfMonth(now)
  const endDate = typeof end == 'string' ? new Date(end) : endOfMonth(now)
  try {
    const events = await prisma.event.findMany({
      where: { AND: { start: { gte: startDate }, end: { lte: endDate } } },
    })

    console.log({
      start: start || startDate,
      end: end || endDate,
      events: events.length,
      date: typeof events.at(0)?.start,
    })
    res.send(events)
  } catch (error) {
    console.error(error)

    res.status(500).end()
  }
}
