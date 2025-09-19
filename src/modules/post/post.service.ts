import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
  const result = await prisma.post.create({
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getAllPosts = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  tags,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  tags?: string[];
}) => {
  console.log(tags);
  const where: any = {
    AND: [
      search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      typeof isFeatured === "boolean" && { isFeatured },
      tags && tags.length > 0 && { tags: { hasEvery: tags } },
    ].filter(Boolean),
  };

  const result = await prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.post.count({ where });

  return {
    data: result,
    pagignation: {
      page,
      limit,
      total,
      totalPage: total / limit,
    },
  };
};

const getPostById = async (id: number) => {
  const result = await prisma.$transaction(async (tx) => {
    await prisma.post.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });

    const postData = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    return postData;
  });

  return result;
};

const getBlogPost = async () => {
  return await prisma.$transaction(async (tx) => {
    const aggregates = await tx.post.aggregate({
      _count: true,
      _sum: { views: true },
      _avg: { views: true },
      _min: { views: true },
      _max: { views: true },
    });

    const featuredCount = await tx.post.count({
      where: {
        isFeatured: true,
      },
    });
    const topFeatured = await tx.post.findFirst({
      where: {
        isFeatured: true,
      },
      orderBy: { views: "desc" },
    });

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastWeekPostCoount = await tx.post.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    });

    return {
      stats: {
        totalPost: aggregates._count ?? 0,
        totalView: aggregates._sum.views ?? 0,
        avgView: aggregates._avg.views ?? 0,
        minView: aggregates._min.views ?? 0,
        maxView: aggregates._max.views ?? 0,
      },
      featured: {
        count: featuredCount,
        topFeatured,
      },
      lastWeekPostCoount,
    };
  });
};

const updatePost = async (id: number, data: Partial<any>) => {
  return prisma.post.update({ where: { id }, data });
};

const deletePost = async (id: number) => {
  return prisma.post.delete({ where: { id } });
};

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getBlogPost,
};
