import { Prisma, Volunteer } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.volunteer
  const get = async () => {
    const { active } = req.query
    return await paginationHandler<Volunteer[], Prisma.VolunteerFindManyArgs>(req, res, model, {
      orderBy: { date: 'desc' },
      where: {
        ...(active && { isActive: active !== 'false' }),
      },
    })
  }
  const post = async () => {
    return await model.create({ data: { ...req.body, isActive: true } })
  }
  await methodRouter(req, res, { get, post })
}, RESOURCES.VOLUNTEERS)
