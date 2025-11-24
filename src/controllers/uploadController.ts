import { Request, Response } from "express";

export const uploadImage = (req: Request, res: Response) => {
  try {
    // --- THÊM LOG DEBUG ---
    console.log("------------------------------------------------");
    console.log("🔍 DEBUG UPLOAD:");
    console.log("1. Content-Type:", req.headers["content-type"]); // Xem header có boundary không
    console.log("2. File nhận được:", req.file); // Xem file có null không
    console.log("3. Body nhận được:", req.body);
    console.log("------------------------------------------------");
    // ---------------------

    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn file nào!" });
    }

    res.status(200).json({
      message: "Upload thành công",
      url: req.file.path,
      filename: req.file.filename,
    });
  } catch (error) {
    // Log lỗi chi tiết ra để xem Cloudinary có báo lỗi không
    console.error("❌ LỖI UPLOAD:", error);
    res.status(500).json({ message: "Lỗi upload ảnh", error });
  }
};
