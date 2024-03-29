import { Inventory, Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.inventory
  const get = async () => {
    const { category } = req.query
    return await paginationHandler<Inventory[], Prisma.InventoryFindManyArgs>(req, res, model, {
      orderBy: { name: 'asc' },
      include: { category: true },
      where: {
        ...(category && { categoryId: Number(category) }),
      },
    })
  }
  const post = async () => {
    return await model.create({ data: { ...req.body } })
  }
  await methodRouter(req, res, { get, post })
}, RESOURCES.INVENTORY)
