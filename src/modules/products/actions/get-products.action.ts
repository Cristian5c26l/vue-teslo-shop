import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interface';
import { getProductImageAction } from './get-product-image.action';

export const getProductsAction = async (page: number = 1, limit: number = 10) => {
  try {
    const { data } = await tesloApi.get<Product[]>(
      `/products?limit=${limit}&offset=${(page - 1) * limit}`, // offset es el número de registros (limit) que se quiere por pagina
    ); // Se espera como respuesta un arrau de objetos de tipo Product al hacer la peticion al endpoint /products

    // console.log(data);

    return data.map((product) => ({
      ...product,
      images: product.images.map(getProductImageAction),
    }));
  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');
  }
};
