import { PrismaClient } from '@prisma/client'

const recipesApi =  async (req, res) => {
  if (req.method === 'GET') return getRecipes(req, res)
  else if (req.method === 'POST') return createRecipe(req, res)
  else res.status(405).json({message: `Method ${req.method} not implemented`})
}

const createRecipe = async (req, res) => {
  const prisma = new PrismaClient()
  const body = req.body
  console.log(body)
  // {
  //   title: 'Test 1',
  //     recipe_code: 'T',
  //   ingredients: [ { ingredient_name: 7, measurement: '1', measurement_type: 8 } ]
  // }

  try {
    const data = await prisma.recipes.create({
      data: {
        name: body.title,
        recipe_code: body.recipe_code,
        recipe_ingredients: {
          create: body.ingredients.map(i => {
            const newIngredient = {
              measurement: i.measurement,
              measurements: {
                connect: {
                  id: i.measurement_type
                }
              }
            }
            if (i.ingredient_name === 'other'){
              newIngredient.ingredients =  {
                create: {
                  name: i.custom_ingredient_name
                }
              }
            }
            else {
              newIngredient.ingredients =  {
                connect: {
                  id: i.ingredient_name
                }
              }
            }
            return newIngredient

          })
        }
      }
    })
    res.status(200).json(data)

  } catch (err){
    console.error(err)
    res.status(500).json({message: err.message})
  } finally {
    prisma.$disconnect()
  }

};



const getRecipes = async (req, res) => {
  const prisma = new PrismaClient()

  try {
    const data = await prisma.recipes.findMany({
      include: {
        recipe_ingredients: {
          include: {
            ingredients: true,
            measurements: true
          }
        }
      }
    })
    res.status(200).json(data)

  } catch (err){
    console.error(err)
    res.status(500).json({message: err.message})
  } finally {
    prisma.$disconnect()
  }
}

export default recipesApi;