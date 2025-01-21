import { assetData } from "./constant/assets.js";
import Item from "./models/items.js";
import connect from "./config/database.js";

export const insertAsset = async () => {
  const data = assetData;
  await connect();
  try {
    const formattedData = assetData.map((asset) => ({
      category: asset.Category,
      name: asset.Item,
      depreciationRate: asset.Depreciation_Rate,
      itemCode: asset.ItemCode,
    }));
    await Item.insertMany(formattedData, { ordered: false });
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

(async () => {
  const result = await insertAsset();
  if (result) {
    console.log("Script completed successfully.");
  } else {
    console.error("Script encountered errors.");
  }

  // Ensure process exits after completion
  process.exit(result ? 0 : 1);
})();