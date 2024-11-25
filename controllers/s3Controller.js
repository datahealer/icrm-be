import AWS from "aws-sdk";
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});
export const generateUploadUrl = async (req, res) => {
  const { fileName, folder } = req.body;
  const key = `${folder}/${Date.now()}-${fileName}`;
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: "image/*",
    Expires: 60 * 5,
  };

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    res.status(200).json({
        status: "success",
        uploadUrl,
        key
    })
    // return { uploadUrl, key };
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw error;
  }
};
