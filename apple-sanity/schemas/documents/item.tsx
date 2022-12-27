import {defineField, defineType} from 'sanity'
import { RiMacbookLine } from "react-icons/ri";

export default defineType({
  name: 'item',
  title: 'Item',
  type: 'document',
  icon: RiMacbookLine,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    // Title (proxy)
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: 'array',
      of: [{type: 'image'}], 
      // options: {
      //   hotspot: true,
      // },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: 'array',
      of: [{ type: 'block' }]
    }),
  ],
})
