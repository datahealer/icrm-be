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
    if (error.name === "MongoBulkWriteError" && error.code === 11000) {
      console.warn("Duplicate key errors encountered, but proceeding without failure.");
      return true; 
    } else {
      console.error("An unexpected error occurred:", error.message);
      return false; 
    }
  }
};

(async () => {
  const result = await insertAsset();
  if (result) {
    console.log("Script completed successfully, with or without duplicates.");
    process.exit(0);
  } else {
    console.error("Script encountered critical errors.");
    process.exit(1);
  }
})();