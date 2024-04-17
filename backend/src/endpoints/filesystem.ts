import { Request, Response } from "express";
import { getFileType, getV4, sendError, sendSuccess } from "../utils";
import {
  imagekit,
  imagekitMaxSize,
  maxFolderFiles,
  maxFolders,
  maxSize,
  prismaClient,
} from "../vars";
import { StringSchema } from "@ezier/validate";
import {
  fileHeightSchema,
  fileIdSchema,
  fileNameSchema,
  fileSizeSchema,
  fileUrlSchema,
  fileWidthSchema,
  folderIdSchema,
  folderTitleSchema,
} from "../schemas";

export async function fetchFoldersHome(req: Request, res: Response) {
  return sendSuccess(
    res,
    {
      folders: await prismaClient.folder.findMany({
        where: {
          ownerId: req.userId,
        },

        select: {
          ownerId: true,
          folderId: true,
          title: true,
          createdAt: true,
        },
      }),
    },
    true
  );
}

export async function createFolder(req: Request, res: Response) {
  const title = req.body.title;

  const schemaResult = new StringSchema({ ...folderTitleSchema }).validate({
    title,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  const folders = await prismaClient.folder.findMany({
    where: {
      ownerId: req.userId,
    },

    select: {
      title: true,
    },
  });

  // Max folders
  if (folders.length == maxFolders) {
    return sendError(400, res, `Maximum folders created (${maxFolders})`);
  }

  for (const folderIndex in folders) {
    if (folders[folderIndex].title == title) {
      return sendError(400, res, "Folder already exists");
    }
  }

  const folder = await prismaClient.folder.create({
    data: {
      folderId: getV4(),
      ownerId: req.userId,
      title,
    },

    select: {
      ownerId: true,
      folderId: true,
      title: true,
      createdAt: true,
    },
  });

  return sendSuccess(res, { folder }, true);
}

export async function renameFolder(req: Request, res: Response) {
  const folderId = req.params.folderId;
  const title = req.body.title;

  const schemaResult = new StringSchema({
    ...folderIdSchema,
    ...folderTitleSchema,
  }).validate({
    folderId,
    title,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  // Check folder
  const folder = await prismaClient.folder.findFirst({
    where: {
      folderId,
    },

    select: {
      ownerId: true,
    },
  });

  if (!folder) {
    return sendError(404, res, "Folder not found");
  }

  // Check accessible
  if (folder.ownerId != req.userId) {
    return sendError(400, res, "You don't have access to this folder");
  }

  // Check duplicate
  const folders = await prismaClient.folder.findMany({
    where: {
      ownerId: req.userId,
    },

    select: {
      title: true,
    },
  });

  for (const folderIndex in folders) {
    if (folders[folderIndex].title == title) {
      return sendError(400, res, "Folder already exists");
    }
  }

  // Rename folder
  await prismaClient.folder.updateMany({
    where: {
      folderId,
    },

    data: {
      title,
    },
  });

  return sendSuccess(res, "Folder renamed");
}

export async function deleteFolder(req: Request, res: Response) {
  const folderId = req.params.folderId;

  const schemaResult = new StringSchema({ ...folderIdSchema }).validate({
    folderId,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  // Check folder
  const folder = await prismaClient.folder.findFirst({
    where: {
      folderId,
    },

    select: {
      ownerId: true,
    },
  });

  if (!folder) {
    return sendError(404, res, "Folder not found");
  }

  // Check accessible
  if (folder.ownerId != req.userId) {
    return sendError(400, res, "You don't have access to this folder");
  }

  // Delete folder
  try {
    await imagekit.deleteFolder(folderId);
  } catch (e) {}

  // Delete all files
  await prismaClient.file.deleteMany({
    where: {
      folderId,
    },
  });

  // Then delete folder
  await prismaClient.folder.delete({
    where: {
      folderId,
    },
  });

  return sendSuccess(res, "Folder deleted");
}

export async function fetchFiles(req: Request, res: Response) {
  const folderId = req.params.folderId;

  const schemaResult = new StringSchema({ ...folderIdSchema }).validate({
    folderId,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  // Check folder
  const folder = await prismaClient.folder.findFirst({
    where: {
      folderId,
    },

    select: {
      ownerId: true,
    },
  });

  if (!folder) {
    return sendError(404, res, "Folder not found");
  }

  // Check accessible
  if (folder.ownerId != req.userId) {
    return sendError(400, res, "You don't have access to this folder");
  }

  return sendSuccess(
    res,
    {
      files: await prismaClient.file.findMany({
        where: {
          folderId,
          ownerId: req.userId,
        },

        select: {
          ownerId: true,
          fileId: true,
          folderId: true,
          name: true,
          createdAt: true,
          size: true,
          url: true,
          width: true,
          height: true,
          type: true,
        },
      }),
    },
    true
  );
}

export async function uploadFile(req: Request, res: Response) {
  const folderId = req.params.folderId;

  const fileId = req.body.fileId;
  const name = req.body.name;
  const size = req.body.size;
  const url = req.body.url;
  const width = req.body.width;
  const height = req.body.height;

  const schemaResult = new StringSchema({
    ...folderIdSchema,
    ...fileIdSchema,
    ...fileNameSchema,
    ...fileSizeSchema,
    ...fileUrlSchema,
    ...fileWidthSchema,
    ...fileHeightSchema,
  }).validate({
    folderId,
    fileId,
    name,
    size,
    url,
    width,
    height,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  // Check folder
  const folder = await prismaClient.folder.findFirst({
    where: {
      folderId,
    },

    select: {
      ownerId: true,
    },
  });

  if (!folder) {
    return sendError(404, res, "Folder not found");
  }

  // Check accessible
  if (folder.ownerId != req.userId) {
    return sendError(400, res, "You don't have access to this folder");
  }

  const files = await prismaClient.file.findMany({
    where: {
      ownerId: req.userId,
      folderId,
    },

    select: {
      fileId: true,
    },
  });

  // Max files
  if (files.length == maxFolderFiles) {
    return sendError(
      400,
      res,
      `Maximum files uploaded to this folder (${maxFolderFiles})`
    );
  }

  // Edge case
  if (size > imagekitMaxSize) {
    return sendError(400, res, "File size above allowed limit");
  }

  // Check total size
  let totalSize = 0;

  const folders = await prismaClient.folder.findMany({
    where: {
      ownerId: req.userId,
    },

    select: {
      folderId: true,
    },
  });

  for (const folderIndex in folders) {
    const target = folders[folderIndex];

    // Doesn't matter, pretend it takes time otherwise we needa async the sync
    const files = await prismaClient.file.findMany({
      where: {
        folderId: target.folderId,
      },

      select: {
        size: true,
      },
    });

    for (const fileIndex in files) {
      totalSize += files[fileIndex].size;
    }
  }

  if (totalSize + Number(size) > maxSize) {
    return sendError(400, res, "Max storage used");
  }

  const file = await prismaClient.file.create({
    data: {
      ownerId: req.userId,
      folderId,
      fileId,
      name,
      size: Number(size),
      url,
      type: getFileType(name),
      width: Number(width),
      height: Number(height),
    },

    select: {
      ownerId: true,
      folderId: true,
      fileId: true,
      name: true,
      size: true,
      url: true,
      width: true,
      height: true,
      type: true,
      createdAt: true,
    },
  });

  return sendSuccess(res, { file }, true);
}

export async function deleteFile(req: Request, res: Response) {
  const folderId = req.params.folderId;
  const fileId = req.params.fileId;

  const schemaResult = new StringSchema({
    ...folderIdSchema,
    ...fileIdSchema,
  }).validate({
    folderId,
    fileId,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  // Check file
  const file = await prismaClient.file.findFirst({
    where: {
      fileId,
    },

    select: {
      ownerId: true,
    },
  });

  if (!file) {
    return sendError(404, res, "File not found");
  }

  // Check accessible
  if (file.ownerId != req.userId) {
    return sendError(400, res, "You don't have access to this file");
  }

  // Delete file
  await prismaClient.file.deleteMany({
    where: {
      fileId,
    },
  });

  const fileRes = await imagekit.listFiles({
    path: `/${folderId}/${fileId}`,
  });

  await imagekit.deleteFile(fileRes[0].fileId);

  return sendSuccess(res, "File deleted");
}

export async function getTotalUsage(req: Request, res: Response) {
  let totalUsage = 0;

  const folders = await prismaClient.folder.findMany({
    where: {
      ownerId: req.userId,
    },

    select: {
      folderId: true,
    },
  });

  for (const folderIndex in folders) {
    const target = folders[folderIndex];

    // Doesn't matter, pretend it takes time otherwise we needa async the sync
    const files = await prismaClient.file.findMany({
      where: {
        folderId: target.folderId,
      },

      select: {
        size: true,
      },
    });

    for (const fileIndex in files) {
      totalUsage += files[fileIndex].size;
    }
  }

  return sendSuccess(res, { totalUsage }, true);
}
