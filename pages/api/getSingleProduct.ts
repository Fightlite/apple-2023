// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { groq } from 'next-sanity'
import { sanityClient } from '../../sanity'

type Data = {
    product: Product
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const query = groq`*[_type == 'item' && _id == '${req.query.id}'] {
        _id,
        ...
    }`;
  const product: Product = await sanityClient.fetch(query);
  res.status(200).json({ product })
}
