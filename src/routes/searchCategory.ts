import { prisma } from "../lib/prisma"; 

export async function searchCategory(key:string) {

    const result = await prisma.category.findFirst({
        where:{
            name:{
                equals:key,
                mode:"insensitive"
            }
        }
    });

    return result;

}

