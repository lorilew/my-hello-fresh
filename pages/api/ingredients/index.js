import { PrismaClient } from '@prisma/client'

const ingredientsApi =  async (req, res) => {
  if (req.method === 'GET') return getIngredients(req, res)
  else res.status(405).json({message: `Method ${req.method} not implemented`})
}

const getIngredients = async (req, res) => {
  const prisma = new PrismaClient()

  try {
    const data = await prisma.ingredients.findMany()
    res.status(200).json(data)

  } catch (err){
    console.error(err)
    res.status(500).json({message: err.message})
  } finally {
    prisma.$disconnect()
  }
}

export default ingredientsApi;